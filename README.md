# 🌍 Travel Survival Guide

Essential travel information for high-confusion destinations. Get instant access to payment methods, internet connectivity, transport options, cultural norms, and safety information for your destination.

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# Start the server
npm start

# Development mode (auto-restart)
npm run dev
```

Visit `http://localhost:3000` to use the web app.

## 🗄️ Database Architecture

This project uses PostgreSQL to store travel data efficiently:

- **9 normalized tables** for different data types
- **Indexed queries** for fast searching
- **Full-text search** on highlights and keywords
- **ACID compliance** for data integrity

## 📱 Web App Features

- **Smart Search**: Search by country name, city, or common terms (e.g., "I'm going to Seoul")
- **Structured Information**: Organized into 8 key categories:
  - 💳 **Payments** (cash/card/mobile apps)
  - 📶 **Internet** (SIM/eSIM, WiFi availability)
  - 🚇 **Transport** (passes, apps, quirks)
  - 🎭 **Culture** (tipping, closures, dress codes)
  - 🍽️ **Food & Drink** (must-try foods, etiquette)
  - 💰 **Budget** (backpacker/mid-range costs)
  - 📅 **Best Time** (recommended seasons)
  - 🛡️ **Safety & Scams** (common scams, safety notes)

## 🔗 API Endpoints

### Get Destination Data
```bash
GET /api/destination/{country}
```

Examples:
- `GET /api/destination/france`
- `GET /api/destination/thailand`
- `GET /api/destination/japan`

### Search Destinations
```bash
GET /api/search?q={query}
```

Examples:
- `GET /api/search?q=seoul`
- `GET /api/search?q=tokyo`
- `GET /api/search?q=berlin`

### List All Destinations
```bash
GET /api/destinations
```

### Health Check
```bash
GET /api/health
```

## 📊 Current Destinations

**80+ destinations** including:
- 🇫🇷 **France** - Paris, Lyon, and nationwide
- 🇹🇭 **Thailand** - Bangkok, Chiang Mai, islands
- 🇯🇵 **Japan** - Tokyo, Osaka, Kyoto
- 🇩🇪 **Germany** - Berlin, Munich, nationwide
- 🇪🇸 **Spain** - Madrid, Barcelona, nationwide
- 🇺🇸 **USA** - New York, California, nationwide
- 🇦🇺 **Australia** - Sydney, Melbourne, nationwide
- And many more...

## 🚀 Deployment

### Railway (Recommended)
1. **Make repository public** (required for Railway free tier)
2. **Go to [railway.app](https://railway.app)**
3. **Deploy from GitHub**
4. **Add PostgreSQL database**
5. **Deploy automatically**

### Other Platforms
- **Render** - Supports private repos
- **Vercel** - Serverless deployment
- **DigitalOcean** - VPS deployment

## 🔧 Integration

```javascript
// Example integration
fetch('/api/destination/france')
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Payment info:', data.data.payments);
      console.log('Transport:', data.data.transport);
      console.log('Culture:', data.data.culture);
    }
  });
```

## 🛠️ Development

### Project Structure
```
├── index.html              # Web app interface
├── styles.css              # Styling
├── script.js               # Frontend logic
├── server-db.js            # Database-powered server
├── package.json            # Dependencies
├── railway.json            # Railway deployment config
├── .gitignore              # Git ignore rules
├── database/
│   ├── schema.sql          # Database schema
│   ├── connection.js       # Database connection
│   └── models.js           # Data access layer
├── scripts/
│   └── seed-database.js    # Database seeding script
└── data/                   # Travel data JSON files (ignored in git)
    ├── France.json
    ├── Thailand.json
    └── ...
```

### Database Schema
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

### Adding New Destinations

1. **Add JSON file** to `data/` directory
2. **Follow existing structure** (see examples)
3. **Run seeding script**: `node scripts/seed-database.js`
4. **Deploy to Railway** - automatic seeding

### Local Database Setup

```bash
# Install PostgreSQL locally
# Create database
createdb travel_guide

# Set environment variable
export DATABASE_URL="postgresql://username:password@localhost:5432/travel_guide"

# Seed database
node scripts/seed-database.js

# Start server
node server-db.js
```

## 📈 Benefits of Database Approach

✅ **No files in repository** - Keep your repo clean  
✅ **Better performance** - Indexed queries  
✅ **Scalable** - Handle more data efficiently  
✅ **Secure** - Data not exposed in public repo  
✅ **Searchable** - Full-text search capabilities  
✅ **Reliable** - ACID compliance  

## 📝 Data Sources

- Government travel advisories
- Reddit travel communities
- Travel blogs and guides
- Local expat communities
- Tourism board websites

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your destination data to `data/` directory
4. Test the API endpoints
5. Submit a pull request

## 📄 License

MIT License - feel free to use for your own projects!

## 🔗 Live Demo

Once deployed to Railway, your API will be available at:
- **Web App**: `https://your-project.railway.app`
- **API**: `https://your-project.railway.app/api/health`