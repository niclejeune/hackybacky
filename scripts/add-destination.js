// scripts/add-destination.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function addDestination(destinationData) {
    const key = destinationData.destination.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    await pool.query(`
        INSERT INTO destinations (key, name, region_type, emoji_flag, payload)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (key) DO UPDATE
        SET name = EXCLUDED.name,
            region_type = EXCLUDED.region_type,
            emoji_flag = EXCLUDED.emoji_flag,
            payload = EXCLUDED.payload
    `, [
        key,
        destinationData.destination,
        destinationData.region_type || 'country',
        destinationData.emoji_flag || null,
        JSON.stringify(destinationData)
    ]);
    
    console.log(`✅ Added destination: ${destinationData.destination} (key: ${key})`);
}

// Example usage - Complete destination structure (matches your JSON format)
const newDestination = {
    destination: "New Country",
    region_type: "country",
    emoji_flag: "🏴",
    metadata: {
        highlights: ["Famous landmark", "Natural wonder", "Cultural site"],
        keywords: ["keyword1", "keyword2", "keyword3"]
    },
    payments: {
        cash: "Local currency preferred. Cash needed for markets and small vendors.",
        card: "Visa/Mastercard widely accepted. Amex less common.",
        mobile: "Apple Pay/Google Pay available in major cities. Local mobile payment apps popular."
    },
    internet: {
        sim_esim: "Local carriers sell prepaid SIMs. eSIM available at airports.",
        wifi: "Free WiFi in hotels, restaurants, and public areas.",
        avg_speed_mbps: 50,
        availability: "Good in cities, limited in rural areas."
    },
    transport: {
        passes: "Public transport passes available. Check for tourist discounts.",
        apps: "Download local transport apps. Uber/Lyft available in major cities.",
        quirks: "Traffic patterns, driving side, and local transport quirks."
    },
    culture: {
        tipping: "10-15% in restaurants. Round up taxi fares. Tip hotel staff.",
        closures: "Shops close on Sundays. Check local holiday schedules.",
        dress: "Modest clothing recommended. Cover shoulders in religious sites."
    },
    food_drink: {
        must_try: ["Local dish 1", "Local dish 2", "Local dish 3"],
        etiquette: "Lunch 12-2pm, Dinner 6-9pm. Vegetarian options available."
    },
    budget: {
        backpacker: "$30-60/day",
        midrange: "$80-150/day"
    },
    best_time: "Spring and autumn for mild weather and fewer crowds.",
    safety_scams: {
        common_scams: "Beware of overpriced tourist services. Use official taxis.",
        safety_notes: "Generally safe country with low crime rates. Check travel advisories."
    }
};

addDestination(newDestination)
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
