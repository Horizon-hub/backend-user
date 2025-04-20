const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { Pool } = require('pg');

const pool = new Pool({
    connectionString:"postgresql://postgres.usjlvzxargnzqddtppnb:syriahotel$10213123@aws-0-eu-central-2.pooler.supabase.com:5432/postgres"
  })
  


app.get('/api/locations', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM "Location"');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get("/api/rooms/:id", async (req, res) => {
    const locationId = req.params.id;
    try {
        const { rows } = await pool.query(`
            SELECT * 
FROM "Room" 
WHERE hotel_id IN (
    SELECT id 
    FROM "Hotel"
    WHERE location_id = $1
);

            `, [locationId]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



