#!/usr/bin/env node

// Clean special characters from baseball card names
function cleanPlayerName(name) {
    if (!name) return name;
    
    return String(name)
        // Replace accented characters with regular letters
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ñ]/g, 'n')
        .replace(/[ç]/g, 'c')
        .replace(/[ý]/g, 'y')
        // Replace smart quotes with regular quotes
        .replace(/['']/g, "'")
        .replace(/[""]/g, '"')
        // Replace em-dash/en-dash with regular dash
        .replace(/[–—]/g, '-')
        // Remove other special characters but keep basic punctuation
        .replace(/[^\w\s\-\.'"(),&]/g, '')
        // Clean up multiple spaces
        .replace(/\s+/g, ' ')
        .trim();
}

// Test function
if (require.main === module) {
    const testNames = [
        "José Altuve",
        "Rafael Devers", 
        "Shōhei Ohtani",
        "Carlos Peña",
        "Iván Rodríguez",
        "Mookie Betts",
        "O'Neill Cruz",
        "Jean Ségura"
    ];
    
    console.log('🧹 Name Cleaning Test:');
    testNames.forEach(name => {
        const cleaned = cleanPlayerName(name);
        if (name !== cleaned) {
            console.log(`  "${name}" → "${cleaned}"`);
        } else {
            console.log(`  "${name}" ✅ (no changes needed)`);
        }
    });
}

module.exports = { cleanPlayerName };