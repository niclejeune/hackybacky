-- Travel Survival Guide Database Schema
-- This will be run when setting up the PostgreSQL database

CREATE TABLE IF NOT EXISTS destinations (
    id SERIAL PRIMARY KEY,
    destination VARCHAR(255) NOT NULL UNIQUE,
    region_type VARCHAR(50) NOT NULL,
    emoji_flag VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS destination_metadata (
    id SERIAL PRIMARY KEY,
    destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
    highlights TEXT[],
    keywords TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
    cash TEXT,
    card TEXT,
    mobile TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS internet (
    id SERIAL PRIMARY KEY,
    destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
    sim_esim TEXT,
    wifi TEXT,
    avg_speed_mbps INTEGER,
    availability TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transport (
    id SERIAL PRIMARY KEY,
    destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
    passes TEXT,
    apps TEXT,
    quirks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS culture (
    id SERIAL PRIMARY KEY,
    destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
    tipping TEXT,
    closures TEXT,
    dress TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS food_drink (
    id SERIAL PRIMARY KEY,
    destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
    must_try TEXT[],
    etiquette TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS budget (
    id SERIAL PRIMARY KEY,
    destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
    backpacker TEXT,
    midrange TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS travel_info (
    id SERIAL PRIMARY KEY,
    destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
    best_time TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS safety_scams (
    id SERIAL PRIMARY KEY,
    destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
    common_scams TEXT[],
    safety_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_destinations_name ON destinations(destination);
CREATE INDEX IF NOT EXISTS idx_destinations_region ON destinations(region_type);
CREATE INDEX IF NOT EXISTS idx_metadata_highlights ON destination_metadata USING GIN(highlights);
CREATE INDEX IF NOT EXISTS idx_metadata_keywords ON destination_metadata USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_safety_scams ON safety_scams USING GIN(common_scams);
CREATE INDEX IF NOT EXISTS idx_food_must_try ON food_drink USING GIN(must_try);
