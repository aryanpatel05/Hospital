// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const patientRoutes = require("./routes/patientRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
// For local dev, e.g. "mongodb://localhost:27017/Hospital"
// For MongoDB Compass, typically the same URL, or a remote cluster
mongoose
  .connect(
    "mongodb+srv://aryanpatel_05:aryanpatel_05@cluster0.i5o9vwg.mongodb.net/Hospital?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected to 'Hospital' database"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api", patientRoutes);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
