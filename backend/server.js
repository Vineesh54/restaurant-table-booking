const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// CORS Configuration
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
app.use(
  cors({
    origin: allowedOrigin,
  })
);

// In-memory data store
const bookings = [];

// Routes
const bookingRoutes = require("./routes/bookingRoutes")(bookings);
app.use("/api/bookings", bookingRoutes);

// Export the app for Vercel
module.exports = app;
