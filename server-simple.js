require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize PostgreSQL connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Test database connection on startup
const testDatabaseConnection = async () => {
    try {
        const { rows } = await pool.query('SELECT COUNT(*) as count FROM destinations');
        console.log(`📊 Connected to database with ${rows[0].count} destinations`);
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT COUNT(*) as count FROM destinations');
        res.json({
            status: 'healthy',
            destinations: parseInt(rows[0].count),
            timestamp: new Date().toISOString(),
            message: 'Travel Survival Guide API - PostgreSQL Based'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Get all destinations
app.get('/api/destinations', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT key, name, region_type, emoji_flag, 
                   payload->'metadata'->'highlights' as highlights,
                   payload->'metadata'->'keywords' as keywords
            FROM destinations 
            ORDER BY name ASC
        `);
        
        const destinations = rows.map(row => ({
            key: row.key,
            name: row.name,
            region_type: row.region_type,
            emoji_flag: row.emoji_flag,
            highlights: row.highlights || [],
            keywords: row.keywords || []
        }));
        
        res.json(destinations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get specific destination
app.get('/api/destination/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { rows } = await pool.query(
            'SELECT payload FROM destinations WHERE key = $1',
            [key.toLowerCase()]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Destination not found' });
        }
        
        res.json(rows[0].payload);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search destinations
app.get('/api/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Query parameter required' });
        }
        
        const query = q.toLowerCase();
        const { rows } = await pool.query(`
            SELECT key, name, region_type, emoji_flag,
                   similarity(name, $1) as score
            FROM destinations
            WHERE name ILIKE '%' || $1 || '%'
               OR payload->'metadata'->'keywords'::text ILIKE '%' || $1 || '%'
               OR payload->'metadata'->'highlights'::text ILIKE '%' || $1 || '%'
            ORDER BY score DESC NULLS LAST, name ASC
            LIMIT 10
        `, [query]);
        
        const results = rows.map(row => ({
            key: row.key,
            destination: row.name,
            region_type: row.region_type,
            emoji_flag: row.emoji_flag,
            score: row.score || 0
        }));
        
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve the web interface
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Travel Survival Guide API running on http://localhost:${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Web interface: http://localhost:${PORT}`);
    
    // Test database connection
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
        console.log('⚠️  Server started but database connection failed');
    }
});
