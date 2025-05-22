// config/database.js (atau index.js tergantung kamu simpan di mana)
import mysql from 'mysql2';
import dotenv from 'dotenv';

// Load .env
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('MySQL connected...');
});

export default db;
