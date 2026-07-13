// encoding-fix.js — Generic mojibake repair for Mason's Baseball Cards
//
// Fixes text that was UTF-8 but got mis-decoded as Mac Roman or Latin-1/Win-1252
// somewhere in the Excel export chain. Examples it repairs:
//   "Tyler O‚ÄôNeill"      -> "Tyler O’Neill"      (Mac Roman mojibake)
//   "Ram√≥n Ur√≠as"        -> "Ramón Urías"        (Mac Roman mojibake)
//   "Francisco √Ålvarez"   -> "Francisco Álvarez"  (Mac Roman mojibake)
//   "JosÃ© RamÃ­rez"       -> "José Ramírez"       (Latin-1 mojibake)
//
// How it works: instead of a hard-coded pattern list (which always misses new
// names), we reverse the corruption generically — map each mojibake character
// back to the byte it came from, then decode those bytes as UTF-8. A repair is
// only accepted if the result is valid UTF-8 (no replacement chars) and strictly
// reduces the amount of suspicious character salad. Runs iteratively to handle
// double-encoded text. Clean strings pass through untouched.

'use strict';

// Mac Roman code points for bytes 0x80–0xFF (standard Apple table).
const MAC_ROMAN_HIGH = [
  'Ä','Å','Ç','É','Ñ','Ö','Ü','á','à','â','ä','ã','å','ç','é','è', // 0x80–0x8F
  'ê','ë','í','ì','î','ï','ñ','ó','ò','ô','ö','õ','ú','ù','û','ü', // 0x90–0x9F
  '†','°','¢','£','§','•','¶','ß','®','©','™','´','¨','≠','Æ','Ø', // 0xA0–0xAF
  '∞','±','≤','≥','¥','µ','∂','∑','∏','π','∫','ª','º','Ω','æ','ø', // 0xB0–0xBF
  '¿','¡','¬','√','ƒ','≈','∆','«','»','…','\u00A0','À','Ã','Õ','Œ','œ', // 0xC0–0xCF
  '–','—','“','”','‘','’','÷','◊','ÿ','Ÿ','⁄','€','‹','›','ﬁ','ﬂ', // 0xD0–0xDF
  '‡','·','‚','„','‰','Â','Ê','Á','Ë','È','Í','Î','Ï','Ì','Ó','Ô', // 0xE0–0xEF
  '\uF8FF','Ò','Ú','Û','Ù','ı','ˆ','˜','¯','˘','˙','˚','¸','˝','˛','ˇ' // 0xF0–0xFF
];

const MAC_ROMAN_REVERSE = new Map();
MAC_ROMAN_HIGH.forEach((ch, i) => MAC_ROMAN_REVERSE.set(ch, 0x80 + i));

// Characters that strongly suggest mojibake when adjacent to other non-ASCII.
const SUSPICIOUS = /[¬√ƒ≈‚„][\u0080-\uFFFF]|[ÃÂ][\u0080-\u00FF]/;

// Lower = more plausible human text. Punishes symbol salad and combining marks.
function suspicionScore(s) {
  let score = 0;
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (cp <= 127) continue;
    if ('√ƒ≈∆‚„†•∂∑∏π∫≠≤≥Ω⁄€ÀÃÂ¬ÆØ¿¡«»…'.includes(ch)) score += 10; // mojibake salad
    else if (cp >= 0x0300 && cp <= 0x036F) score += 20;               // combining marks
    else if ((cp >= 0xC0 && cp <= 0xFF) || '’‘“”–—…'.includes(ch)) score += 1; // normal accents/punct
    else score += 5;
  }
  return score;
}

function byteFor(ch, mode) {
  const cp = ch.codePointAt(0);
  if (cp <= 0x7F) return cp;
  if (mode === 'mac') return MAC_ROMAN_REVERSE.has(ch) ? MAC_ROMAN_REVERSE.get(ch) : null;
  return cp <= 0xFF ? cp : null; // latin1
}

// Walk the string; wherever consecutive chars map (via `mode`) to a valid
// UTF-8 multibyte sequence, decode just that segment. Everything else is
// left untouched, so mixed clean/corrupted strings repair correctly.
function repairSequences(s, mode) {
  const chars = Array.from(s);
  const bytes = chars.map(ch => byteFor(ch, mode));
  let out = '';
  let i = 0;
  const isCont = b => b !== null && b >= 0x80 && b <= 0xBF;
  while (i < chars.length) {
    const b = bytes[i];
    let len = 0;
    if (b !== null) {
      if (b >= 0xC2 && b <= 0xDF && isCont(bytes[i + 1])) len = 2;
      else if (b >= 0xE0 && b <= 0xEF && isCont(bytes[i + 1]) && isCont(bytes[i + 2])) len = 3;
      else if (b >= 0xF0 && b <= 0xF4 && isCont(bytes[i + 1]) && isCont(bytes[i + 2]) && isCont(bytes[i + 3])) len = 4;
    }
    if (len > 0) {
      const decoded = Buffer.from(bytes.slice(i, i + len)).toString('utf8');
      if (!decoded.includes('\uFFFD')) {
        out += decoded;
        i += len;
        continue;
      }
    }
    out += chars[i];
    i += 1;
  }
  return out;
}

/**
 * Repair mojibake in a string. Safe on clean input (returns it unchanged).
 * @param {*} text
 * @returns {string}
 */
function fixText(text) {
  if (text === null || text === undefined) return text;
  let s = String(text);

  // Known artifact from an old buggy fixer that mapped ú -> "ús" (e.g. "Jesúss").
  s = s.replace(/úss\b/g, 'ús');

  for (let pass = 0; pass < 3; pass++) {
    if (!SUSPICIOUS.test(s)) break;
    const before = suspicionScore(s);
    const candidates = [repairSequences(s, 'mac'), repairSequences(s, 'latin1')]
      .filter(c => suspicionScore(c) < before);
    if (candidates.length === 0) break;
    candidates.sort((a, b) => suspicionScore(a) - suspicionScore(b));
    s = candidates[0];
  }
  return s.trim();
}

/** Apply fixText to every string field of a card row object (in place). */
function fixRow(row) {
  for (const key of Object.keys(row)) {
    if (typeof row[key] === 'string') row[key] = fixText(row[key]);
  }
  return row;
}

module.exports = { fixText, fixRow };
