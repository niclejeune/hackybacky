# Travel Survival Guide API

A PostgreSQL-powered REST API providing essential travel information for 76+ destinations worldwide. Get instant access to payment methods, internet connectivity, transport options, cultural norms, and safety information through both API endpoints and an interactive web interface.

## 🚀 Quick Start

### Option 1: With Docker PostgreSQL (Recommended)
```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL with Docker
docker run --name hackybacky-db -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=hackybacky \
  -d postgres:16

# 3. Create .env file
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hackybacky"' > .env

# 4. Set up database schema
psql "$DATABASE_URL" -f sql/schema.sql

# 5. Import travel data
npm run db:import

# 6. Start the API
npm start
```

### Option 2: With Existing PostgreSQL

```bash
# 1. Install dependencies
npm install

# 2. Create .env file with your database URL
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/your_db"' > .env

# 3. Set up database schema
psql "$DATABASE_URL" -f sql/schema.sql

# 4. Import travel data
npm run db:import

# 5. Start the API
npm start
```

Your API will be running at **http://localhost:3000**

## ⚠️ Important Note About Data

**The `data/` directory is not included in this repository.** You must create your own destination JSON files. The original data has been removed for privacy reasons.

**To get started:**
1. **Create your own JSON files** in the `data/` directory following the format in `scripts/add-destination.js`
2. **Use the import script** to add destinations: `npm run db:import`
3. **Or use the add-destination script** to add individual destinations: `npm run db:add`

## 🌐 Web Interface

The project includes a fully functional web interface:

- **Search**: Type any country name to get instant results
- **Live Suggestions**: See suggestions as you type
- **Detailed Information**: View comprehensive travel data for each destination
- **Responsive Design**: Works on desktop and mobile devices

Simply open **http://localhost:3000** in your browser to start using the web interface!

## 📁 Project Structure

```
hackybacky/
├── data/                 # Travel destination JSON files (YOU MUST CREATE THESE)
│   ├── France.json      # Create your own destination files
│   ├── China.json       # Follow the format in scripts/add-destination.js
│   ├── Japan.json       # Or use the import script to add destinations
│   └── ... (your countries)
├── sql/                 # Database schema and migrations
│   └── schema.sql        # PostgreSQL schema with JSONB support
├── scripts/              # Database management scripts
│   ├── import-data.js    # Import JSON files to PostgreSQL
│   └── add-destination.js # Add new destinations to database
├── server-simple.js      # Main API server (PostgreSQL-powered)
├── index.html           # Web interface
├── script.js            # Frontend JavaScript
├── styles.css           # Frontend styling
├── package.json         # Dependencies
├── .env                 # Environment variables (DATABASE_URL)
└── README.md            # This file
```

## 🌍 Available Destinations

**76+ countries and regions including:**

🇪🇺 **Europe**: France, Germany, Italy, Spain, United Kingdom, Netherlands, Switzerland, Austria, Belgium, Poland, Czech Republic, Croatia, Denmark, Sweden, Norway, Finland, Ireland, Portugal, Greece, Hungary, Estonia, Latvia, Lithuania, Iceland, Monaco

🇦🇸 **Asia**: China, Japan, Thailand, South Korea, Singapore, Malaysia, Vietnam, Indonesia, Philippines, India, Nepal, Sri Lanka, Hong Kong, Macau, United Arab Emirates, Saudi Arabia, Qatar, Israel, Jordan

🇺🇸 **Americas**: USA, Canada, Mexico, Brazil, Argentina, Chile, Peru, Colombia, Costa Rica, Cuba, Panama, Ecuador, Bolivia, Guatemala, Belize, Honduras, El Salvador, Nicaragua, Puerto Rico, Jamaica, Trinidad & Tobago, Dominican Republic

🇦🇺 **Oceania**: Australia, New Zealand

🇦🇫 **Africa**: Egypt, Morocco, South Africa, Kenya, Tanzania, Maldives

🇷🇺 **Other**: Russia, Turkey

## 🎯 Key Features

