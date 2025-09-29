const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Load travel data from individual JSON files in data/ directory
const loadTravelData = () => {
    const data = {};
    
    try {
        const dataDir = path.join(__dirname, 'data');
        
        if (!fs.existsSync(dataDir)) {
            console.log('📁 data/ directory not found');
            return {};
        }
        
        // Read all JSON files from data directory
        const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
        
        files.forEach(file => {
            try {
                const filePath = path.join(dataDir, file);
                const fileData = fs.readFileSync(filePath, 'utf8');
                const destination = JSON.parse(fileData);
                
                // Create key from destination name
                const key = destination.destination.toLowerCase().replace(/\s+/g, '-');
                data[key] = destination;
            } catch (error) {
                console.error(`Error loading ${file}:`, error.message);
            }
        });
        
        console.log(`📊 Loaded ${Object.keys(data).length} destinations from data/ directory`);
    } catch (error) {
        console.error('Error loading travel data:', error.message);
    }
    
    return data;
};

const travelData = loadTravelData();

// Helper function to find destination using metadata
const findDestination = (searchTerm) => {
    const normalized = searchTerm.toLowerCase().trim();
    
    // Direct destination name match
    const directKey = normalized.replace(/\s+/g, '-');
    if (travelData[directKey]) {
        return directKey;
    }
    
    // Search through metadata in each destination
    for (const [key, data] of Object.entries(travelData)) {
        if (data.metadata) {
            const allSearchTerms = [
                data.destination,
                ...data.metadata.highlights || [],
                ...data.metadata.keywords || []
            ];
            
            if (allSearchTerms.some(term => 
                normalized.includes(term.toLowerCase()) || 
                term.toLowerCase().includes(normalized)
            )) {
                return key;
            }
        }
    }
    
    return null;
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for destination lookup
app.get('/api/destination/:country', (req, res) => {
    const { country } = req.params;
    const destination = findDestination(country);
    
    if (destination && travelData[destination]) {
        res.json({
            success: true,
            data: travelData[destination]
        });
    } else {
        res.status(404).json({
            success: false,
            error: 'Destination not found',
            available: Object.keys(travelData)
        });
    }
});

// API endpoint for search
app.get('/api/search', (req, res) => {
    const { q } = req.query;
    
    if (!q) {
        return res.status(400).json({
            success: false,
            error: 'Query parameter "q" is required'
        });
    }
    
    const destination = findDestination(q);
    
    if (destination && travelData[destination]) {
        res.json({
            success: true,
            data: travelData[destination]
        });
    } else {
        res.status(404).json({
            success: false,
            error: 'No results found',
            query: q,
            suggestions: Object.keys(travelData)
        });
    }
});

// API endpoint to get all available destinations
app.get('/api/destinations', (req, res) => {
    const destinations = Object.keys(travelData).map(key => ({
        key,
        destination: travelData[key].destination,
        region_type: travelData[key].region_type,
        emoji_flag: travelData[key].emoji_flag || '🌍'
    }));
    
    res.json({
        success: true,
        data: destinations
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Travel Survival Guide API is running',
        timestamp: new Date().toISOString(),
        destinations: Object.keys(travelData).length
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

app.listen(PORT, () => {
    console.log(`🌍 Travel Survival Guide API running on port ${PORT}`);
    console.log(`📱 Web app: http://localhost:${PORT}`);
    console.log(`🔗 API docs:`);
    console.log(`   GET /api/destination/{country} - Get specific destination`);
    console.log(`   GET /api/search?q={query} - Search destinations`);
    console.log(`   GET /api/destinations - List all destinations`);
    console.log(`   GET /api/health - Health check`);
});
