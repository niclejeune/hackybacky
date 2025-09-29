const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Load travel data from JSON files
const loadTravelData = () => {
    const data = {};
    
    try {
        const dataDir = path.join(__dirname, 'data');
        
        if (!fs.existsSync(dataDir)) {
            console.log('📁 data/ directory not found');
            return {};
        }
        
        // Read all JSON files from data directory
        const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json') && file !== 'package.json');
        
        files.forEach(file => {
            try {
                const filePath = path.join(dataDir, file);
                const fileData = fs.readFileSync(filePath, 'utf8');
                const destination = JSON.parse(fileData);
                
                // Create key from destination name
                const key = destination.destination.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                data[key] = destination;
            } catch (error) {
                console.error(`Error loading ${file}:`, error.message);
            }
        });
        
        console.log(`📊 Loaded ${Object.keys(data).length} destinations from JSON files`);
    } catch (error) {
        console.error('Error loading travel data:', error.message);
    }
    
    return data;
};

// Load data on startup
const travelData = loadTravelData();

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        destinations: Object.keys(travelData).length,
        timestamp: new Date().toISOString(),
        message: 'Travel Survival Guide API - JSON File Based'
    });
});

// Get all destinations
app.get('/api/destinations', (req, res) => {
    const destinations = Object.keys(travelData).map(key => ({
        key,
        name: travelData[key].destination,
        region_type: travelData[key].region_type,
        emoji_flag: travelData[key].emoji_flag,
        highlights: travelData[key].metadata?.highlights || [],
        keywords: travelData[key].metadata?.keywords || []
    }));
    
    res.json(destinations);
});

// Get specific destination
app.get('/api/destination/:key', (req, res) => {
    const { key } = req.params;
    const destination = travelData[key.toLowerCase()];
    
    if (!destination) {
        return res.status(404).json({ error: 'Destination not found' });
    }
    
    res.json(destination);
});

// Search destinations
app.get('/api/search', (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ error: 'Query parameter required' });
    }
    
    const query = q.toLowerCase();
    const results = [];
    
    Object.keys(travelData).forEach(key => {
        const destination = travelData[key];
        
        // Search in destination name
        if (destination.destination.toLowerCase().includes(query)) {
            results.push({ key, destination, score: 100 });
            return;
        }
        
        // Search in keywords
        if (destination.metadata?.keywords) {
            const keywordMatch = destination.metadata.keywords.some(keyword => 
                keyword.toLowerCase().includes(query)
            );
            if (keywordMatch) {
                results.push({ key, destination, score: 80 });
                return;
            }
        }
        
        // Search in highlights
        if (destination.metadata?.highlights) {
            const highlightMatch = destination.metadata.highlights.some(highlight => 
                highlight.toLowerCase().includes(query)
            );
            if (highlightMatch) {
                results.push({ key, destination, score: 60 });
                return;
            }
        }
        
        // Search in other fields
        const searchText = JSON.stringify(destination).toLowerCase();
        if (searchText.includes(query)) {
            results.push({ key, destination, score: 40 });
        }
    });
    
    // Sort by score and return
    results.sort((a, b) => b.score - a.score);
    res.json(results.map(r => ({ key: r.key, destination: r.destination })));
});

// Serve the web interface
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Travel Survival Guide API running on http://localhost:${PORT}`);
    console.log(`📊 Loaded ${Object.keys(travelData).length} destinations`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Web interface: http://localhost:${PORT}`);
    
    // Show some example destinations
    const exampleKeys = Object.keys(travelData).slice(0, 5);
    if (exampleKeys.length > 0) {
        console.log(`🌍 Example destinations: ${exampleKeys.join(', ')}`);
    }
});
