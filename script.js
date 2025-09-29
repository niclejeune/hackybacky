// Travel data - fetched from API
let travelData = {};

// Load travel data from API
async function loadTravelData() {
    try {
        console.log('Loading travel data...');
        const response = await fetch('/api/destinations');
        const destinations = await response.json();
        console.log('Destinations response:', destinations);
        
        // Load each country's data
        for (const dest of destinations) {
            const countryResponse = await fetch(`/api/destination/${dest.key}`);
            const countryData = await countryResponse.json();
            travelData[dest.key] = countryData;
        }
        console.log(`Loaded ${Object.keys(travelData).length} countries`);
        console.log('Available countries:', Object.keys(travelData));
    } catch (error) {
        console.error('Error loading travel data:', error);
    }
}

// Initialize data when page loads
loadTravelData();

// Dynamic search using metadata
const getSearchTerms = (data) => {
    if (!data.metadata) return [];
    return [
        data.destination,
        ...data.metadata.highlights || [],
        ...data.metadata.keywords || []
    ];
};

function normalizeSearchTerm(term) {
    return term.toLowerCase().trim();
}

function findDestination(searchTerm) {
    const normalized = normalizeSearchTerm(searchTerm);
    console.log('Searching for:', normalized);
    console.log('Available data keys:', Object.keys(travelData));
    
    // Direct country name match
    if (travelData[normalized]) {
        console.log('Direct match found:', normalized);
        return normalized;
    }
    
    // Search through metadata in each destination
    for (const [key, data] of Object.entries(travelData)) {
        const searchTerms = getSearchTerms(data);
        if (searchTerms.some(term => 
            normalized.includes(term.toLowerCase()) || 
            term.toLowerCase().includes(normalized)
        )) {
            console.log('Metadata match found:', key);
            return key;
        }
    }
    
    console.log('No match found for:', normalized);
    return null;
}

function showSuggestions() {
    const query = normalizeSearchTerm(searchInput.value);
    if (query.length < 2) {
        searchSuggestions.style.display = 'none';
        return;
    }
    
    const matches = [];
    for (const [key, data] of Object.entries(travelData)) {
        const searchTerms = getSearchTerms(data);
        if (searchTerms.some(term => term.toLowerCase().includes(query))) {
            matches.push({ key, destination: data.destination, emoji_flag: data.emoji_flag });
        }
    }
    
    if (matches.length > 0) {
        searchSuggestions.innerHTML = matches.map(match => 
            `<div class="suggestion-item" data-key="${match.key}">
                ${match.emoji_flag} ${match.destination}
            </div>`
        ).join('');
        searchSuggestions.style.display = 'block';
        
        // Add click handlers
        searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const key = item.dataset.key;
                searchInput.value = travelData[key].destination;
                searchSuggestions.style.display = 'none';
                showResults(key);
            });
        });
    } else {
        searchSuggestions.style.display = 'none';
    }
}

