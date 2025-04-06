const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./database"); // Ensure database connection is established
const authRoutes = require("./authRoutes");
const recordRoutes = require("./recordRoutes");
const setSecurityHeaders = require("./middleware/security");

const app = express(); // ✅ Initialize Express app first

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(setSecurityHeaders);

// Serve static files from the frontend build directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
}

// Routes
app.use("/auth", authRoutes);
app.use("/api/records", recordRoutes); // ✅ Correct route

// Handle React routing in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
