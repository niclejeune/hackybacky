#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { insertDestination } = require('../database/models');
const { testConnection, initializeDatabase } = require('../database/connection');

// Load environment variables
require('dotenv').config();

const seedDatabase = async () => {
    try {
        console.log('🔄 Starting database seeding...');
        
        // Test database connection
        const connected = await testConnection();
        if (!connected) {
            console.error('❌ Database connection failed');
            process.exit(1);
        }
        
        // Initialize database schema
        await initializeDatabase();
        console.log('✅ Database schema initialized');
        
        // Read all JSON files from data directory
        const dataDir = path.join(__dirname, '..', 'data');
        
        if (!fs.existsSync(dataDir)) {
            console.error('❌ Data directory not found');
            process.exit(1);
        }
        
        const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
        console.log(`📁 Found ${files.length} JSON files to process`);
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const file of files) {
            try {
                const filePath = path.join(dataDir, file);
                const fileData = fs.readFileSync(filePath, 'utf8');
                const destinationData = JSON.parse(fileData);
                
                // Insert into database
                const destinationId = await insertDestination(destinationData);
                console.log(`✅ Inserted: ${destinationData.destination} (ID: ${destinationId})`);
                successCount++;
                
            } catch (error) {
                console.error(`❌ Error processing ${file}:`, error.message);
                errorCount++;
            }
        }
        
        console.log('\n📊 Seeding Summary:');
        console.log(`✅ Successfully inserted: ${successCount} destinations`);
        console.log(`❌ Errors: ${errorCount} files`);
        console.log(`📁 Total files processed: ${files.length}`);
        
        if (successCount > 0) {
            console.log('\n🎉 Database seeding completed successfully!');
        } else {
            console.log('\n⚠️  No data was inserted. Check your JSON files.');
        }
        
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

// Run seeding if called directly
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase };
