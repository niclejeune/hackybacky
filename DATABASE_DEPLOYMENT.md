# 🗄️ Travel Survival Guide - Database Deployment Guide

## Overview
This guide shows how to deploy your Travel Survival Guide API using PostgreSQL database instead of JSON files.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Server    │    │   PostgreSQL    │
│   (HTML/JS)     │◄──►│   (Node.js)     │◄──►│   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database (Railway provides this)
- Your travel data JSON files

## 🚀 Railway Deployment Steps

### Step 1: Set up Railway Project

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Select your repository**

### Step 2: Add PostgreSQL Database

1. **In your Railway project dashboard**
2. **Click "New" → "Database" → "PostgreSQL"**
3. **Railway will automatically create a PostgreSQL instance**
4. **Copy the `DATABASE_URL` from the database service**

### Step 3: Configure Environment Variables

In your Railway project settings, add:
```
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
```

### Step 4: Deploy Your Code

Railway will automatically:
- Install dependencies from `package.json`
- Run `node server-db.js` (as specified in `railway.json`)
- Connect to your PostgreSQL database

## 🗄️ Database Schema

The database includes these tables:
- `destinations` - Main destination info
- `destination_metadata` - Highlights and keywords
- `payments` - Payment methods
- `internet` - Internet connectivity
- `transport` - Transportation info
- `culture` - Cultural information
- `food_drink` - Food and drink recommendations
- `budget` - Budget information
- `travel_info` - Best time to visit
- `safety_scams` - Safety and scam information

## 🌱 Seeding the Database

The database will be automatically seeded with your travel data when the server starts.

### Manual Seeding (if needed)

```bash
# Install dependencies
npm install

# Seed the database
node scripts/seed-database.js
```

## 🔧 Local Development

### 1. Set up Local PostgreSQL

```bash
# Install PostgreSQL (if not already installed)
# Create database
createdb travel_guide

# Set environment variable
export DATABASE_URL="postgresql://username:password@localhost:5432/travel_guide"
```

### 2. Run Locally

```bash
# Install dependencies
npm install

# Seed database
node scripts/seed-database.js

# Start server
node server-db.js
```

## 📊 API Endpoints

Once deployed, your API will have these endpoints:

- `GET /` - Web interface
- `GET /api/health` - Health check with database status
- `GET /api/destinations` - List all destinations
- `GET /api/destination/{country}` - Get specific destination
- `GET /api/search?q={query}` - Search destinations

## 🔍 Testing Your Deployment

```bash
# Health check
curl https://your-app.railway.app/api/health

# Get France data
curl https://your-app.railway.app/api/destination/france

# Search Thailand
curl https://your-app.railway.app/api/search?q=thailand

# List all destinations
curl https://your-app.railway.app/api/destinations
```

## 🛠️ Troubleshooting

### Database Connection Issues
- Check `DATABASE_URL` environment variable
- Ensure PostgreSQL service is running
- Verify database credentials

### Seeding Issues
- Check JSON files are valid
- Ensure database schema is created
- Check file permissions

### Performance Issues
- Database indexes are automatically created
- Consider connection pooling for high traffic
- Monitor database performance in Railway dashboard

## 📈 Benefits of Database Approach

✅ **No files in repository** - Keep your repo clean  
✅ **Better performance** - Indexed queries  
✅ **Scalable** - Handle more data efficiently  
✅ **Secure** - Data not exposed in public repo  
✅ **Searchable** - Full-text search capabilities  
✅ **Reliable** - ACID compliance  

## 🔄 Updates

To update travel data:
1. Update JSON files locally
2. Re-run seeding script
3. Deploy to Railway
4. Database will be updated automatically

## 📞 Support

If you encounter issues:
1. Check Railway logs
2. Verify database connection
3. Test API endpoints
4. Check environment variables
