// backend/models/Patient.js
const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    // --- Personal Info ---
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      trim: true,
    },
    phone: { type: String, required: [true, "Phone is required"], trim: true }, // Consider adding validation for format/length if needed
    city: { type: String, required: [true, "City is required"], trim: true },
    occupation: {
      type: String,
      required: [true, "Occupation is required"],
      trim: true,
    },
    maritalStatus: {
      type: String,
      required: [true, "Marital Status is required"],
      enum: ["married", "unmarried", "divorced", "widow", ""], // Allow empty string if that's the initial select value
    },
    // Consider if spouseName should only be required if maritalStatus is 'married'
    spouseName: {
      type: String,
      required: [true, "Spouse Name is required"],
      trim: true,
    },
    age: { type: Number, required: [true, "Age is required"], min: 0 },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["male", "female", "other"],
    },
    birthDate: { type: String, required: [true, "Birth Date is required"] }, // Keep as String based on form, or change to Date if preferred { type: Date, required: true }
    photo: { type: String, required: false, default: null }, // Base64 or URL

    // --- Medical Info ---
    allergic: { type: Boolean, default: false }, // Defaults to false
    // Storing allergies as a single string as per form logic, default to empty
    allergies: { type: String, trim: true, default: "" },
    // Medical history is an array of strings
    medicalHistory: { type: [String], default: [] },

    // --- Women Only Fields (Conditionally Required) ---
    periodType: {
      type: String,
      required: function () {
        return this.gender === "female";
      },
      enum: ["regular", "irregular", null, ""], // Allow null/empty for initial state
    },
    stillHavingPeriods: {
      type: String, // Storing 'yes' or 'no'
      required: function () {
        return this.gender === "female";
      },
      enum: ["yes", "no", null],
    },
    difficultyWithPeriods: {
      type: String,
      required: function () {
        return this.gender === "female";
      },
      enum: ["no", "moderate", "severe", null, ""], // Match form values
    },
    // Numeric fields with defaults
    pregnancies: {
      type: Number,
      required: function () {
        return this.gender === "female";
      },
      min: 0,
      default: 0,
    },
    births: {
      type: Number,
      required: function () {
        return this.gender === "female";
      },
      min: 0,
      default: 0,
    },
    miscarriages: {
      type: Number,
      required: function () {
        return this.gender === "female";
      },
      min: 0,
      default: 0,
    },
    abortions: {
      type: Number,
      required: function () {
        return this.gender === "female";
      },
      min: 0,
      default: 0,
    },
    // Symptom fields - required only if female
    leakageOfUrine: {
      type: String,
      required: function () {
        return this.gender === "female";
      }, // CORRECTED
      enum: ["yes", "no", null],
    },
    leakageDescription: { type: String, trim: true, default: "" },
    pelvicPain: {
      type: String,
      required: function () {
        return this.gender === "female";
      }, // CORRECTED
      enum: ["yes", "no", null],
    },
    pelvicDescription: { type: String, trim: true, default: "" },
    abnormalDischarge: {
      type: String,
      required: function () {
        return this.gender === "female";
      }, // CORRECTED
      enum: ["yes", "no", null],
    },
    abnormalDischargeDescription: { type: String, trim: true, default: "" },
    abnormalPapSmear: {
      type: String,
      required: function () {
        return this.gender === "female";
      }, // CORRECTED
      enum: ["yes", "no", null],
    },
    abnormalPapSmearDescription: { type: String, trim: true, default: "" },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
    // Important: Mongoose attempts to pluralize model names for collections.
    // Explicitly setting it avoids potential mismatches if model name changes.
    collection: "User_details", // Explicitly set collection name here
  }
);

// Export using the PascalCase name 'Patient', linked to the 'User_details' collection.
module.exports = mongoose.model("Patient", patientSchema);
