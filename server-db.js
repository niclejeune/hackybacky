const express = require('express');
const cors = require('cors');
const path = require('path');
const { testConnection, initializeDatabase } = require('./database/connection');
const { getAllDestinations, getDestinationByName, searchDestinations } = require('./database/models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Initialize database connection
let dbReady = false;

const initializeApp = async () => {
    try {
        console.log('🔄 Initializing database connection...');
        
        const connected = await testConnection();
        if (!connected) {
            console.error('❌ Failed to connect to database');
            return;
        }
        
        await initializeDatabase();
        console.log('✅ Database initialized successfully');
        dbReady = true;
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
    }
};

// Initialize on startup
initializeApp();

// Helper function to find destination using metadata
const findDestination = async (searchTerm) => {
    if (!dbReady) {
        return null;
    }
    
    try {
        // First try direct name match
        const directMatch = await getDestinationByName(searchTerm);
        if (directMatch) {
            return directMatch;
        }
        
        // Then try search in metadata
        const searchResults = await searchDestinations(searchTerm);
        if (searchResults.length > 0) {
            return searchResults[0];
        }
        
        return null;
    } catch (error) {
        console.error('Error finding destination:', error);
        return null;
    }
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for destination lookup
app.get('/api/destination/:country', async (req, res) => {
    if (!dbReady) {
        return res.status(503).json({
            success: false,
            error: 'Database not ready'
        });
    }
    
    const { country } = req.params;
    const destination = await findDestination(country);
    
    if (destination) {
        res.json({
            success: true,
            data: destination
        });
    } else {
        res.status(404).json({
            success: false,
            error: 'Destination not found'
        });
    }
});

// API endpoint for search
app.get('/api/search', async (req, res) => {
    if (!dbReady) {
        return res.status(503).json({
            success: false,
            error: 'Database not ready'
        });
    }
    
    const { q } = req.query;
    
    if (!q) {
        return res.status(400).json({
            success: false,
            error: 'Query parameter "q" is required'
        });
    }
    
    const destination = await findDestination(q);
    
    if (destination) {
        res.json({
            success: true,
            data: destination
        });
    } else {
        res.status(404).json({
            success: false,
            error: 'No results found',
            query: q
        });
    }
});

// API endpoint to get all available destinations
app.get('/api/destinations', async (req, res) => {
    if (!dbReady) {
        return res.status(503).json({
            success: false,
            error: 'Database not ready'
        });
    }
    
    try {
        const destinations = await getAllDestinations();
        const result = destinations.map(dest => ({
            key: dest.destination.toLowerCase().replace(/\s+/g, '-'),
            destination: dest.destination,
            region_type: dest.region_type,
            emoji_flag: dest.emoji_flag || '🌍'
        }));
        
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error getting destinations:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
    const dbStatus = dbReady ? 'connected' : 'disconnected';
    
    res.json({
        success: true,
        message: 'Travel Survival Guide API is running',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        destinations: dbReady ? 'Loading...' : 0
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
