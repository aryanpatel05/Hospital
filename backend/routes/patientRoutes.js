// backend/routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const PatientModel = require("../models/patient");

// POST /api/patient-history: Save new patient history data
router.post("/patient-history", async (req, res) => {
  try {
    const newPatient = new PatientModel(req.body);
    const savedPatient = await newPatient.save();
    return res.status(201).json(savedPatient);
  } catch (error) {
    console.error("Error saving patient data:", error);
    return res.status(500).json({ message: "Error saving patient data." });
  }
});

// GET /api/patients: Fetch all patient records
router.get("/patients", async (req, res) => {
  try {
    // Use PatientModel instead of Patient
    const patients = await PatientModel.find({});
    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Error fetching patients" });
  }
});

// GET /api/patient/:id: Fetch a single patient by ID
router.get("/patient/:id", async (req, res) => {
  try {
    const patient = await PatientModel.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }
    return res.json(patient);
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return res.status(500).json({ message: "Error fetching patient details." });
  }
});

// PUT /api/patient/:id: Update an existing patient by ID
// **** THIS IS THE ADDED/UPDATED ROUTE ****
router.put("/patient/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Optional: Add specific validation or sanitation for updateData here
    // Example: Ensure 'age' is a number if provided
    if (updateData.age !== undefined) {
      updateData.age = Number(updateData.age);
      if (isNaN(updateData.age)) {
        return res.status(400).json({ message: "Invalid age provided." });
      }
    }

    // Convert medicalHistory string back to array if necessary
    if (
      updateData.medicalHistory &&
      typeof updateData.medicalHistory === "string"
    ) {
      updateData.medicalHistory = updateData.medicalHistory
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    } else if (updateData.medicalHistory === "") {
      // Handle empty string case
      updateData.medicalHistory = [];
    }

    // Ensure boolean value for 'allergic'
    if (updateData.allergic !== undefined) {
      updateData.allergic = Boolean(updateData.allergic);
    }

    // Convert numeric fields if they exist in updateData
    const numericFields = [
      "pregnancies",
      "births",
      "miscarriages",
      "abortions",
    ];
    numericFields.forEach((field) => {
      if (
        updateData[field] !== undefined &&
        updateData[field] !== null &&
        updateData[field] !== ""
      ) {
        updateData[field] = Number(updateData[field]);
        if (isNaN(updateData[field])) {
          // Handle error or remove field if invalid number?
          console.warn(`Invalid number received for ${field}, setting to 0.`);
          updateData[field] = 0; // Or delete updateData[field];
        }
      } else if (updateData[field] === "") {
        // Decide how to handle empty string for numbers - maybe set to 0 or null/undefined
        updateData[field] = 0; // Set to 0 if empty string
      }
    });

    const updatedPatient = await PatientModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure schema validations run on update
        omitUndefined: true, // Don't set fields to undefined if not in updateData
      }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found to update." });
    }

    console.log("Patient updated:", updatedPatient._id);
    return res.status(200).json(updatedPatient); // Send back the updated patient
  } catch (error) {
    console.error("Error updating patient data:", error);
    if (error.name === "ValidationError") {
      // Send back specific validation errors
      const errors = Object.values(error.errors).map((el) => el.message);
      return res
        .status(400)
        .json({ message: "Validation Error during update", errors: errors });
    }
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ message: "Invalid Patient ID format for update." });
    }
    return res
      .status(500)
      .json({ message: "Error updating patient data.", error: error.message });
  }
});

module.exports = router;
