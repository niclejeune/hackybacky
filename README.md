# 🌍 Travel Survival Guide

Essential travel information for high-confusion destinations. Get instant access to payment methods, internet connectivity, transport options, cultural norms, and safety information for your destination.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Development mode (auto-restart)
npm run dev
```

Visit `http://localhost:3000` to use the web app.

## 📱 Web App Features

- **Smart Search**: Search by country name, city, or common terms (e.g., "I'm going to Seoul")
- **Structured Information**: Organized into 5 key categories:
  - 💳 **Payments** (cash/card/mobile apps)
  - 📶 **Internet** (SIM/eSIM, WiFi availability)
  - 🚇 **Transport** (passes, apps, quirks)
  - 🎭 **Culture** (tipping, closures, dress codes)
  - 🛡️ **Safety & Scams** (common scams, safety notes)

## 🔗 API Endpoints

### Get Destination Data
```bash
GET /api/destination/{country}
```

Examples:
- `GET /api/destination/china`
- `GET /api/destination/south-korea`
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

- 🇨🇳 **China** - Beijing, Shanghai, and beyond
- 🇰🇷 **South Korea** - Seoul and nationwide
- 🇯🇵 **Japan** - Tokyo, Osaka, Kyoto
- 🇩🇪 **Germany** - Berlin, Munich, nationwide
- 🇪🇸 **Spain** - Madrid, Barcelona, nationwide

## 🔧 Integration with cheap.voyage

The API is designed for easy integration:

```javascript
// Example integration
fetch('/api/destination/china')
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Payment info:', data.data.payments);
      console.log('Transport:', data.data.transport);
    }
  });
```

## 📈 Future Roadmap

### Phase 1: Manual Curation ✅
- [x] 5 high-confusion destinations
- [x] Structured data format
- [x] Web app interface
- [x] API endpoints

### Phase 2: AI-Powered Data Collection
- [ ] Automated scraping from government sites
- [ ] Reddit community data aggregation
- [ ] Blog post summarization
- [ ] Real-time data updates

### Phase 3: Enhanced Features
- [ ] User-generated content
- [ ] Offline mode
- [ ] Mobile app
- [ ] Multi-language support

## 🛠️ Development

### Project Structure
```
├── index.html          # Web app interface
├── styles.css          # Styling
├── script.js           # Frontend logic
├── server.js           # Express server
├── package.json        # Dependencies
├── china.json          # China travel data
├── south_korea.json    # South Korea travel data
├── japan.json          # Japan travel data
├── germany.json        # Germany travel data
└── spain.json          # Spain travel data
```

### Adding New Destinations

1. Create a new JSON file (e.g., `france.json`)
2. Follow the existing data structure
3. Add search terms to `server.js`
4. Update the frontend data in `script.js`

## 📝 Data Sources

- Government travel advisories
- Reddit travel communities
- Travel blogs and guides
- Local expat communities
- Tourism board websites

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your destination data
4. Test the API endpoints
5. Submit a pull request

## 📄 License

MIT License - feel free to use for your own projects!
