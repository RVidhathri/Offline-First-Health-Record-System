const express = require("express");
const cors = require("cors");
const db = require("./database"); // Ensure database connection is established
const authRoutes = require("./authRoutes");
const recordRoutes = require("./recordRoutes");

const app = express(); // ✅ Initialize Express app first

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/api/records", recordRoutes); // ✅ Correct route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
