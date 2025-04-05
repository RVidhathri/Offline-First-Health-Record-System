const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Connect to SQLite Database
const dbPath = path.resolve(__dirname, "../health_records.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("✅ Connected to SQLite database.");
    }
});

// 📌 Create "records" table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        age INTEGER NOT NULL,
        date TEXT NOT NULL,
        disease TEXT NOT NULL,
        hospital TEXT NOT NULL,
        doctor TEXT NOT NULL,
        file TEXT DEFAULT NULL
    )
`);

// 📌 ✅ 1. Add New Health Record
router.post("/add", (req, res) => {
    const { user_id, age, date, disease, hospital, doctor, file } = req.body;

    if (!user_id || !age || !date || !disease || !hospital || !doctor) {
        return res.status(400).json({ error: "❌ All fields are required!" });
    }

    db.run(
        `INSERT INTO records (user_id, age, date, disease, hospital, doctor, file) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, age, date, disease, hospital, doctor, file || null],
        function (err) {
            if (err) {
                return res.status(500).json({ error: "❌ Error adding record: " + err.message });
            }
            res.status(201).json({ message: "✅ Record added successfully!", id: this.lastID });
        }
    );
});

// 📌 ✅ 2. Fetch All Records for a User
router.get("/:user_id", (req, res) => {
    const { user_id } = req.params;

    db.all(`SELECT * FROM records WHERE user_id = ?`, [user_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "❌ Error fetching records: " + err.message });
        }
        res.json(rows);
    });
});

// 📌 ✅ 3. Update an Existing Record
router.put("/update/:id", (req, res) => {
    const { id } = req.params;
    const { age, date, disease, hospital, doctor, file } = req.body;

    db.run(
        `UPDATE records SET age=?, date=?, disease=?, hospital=?, doctor=?, file=? WHERE id=?`,
        [age, date, disease, hospital, doctor, file, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: "❌ Error updating record: " + err.message });
            }
            res.json({ message: "✅ Record updated successfully!" });
        }
    );
});

// 📌 ✅ 4. Delete a Record
router.delete("/delete/:id", (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM records WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: "❌ Error deleting record: " + err.message });
        }
        res.json({ message: "✅ Record deleted successfully!" });
    });
});

module.exports = router;
