#!/bin/bash

# Travel Survival Guide - Database Deployment Script
# This script sets up the database and seeds it with travel data

echo "🚀 Starting Travel Survival Guide deployment..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable not set"
    echo "Please set DATABASE_URL to your PostgreSQL connection string"
    exit 1
fi

echo "✅ DATABASE_URL is set"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run database seeding
echo "🌱 Seeding database with travel data..."
node scripts/seed-database.js

if [ $? -eq 0 ]; then
    echo "✅ Database seeding completed successfully!"
    echo "🚀 Starting server..."
    node server-db.js
else
    echo "❌ Database seeding failed"
    exit 1
fi
