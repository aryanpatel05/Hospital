// backend/models/Patient.js
const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: [true, "First Name is required"] },
    lastName: { type: String, required: [true, "Last Name is required"] },
    phone: { type: String, required: [true, "Phone is required"] },
    city: { type: String, required: [true, "City is required"] }, // New field
    occupation: { type: String, required: [true, "Occupation is required"] },
    maritalStatus: {
      type: String,
      required: [true, "Marital Status is required"],
    },
    spouseName: { type: String, required: [true, "Spouse Name is required"] },
    age: { type: Number, required: [true, "Age is required"] },
    gender: { type: String, required: [true, "Gender is required"] },
    birthDate: { type: String, required: [true, "Birth Date is required"] },
    allergic: { type: Boolean, required: [true, "Allergic flag is required"] },
    allergies: { type: String, required: false },
    medicalHistory: { type: [String], required: false },
    periodType: {
      type: String,
      required: function () {
        return this.gender === "female";
      },
    },
    stillHavingPeriods: {
      type: String,
      required: function () {
        return this.gender === "female";
      },
    },
    difficultyWithPeriods: {
      type: String,
      required: function () {
        return this.gender === "female";
      },
    },
    pregnancies: {
      type: Number,
      required: function () {
        return this.gender === "female";
      },
    },

    miscarriages: {
      type: Number,
      required: function () {
        return this.gender === "female";
      },
    },
    abortions: {
      type: Number,
      required: function () {
        return this.gender === "female";
      },
    },
    leakageOfUrine: {
      type: String,
      required: [true, "Leakage of urine is required"],
    },
    leakageDescription: { type: String, required: false },
    pelvicPain: { type: String, required: [true, "Pelvic pain is required"] },
    pelvicDescription: { type: String, required: false },
    abnormalDischarge: {
      type: String,
      required: [true, "Abnormal discharge is required"],
    },
    abnormalDischargeDescription: { type: String, required: false },
    abnormalPapSmear: {
      type: String,
      required: [true, "Abnormal Pap Smear is required"],
    },
    abnormalPapSmearDescription: { type: String, required: false },
    photo: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User_details", patientSchema, "User_details");
