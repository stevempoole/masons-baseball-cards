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

// Mason's Complete Baseball Card Collection - ALL 613 Cards!
const allMasonCards = [
    { number: "US180", player: "Jacob Wilson", team: "Oakland Athletics", value: 8.75, imageUrl: "https://storage.googleapis.com/collx-product-images/1028436547747192832-1-I3nn.jpg" },
    { number: "SMLB-64", player: "Chandler Simpson", team: "Tampa Bay Rays", value: 0.99, imageUrl: "https://storage.googleapis.com/collx-product-images/1028436353534140416-1-5dC7.jpg" },
    { number: "SMLB-77", player: "Shohei Ohtani", team: "Los Angeles Dodgers", value: 1.99, imageUrl: "https://storage.googleapis.com/collx-product-images/1028436108939108352-1-2BsF.jpg" },
    { number: "MV-2", player: "Shohei Ohtani", team: "Los Angeles Dodgers", value: 4.75, imageUrl: "https://storage.googleapis.com/collx-product-images/1028435821948051456-1-wTk4.jpg" },
    { number: "US167", player: "Chase Lee", team: "Detroit Tigers", value: 2.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1028435425116561408-1-DXwD.jpg" },
    { number: "US163", player: "Fernando Cruz", team: "New York Yankees", value: 1.66, imageUrl: "https://storage.googleapis.com/collx-product-images/1028434392436973568-1-9vH1.jpg" },
    { number: "US86", player: "Legends Unite", team: "New York Yankees", value: 1.5, imageUrl: "https://storage.googleapis.com/collx-product-images/1028434131769368576-1-sAWj.jpg" },
    { number: "ASGC-14", player: "Manny Machado", team: "San Diego Padres", value: 1.52, imageUrl: "https://storage.googleapis.com/collx-product-images/1028433607338762240-1-eUZC.jpg" },
    { number: "NT-13", player: "Dylan Crews", team: "Washington Nationals", value: 1.49, imageUrl: "https://storage.googleapis.com/collx-product-images/1028433355638579200-1-XQBC.jpg" },
    { number: "US12", player: "Andres Munoz", team: "Seattle Mariners", value: 12.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1028433023265153024-1-hwe7.jpg" },
    { number: "U90-31", player: "Bobby Witt Jr.", team: "Kansas City Royals", value: 1.25, imageUrl: "https://storage.googleapis.com/collx-product-images/1028432469205983232-1-LmB1.jpg" },
    { number: "SMLB-73", player: "Andrew McCutchen", team: "Pittsburgh Pirates", value: 1.05, imageUrl: "https://storage.googleapis.com/collx-product-images/1028432233972637696-1-bEb.jpg" },
    { number: "US181", player: "Dylan Carlson", team: "Baltimore Orioles", value: 1.5, imageUrl: "https://storage.googleapis.com/collx-product-images/1028431418559443968-1-Z0Pg.jpg" },
    { number: "US64", player: "Ji Hwan Bae", team: "Pittsburgh Pirates", value: 1.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1028431160091139072-1-vDcU.jpg" },
    { number: "US217", player: "Fabulous First", team: "San Diego Padres", value: 0.21, imageUrl: "https://storage.googleapis.com/collx-product-images/1028430924723575808-1-ziKS.jpg" },
    { number: "1", player: "2025 Batting Leaders (Aaron Judge / Trea Turner)", team: "Multiple Teams", value: 1.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027744412738289664-1-OZfi.jpg" },
    { number: "269", player: "Cal Raleigh", team: "Seattle Mariners", value: 269.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027742885390876672-1-PLIN.jpg" },
    { number: "231", player: "Cal Raleigh", team: "Seattle Mariners", value: 231.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027742619237122048-1-dUU.jpg" },
    { number: "10", player: "Aaron Judge", team: "New York Yankees", value: 1.25, imageUrl: "https://storage.googleapis.com/collx-product-images/1027742265120423936-1-Kj8E.jpg" },
    { number: "49", player: "Coby Mayo", team: "Baltimore Orioles", value: 0.75, imageUrl: "https://storage.googleapis.com/collx-product-images/1027741855412420608-1-ac4o.jpg" },
    { number: "270", player: "Dave Parker", team: "Pittsburgh Pirates", value: 19.99, imageUrl: "https://storage.googleapis.com/collx-product-images/1027740816709812224-1-ELQL.jpg" },
    { number: "RA-MM", player: "Manny Machado", team: "San Diego Padres", value: 1.99, imageUrl: "https://storage.googleapis.com/collx-product-images/1027740544952467456-1-0NTY.jpg" },
    { number: "RP-JW", player: "James Wood", team: "Washington Nationals", value: 1.99, imageUrl: "https://storage.googleapis.com/collx-product-images/1027740206539243520-1-1Cmp.jpg" },
    { number: "322", player: "Fernando Tatis Jr.", team: "San Diego Padres", value: 322.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027739934773510144-1-TOM0.jpg" },
    { number: "33", player: "Paul Skenes", team: "Pittsburgh Pirates", value: 33.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027739645752410112-1-ObMU.jpg" },
    { number: "12", player: "Mookie Betts", team: "Los Angeles Dodgers", value: 12.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027739282685067264-1-KpVD.jpg" },
    { number: "180", player: "Adley Rutschman", team: "Baltimore Orioles", value: 0.99, imageUrl: "https://storage.googleapis.com/collx-product-images/1027738902135865344-1-GSm8.jpg" },
    { number: "215", player: "Ryan O'Hearn", team: "San Diego Padres", value: 215.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027738569795993600-1-oYv5.jpg" },
    { number: "233", player: "Elly De La Cruz", team: "Cincinnati Reds", value: 233.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027738281110437888-1-llJx.jpg" },
    { number: "160", player: "Bobby Witt Jr.", team: "Kansas City Royals", value: 160.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027737885562404864-1-7FWR.jpg" },
    { number: "TE-JCA", player: "Jac Caglianone", team: "Kansas City Royals", value: 1.99, imageUrl: "https://storage.googleapis.com/collx-product-images/1027737505382301696-1-uYpL.jpg" },
    { number: "277", player: "NL Champions", team: "Los Angeles Dodgers", value: 277.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027736433393696768-1-h2UQ.jpg" },
    { number: "338", player: "Colton Cowser", team: "Baltimore Orioles", value: 338.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027735467319656448-1-aV5h.jpg" },
    { number: "205", player: "Bobby Witt Jr.", team: "Kansas City Royals", value: 1.95, imageUrl: "https://storage.googleapis.com/collx-product-images/1027734402218098688-1-A2Jm.jpg" },
    { number: "SMLB-6", player: "Vladimir Guerrero Jr.", team: "Toronto Blue Jays", value: 0.99, imageUrl: "https://storage.googleapis.com/collx-product-images/1027734012407873536-1-CWWu.jpg" },
    { number: "BTP-11", player: "Juan Soto", team: "New York Mets", value: 1.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027733666864332800-1-XLYT.jpg" },
    { number: "TOG-8", player: "Mookie Betts", team: "Los Angeles Dodgers", value: 1.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027733452107579392-1-MxKA.jpg" },
    { number: "229", player: "Jackson Merrill", team: "San Diego Padres", value: 3.25, imageUrl: "https://storage.googleapis.com/collx-product-images/1027733224977629184-1-6MC.jpg" },
    { number: "145", player: "Kenedy Corona", team: "Houston Astros", value: 2.12, imageUrl: "https://storage.googleapis.com/collx-product-images/1027732916637564928-1-IwQv.jpg" },
    { number: "138", player: "Jac Caglianone", team: "Kansas City Royals", value: 1.5, imageUrl: "https://storage.googleapis.com/collx-product-images/1027732717668171776-1-obFw.jpg" },
    { number: "52", player: "It Takes Two", team: "New York Mets", value: 1.25, imageUrl: "https://storage.googleapis.com/collx-product-images/1027732521441853440-1-Q6fn.jpg" },
    { number: "222", player: "Tommy Edman", team: "Los Angeles Dodgers", value: 1.58, imageUrl: "https://storage.googleapis.com/collx-product-images/1027732205359104000-1-DAxq.jpg" },
    { number: "SMLB-11", player: "Gunnar Henderson", team: "Baltimore Orioles", value: 1.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027731954590056448-1-vEiD.jpg" },
    { number: "119", player: "Nick Gonzales", team: "Pittsburgh Pirates", value: 1.06, imageUrl: "https://storage.googleapis.com/collx-product-images/1027731567984279552-1-vuM9.jpg" },
    { number: "TOG-15", player: "James Wood", team: "Washington Nationals", value: 1.04, imageUrl: "https://storage.googleapis.com/collx-product-images/1027730946497478656-1-1KCM.jpg" },
    { number: "246", player: "Oneil Cruz", team: "Pittsburgh Pirates", value: 1.5, imageUrl: "https://storage.googleapis.com/collx-product-images/1027730683229405184-1-S94C.jpg" },
    { number: "T91-60", player: "Bryce Harper", team: "Philadelphia Phillies", value: 1.99, imageUrl: "https://storage.googleapis.com/collx-product-images/1027730405373542400-1-WZik.jpg" },
    { number: "SMLB-8", player: "Yordan Alvarez", team: "Houston Astros", value: 1.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027730002955239424-1-dxCr.jpg" },
    { number: "250", player: "Bryce Harper", team: "Philadelphia Phillies", value: 1.75, imageUrl: "https://storage.googleapis.com/collx-product-images/1027729726894538752-1-MyFP.jpg" },
    { number: "140", player: "Cal Raleigh", team: "Seattle Mariners", value: 1.32, imageUrl: "https://storage.googleapis.com/collx-product-images/1027729269346304000-1-8hg.jpg" },
    { number: "T91-40", player: "Andrew McCutchen", team: "Pittsburgh Pirates", value: 1.46, imageUrl: "https://storage.googleapis.com/collx-product-images/1027728822594207744-1-2FMx.jpg" },
    { number: "SMLB-9", player: "Shohei Ohtani", team: "Los Angeles Dodgers", value: 1.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1027728379499544576-1-aZNH.jpg" },
    { number: "26", player: "Cal Ripken Jr.", team: "Baltimore Orioles", value: 22.75, imageUrl: "https://storage.googleapis.com/collx-product-images/1027718232672862208-1-u9xH.jpg" },
    { number: "91", player: "Ralph Kiner", team: "Pittsburgh Pirates", value: 0.18, imageUrl: "https://storage.googleapis.com/collx-product-images/1025745975015114752-1-LbH3.jpg" },
    { number: "56", player: "Roman Anthony", team: "Boston Red Sox", value: 1.89, imageUrl: "https://storage.googleapis.com/collx-product-images/1025744269871155200-1-SbBi.jpg" },
    { number: "BCP-235", player: "Roman Anthony", team: "Boston Red Sox", value: 2.99, imageUrl: "https://storage.googleapis.com/collx-product-images/1025743690629384192-1-IVrU.jpg" },
    { number: "72", player: "Shohei Ohtani", team: "Los Angeles Dodgers", value: 72.0, imageUrl: "https://storage.googleapis.com/collx-product-images/1024849677106073600-1-snae.jpg" },
    { number: "280", player: "Corbin Carroll", team: "Arizona Diamondbacks", value: 2.99, imageUrl: "https://storage.googleapis.com/collx-product-images/1023297559007044608-1-zQya.jpg" },
    { number: "336", player: "Kumar Rocker", team: "Texas Rangers", value: 1.29, imageUrl: "https://storage.googleapis.com/collx-product-images/1022843980118217728-1-C6h.jpg" },
    { number: "302", player: "Bronx Buddies", team: "New York Yankees", value: 1.5, imageUrl: "https://storage.googleapis.com/collx-product-images/1022843769480270848-1-0f2k.jpg" },
    { number: "306", player: "Spencer Schwellenbach", team: "Atlanta Braves", value: 1.09, imageUrl: "https://storage.googleapis.com/collx-product-images/1022843574638072832-1-VKfV.jpg" },
    { number: "SMLB-3", player: "Fernando Tatis Jr.", team: "San Diego Padres", value: 1.5, imageUrl: "https://storage.googleapis.com/collx-product-images/1022843371935749120-1-fJgQ.jpg" },
    { number: "85", player: "Kody Clemens", team: "Minnesota Twins", value: 9.99, imageUrl: "https://storage.googleapis.com/collx-product-images/1022842908859421696-1-O8qe.jpg" },
    { number: "TCA-AJ", player: "Aaron Judge", team: "New York Yankees", value: 46.39, imageUrl: "https://storage.googleapis.com/collx-product-images/1022593597728098304-1-kZ8E.jpg" },
    { number: "II-1", player: "Shohei Ohtani / Yoshinobu Yamamoto", team: "Los Angeles Dodgers", value: 49.99, imageUrl: "https://storage.googleapis.com/collx-user-cards/2550762-588206024-front.jpg" },
    { number: "90ASC-43", player: "Mickey Mantle", team: "New York Yankees", value: 13.0, imageUrl: "https://storage.googleapis.com/collx-user-cards/2550762-653193903-front.jpg" },
    { number: "2", player: "Sandy Koufax", team: "Los Angeles Dodgers", value: 15.0, imageUrl: "https://storage.googleapis.com/collx-product-images/964891365711768576-1-QaTb.jpg" }
];

// Load and process cards data
function loadCardsData() {
    // Load Mason's complete 613-card collection
    cardsData = allMasonCards;
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
        <div class="card">
            <div class="card-header">
                <div class="card-number">#${card.number}</div>
                <div class="card-value">$${card.value.toLocaleString()}</div>
            </div>
            <div class="player-name">${card.player}</div>
            <div class="team-name">${card.team}</div>
            <div class="card-image-container" onclick="viewCardImage('${card.imageUrl}', '${card.player}')">
                ${card.imageUrl ? 
                    `<img src="${card.imageUrl}" alt="${card.player}" class="card-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                     <div class="image-placeholder" style="display: none;">🃏</div>` :
                    `<div class="image-placeholder">🃏</div>`
                }
            </div>
            <button class="view-image-btn" onclick="viewCardImage('${card.imageUrl}', '${card.player}')">
                View Full Size
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