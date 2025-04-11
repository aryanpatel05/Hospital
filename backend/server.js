// backend/server.js
require("dotenv").config(); // Optional: for environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const patientRoutes = require("./routes/patientRoutes"); // Ensure path is correct

const app = express();

// --- Middleware ---
// Enable CORS - configure appropriately for production
app.use(cors());
// Body Parsers - Crucial: Before routes
app.use(express.json({ limit: "10mb" })); // For JSON payloads (increased limit for photo)
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // For URL-encoded data if needed

// --- Database Connection ---
// Prefer environment variables for sensitive data like connection strings
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://aryanpatel_05:aryanpatel_05@cluster0.i5o9vwg.mongodb.net/Hospital?retryWrites=true&w=majority";

if (!MONGODB_URI) {
  console.error("FATAL ERROR: MongoDB connection string not found.");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Mongoose 6+ doesn't require useCreateIndex or useFindAndModify
  })
  .then(() => console.log(`MongoDB connected to database.`)) // Removed specific DB name here, less brittle
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit if DB connection fails
  });

// --- Routes ---
// Root route
app.get("/", (req, res) => {
  res.send("Patient History API is running! 🚀");
});

// Mount the patient API routes
app.use("/api", patientRoutes);

// --- Basic Error Handler (Optional) ---
// Catches errors passed via next(error)
app.use((err, req, res, next) => {
  console.error("Unhandled application error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// --- Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
