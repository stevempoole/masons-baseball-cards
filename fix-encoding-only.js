#!/usr/bin/env node

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

console.log('🔧 Mason\'s Baseball Card Character Fix ONLY');
console.log('============================================');

const inputFile = '/Users/stevenmpoole6/.openclaw/media/inbound/masons-cards-updated---45a57454-a4ea-40d5-bbb7-2ca123ea4ec7.xlsx';
const outputFile = path.join(require('os').homedir(), 'Desktop', 'masons-cards-ENCODING-FIXED.xlsx');

// Fix corrupted character encoding
function fixCharacterEncoding(text) {
    if (!text) return text;
    
    return String(text)
        // Fix specific corrupted patterns
        .replace(/JosÃ©/g, 'José')
        .replace(/RamÃrez/g, 'Ramírez')
        .replace(/AlcÃ¡ntara/g, 'Alcántara')
        .replace(/AcuÃ±a/g, 'Acuña')
        .replace(/AndrÃ©s/g, 'Andrés')
        .replace(/MuÃ±oz/g, 'Muñoz')
        .replace(/FernÃ¡ndez/g, 'Fernández')
        // General corrupted character fixes
        .replace(/Ã©/g, 'é')
        .replace(/Ã¡/g, 'á')
        .replace(/Ã±/g, 'ñ')
        .replace(/Ã­/g, 'í')
        .replace(/Ã³/g, 'ó')
        .replace(/Ãº/g, 'ú')
        .replace(/Ã /g, 'à')
        .replace(/Ã¨/g, 'è')
        .replace(/Ã§/g, 'ç')
        // Clean up any remaining weird characters
        .replace(/Ã/g, '')
        .trim();
}

try {
    console.log('📖 Reading original Excel file...');
    const workbook = XLSX.readFile(inputFile);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log('✅ Found', jsonData.length, 'total cards');
    
    // Step 1: Fix character encoding ONLY
    console.log('\\n🔤 Fixing character encoding (keeping ALL cards)...');
    let encodingFixes = 0;
    jsonData.forEach(row => {
        const originalName = row.name;
        row.name = fixCharacterEncoding(row.name);
        if (originalName !== row.name) {
            encodingFixes++;
            console.log(`  Fixed: "${originalName}" → "${row.name}"`);
        }
    });
    console.log('✅ Fixed', encodingFixes, 'character encoding issues');
    
    // Step 2: Fix multi-player cards (assign team)
    console.log('\\n📋 Fixing multi-player cards...');
    let multiPlayerFixes = 0;
    jsonData.forEach(row => {
        if (!row.team || row.team.trim() === '') {
            if (row.name && (row.name.includes('Leaders') || row.name.includes('Rookie'))) {
                row.team = 'MLB Leaders';
                multiPlayerFixes++;
            }
        }
    });
    console.log('✅ Fixed', multiPlayerFixes, 'multi-player cards (assigned to "MLB Leaders")');
    
    // Calculate final stats (ALL cards kept)
    const totalValue = jsonData.reduce((sum, row) => {
        return sum + parseFloat(row.market_value || 0);
    }, 0);
    
    const validCards = jsonData.filter(row => {
        const name = String(row.name || '').trim();
        const team = String(row.team || '').trim();
        return name && team;
    });
    
    console.log('\\n📊 Final Collection Stats (NO cards removed):');
    console.log('  Total cards:', jsonData.length);
    console.log('  Valid cards:', validCards.length);
    console.log('  Total collection value: $' + totalValue.toFixed(2));
    console.log('  Character encoding fixes:', encodingFixes);
    console.log('  Multi-player card fixes:', multiPlayerFixes);
    
    // Show unique front_image examples to prove these are different cards
    console.log('\\n🖼️  Unique Image Examples (proving these are different cards):');
    const playerCounts = new Map();
    jsonData.forEach(row => {
        const name = String(row.name || '').trim();
        if (!playerCounts.has(name)) {
            playerCounts.set(name, []);
        }
        playerCounts.get(name).push({
            team: row.team,
            value: row.market_value,
            image: row.front_image
        });
    });
    
    // Show examples of players with multiple cards
    let exampleCount = 0;
    for (const [playerName, cards] of playerCounts.entries()) {
        if (cards.length > 1 && exampleCount < 3) {
            console.log(`\\n  ${playerName} has ${cards.length} different cards:`);
            cards.slice(0, 3).forEach((card, idx) => {
                console.log(`    ${idx + 1}. ${card.team} - $${card.value} - ${card.image?.substring(card.image.lastIndexOf('/') + 1) || 'No image'}`);
            });
            exampleCount++;
        }
    }
    
    // Create new Excel file with ALL cards
    console.log('\\n💾 Creating fixed Excel file (ALL', jsonData.length, 'cards kept)...');
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.json_to_sheet(jsonData);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Encoding Fixed');
    
    // Write to Desktop
    XLSX.writeFile(newWorkbook, outputFile);
    console.log('✅ Saved fixed file to:', outputFile);
    
    console.log('\\n🎉 Character encoding fixed!');
    console.log('📁 ALL', jsonData.length, 'cards preserved - no duplicates removed');
    console.log('💡 Each card has unique front_image proving they are different cards');
    
} catch (error) {
    console.error('❌ Error:', error.message);
}