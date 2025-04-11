// src/pages/PatientDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Paper, Typography, Grid, CircularProgress } from "@mui/material";
// Make sure this CSS file exists and is correctly linked
import "../styles/PatientDetailsReport.css";

// Icon Imports (ensure all used icons are imported correctly)
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined"; // For Medical History items
import FemaleOutlinedIcon from "@mui/icons-material/FemaleOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
import FamilyRestroomOutlinedIcon from "@mui/icons-material/FamilyRestroomOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ChildFriendlyOutlinedIcon from "@mui/icons-material/ChildFriendlyOutlined"; // Using this for Births
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined"; // Default Women's Health Icon
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined"; // For Discharge/Leakage
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined"; // For Pap Smear
import MoodBadOutlinedIcon from "@mui/icons-material/MoodBadOutlined"; // For Pelvic Pain

const defaultPhoto = "https://via.placeholder.com/100?text=No+Photo"; // Default avatar URL
const NA = "N/A"; // Constant for Not Applicable/Available

// Helper function to safely get data or return NA
const getData = (value) => {
  // Treat 0 as a valid value, but null/undefined/empty string as NA
  if (value === null || value === undefined || value === "") {
    return NA;
  }
  return value;
};

// Helper function to get number or default (e.g., 0), handles null/undefined
const getNumberData = (value) => {
  // Treat 0 as valid, return NA only if null/undefined
  if (value === null || value === undefined) {
    return NA;
  }
  return String(value); // Return as string for display consistency
};

// Helper to convert boolean-like strings ('yes'/'no') or booleans to Yes/No/NA
const formatYesNo = (value) => {
  if (
    value === true ||
    (typeof value === "string" && value.toLowerCase() === "yes")
  ) {
    return "Yes";
  }
  if (
    value === false ||
    (typeof value === "string" && value.toLowerCase() === "no")
  ) {
    return "No";
  }
  // Treat null, undefined, empty string, or other values as N/A
  return NA;
};

// Helper function to format date string (optional, but good practice)
const formatDate = (dateString) => {
  if (!dateString || dateString === NA) return NA;
  try {
    const date = new Date(dateString);
    // Check if the date is valid before formatting
    if (isNaN(date.getTime())) return NA;
    // Example format: 15 Aug 2023 (adjust format as needed)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    console.warn("Could not format date:", dateString, e);
    return dateString; // Return original string if formatting fails
  }
};

