// backend/routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // Needed for ObjectId validation
const Patient = require("../models/patient"); // CORRECTED: Import the model

// --- CREATE New Patient History ---
router.post("/patient-history", async (req, res) => {
  console.log("--- Backend API: POST /api/patient-history received ---");
  // Log the raw body BEFORE any processing
  console.log("Received Request Body:", JSON.stringify(req.body, null, 2));

  try {
    // Create a new patient instance with the request body
    const patientData = req.body;
    const newPatient = new Patient(patientData);

    // --- Data Cleaning/Conditional Logic BEFORE Validation/Save ---

    // 1. Clear women-only fields if gender is not 'female'
    if (newPatient.gender !== "female") {
      console.log("Gender is not female, clearing women-specific fields.");
      newPatient.periodType = null;
      newPatient.stillHavingPeriods = null;
      newPatient.difficultyWithPeriods = null;
      newPatient.pregnancies = null; // Or 0 if preferred and schema allows
      newPatient.births = null;
      newPatient.miscarriages = null;
      newPatient.abortions = null;
      newPatient.leakageOfUrine = null;
      newPatient.leakageDescription = null;
      newPatient.pelvicPain = null;
      newPatient.pelvicDescription = null;
      newPatient.abnormalDischarge = null;
      newPatient.abnormalDischargeDescription = null;
      newPatient.abnormalPapSmear = null;
      newPatient.abnormalPapSmearDescription = null;
    } else {
      // 2. If female, ensure description fields are empty if the corresponding answer is 'no' or null/undefined
      console.log("Gender is female, checking description fields.");
      if (newPatient.leakageOfUrine !== "yes")
        newPatient.leakageDescription = "";
      if (newPatient.pelvicPain !== "yes") newPatient.pelvicDescription = "";
      if (newPatient.abnormalDischarge !== "yes")
        newPatient.abnormalDischargeDescription = "";
      if (newPatient.abnormalPapSmear !== "yes")
        newPatient.abnormalPapSmearDescription = "";
    }

    // 3. Trim allergies string if it exists
    if (typeof newPatient.allergies === "string") {
      newPatient.allergies = newPatient.allergies.trim();
    }

    console.log(
      "Processed Patient Data before save:",
      JSON.stringify(newPatient.toObject(), null, 2)
    ); // Log processed data
    console.log("Attempting to save patient data to MongoDB...");

    // Mongoose will validate based on the schema during save
    const savedPatient = await newPatient.save();

    console.log("Patient data saved successfully. ID:", savedPatient._id);
    // Return the saved patient data (or just ID/success message)
    return res
      .status(201)
      .json({
        message: "Patient registered successfully",
        patient: savedPatient,
      });
  } catch (error) {
    console.error("--- ERROR saving patient data ---");
    console.error("Error Message:", error.message);

    // Handle Mongoose Validation Errors specifically
    if (error.name === "ValidationError") {
      console.error(
        "Validation Errors:",
        JSON.stringify(error.errors, null, 2)
      );
      // Extract user-friendly error messages
      const errors = Object.values(error.errors).map((el) => el.message);
      return res
        .status(400)
        .json({
          message: "Validation failed. Please check the fields.",
          errors: errors,
        });
    }

    // Log the full error for other types of errors (e.g., database connection issues)
    console.error("Full Error Object:", error);
    return res
      .status(500)
      .json({
        message: "Server error while saving patient data",
        error: error.message,
      });
  }
});

// --- GET All Patients (Keep as is) ---
router.get("/patients", async (req, res) => {
  try {
    console.log("--- Backend API: GET /api/patients received ---");
    const patients = await Patient.find({}); // Use correct model name
    console.log(`Found ${patients.length} patients.`);
    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error.message);
    res.status(500).json({ message: "Error fetching patients" });
  }
});

// --- GET Patient Details by ID ---
router.get("/patient/:id", async (req, res) => {
  console.log(
    `--- Backend API: GET /api/patient/${req.params.id} received ---`
  );
  try {
    const patientId = req.params.id;
    // Validate if ID is a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      console.log("Invalid patient ID format received:", patientId);
      return res.status(400).json({ message: "Invalid Patient ID format" });
    }

    console.log(`Fetching patient with ID: ${patientId}...`);
    // Find by ID using the correct Model name
    const patient = await Patient.findById(patientId);

    if (!patient) {
      console.log(`Patient with ID ${patientId} not found.`);
      return res.status(404).json({ message: "Patient not found" });
    }

    console.log("Patient found successfully.");
    // Return the found patient document
    return res.json(patient);
  } catch (error) {
    console.error("--- ERROR fetching patient details ---");
    console.error("Error Message:", error.message);
    // Avoid sending full error object in production for security
    return res
      .status(500)
      .json({ message: "Server error fetching patient details" });
  }
});

module.exports = router;
