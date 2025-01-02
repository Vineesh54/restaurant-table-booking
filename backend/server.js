const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from `.env` file
dotenv.config();

const app = express();
app.use(express.json());

// CORS Configuration
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*"; // Allow all origins by default for local testing
app.use(
  cors({
    origin: allowedOrigin,
  })
);

// In-memory bookings data store
const bookings = [];

// Routes
const bookingRoutes = require("./routes/bookingRoutes")(bookings);
app.use("/api/bookings", bookingRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed origin for CORS: ${allowedOrigin}`);
});
