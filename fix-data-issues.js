#!/usr/bin/env node

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

console.log('🔧 Mason\'s Baseball Card Data Fixer');
console.log('=====================================');

const inputFile = '/Users/stevenmpoole6/.openclaw/media/inbound/masons-cards-updated---45a57454-a4ea-40d5-bbb7-2ca123ea4ec7.xlsx';
const outputFile = path.join(require('os').homedir(), 'Desktop', 'masons-cards-FIXED.xlsx');

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

// Generate a unique key for deduplication
function generateCardKey(row) {
    const name = String(row.name || '').trim().toLowerCase();
    const team = String(row.team || '').trim().toLowerCase();
    const number = String(row.number || '').trim();
    
    // For multi-player cards, use the full name as key
    if (name.includes('/') || name.includes('leaders') || name.includes('rookie')) {
        return name + '|' + number;
    }
    
    // For regular player cards
    return name + '|' + team;
}

try {
    console.log('📖 Reading Excel file...');
    const workbook = XLSX.readFile(inputFile);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log('✅ Found', jsonData.length, 'total cards');
    
    // Step 1: Fix character encoding
    console.log('\\n🔤 Step 1: Fixing character encoding...');
    let encodingFixes = 0;
    jsonData.forEach(row => {
        const originalName = row.name;
        row.name = fixCharacterEncoding(row.name);
        if (originalName !== row.name) {
            encodingFixes++;
        }
    });
    console.log('✅ Fixed', encodingFixes, 'character encoding issues');
    
    // Step 2: Handle duplicates
    console.log('\\n🔄 Step 2: Removing duplicates...');
    const seen = new Map();
    const uniqueCards = [];
    const duplicates = [];
    
    jsonData.forEach((row, index) => {
        const key = generateCardKey(row);
        
        if (seen.has(key)) {
            // This is a duplicate
            const existing = seen.get(key);
            // Keep the one with higher value, or the first one if values are equal
            const existingValue = parseFloat(existing.market_value || 0);
            const currentValue = parseFloat(row.market_value || 0);
            
            if (currentValue > existingValue) {
                // Replace the existing card with this higher-value one
                const existingIndex = uniqueCards.findIndex(card => generateCardKey(card) === key);
                if (existingIndex >= 0) {
                    duplicates.push(uniqueCards[existingIndex]);
                    uniqueCards[existingIndex] = row;
                    seen.set(key, row);
                }
            } else {
                // Keep the existing card, mark this as duplicate
                duplicates.push(row);
            }
        } else {
            // First time seeing this card
            seen.set(key, row);
            uniqueCards.push(row);
        }
    });
    
    console.log('✅ Removed', duplicates.length, 'duplicate cards');
    console.log('✅ Kept', uniqueCards.length, 'unique cards');
    
    // Step 3: Handle multi-player cards
    console.log('\\n📋 Step 3: Fixing multi-player cards...');
    let multiPlayerFixes = 0;
    uniqueCards.forEach(row => {
        if (!row.team || row.team.trim() === '') {
            if (row.name && (row.name.includes('Leaders') || row.name.includes('Rookie'))) {
                row.team = 'MLB Leaders';
                multiPlayerFixes++;
            }
        }
    });
    console.log('✅ Fixed', multiPlayerFixes, 'multi-player cards (assigned to \"MLB Leaders\")');
    
    // Step 4: Calculate final stats
    const totalValue = uniqueCards.reduce((sum, row) => {
        return sum + parseFloat(row.market_value || 0);
    }, 0);
    
    console.log('\\n📊 Final Collection Stats:');
    console.log('  Total unique cards:', uniqueCards.length);
    console.log('  Total collection value: $' + totalValue.toFixed(2));
    console.log('  Cards removed as duplicates:', duplicates.length);
    console.log('  Character encoding fixes:', encodingFixes);
    console.log('  Multi-player card fixes:', multiPlayerFixes);
    
    // Step 5: Create new Excel file
    console.log('\\n💾 Creating fixed Excel file...');
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.json_to_sheet(uniqueCards);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Fixed Cards');
    
    // Write to Desktop
    XLSX.writeFile(newWorkbook, outputFile);
    console.log('✅ Saved fixed file to:', outputFile);
    
    // Show some examples of fixes
    if (encodingFixes > 0) {
        console.log('\\n🔤 Character Encoding Examples:');
        uniqueCards.slice(0, 10).forEach(row => {
            if (row.name.includes('é') || row.name.includes('ñ') || row.name.includes('á')) {
                console.log('  ✅', row.name);
            }
        });
    }
    
    console.log('\\n🎉 Data fixing complete!');
    console.log('📁 Use the FIXED file for your website update');
    
} catch (error) {
    console.error('❌ Error:', error.message);
}