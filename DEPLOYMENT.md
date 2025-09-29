# 🚀 Travel Survival Guide - Deployment Guide

## Quick Deploy Options

### Option 1: Railway (Recommended - Easiest)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Your Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will automatically detect Node.js and deploy

3. **Your API will be live at:**
   - `https://your-project-name.railway.app`
   - Health check: `https://your-project-name.railway.app/api/health`

### Option 2: Render (Free Tier)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     - Build Command: `npm install`
     - Start Command: `node server.js`
   - Click "Create Web Service"

### Option 3: Vercel (Serverless)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

## API Endpoints

Once deployed, your API will have these endpoints:

- `GET /` - Web interface
- `GET /api/health` - Health check
- `GET /api/destinations` - List all destinations
- `GET /api/destination/{country}` - Get specific destination
- `GET /api/search?q={query}` - Search destinations

## Environment Variables

No environment variables required - the API works out of the box!

## Local Development

```bash
# Install dependencies
npm install

# Start server
npm start

# Server runs on http://localhost:3000
```

## Testing Your Deployment

```bash
# Health check
curl https://your-app-url.railway.app/api/health

# Get France data
curl https://your-app-url.railway.app/api/destination/france

# Search Thailand
curl https://your-app-url.railway.app/api/search?q=thailand
```
