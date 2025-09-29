const { Pool } = require('pg');
require('dotenv').config();

// Database connection configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test database connection
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Database connected successfully');
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

// Initialize database schema
const initializeDatabase = async () => {
    try {
        const client = await pool.connect();
        
        // Read and execute schema
        const fs = require('fs');
        const path = require('path');
        const schemaPath = path.join(__dirname, 'schema.sql');
        
        if (fs.existsSync(schemaPath)) {
            const schema = fs.readFileSync(schemaPath, 'utf8');
            await client.query(schema);
            console.log('✅ Database schema initialized');
        }
        
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        return false;
    }
};

module.exports = {
    pool,
    testConnection,
    initializeDatabase
};
