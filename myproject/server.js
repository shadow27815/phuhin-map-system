const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config(); // โหลดค่าจาก .env

const app = express();
const port = process.env.PORT || 3001; // อ่านจาก .env หรือใช้ 3001

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ใช้ pool จากค่า .env
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10), // แปลงเป็น number
});

// เชื่อม routes หลังสร้าง pool
const authRoutes = require('./routes/authRoutes');
app.use('/api/admins', authRoutes(pool));

// Static file และ routes อื่น ๆ
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/mypoints', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                id,
                ST_AsGeoJSON(geom) AS geometry,
                name,
                description,
                sym,
                image
            FROM "My points"
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Database Query Error:', err);
        res.status(500).send('Server Error');
    }
});

const pointsRoutes = require('./routes/pointsRoutes');
app.use('/api/points', pointsRoutes(pool));

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
