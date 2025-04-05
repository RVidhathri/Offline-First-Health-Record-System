const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./health_records.db", (err) => {
    if (err) console.error(err.message);
    console.log("Connected to SQLite database.");
});

// Create User Table
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, age INTEGER, email TEXT UNIQUE, password TEXT,
    location TEXT, existingDisease TEXT, qrCode TEXT
)`);

// Create Health Records Table
db.run(`CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER, age INTEGER, date TEXT, disease TEXT,
    hospital TEXT, doctor TEXT, file BLOB,
    FOREIGN KEY (userId) REFERENCES users (id)
)`);

module.exports = db;