const PatientDetails = () => {
  const { id } = useParams(); // Get patient ID from URL
  const [patient, setPatient] = useState(null); // Store patient data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  useEffect(() => {
    // Fetch patient data when component mounts or ID changes
    setLoading(true);
    setError("");
    axios
      .get(`https://hospital-qn5w.onrender.com/api/patient/${id}`)
      .then((res) => {
        console.log("API Response:", res.data);
        const patientData = res.data;

        // --- Data Sanitization ---
        // Ensure medicalHistory is always an array
        if (patientData && !Array.isArray(patientData.medicalHistory)) {
          console.warn(
            "Received non-array medicalHistory, attempting conversion or defaulting."
          );
          // Handle potential comma-separated string from older data if necessary
          if (
            typeof patientData.medicalHistory === "string" &&
            patientData.medicalHistory.trim()
          ) {
            patientData.medicalHistory = patientData.medicalHistory
              .split(",")
              .map((h) => h.trim())
              .filter((h) => h);
          } else {
            // If it's something else (null, undefined, object, etc.), default to empty array
            patientData.medicalHistory = [];
          }
        }
        // Ensure allergies is processed correctly (might be string or array)
        if (patientData && !Array.isArray(patientData.allergies)) {
          if (
            typeof patientData.allergies === "string" &&
            patientData.allergies.trim()
          ) {
            patientData.allergies = patientData.allergies
              .split(",")
              .map((a) => a.trim())
              .filter((a) => a);
          } else {
            patientData.allergies = []; // Default to empty array if not a usable string
          }
        }

        setPatient(patientData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching patient details:", err);
        let errorMsg = "Error fetching patient details.";
        if (err.response) {
          errorMsg = `Error: ${err.response.status} - ${
            err.response.data?.message || err.response.statusText
          }`;
        } else if (err.request) {
          errorMsg = "Network error: Server did not respond.";
        } else {
          errorMsg = `Client Error: ${err.message}`;
        }
        setError(errorMsg);
        setLoading(false);
      });
  }, [id]); // Re-run effect if ID changes

  // --- Render Loading State ---
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading patient data...</Typography>
      </Box>
    );
  }

  // --- Render Error State ---
  if (error) {
    return (
      <Box sx={{ padding: 5, textAlign: "center", color: "red" }}>
        <Typography variant="h6">Could not load patient data.</Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  // --- Render No Data State ---
  if (!patient) {
    // This case might occur if API returns success but empty data, or after an error.
    return (
      <Box sx={{ padding: 5, textAlign: "center" }}>
        <Typography>No patient data found for this ID.</Typography>
      </Box>
    );
  }

  // --- Prepare Processed Data for Rendering ---

  // Allergies: Use the sanitized array from useEffect
  const allergiesList = Array.isArray(patient.allergies)
    ? patient.allergies.filter((a) => a)
    : [];
  const hasAllergies = allergiesList.length > 0;

  // Medical History: Use the sanitized array from useEffect
  const medicalHistoryList = Array.isArray(patient.medicalHistory)
    ? patient.medicalHistory.filter((h) => h)
    : [];
  const hasMedicalHistory = medicalHistoryList.length > 0;

  // Determine if Women's Health section should be shown
  const isFemale = patient.gender && patient.gender.toLowerCase() === "female";

  // Prepare Women's Health Details only if female
  let womensHealthDetails = [];
  if (isFemale) {
    // Ensure these field names EXACTLY match your API response keys
    womensHealthDetails = [
      {
        id: "discharge",
        question: "Abnormal Discharge",
        answer: formatYesNo(patient.abnormalDischarge),
        description: getData(patient.abnormalDischargeDescription),
      },
      {
        id: "pap",
        question: "Abnormal Pap Smear",
        answer: formatYesNo(patient.abnormalPapSmear),
        description: getData(patient.abnormalPapSmearDescription),
      },
      {
        id: "pelvic",
        question: "Pelvic Pain",
        answer: formatYesNo(patient.pelvicPain),
        description: getData(patient.pelvicDescription),
      },
      {
        id: "leakage",
        question: "Leakage of Urine",
        answer: formatYesNo(patient.leakageOfUrine),
        description: getData(patient.leakageDescription),
      }, // Check API field name (e.g., leakageOfUrine)
    ].filter((item) => item.answer !== NA || item.description !== NA); // Optionally filter out items that are completely N/A
  }

  // Function to get appropriate icon for Women's Health symptoms
  const getWomensHealthIcon = (id) => {
    switch (id) {
      case "discharge":
        return <WaterDropOutlinedIcon className="womens-health-item-icon" />;
      case "pap":
        return <ScienceOutlinedIcon className="womens-health-item-icon" />;
      case "pelvic":
        return <MoodBadOutlinedIcon className="womens-health-item-icon" />;
      case "leakage":
        return <WaterDropOutlinedIcon className="womens-health-item-icon" />; // Reuse icon
      default:
        return <MonitorHeartOutlinedIcon className="womens-health-item-icon" />; // Default icon
    }
  };

  // ----- Render Patient Details Report -----
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1000px",
        margin: "auto",
        py: { xs: 2, sm: 3 },
      }}
    >
      {" "}
      {/* Centered, max-width, responsive padding */}
      <Paper
        className="patient-report-paper"
        elevation={0}
        variant="outlined"
        sx={{ border: "1px solid #dee2e6" }}
      >
        {/* ===== Top Blue Header Section ===== */}
        <Box className="report-header-blue">
          <img
            src={getData(patient.photo) === NA ? defaultPhoto : patient.photo}
            alt={`${getData(patient.firstName)} ${getData(
              patient.lastName
            )}'s photo`}
            className="header-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultPhoto;
            }} // Fallback if image fails to load
          />
          <Box className="header-info">
            <Typography variant="h1" className="header-name">
              {getData(patient.firstName)} {getData(patient.lastName)}
            </Typography>
            <Box className="header-meta">
              {/* Combine Age and Birth Date */}
              <span className="header-meta-item">
                <CakeOutlinedIcon sx={{ mr: 0.5 }} /> {getData(patient.age)} yrs
                ({formatDate(patient.birthDate)})
              </span>
              <span className="header-meta-item">
                <PhoneOutlinedIcon sx={{ mr: 0.5 }} />{" "}
                {patient.phone ? `+91 ${patient.phone}` : NA}
              </span>
              <span className="header-meta-item">
                <BusinessCenterOutlinedIcon sx={{ mr: 0.5 }} />{" "}
                {getData(patient.occupation)}
              </span>
              {/* Allergy Tag - shown only if allergies exist */}
              {hasAllergies && (
                <span className="header-allergy-tag">
                  <WarningAmberOutlinedIcon sx={{ mr: 0.5 }} /> Allergies
                  Present
                </span>
              )}
            </Box>
          </Box>
        </Box>
        {/* Padding wrapper for the main content */}
        <Box className="report-content-padding">
          {/* ===== Report Title & ID ===== */}
          <Box className="report-title-box">
            <Typography className="report-title">
              PATIENT HISTORY REPORT
            </Typography>
            {/* Display MongoDB _id if available */}
            <Typography className="report-subtitle">
              Patient ID: {getData(patient._id)}
            </Typography>
          </Box>

          {/* ===== PERSONAL INFORMATION SECTION ===== */}
          <Box className="report-section">
            <Box className="section-title-container">
              <PersonOutlineIcon className="section-icon" />
              <Typography variant="h2" className="section-title">
                Personal Information
              </Typography>
            </Box>
            <Grid
              container
              spacing={{ xs: 1.5, sm: 2 }}
              className="personal-info-grid"
            >
              {/* Use helper functions for clean data display */}
              <Grid item xs={6} sm={4} md={3}>
                {" "}
                <Box className="info-item">
                  {" "}
                  <Typography className="info-label">Full Name</Typography>{" "}
                  <Typography className="info-value">
                    {getData(patient.firstName)} {getData(patient.lastName)}
                  </Typography>{" "}
                </Box>{" "}
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                {" "}
                <Box className="info-item">
                  {" "}
                  <Typography className="info-label">
                    <PhoneOutlinedIcon /> Phone
                  </Typography>{" "}
                  <Typography className="info-value">
                    {patient.phone ? `+91 ${patient.phone}` : NA}
                  </Typography>{" "}
                </Box>{" "}
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                {" "}
                <Box className="info-item">
                  {" "}
                  <Typography className="info-label">
                    <CakeOutlinedIcon /> Age
                  </Typography>{" "}
                  <Typography className="info-value">
                    {getData(patient.age)}
                  </Typography>{" "}
                </Box>{" "}
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                {" "}
                <Box className="info-item">
                  {" "}
                  <Typography className="info-label">
                    <WcOutlinedIcon /> Gender
                  </Typography>{" "}
                  <Typography className="info-value">
                    {getData(patient.gender)}
                  </Typography>{" "}
                </Box>{" "}
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                {" "}
                <Box className="info-item">
                  {" "}
                  <Typography className="info-label">
                    <CalendarMonthOutlinedIcon /> Birth Date
                  </Typography>{" "}
                  <Typography className="info-value">
                    {formatDate(patient.birthDate)}
                  </Typography>{" "}
                </Box>{" "}
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                {" "}
                <Box className="info-item">
                  {" "}
                  <Typography className="info-label">
                    <BusinessCenterOutlinedIcon /> Occupation
                  </Typography>{" "}
                  <Typography className="info-value">
                    {getData(patient.occupation)}
                  </Typography>{" "}
                </Box>{" "}
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                {" "}
                <Box className="info-item">
                  {" "}
                  <Typography className="info-label">
                    <LocationCityOutlinedIcon /> City
                  </Typography>{" "}
                  <Typography className="info-value">
                    {getData(patient.city)}
                  </Typography>{" "}
                </Box>{" "}
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                {" "}
                <Box className="info-item">
                  {" "}
                  <Typography className="info-label">
                    <FavoriteBorderOutlinedIcon /> Marital Status
                  </Typography>{" "}
                  <Typography className="info-value">
                    {getData(patient.maritalStatus)}
                  </Typography>{" "}
                </Box>{" "}
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                {" "}
                <Box className="info-item">
                  {" "}
                  <Typography className="info-label">
                    <FamilyRestroomOutlinedIcon /> Spouse Name
                  </Typography>{" "}
                  <Typography className="info-value">
                    {getData(patient.spouseName)}
                  </Typography>{" "}
                </Box>{" "}
              </Grid>
            </Grid>
          </Box>

          {/* ===== ALLERGY INFORMATION SECTION ===== */}
          <Box className="report-section">
            <Box className="section-title-container">
              <WarningAmberOutlinedIcon
                className="section-icon"
                sx={{ color: hasAllergies ? "#dc3545" : "inherit" }}
              />
              <Typography
                variant="h2"
                className="section-title"
                sx={{ color: hasAllergies ? "#dc3545" : "inherit" }}
              >
                Allergy Information
              </Typography>
            </Box>
            {hasAllergies ? (
              <Box className="allergy-content">
                <Typography className="allergy-warning-line">
                  <WarningAmberOutlinedIcon
                    sx={{
                      fontSize: "1.1rem",
                      mr: 0.5,
                      verticalAlign: "middle",
                    }}
                  />{" "}
                  This patient has reported the following allergies:
                </Typography>
                <Box className="allergy-pills-container">
                  {/* Display allergies as pills */}
                  {allergiesList.map((allergy, index) => (
                    <span key={index} className="allergy-pill">
                      {allergy}
                    </span>
                  ))}
                </Box>
              </Box>
            ) : (
              <Typography className="no-data-message">
                No known allergies reported.
              </Typography>
            )}
          </Box>

          {/* ===== MEDICAL HISTORY SECTION ===== */}
          <Box className="report-section">
            <Box className="section-title-container">
              <ArticleOutlinedIcon className="section-icon" />
              <Typography variant="h2" className="section-title">
                Medical History
              </Typography>
            </Box>
            {hasMedicalHistory ? (
              // Use the card layout for medical history items
              <Box className="medical-history-container">
                {medicalHistoryList.map((item, index) => (
                  <Box key={index} className="medical-history-item">
                    <ArticleOutlinedIcon
                      sx={{ fontSize: "1.1rem", color: "#0d6efd" }}
                    />{" "}
                    {/* Consistent Icon */}
                    <Typography component="span">{item}</Typography>{" "}
                    {/* History Item Text */}
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography className="no-data-message">
                No significant medical history reported.
              </Typography>
            )}
          </Box>

          {/* ===== WOMEN'S HEALTH SECTION (Conditional) ===== */}
          {isFemale && (
            <Box className="report-section">
              <Box className="section-title-container">
                <FemaleOutlinedIcon
                  className="section-icon"
                  sx={{ color: "#c678dd" }}
                />
                <Typography
                  variant="h2"
                  className="section-title"
                  sx={{ color: "#c678dd" }}
                >
                  Women’s Health
                </Typography>
              </Box>

              {/* --- Menstrual Information --- */}
              <Box className="menstrual-info-block">
                <Typography className="subsection-title">
                  Menstrual Information
                </Typography>
                <Grid container spacing={{ xs: 1, sm: 2 }}>
                  {/* Ensure field names match API response (e.g., patient.periodType) */}
                  <Grid item xs={12} sm={4}>
                    {" "}
                    <Box className="info-item sub-item">
                      {" "}
                      <Typography className="info-label">
                        Period Type
                      </Typography>{" "}
                      <Typography className="info-value">
                        {getData(patient.periodType)}
                      </Typography>{" "}
                    </Box>{" "}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    {" "}
                    <Box className="info-item sub-item">
                      {" "}
                      <Typography className="info-label">
                        Still Having Periods
                      </Typography>{" "}
                      <Typography className="info-value">
                        {formatYesNo(patient.stillHavingPeriods)}
                      </Typography>{" "}
                    </Box>{" "}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    {" "}
                    <Box className="info-item sub-item">
                      {" "}
                      <Typography className="info-label">
                        Difficulty with Periods
                      </Typography>{" "}
                      <Typography className="info-value">
                        {getData(patient.difficultyWithPeriods)}
                      </Typography>{" "}
                    </Box>{" "}
                  </Grid>
                </Grid>
              </Box>

              {/* --- Reproductive History --- */}
              <Box className="reproductive-history-block">
                <Typography className="subsection-title">
                  Reproductive History
                </Typography>
                <Box className="reproductive-cards-container">
                  {/* Use getNumberData for numeric fields */}
                  <Box className="reproductive-card">
                    {" "}
                    <AddCircleOutlineOutlinedIcon className="reproductive-card-icon pregnancies" />{" "}
                    <Box className="reproductive-card-content">
                      {" "}
                      <Typography className="reproductive-card-number">
                        {getNumberData(patient.pregnancies)}
                      </Typography>{" "}
                      <Typography className="reproductive-card-label">
                        Pregnancies
                      </Typography>{" "}
                    </Box>{" "}
                  </Box>
                  <Box className="reproductive-card">
                    {" "}
                    <ChildFriendlyOutlinedIcon className="reproductive-card-icon births" />{" "}
                    <Box className="reproductive-card-content">
                      {" "}
                      <Typography className="reproductive-card-number">
                        {getNumberData(patient.births)}
                      </Typography>{" "}
                      <Typography className="reproductive-card-label">
                        Births
                      </Typography>{" "}
                    </Box>{" "}
                  </Box>
                  <Box className="reproductive-card">
                    {" "}
                    <RemoveCircleOutlineOutlinedIcon className="reproductive-card-icon miscarriages" />{" "}
                    <Box className="reproductive-card-content">
                      {" "}
                      <Typography className="reproductive-card-number">
                        {getNumberData(patient.miscarriages)}
                      </Typography>{" "}
                      <Typography className="reproductive-card-label">
                        Miscarriages
                      </Typography>{" "}
                    </Box>{" "}
                  </Box>
                  <Box className="reproductive-card">
                    {" "}
                    <DoNotDisturbOnOutlinedIcon className="reproductive-card-icon abortions" />{" "}
                    <Box className="reproductive-card-content">
                      {" "}
                      <Typography className="reproductive-card-number">
                        {getNumberData(patient.abortions)}
                      </Typography>{" "}
                      <Typography className="reproductive-card-label">
                        Abortions
                      </Typography>{" "}
                    </Box>{" "}
                  </Box>
                </Box>
              </Box>

              {/* --- Detailed Gynecological Questions --- */}
              {womensHealthDetails.length > 0 && (
                <Box className="womens-health-details-container">
                  <Typography className="subsection-title">
                    Gynecological Symptoms
                  </Typography>
                  <Box className="womens-health-vertical-line" />{" "}
                  {/* Optional decorative line */}
                  {womensHealthDetails.map((item) => (
                    <Box key={item.id} className="womens-health-item">
                      {getWomensHealthIcon(item.id)}
                      <Typography className="womens-health-question">
                        {item.question}
                      </Typography>
                      <Typography
                        component="span"
                        className={`womens-health-answer ${item.answer.toLowerCase()}`}
                      >
                        {item.answer}
                      </Typography>
                      {/* Show description only if answer is Yes and description exists */}
                      {item.answer === "Yes" && item.description !== NA && (
                        <Typography
                          component="span"
                          className="womens-health-description"
                        >
                          : {item.description}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
              {/* Message if no specific symptoms reported */}
              {womensHealthDetails.length === 0 && (
                <Typography className="no-data-message" sx={{ mt: 2 }}>
                  No specific gynecological symptoms reported.
                </Typography>
              )}
            </Box> // End Women's Health Section Box
          )}

          {/* ===== Report Footer ===== */}
          <Box
            sx={{
              borderTop: 1,
              borderColor: "divider",
              mt: 4,
              pt: 1.5,
              textAlign: "center",
            }}
          >
            <Typography className="report-footer">
              Report generated on: {new Date().toLocaleString()}
            </Typography>
            <Typography
              className="report-footer"
              sx={{ fontStyle: "italic", mt: 0.5 }}
            >
              This is a confidential medical document.
            </Typography>
          </Box>
        </Box>{" "}
        {/* End report-content-padding */}
      </Paper>
    </Box>
  );
};

export default PatientDetails;
