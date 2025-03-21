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
    const patients = await PatientModel.find();
    return res.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return res.status(500).json({ message: "Error fetching patients." });
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

module.exports = router;
