# Travel Survival Guide API

A lightweight REST API providing essential travel information for 76+ destinations worldwide. Get instant access to payment methods, internet connectivity, transport options, cultural norms, and safety information through both API endpoints and an interactive web interface.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Extract travel data (if using data.zip)
# Expand-Archive -Path "data.zip" -DestinationPath "data" -Force

# Start the API
npm start
```

Your API will be running at **http://localhost:3000**

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
├── data/                 # 76+ travel destination JSON files
│   ├── France.json
│   ├── China.json
│   ├── Japan.json
│   └── ... (76+ countries)
├── data.zip             # Compressed data folder for easy distribution
├── server-simple.js      # Main API server
├── index.html           # Web interface
├── script.js            # Frontend JavaScript
├── styles.css           # Frontend styling
├── package.json         # Dependencies
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

- **Real-time Search**: Type any country name and get instant results
- **Live Suggestions**: See matching destinations as you type
- **Comprehensive Data**: Each destination includes:
  - 💳 Payment methods (cash, card, mobile)
  - 📶 Internet connectivity (SIM, WiFi, speeds)
  - 🚌 Transport options (public, taxis, car rental)
  - 🎭 Cultural norms (language, etiquette, dress code)
  - 🍽️ Food information (local dishes, dining times, costs)
  - 💰 Budget estimates (daily costs, accommodation, activities)
  - 🛡️ Safety information (areas to avoid, scams, emergency numbers)
  - 🏥 Health requirements (vaccinations, healthcare, insurance)
  - 📋 Visa information (requirements, duration, costs)
  - 🌤️ Climate data (seasons, best times to visit, clothing)
  - 📞 Communication (phone codes, timezones, business hours)

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

**Example:**
```bash
curl http://localhost:3000/api/destination/france
curl http://localhost:3000/api/destination/japan
curl http://localhost:3000/api/destination/united-kingdom
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

---

**Travel smarter with comprehensive destination information at your fingertips! 🌍✈️**