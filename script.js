// Configuration
const SITE_PASSWORD = 'mason2026'; // Change this to your desired password
let cardsData = [];
let filteredCards = [];

// Password Protection
function checkPassword() {
    const input = document.getElementById('passwordInput');
    const password = input.value.trim();
    const errorDiv = document.getElementById('passwordError');
    
    if (password === SITE_PASSWORD) {
        document.getElementById('passwordScreen').style.display = 'none';
        document.getElementById('mainSite').style.display = 'block';
        loadCardsData();
        // Store authentication in sessionStorage
        sessionStorage.setItem('authenticated', 'true');
    } else {
        errorDiv.style.display = 'block';
        input.value = '';
        input.focus();
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }
}

// Check authentication on page load
window.addEventListener('load', function() {
    if (sessionStorage.getItem('authenticated') === 'true') {
        document.getElementById('passwordScreen').style.display = 'none';
        document.getElementById('mainSite').style.display = 'block';
        loadCardsData();
    } else {
        document.getElementById('passwordInput').focus();
    }
});

// Allow Enter key to submit password
document.addEventListener('keyup', function(event) {
    if (event.key === 'Enter' && document.getElementById('passwordScreen').style.display !== 'none') {
        checkPassword();
    }
});

// Sample card data structure (you'll replace this with your spreadsheet data)
const sampleCards = [
    {
        number: "2021-1",
        player: "Mike Trout",
        team: "Los Angeles Angels",
        value: 450.00,
        imageUrl: "https://via.placeholder.com/200x280/1a4c3a/ffffff?text=Mike+Trout"
    },
    {
        number: "2020-25",
        player: "Ronald Acuña Jr.",
        team: "Atlanta Braves",
        value: 325.00,
        imageUrl: "https://via.placeholder.com/200x280/1a4c3a/ffffff?text=Acuna+Jr"
    },
    {
        number: "2019-150",
        player: "Juan Soto",
        team: "Washington Nationals",
        value: 275.00,
        imageUrl: "https://via.placeholder.com/200x280/1a4c3a/ffffff?text=Juan+Soto"
    },
    {
        number: "2021-89",
        player: "Fernando Tatis Jr.",
        team: "San Diego Padres",
        value: 380.00,
        imageUrl: "https://via.placeholder.com/200x280/1a4c3a/ffffff?text=Tatis+Jr"
    },
    {
        number: "2020-200",
        player: "Mookie Betts",
        team: "Los Angeles Dodgers",
        value: 290.00,
        imageUrl: "https://via.placeholder.com/200x280/1a4c3a/ffffff?text=Mookie+Betts"
    },
    {
        number: "2019-77",
        player: "Aaron Judge",
        team: "New York Yankees",
        value: 420.00,
        imageUrl: "https://via.placeholder.com/200x280/1a4c3a/ffffff?text=Aaron+Judge"
    }
];

// Load and process cards data
function loadCardsData() {
    // For now, use sample data. You'll replace this with actual spreadsheet data processing
    cardsData = sampleCards;
    filteredCards = [...cardsData];
    
    updateStats();
    populateTeamFilter();
    renderCards();
}

// Update collection statistics
function updateStats() {
    const totalCards = cardsData.length;
    const totalValue = cardsData.reduce((sum, card) => sum + card.value, 0);
    const uniqueTeams = [...new Set(cardsData.map(card => card.team))].length;
    
    document.getElementById('totalCards').textContent = totalCards.toLocaleString();
    document.getElementById('totalValue').textContent = `$${totalValue.toLocaleString()}`;
    document.getElementById('uniqueTeams').textContent = uniqueTeams;
}

// Populate team filter dropdown
function populateTeamFilter() {
    const teamFilter = document.getElementById('teamFilter');
    const teams = [...new Set(cardsData.map(card => card.team))].sort();
    
    // Clear existing options except "All Teams"
    teamFilter.innerHTML = '<option value="">All Teams</option>';
    
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        teamFilter.appendChild(option);
    });
}

// Filter cards based on search and team filter
function filterCards() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedTeam = document.getElementById('teamFilter').value;
    
    filteredCards = cardsData.filter(card => {
        const matchesSearch = card.player.toLowerCase().includes(searchTerm) ||
                            card.team.toLowerCase().includes(searchTerm) ||
                            card.number.toLowerCase().includes(searchTerm);
        
        const matchesTeam = !selectedTeam || card.team === selectedTeam;
        
        return matchesSearch && matchesTeam;
    });
    
    renderCards();
}

// Sort cards
function sortCards() {
    const sortBy = document.getElementById('sortSelect').value;
    
    filteredCards.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.player.localeCompare(b.player);
            case 'value':
                return b.value - a.value; // Descending order for value
            case 'team':
                return a.team.localeCompare(b.team);
            case 'number':
                return a.number.localeCompare(b.number);
            default:
                return 0;
        }
    });
    
    renderCards();
}

// Render cards to the grid
function renderCards() {
    const cardGrid = document.getElementById('cardGrid');
    
    if (filteredCards.length === 0) {
        cardGrid.innerHTML = `
            <div class="loading" style="grid-column: 1 / -1;">
                <div>No cards found matching your criteria</div>
            </div>
        `;
        return;
    }
    
    cardGrid.innerHTML = filteredCards.map(card => `
        <div class="card" onclick="viewCardImage('${card.imageUrl}', '${card.player}')">
            <div class="card-header">
                <div class="card-number">#${card.number}</div>
                <div class="card-value">$${card.value.toLocaleString()}</div>
            </div>
            <div class="player-name">${card.player}</div>
            <div class="team-name">${card.team}</div>
            <div class="card-image-container">
                ${card.imageUrl ? 
                    `<img src="${card.imageUrl}" alt="${card.player}" class="card-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                     <div class="image-placeholder" style="display: none;">🃏</div>` :
                    `<div class="image-placeholder">🃏</div>`
                }
            </div>
            <button class="view-image-btn" onclick="event.stopPropagation(); viewCardImage('${card.imageUrl}', '${card.player}')">
                View Card Image
            </button>
        </div>
    `).join('');
}

// View card image in new tab
function viewCardImage(imageUrl, playerName) {
    if (imageUrl && imageUrl !== 'undefined') {
        window.open(imageUrl, '_blank');
    } else {
        alert(`No image available for ${playerName}`);
    }
}

// Function to process CSV/spreadsheet data (you'll use this when you add the real data)
function processSpreadsheetData(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const processedCards = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        
        const card = {
            number: values[headers.indexOf('card number')] || values[headers.indexOf('number')] || '',
            player: values[headers.indexOf('player')] || values[headers.indexOf('player name')] || '',
            team: values[headers.indexOf('team')] || '',
            value: parseFloat(values[headers.indexOf('value')] || values[headers.indexOf('market value')] || '0'),
            imageUrl: values[headers.indexOf('image')] || values[headers.indexOf('image url')] || values[headers.indexOf('link')] || ''
        };
        
        if (card.player && card.team) {
            processedCards.push(card);
        }
    }
    
    return processedCards;
}

// Initialize password input focus
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.focus();
    }
});