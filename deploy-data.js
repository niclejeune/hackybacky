#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// This script will be run on Railway to load data
// Data files should be uploaded separately via Railway CLI

const loadTravelData = () => {
    const data = {};
    
    try {
        const dataDir = path.join(__dirname, 'data');
        
        if (!fs.existsSync(dataDir)) {
            console.log('📁 data/ directory not found - will use fallback data');
            return getFallbackData();
        }
        
        const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
        
        files.forEach(file => {
            try {
                const filePath = path.join(dataDir, file);
                const fileData = fs.readFileSync(filePath, 'utf8');
                const destination = JSON.parse(fileData);
                
                const key = destination.destination.toLowerCase().replace(/\s+/g, '-');
                data[key] = destination;
            } catch (error) {
                console.error(`Error loading ${file}:`, error.message);
            }
        });
        
        console.log(`📊 Loaded ${Object.keys(data).length} destinations from data/ directory`);
    } catch (error) {
        console.error('Error loading travel data:', error.message);
        return getFallbackData();
    }
    
    return data;
};

// Fallback data if files not found
const getFallbackData = () => {
    return {
        'france': {
            destination: 'France',
            region_type: 'country',
            emoji_flag: '🇫🇷',
            metadata: {
                highlights: ['Eiffel Tower', 'Louvre Museum', 'Mont Saint-Michel'],
                keywords: ['TGV', 'croissant', 'wine', 'château']
            },
            payments: {
                cash: 'Cash still useful in small shops, cafés, bakeries, and rural areas.',
                card: 'Visa and Mastercard widely accepted; Amex less common outside big cities.',
                mobile: 'Apple Pay and Google Pay widely accepted; many French banks support contactless via NFC.'
            },
            internet: {
                sim_esim: 'Orange, SFR, Bouygues, Free Mobile sell prepaid SIMs. eSIMs from Airalo, Holafly.',
                wifi: 'Free WiFi in cafés, McDonald\'s, train stations, and hotels.',
                avg_speed_mbps: 90,
                availability: 'Excellent in cities, patchy in rural mountains.'
            },
            transport: {
                passes: 'Navigo card in Paris for metro, buses, RER. TGV trains need booking.',
                apps: 'RATP app, SNCF Connect, Oui.sncf, Citymapper.',
                quirks: 'Frequent strikes affect trains/metros. Shops may close at lunch (12–2 pm).'
            },
            culture: {
                tipping: 'Service included; rounding up appreciated.',
                closures: 'Museums closed Mon/Tue; small shops closed Sun.',
                dress: 'Smart casual for fine dining.'
            },
            food_drink: {
                must_try: ['Croissant', 'Crêpes', 'Coq au Vin', 'Cheese & Wine'],
                etiquette: 'Say \'Bonjour\' before ordering. Bread goes on the table, not plates.'
            },
            budget: {
                backpacker: '$60–90/day',
                midrange: '$150–250/day'
            },
            best_time: 'Apr–Jun and Sep–Oct',
            safety_scams: {
                common_scams: ['Pickpockets in Paris metro', 'Petition scam', 'Bracelet scam at Montmartre'],
                safety_notes: 'Bag checks at museums, keep valuables secure.'
            }
        }
    };
};

module.exports = { loadTravelData };
