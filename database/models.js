const { pool } = require('./connection');

// Get all destinations with full data
const getAllDestinations = async () => {
    try {
        const query = `
            SELECT 
                d.id,
                d.destination,
                d.region_type,
                d.emoji_flag,
                dm.highlights,
                dm.keywords,
                p.cash,
                p.card,
                p.mobile,
                i.sim_esim,
                i.wifi,
                i.avg_speed_mbps,
                i.availability,
                t.passes,
                t.apps,
                t.quirks,
                c.tipping,
                c.closures,
                c.dress,
                fd.must_try,
                fd.etiquette,
                b.backpacker,
                b.midrange,
                ti.best_time,
                ss.common_scams,
                ss.safety_notes
            FROM destinations d
            LEFT JOIN destination_metadata dm ON d.id = dm.destination_id
            LEFT JOIN payments p ON d.id = p.destination_id
            LEFT JOIN internet i ON d.id = i.destination_id
            LEFT JOIN transport t ON d.id = t.destination_id
            LEFT JOIN culture c ON d.id = c.destination_id
            LEFT JOIN food_drink fd ON d.id = fd.destination_id
            LEFT JOIN budget b ON d.id = b.destination_id
            LEFT JOIN travel_info ti ON d.id = ti.destination_id
            LEFT JOIN safety_scams ss ON d.id = ss.destination_id
        `;
        
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error getting all destinations:', error);
        throw error;
    }
};

// Get destination by name
const getDestinationByName = async (destinationName) => {
    try {
        const query = `
            SELECT 
                d.id,
                d.destination,
                d.region_type,
                d.emoji_flag,
                dm.highlights,
                dm.keywords,
                p.cash,
                p.card,
                p.mobile,
                i.sim_esim,
                i.wifi,
                i.avg_speed_mbps,
                i.availability,
                t.passes,
                t.apps,
                t.quirks,
                c.tipping,
                c.closures,
                c.dress,
                fd.must_try,
                fd.etiquette,
                b.backpacker,
                b.midrange,
                ti.best_time,
                ss.common_scams,
                ss.safety_notes
            FROM destinations d
            LEFT JOIN destination_metadata dm ON d.id = dm.destination_id
            LEFT JOIN payments p ON d.id = p.destination_id
            LEFT JOIN internet i ON d.id = i.destination_id
            LEFT JOIN transport t ON d.id = t.destination_id
            LEFT JOIN culture c ON d.id = c.destination_id
            LEFT JOIN food_drink fd ON d.id = fd.destination_id
            LEFT JOIN budget b ON d.id = b.destination_id
            LEFT JOIN travel_info ti ON d.id = ti.destination_id
            LEFT JOIN safety_scams ss ON d.id = ss.destination_id
            WHERE LOWER(d.destination) = LOWER($1)
        `;
        
        const result = await pool.query(query, [destinationName]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error getting destination by name:', error);
        throw error;
    }
};

// Search destinations by metadata
const searchDestinations = async (searchTerm) => {
    try {
        const query = `
            SELECT 
                d.id,
                d.destination,
                d.region_type,
                d.emoji_flag,
                dm.highlights,
                dm.keywords
            FROM destinations d
            LEFT JOIN destination_metadata dm ON d.id = dm.destination_id
            WHERE 
                LOWER(d.destination) LIKE LOWER($1) OR
                EXISTS (
                    SELECT 1 FROM unnest(dm.highlights) AS highlight 
                    WHERE LOWER(highlight) LIKE LOWER($1)
                ) OR
                EXISTS (
                    SELECT 1 FROM unnest(dm.keywords) AS keyword 
                    WHERE LOWER(keyword) LIKE LOWER($1)
                )
        `;
        
        const result = await pool.query(query, [`%${searchTerm}%`]);
        return result.rows;
    } catch (error) {
        console.error('Error searching destinations:', error);
        throw error;
    }
};

// Insert destination data
const insertDestination = async (destinationData) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Insert main destination
        const destResult = await client.query(
            'INSERT INTO destinations (destination, region_type, emoji_flag) VALUES ($1, $2, $3) RETURNING id',
            [destinationData.destination, destinationData.region_type, destinationData.emoji_flag]
        );
        
        const destinationId = destResult.rows[0].id;
        
        // Insert metadata
        if (destinationData.metadata) {
            await client.query(
                'INSERT INTO destination_metadata (destination_id, highlights, keywords) VALUES ($1, $2, $3)',
                [destinationId, destinationData.metadata.highlights, destinationData.metadata.keywords]
            );
        }
        
        // Insert payments
        if (destinationData.payments) {
            await client.query(
                'INSERT INTO payments (destination_id, cash, card, mobile) VALUES ($1, $2, $3, $4)',
                [destinationId, destinationData.payments.cash, destinationData.payments.card, destinationData.payments.mobile]
            );
        }
        
        // Insert internet
        if (destinationData.internet) {
            await client.query(
                'INSERT INTO internet (destination_id, sim_esim, wifi, avg_speed_mbps, availability) VALUES ($1, $2, $3, $4, $5)',
                [destinationId, destinationData.internet.sim_esim, destinationData.internet.wifi, destinationData.internet.avg_speed_mbps, destinationData.internet.availability]
            );
        }
        
        // Insert transport
        if (destinationData.transport) {
            await client.query(
                'INSERT INTO transport (destination_id, passes, apps, quirks) VALUES ($1, $2, $3, $4)',
                [destinationId, destinationData.transport.passes, destinationData.transport.apps, destinationData.transport.quirks]
            );
        }
        
        // Insert culture
        if (destinationData.culture) {
            await client.query(
                'INSERT INTO culture (destination_id, tipping, closures, dress) VALUES ($1, $2, $3, $4)',
                [destinationId, destinationData.culture.tipping, destinationData.culture.closures, destinationData.culture.dress]
            );
        }
        
        // Insert food_drink
        if (destinationData.food_drink) {
            await client.query(
                'INSERT INTO food_drink (destination_id, must_try, etiquette) VALUES ($1, $2, $3)',
                [destinationId, destinationData.food_drink.must_try, destinationData.food_drink.etiquette]
            );
        }
        
        // Insert budget
        if (destinationData.budget) {
            await client.query(
                'INSERT INTO budget (destination_id, backpacker, midrange) VALUES ($1, $2, $3)',
                [destinationId, destinationData.budget.backpacker, destinationData.budget.midrange]
            );
        }
        
        // Insert travel_info
        if (destinationData.best_time) {
            await client.query(
                'INSERT INTO travel_info (destination_id, best_time) VALUES ($1, $2)',
                [destinationId, destinationData.best_time]
            );
        }
        
        // Insert safety_scams
        if (destinationData.safety_scams) {
            await client.query(
                'INSERT INTO safety_scams (destination_id, common_scams, safety_notes) VALUES ($1, $2, $3)',
                [destinationId, destinationData.safety_scams.common_scams, destinationData.safety_scams.safety_notes]
            );
        }
        
        await client.query('COMMIT');
        return destinationId;
        
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    getAllDestinations,
    getDestinationByName,
    searchDestinations,
    insertDestination
};
