// Configuration
const SITE_PASSWORD = 'mason613'; // Password based on total number of cards in collection
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

// Mason's Baseball Card Collection - 613 Cards Total! 
// This is a sample of the collection - the full collection includes legends like Mickey Mantle, Cal Ripken Jr., and modern stars!
const masonCards = [
    // High Value Cards
    { number: "26", player: "Cal Ripken Jr.", team: "Baltimore Orioles", value: 22.75, imageUrl: "https://storage.googleapis.com/collx-product-images/1027718232672862208-1-u9xH.jpg" },
    { number: "270", player: "Dave Parker", team: "Pittsburgh Pirates", value: 19.99, imageUrl: "https://storage.googleapis.com/collx-product-images/1027740816709812224-1-ELQL.jpg" },
    { number: "2", player: "Sandy Koufax", team: "Los Angeles Dodgers", value: 15.0, imageUrl: "https://storage.googleapis.com/collx-product-images/964891365711768576-1-QaTb.jpg" },
    { number: "90ASC-43", player: "Mickey Mantle", team: "New York Yankees", value: 13.0, imageUrl: "https://storage.googleapis.com/collx-user-cards/2550762-653193903-front.jpg" },
    { number: "US12", player: "Andres Munoz", team: "Seattle Mariners", value: 12.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1028433023265153024-1-hwe7.jpg" },
    
    // Modern Superstars - Shohei Ohtani Collection
    { number: "II-1", player: "Shohei Ohtani / Yoshinobu Yamamoto", team: "Los Angeles Dodgers", value: 49.99, imageUrl: "https://storage.googleapis.com/collx-user-cards/2550762-588206024-front.jpg" },
    { number: "SMLB-77", player: "Shohei Ohtani", team: "Los Angeles Dodgers", value: 1.99, imageUrl: "https://storage.googleapis.com/collx-product-images/1028436108939108352-1-2BsF.jpg" },
    { number: "MV-2", player: "Shohei Ohtani", team: "Los Angeles Dodgers", value: 4.75, imageUrl: "https://storage.googleapis.com/collx-product-images/1028435821948051456-1-wTk4.jpg" },
    { number: "SMLB-9", player: "Shohei Ohtani", team: "Los Angeles Dodgers", value: 1.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027728379499544576-1-aZNH.jpg" },
    { number: "TTY-25", player: "Shohei Ohtani", team: "Los Angeles Dodgers", value: 2.7, imageUrl: "https://storage.googleapis.com/collx-product-images/1022718937102059520-1-Pbpq.jpg" },
    
    // Aaron Judge Collection 
    { number: "TCA-AJ", player: "Aaron Judge", team: "New York Yankees", value: 46.39, imageUrl: "https://storage.googleapis.com/collx-product-images/1022593597728098304-1-kZ8E.jpg" },
    { number: "AC-14", player: "Aaron Judge", team: "New York Yankees", value: 2.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1005481764884355072-1-cjs5.jpg" },
    { number: "TT-20", player: "Aaron Judge", team: "New York Yankees", value: 2.99, imageUrl: "https://storage.googleapis.com/collx-product-images/1022720025498781696-1-QOmn.jpg" },
    { number: "10", player: "Aaron Judge", team: "New York Yankees", value: 1.25, imageUrl: "https://storage.googleapis.com/collx-product-images/1027742265120423936-1-Kj8E.jpg" },
    
    // Paul Skenes - Rising Star
    { number: "33", player: "Paul Skenes", team: "Pittsburgh Pirates", value: 33.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027739645752410112-1-ObMU.jpg" },
    { number: "ASG-27", player: "Paul Skenes", team: "Pittsburgh Pirates", value: 2.0, imageUrl: "https://storage.googleapis.com/collx-product-images/939385562618694656-1-ih7C.jpg" },
    { number: "BG-6", player: "Paul Skenes", team: "Pittsburgh Pirates", value: 2.76, imageUrl: "https://storage.googleapis.com/collx-product-images/939384315410062336-1-GMJ.jpg" },
    
    // Baltimore Orioles - Local Team Focus
    { number: "180", player: "Adley Rutschman", team: "Baltimore Orioles", value: 0.99, imageUrl: "https://storage.googleapis.com/collx-product-images/1027738902135865344-1-GSm8.jpg" },
    { number: "SMLB-11", player: "Gunnar Henderson", team: "Baltimore Orioles", value: 1.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027731954590056448-1-vEiD.jpg" },
    { number: "49", player: "Coby Mayo", team: "Baltimore Orioles", value: 0.75, imageUrl: "https://storage.googleapis.com/collx-product-images/1027741855412420608-1-ac4o.jpg" },
    { number: "338", player: "Colton Cowser", team: "Baltimore Orioles", value: 2.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027735467319656448-1-aV5h.jpg" },
    { number: "BAL-15", player: "Anthony Santander", team: "Baltimore Orioles", value: 8.99, imageUrl: "https://storage.googleapis.com/collx-user-cards/2550762-533014925-front.jpg" },
    
    // Other Modern Stars
    { number: "322", player: "Fernando Tatis Jr.", team: "San Diego Padres", value: 4.99, imageUrl: "https://storage.googleapis.com/collx-product-images/1027739934773510144-1-TOM0.jpg" },
    { number: "12", player: "Mookie Betts", team: "Los Angeles Dodgers", value: 12.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027739282685067264-1-KpVD.jpg" },
    { number: "233", player: "Elly De La Cruz", team: "Cincinnati Reds", value: 2.99, imageUrl: "https://storage.googleapis.com/collx-product-images/1027738281110437888-1-llJx.jpg" },
    { number: "160", player: "Bobby Witt Jr.", team: "Kansas City Royals", value: 3.5, imageUrl: "https://storage.googleapis.com/collx-product-images/1027737885562404864-1-7FWR.jpg" },
    { number: "229", player: "Jackson Merrill", team: "San Diego Padres", value: 3.25, imageUrl: "https://storage.googleapis.com/collx-product-images/1027733224977629184-1-6MC.jpg" },
    
    // Hall of Fame Legends
    { number: "172", player: "Derek Jeter", team: "New York Yankees", value: 3.6, imageUrl: "https://storage.googleapis.com/collx-product-images/1022117203360884736-1-r8S.jpg" },
    { number: "89", player: "Craig Biggio", team: "Houston Astros", value: 89.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1022117833018189824-1-HzW4.jpg" },
    { number: "84", player: "Chipper Jones", team: "Atlanta Braves", value: 1.69, imageUrl: "https://storage.googleapis.com/collx-product-images/1022118425757231104-1-2or6.jpg" },
    { number: "71", player: "Greg Maddux", team: "Atlanta Braves", value: 1.59, imageUrl: "https://storage.googleapis.com/collx-product-images/1022110824336205824-1-5hRT.jpg" },
    { number: "79", player: "Nolan Ryan", team: "Houston Astros", value: 1.59, imageUrl: "https://storage.googleapis.com/collx-product-images/1022114555027007488-1-hCDA.jpg" },
    
    // Young Prospects & Rookies
    { number: "NT-13", player: "Dylan Crews", team: "Washington Nationals", value: 1.49, imageUrl: "https://storage.googleapis.com/collx-product-images/1028433355638579200-1-XQBC.jpg" },
    { number: "TOG-15", player: "James Wood", team: "Washington Nationals", value: 1.04, imageUrl: "https://storage.googleapis.com/collx-product-images/1027730946497478656-1-1KCM.jpg" },
    { number: "56", player: "Roman Anthony", team: "Boston Red Sox", value: 1.89, imageUrl: "https://storage.googleapis.com/collx-product-images/1025744269871155200-1-SbBi.jpg" },
    { number: "US180", player: "Jacob Wilson", team: "Oakland Athletics", value: 8.75, imageUrl: "https://storage.googleapis.com/collx-product-images/1028436547747192832-1-I3nn.jpg" },
    
    // Special Cards & Inserts
    { number: "277", player: "NL Champions", team: "Los Angeles Dodgers", value: 1.75, imageUrl: "https://storage.googleapis.com/collx-product-images/1027736433393696768-1-h2UQ.jpg" },
    { number: "52", player: "It Takes Two", team: "New York Mets", value: 1.25, imageUrl: "https://storage.googleapis.com/collx-product-images/1027732521441853440-1-Q6fn.jpg" },
    { number: "US86", player: "Legends Unite", team: "New York Yankees", value: 1.5, imageUrl: "https://storage.googleapis.com/collx-product-images/1028434131769368576-1-sAWj.jpg" },
    { number: "DD-1", player: "George Brett / Bobby Witt Jr.", team: "Kansas City Royals", value: 1.9, imageUrl: "https://storage.googleapis.com/collx-user-cards/2550762-665007554-front.jpg" },
    
    // More Current Stars
    { number: "T91-60", player: "Bryce Harper", team: "Philadelphia Phillies", value: 1.99, imageUrl: "https://storage.googleapis.com/collx-product-images/1027730405373542400-1-WZik.jpg" },
    { number: "SMLB-8", player: "Yordan Alvarez", team: "Houston Astros", value: 1.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027730002955239424-1-dxCr.jpg" },
    { number: "BTP-11", player: "Juan Soto", team: "New York Mets", value: 1.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027733666864332800-1-XLYT.jpg" },
    { number: "SMLB-6", player: "Vladimir Guerrero Jr.", team: "Toronto Blue Jays", value: 0.99, imageUrl: "https://storage.googleapis.com/collx-product-images/1027734012407873536-1-CWWu.jpg" }
];

// Load and process cards data
function loadCardsData() {
    // Load Mason's real baseball card collection
    cardsData = masonCards;
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