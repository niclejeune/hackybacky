// scripts/import-data.js
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const DATA_DIR = path.join(process.cwd(), "data");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function toKey(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set.");
    process.exit(1);
  }
  if (!fs.existsSync(DATA_DIR)) {
    console.log("No /data folder found. If data.zip exists, unzip it to /data first.");
    process.exit(0);
  }
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".json"));
  if (!files.length) {
    console.log("No JSON files in /data. Nothing to import.");
    process.exit(0);
  }

  for (const f of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), "utf8"));
    const name = raw.destination || raw.name || path.basename(f, ".json");
    const region_type = raw.region_type || "country";
    const emoji_flag = raw.emoji_flag || null;
    const key = raw.key || toKey(name);

    await pool.query(
      `insert into destinations (key, name, region_type, emoji_flag, payload)
       values ($1,$2,$3,$4,$5)
       on conflict (key) do update
       set name=excluded.name, region_type=excluded.region_type, emoji_flag=excluded.emoji_flag, payload=excluded.payload`,
      [key, name, region_type, emoji_flag, JSON.stringify(raw)]
    );
    console.log("Imported:", key);
  }
  await pool.end();
  console.log("Import complete.");
}

main().catch(e => { console.error(e); process.exit(1); });