function showResults(destinationKey) {
    const data = travelData[destinationKey];
    if (!data) {
        noResults.style.display = 'block';
        resultsSection.style.display = 'none';
        return;
    }
    
    // Hide other sections
    noResults.style.display = 'none';
    resultsSection.style.display = 'block';
    
    // Update header
    document.getElementById('destinationTitle').textContent = data.destination;
    document.getElementById('destinationFlag').textContent = data.emoji_flag;
    
    // Build survival packet
    const packet = document.getElementById('survivalPacket');
    packet.innerHTML = `
        <div class="category">
            <div class="category-header">
                <h3 class="category-title">
                    <span class="category-icon">💳</span>
                    Payments
                </h3>
            </div>
            <div class="category-content">
                <div class="info-item">
                    <div class="info-label">Cash</div>
                    <div class="info-value">${data.payments.cash}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Card</div>
                    <div class="info-value">${data.payments.card}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Mobile Payments</div>
                    <div class="info-value">${data.payments.mobile}</div>
                </div>
            </div>
        </div>
        
        <div class="category">
            <div class="category-header">
                <h3 class="category-title">
                    <span class="category-icon">📶</span>
                    Internet
                </h3>
            </div>
            <div class="category-content">
                <div class="info-item">
                    <div class="info-label">SIM/eSIM</div>
                    <div class="info-value">${data.internet.sim_esim}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">WiFi</div>
                    <div class="info-value">${data.internet.wifi}</div>
                </div>
                ${data.internet.avg_speed_mbps ? `
                <div class="info-item">
                    <div class="info-label">Average Speed</div>
                    <div class="info-value">${data.internet.avg_speed_mbps} Mbps</div>
                </div>
                ` : ''}
                <div class="info-item">
                    <div class="info-label">Availability</div>
                    <div class="info-value">${data.internet.availability}</div>
                </div>
            </div>
        </div>
        
        <div class="category">
            <div class="category-header">
                <h3 class="category-title">
                    <span class="category-icon">🚇</span>
                    Transport
                </h3>
            </div>
            <div class="category-content">
                <div class="info-item">
                    <div class="info-label">Passes</div>
                    <div class="info-value">${data.transport.passes}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Apps</div>
                    <div class="info-value">${data.transport.apps}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Quirks</div>
                    <div class="info-value">${data.transport.quirks}</div>
                </div>
            </div>
        </div>
        
        <div class="category">
            <div class="category-header">
                <h3 class="category-title">
                    <span class="category-icon">🎭</span>
                    Culture
                </h3>
            </div>
            <div class="category-content">
                <div class="info-item">
                    <div class="info-label">Tipping</div>
                    <div class="info-value">${data.culture.tipping}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Shop Closures</div>
                    <div class="info-value">${data.culture.closures}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Dress Code</div>
                    <div class="info-value">${data.culture.dress}</div>
                </div>
            </div>
        </div>
        
        <div class="category">
            <div class="category-header">
                <h3 class="category-title">
                    <span class="category-icon">🍽️</span>
                    Food & Drink
                </h3>
            </div>
            <div class="category-content">
                <div class="info-item">
                    <div class="info-label">Must Try</div>
                    <div class="info-value">
                        <ul class="food-list">
                            ${data.food_drink.must_try.map(food => `<li>${food}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-label">Etiquette</div>
                    <div class="info-value">${data.food_drink.etiquette}</div>
                </div>
            </div>
        </div>
        
        <div class="category">
            <div class="category-header">
                <h3 class="category-title">
                    <span class="category-icon">💰</span>
                    Budget
                </h3>
            </div>
            <div class="category-content">
                <div class="info-item">
                    <div class="info-label">Backpacker</div>
                    <div class="info-value">${data.budget.backpacker}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Mid-range</div>
                    <div class="info-value">${data.budget.midrange}</div>
                </div>
            </div>
        </div>
        
        <div class="category">
            <div class="category-header">
                <h3 class="category-title">
                    <span class="category-icon">📅</span>
                    Best Time to Visit
                </h3>
            </div>
            <div class="category-content">
                <div class="info-item">
                    <div class="info-label">Recommended Season</div>
                    <div class="info-value">${data.best_time}</div>
                </div>
            </div>
        </div>
        
        <div class="category">
            <div class="category-header">
                <h3 class="category-title">
                    <span class="category-icon">🛡️</span>
                    Safety & Scams
                </h3>
            </div>
            <div class="category-content">
                <div class="info-item">
                    <div class="info-label">Common Scams</div>
                    <div class="info-value">
                        <ul class="scam-list">
                            ${data.safety_scams.common_scams.map(scam => `<li>${scam}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-label">Safety Notes</div>
                    <div class="info-value">${data.safety_scams.safety_notes}</div>
                </div>
            </div>
        </div>
    `;
}

// Search functionality
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchSuggestions = document.getElementById('searchSuggestions');
const resultsSection = document.getElementById('resultsSection');
const noResults = document.getElementById('noResults');

// Event listeners
searchInput.addEventListener('input', showSuggestions);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const destination = findDestination(searchInput.value);
        if (destination) {
            showResults(destination);
        } else {
            noResults.style.display = 'block';
            resultsSection.style.display = 'none';
        }
        searchSuggestions.style.display = 'none';
    }
});

searchBtn.addEventListener('click', () => {
    const destination = findDestination(searchInput.value);
    if (destination) {
        showResults(destination);
    } else {
        noResults.style.display = 'block';
        resultsSection.style.display = 'none';
    }
    searchSuggestions.style.display = 'none';
});

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-section')) {
        searchSuggestions.style.display = 'none';
    }
});