- **PostgreSQL Backend**: Fast, reliable database with JSONB support for flexible data storage
- **Real-time Search**: Type any country name and get instant results with PostgreSQL full-text search
- **Live Suggestions**: See matching destinations as you type
- **Database Management**: Easy scripts for importing data and adding new destinations
- **Comprehensive Data**: Each destination includes:
  - 💳 Payment methods (cash, card, mobile)
  - 📶 Internet connectivity (SIM, WiFi, speeds)
  - 🚌 Transport options (passes, apps, quirks)
  - 🎭 Cultural norms (tipping, closures, dress code)
  - 🍽️ Food information (must-try dishes, dining etiquette)
  - 💰 Budget estimates (backpacker, midrange costs)
  - 🛡️ Safety information (common scams, safety notes)
  - 🌤️ Best time to visit
  - 📞 Communication details

## 🗄️ Database Management

### Adding New Destinations

**Option 1: Add JSON file and re-import**
```bash
# 1. Add new JSON file to data/ directory
# 2. Re-run import (updates existing, adds new)
npm run db:import
```

**Option 2: Use the add-destination script**
```bash
# 1. Edit scripts/add-destination.js with your destination data
# 2. Run the script
npm run db:add
```

## 📊 API Endpoints

**Option 3: Direct database insertion**
```sql
# Connect to database
psql "$DATABASE_URL"

# Insert new destination
INSERT INTO destinations (key, name, region_type, emoji_flag, payload) 
VALUES (
  'new-country',
  'New Country',
  'country',
  '🏴',
  '{"destination": "New Country", "payments": {...}}'::jsonb
);
```

### Database Schema

The PostgreSQL schema uses JSONB for flexible data storage:

```sql
# Key table structure
CREATE TABLE destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  name text NOT NULL,
  region_type text NOT NULL,
  emoji_flag text,
  payload jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

# Optimized indexes for fast search
CREATE INDEX idx_destinations_payload_gin ON destinations USING gin (payload jsonb_path_ops);
CREATE INDEX idx_destinations_name_trgm ON destinations USING gin (name gin_trgm_ops);
```

### Environment Variables

Create a `.env` file with your database connection:

```bash
# For Docker PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hackybacky"

# For managed PostgreSQL (Supabase, Neon, etc.)
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

## 📊 API Endpoints

### Health Check
```bash
GET /api/health
```
Returns API status and number of loaded destinations.

### List All Destinations
```bash
GET /api/destinations
```
Returns a list of all available destinations with basic info.

### Get Specific Destination
```bash
GET /api/destination/{key}
```
Returns complete travel information for a destination.

**Key Generation Rules:**
- Spaces become hyphens: `"Dominican Republic"` → `"dominican-republic"`
- Special characters are removed: `"Trinidad & Tobago"` → `"trinidad-tobago"`
- All keys are lowercase

**Examples:**
```bash
curl http://localhost:3000/api/destination/france
curl http://localhost:3000/api/destination/japan
curl http://localhost:3000/api/destination/united-kingdom
curl http://localhost:3000/api/destination/dominican-republic
curl http://localhost:3000/api/destination/trinidad-tobago
curl http://localhost:3000/api/destination/saudi-arabia
```

### Search Destinations
```bash
GET /api/search?q={query}
```
Search across all destinations by name, keywords, highlights, or any content.

**Examples:**
```bash
curl http://localhost:3000/api/search?q=china
curl http://localhost:3000/api/search?q=sushi
curl http://localhost:3000/api/search?q=metro
curl http://localhost:3000/api/search?q=visa
```

## 📋 Data Structure

Each destination includes comprehensive information:

```json
{
  "destination": "France",
  "region_type": "country",
  "emoji_flag": "🇫🇷",
  "metadata": {
    "highlights": ["Eiffel Tower", "Louvre Museum", "Mont Saint-Michel"],
    "keywords": ["TGV", "croissant", "wine", "château"]
  },
  "payments": {
    "cash": "Cash usage information",
    "card": "Credit card acceptance",
    "mobile": "Mobile payment options"
  },
  "internet": {
    "sim_esim": "SIM card and eSIM options",
    "wifi": "WiFi availability",
    "avg_speed_mbps": 90,
    "availability": "Coverage information"
  },
  "transport": {
    "passes": "Transportation passes",
    "apps": "Useful apps",
    "quirks": "Local transport quirks"
  },
  "culture": {
    "tipping": "Tipping customs",
    "closures": "Business hours",
    "dress": "Dress code recommendations"
  },
  "food_drink": {
    "must_try": ["Local specialties"],
    "etiquette": "Dining etiquette"
  },
  "budget": {
    "backpacker": "Budget travel costs",
    "midrange": "Mid-range travel costs"
  },
  "best_time": "Optimal travel season",
  "safety_scams": {
    "common_scams": ["Known scams"],
    "safety_notes": "Safety information"
  }
}
```

## 🌐 Web Interface

Visit **http://localhost:3000** for a user-friendly web interface with:

- **Real-time search** across all destinations
- **Formatted display** of travel information
- **Responsive design** for mobile and desktop
- **Direct API access** from the browser

## 🔧 Development

### Scripts
```bash
npm start    # Start the API server
npm run dev  # Start in development mode
```

### Adding New Destinations

1. **Create JSON file** in the `data/` directory
2. **Follow the data structure** shown above
3. **Restart the server** to load new data

The server automatically reads all `.json` files from the `data/` directory on startup.

### Modifying Existing Data

1. **Edit the JSON file** in the `data/` directory
2. **Restart the server** to reload changes

## 🚀 Deployment Options

### Local Development
```bash
npm install && npm start
```

### Production Hosting
- **Vercel**: Deploy directly from GitHub
- **Netlify**: Static hosting with API functions
- **Railway**: Full-stack hosting
- **Heroku**: Container deployment
- **DigitalOcean**: VPS deployment

### Environment Variables
```bash
PORT=3000  # Optional: Change the port (default: 3000)
```

## 📈 Features

- ✅ **80+ Destinations** - Comprehensive global coverage
- ✅ **Real-time Search** - Fast text search across all data
- ✅ **RESTful API** - Clean, documented endpoints
- ✅ **JSON-based** - Simple file-based data storage
- ✅ **Web Interface** - User-friendly search interface
- ✅ **Lightweight** - No database required
- ✅ **Fast Startup** - Instant server startup
- ✅ **Easy Updates** - Edit JSON files directly

## 📖 Use Cases

- **Travel Apps** - Integrate travel information
- **Chatbots** - Provide travel advice
- **Travel Websites** - Display destination info
- **Research** - Access structured travel data
- **Mobile Apps** - Offline-capable travel guide

## 🤝 Contributing

1. **Fork the repository**
2. **Add or update destination JSON files**
3. **Test your changes locally**
4. **Submit a pull request**

## 📄 License

MIT License - feel free to use this data and API for your projects.

## 🆘 Support

- **Check the health endpoint**: `/api/health`
- **Verify JSON syntax** in data files
- **Ensure Node.js** version 18+ is installed
- **Check console logs** for error messages

### 🔧 Troubleshooting

#### Database Connection Issues
```bash
# Test database connection
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM destinations;"

