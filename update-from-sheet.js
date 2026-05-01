#!/usr/bin/env node

const XLSX = require('xlsx');
const fs = require('fs');
const { execSync } = require('child_process');

console.log('🍌 Mason\'s Baseball Card Collection - Sheet Update');
console.log('================================================');

const EXCEL_FILE = './masons-cards-updated.xlsx'; // Look in project directory
const OUTPUT_FILE = 'all-cards-data.js';

// Check if Excel file exists
if (!fs.existsSync(EXCEL_FILE)) {
    console.error('❌ Excel file not found:', EXCEL_FILE);
    console.log('📋 Expected location: ./masons-cards-updated.xlsx (project directory)');
    console.log('📋 Available .xlsx files on Desktop:');
    const desktopPath = require('path').join(require('os').homedir(), 'Desktop');
    try {
        fs.readdirSync(desktopPath).filter(f => f.endsWith('.xlsx')).forEach(f => console.log('  -', f));
    } catch (e) {
        console.log('  (Unable to read Desktop directory)');
    }
    process.exit(1);
}

console.log('📖 Reading Excel file:', EXCEL_FILE);

// Read Excel file
const workbook = XLSX.readFile(EXCEL_FILE);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rawData = XLSX.utils.sheet_to_json(worksheet);

console.log('✅ Found', rawData.length, 'cards in sheet:', sheetName);

// Fix character encoding function
function fixCharacterEncoding(text) {
    if (!text) return text;
    
    return String(text)
        // Fix new corruption patterns (√≠ instead of í, etc.)
        .replace(/√≠/g, 'í')
        .replace(/√°/g, 'á')
        .replace(/√±/g, 'ñ')
        .replace(/√©/g, 'é')
        .replace(/√³/g, 'ó')
        .replace(/√∫/g, 'ús')
        .replace(/√∑/g, 'ú')
        // Fix older corruption patterns
        .replace(/Jos√©/g, 'José')
        .replace(/Ram√≠rez/g, 'Ramírez')
        .replace(/Rodr√≠guez/g, 'Rodríguez')
        .replace(/Alc√°ntara/g, 'Alcántara')
        .replace(/Acu√±a/g, 'Acuña')
        .replace(/Andr√©s/g, 'Andrés')
        .replace(/Mu√±oz/g, 'Muñoz')
        .replace(/Fern√°ndez/g, 'Fernández')
        .replace(/Jes√∫s/g, 'Jesús')
        // General fixes
        .replace(/JosÃ©/g, 'José')
        .replace(/RamÃrez/g, 'Ramírez')
        .replace(/AlcÃ¡ntara/g, 'Alcántara')
        .replace(/AcuÃ±a/g, 'Acuña')
        .replace(/AndrÃ©s/g, 'Andrés')
        .replace(/MuÃ±oz/g, 'Muñoz')
        .replace(/FernÃ¡ndez/g, 'Fernández')
        .replace(/Ã©/g, 'é')
        .replace(/Ã¡/g, 'á')
        .replace(/Ã±/g, 'ñ')
        .replace(/Ã­/g, 'í')
        .replace(/Ã³/g, 'ó')
        .replace(/Ãº/g, 'ú')
        .replace(/Ã /g, 'à')
        .replace(/Ã¨/g, 'è')
        .replace(/Ã§/g, 'ç')
        .replace(/Ã/g, '')
        .trim();
}

// Transform data to website format
const cardsData = rawData.map((row, index) => {
    return {
        number: String(row.number || row.Number || '').trim(),
        player: fixCharacterEncoding(String(row.name || row.Name || row.player || row.Player || '').trim()),
        team: String(row.team || row.Team || '').trim(),
        value: parseFloat(row.market_value || row[' market_value '] || row.Market_Value || row.value || row.Value || 0),
        imageUrl: String(row.front_image || row.Front_Image || row.image || row.Image || row.imageUrl || '').trim()
    };
}).filter(card => card.player && card.team); // Remove invalid cards

console.log('✅ Processed', cardsData.length, 'valid cards');

// Calculate collection stats
const totalValue = cardsData.reduce((sum, card) => sum + card.value, 0);
const uniqueTeams = [...new Set(cardsData.map(card => card.team))].length;
const highestValue = Math.max(...cardsData.map(card => card.value));

console.log('📊 Collection Stats:');
console.log(`   Total Cards: ${cardsData.length}`);
console.log(`   Total Value: $${totalValue.toFixed(2)}`);
console.log(`   Unique Teams: ${uniqueTeams}`);
console.log(`   Highest Value: $${highestValue.toFixed(2)}`);

// Generate JavaScript file content
const jsContent = `// Mason's Baseball Card Collection Data
// Auto-generated from ${EXCEL_FILE}
// Last updated: ${new Date().toISOString()}
// Total cards: ${cardsData.length}

const cardsDatabase = ${JSON.stringify(cardsData, null, 2)};

// Collection metadata
const collectionInfo = {
    totalCards: ${cardsData.length},
    totalValue: ${totalValue.toFixed(2)},
    uniqueTeams: ${uniqueTeams},
    lastUpdated: "${new Date().toISOString()}",
    dataSource: "${EXCEL_FILE}"
};

// For browser compatibility
if (typeof window !== 'undefined') {
    window.cardsDatabase = cardsDatabase;
    window.collectionInfo = collectionInfo;
}

// For Node.js compatibility  
if (typeof module !== 'undefined') {
    module.exports = { cardsDatabase, collectionInfo };
}
`;

// Create backup of current file
if (fs.existsSync(OUTPUT_FILE)) {
    const backupFile = `${OUTPUT_FILE}.backup.${Date.now()}`;
    fs.copyFileSync(OUTPUT_FILE, backupFile);
    console.log('💾 Backed up current data to:', backupFile);
}

// Write new file
fs.writeFileSync(OUTPUT_FILE, jsContent);
console.log('✅ Updated', OUTPUT_FILE);

// Commit changes to git
try {
    console.log('📝 Committing changes to git...');
    execSync('git add .');
    execSync(`git commit -m "📊 Weekly card value update - ${cardsData.length} cards, $${totalValue.toFixed(2)} total value"`);
    execSync('git push origin main');
    console.log('✅ Changes committed and pushed to GitHub');
    console.log('🌐 Website will update automatically via GitHub Pages');
} catch (error) {
    console.error('❌ Git operations failed:', error.message);
    console.log('💡 You may need to manually commit and push the changes');
}

console.log('\n🎉 Update Complete!');
console.log(`📈 Collection value: $${totalValue.toFixed(2)}`);
console.log(`🃏 Total cards: ${cardsData.length}`);
console.log(`🌐 View at: https://stevempoole.github.io/masons-baseball-cards/`);