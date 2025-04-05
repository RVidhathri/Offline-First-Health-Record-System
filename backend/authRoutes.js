const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("./database");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
    const { name, age, email, password, location, existingDisease, qrCode } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run("INSERT INTO users (name, age, email, password, location, existingDisease, qrCode) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, age, email, hashedPassword, location, existingDisease, qrCode],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, message: "User registered" });
        });
});

module.exports = router;