# Check if Docker container is running
docker ps | grep hackybacky-db

# Restart Docker container if needed
docker restart hackybacky-db
```

#### Key Generation Issues
If a destination isn't found, check the key generation:

```bash
# Test key generation for any destination name
node -e "
const dest = 'Trinidad & Tobago';
const key = dest.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
console.log('Destination:', dest);
console.log('Generated key:', key);
"
```

**Common Key Patterns:**
- `"United States of America"` → `"united-states-of-america"`
- `"South Korea"` → `"south-korea"`
- `"Hong Kong"` → `"hong-kong"`
- `"Czech Republic"` → `"czech-republic"`
- `"Trinidad & Tobago"` → `"trinidad-tobago"` (note: single hyphens)

#### Data Structure Issues
Ensure JSON files follow the exact structure. Common issues:
- Missing required fields (e.g., `transport.passes`, `culture.tipping`)
- Incorrect field names (e.g., `food.local_dishes` instead of `food_drink.must_try`)
- Missing `best_time` or `safety_scams` fields

#### Import Issues
```bash
# Check if data directory exists
ls -la data/

# Re-import all data
npm run db:import

# Check database contents
psql "$DATABASE_URL" -c "SELECT key, name FROM destinations LIMIT 5;"
```

### 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Browser   │    │   Express API   │    │   PostgreSQL    │
│                 │    │                 │    │                 │
│  - Search UI    │◄──►│  - REST API     │◄──►│  - JSONB Data   │
│  - Live Results │    │  - CORS Enabled │    │  - Full-text    │
│  - Responsive   │    │  - Static Files │    │    Search       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Key Components:**
- **Frontend**: HTML/CSS/JS with live search and suggestions
- **API**: Express.js with PostgreSQL integration
- **Database**: PostgreSQL with JSONB for flexible data storage
- **Search**: PostgreSQL full-text search with trigram matching
- **Management**: Scripts for importing and adding destinations
---

**Travel smarter with comprehensive destination information at your fingertips! 🌍✈️**