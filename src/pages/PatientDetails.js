// src/pages/PatientDetails.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Paper, Typography, Grid, CircularProgress } from "@mui/material"; // Added CircularProgress
import "../styles/PatientDetailsReport.css";

// Import Icons (Ensure all used icons are imported)
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import FemaleOutlinedIcon from "@mui/icons-material/FemaleOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
// Removed HomeOutlinedIcon as LocationCityOutlinedIcon is used
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
import FamilyRestroomOutlinedIcon from "@mui/icons-material/FamilyRestroomOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ChildFriendlyOutlinedIcon from "@mui/icons-material/ChildFriendlyOutlined"; // Using this for Births
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import MoodBadOutlinedIcon from "@mui/icons-material/MoodBadOutlined";

const defaultPhoto = "https://via.placeholder.com/60"; // Default avatar URL
const NA = "N/A"; // Constant for Not Applicable/Available

// Helper function to safely get data or return NA
// Handles null, undefined, and empty strings
const getData = (value) => {
  if (value === null || value === undefined || value === "") {
    return NA;
  }
  return value;
};

// Helper function to get number or default (e.g., 0), then format with getData
const getNumberData = (value, defaultValue = 0) => {
  const num = value === null || value === undefined ? defaultValue : value;
  return getData(num); // Format with NA if needed (though defaultValue usually prevents this)
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
  // Consider empty string or specific values as No if appropriate for your API
  // if (value === '') return 'No';
  return NA; // Treat null, undefined, other strings as N/A
};

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null); // Start with null
  const [loading, setLoading] = useState(true); // Start loading
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(""); // Clear previous errors
    axios
      .get(`https://hospital-qn5w.onrender.com/api/patient/${id}`)
      .then((res) => {
        console.log("API Response:", res.data); // Log to see actual structure
        setPatient(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching patient details:", err);
        let errorMsg = "Error fetching patient details.";
        if (err.response) {
          // Server responded with a status code outside 2xx
          errorMsg = `Error: ${err.response.status} - ${
            err.response.data?.message || err.response.statusText
          }`;
        } else if (err.request) {
          // Request was made but no response received
          errorMsg = "Network error or server did not respond.";
        } else {
          // Something else happened in setting up the request
          errorMsg = `Error: ${err.message}`;
        }
        setError(errorMsg);
        setLoading(false);
      });
  }, [id]);

  // --- Loading and Error States ---
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
  if (error) {
    return (
      <Box sx={{ padding: 5, textAlign: "center", color: "red" }}>
        <Typography>
          Could not load patient data. <br /> {error}
        </Typography>
      </Box>
    );
  }
  if (!patient) {
    // This state might be brief or could happen if API returns empty success
    return (
      <Box sx={{ padding: 5, textAlign: "center" }}>
        <Typography>No patient data found for this ID.</Typography>
      </Box>
    );
  }

  // --- Prepare data safely after loading and no error ---

  // Allergies: Assume 'allergies' is a comma-separated string or an array
  let allergiesList = [];
  if (
    typeof patient.allergies === "string" &&
    patient.allergies.trim() !== ""
  ) {
    allergiesList = patient.allergies
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a);
  } else if (Array.isArray(patient.allergies)) {
    allergiesList = patient.allergies
      .filter((a) => a && typeof a === "string" && a.trim() !== "")
      .map((a) => a.trim());
  }
  const hasAllergies = allergiesList.length > 0;

  // Medical History: Assume 'medicalHistory' is a comma-separated string or an array
  let medicalHistoryList = [];
  if (
    typeof patient.medicalHistory === "string" &&
    patient.medicalHistory.trim() !== ""
  ) {
    medicalHistoryList = patient.medicalHistory
      .split(",")
      .map((h) => h.trim())
      .filter((h) => h);
  } else if (Array.isArray(patient.medicalHistory)) {
    medicalHistoryList = patient.medicalHistory
      .filter((h) => h && typeof h === "string" && h.trim() !== "")
      .map((h) => h.trim());
  }
  const hasMedicalHistory = medicalHistoryList.length > 0;

  // Check if Women's Health section should be shown
  const isFemale = patient.gender && patient.gender.toLowerCase() === "female";

  // Prepare Women's Health Details only if female
  let womensHealthDetails = [];
  if (isFemale) {
    // Adjust field names ('abnormalDischarge', etc.) based on your ACTUAL API response
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
      },
    ];
    // .filter(item => item.answer !== NA || (item.answer === 'Yes' && item.description !== NA)); // Decide if you want to filter out rows that are entirely N/A
  }

  // Function to get icons for Women's Health Details
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
        return <MonitorHeartOutlinedIcon className="womens-health-item-icon" />;
    }
  };

  // ----- Render Component -----
  return (
    <Box sx={{ width: "100%", padding: { xs: "10px 0", sm: "20px 0" } }}>
      {" "}
      {/* Responsive padding */}
      <Paper className="patient-report-paper" elevation={0} variant="outlined">
        {/* ===== Top Blue Header Section ===== */}
        <Box className="report-header-blue">
          <img
            src={getData(patient.photo) === NA ? defaultPhoto : patient.photo} // Use default if photo is NA
            alt={`${getData(patient.firstName)} ${getData(patient.lastName)}`}
            className="header-avatar"
          />
          <Box className="header-info">
            <Typography variant="h1" className="header-name">
              {getData(patient.firstName)} {getData(patient.lastName)}
            </Typography>
            <Box className="header-meta">
              <span className="header-meta-item">
                <CakeOutlinedIcon /> {getData(patient.age)} years (
                {getData(patient.birthDate)})
              </span>
              <span className="header-meta-item">
                <PhoneOutlinedIcon />{" "}
                {patient.phone ? `+91 ${patient.phone}` : NA}
              </span>
              <span className="header-meta-item">
                <BusinessCenterOutlinedIcon /> {getData(patient.occupation)}
              </span>
              {/* Conditionally show Allergy Tag */}
              {hasAllergies && (
                <span className="header-allergy-tag">
                  <WarningAmberOutlinedIcon /> Allergies
                </span>
              )}
            </Box>
          </Box>
        </Box>
        {/* Padding wrapper for the rest of the content */}
        <Box className="report-content-padding">
          {/* ===== Report Title ===== */}
          <Box className="report-title-box">
            <Typography className="report-title">
              NEW PATIENT HISTORY REPORT
            </Typography>
            {/* Use _id if available, otherwise maybe patient ID field? */}
            <Typography className="report-subtitle">
              Report ID: #{getData(patient._id || patient.patientId)}{" "}
              {/* Check for _id or patientId */}
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
              spacing={{ xs: 1, sm: 2 }}
              className="personal-info-grid"
            >
              {/* Row 1 */}
              <Grid item xs={6} sm={6} md={3}>
                {" "}
                {/* Adjusted grid points for better layout */}
                <Box className="info-item">
                  <Typography className="info-label">Full Name</Typography>
                  <Typography className="info-value">
                    {getData(patient.firstName)} {getData(patient.lastName)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} md={3}>
                <Box className="info-item">
                  <Typography className="info-label">
                    <PhoneOutlinedIcon />
                    Phone
                  </Typography>
                  <Typography className="info-value">
                    {patient.phone ? `+91 ${patient.phone}` : NA}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} md={3}>
                <Box className="info-item">
                  <Typography className="info-label">
                    <CakeOutlinedIcon />
                    Age
                  </Typography>
                  <Typography className="info-value">
                    {getData(patient.age)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} md={3}>
                <Box className="info-item">
                  <Typography className="info-label">
                    <WcOutlinedIcon />
                    Gender
                  </Typography>
                  <Typography className="info-value">
                    {getData(patient.gender)}
                  </Typography>
                </Box>
              </Grid>
              {/* Row 2 */}
              <Grid item xs={6} sm={6} md={3}>
                <Box className="info-item">
                  <Typography className="info-label">
                    <CalendarMonthOutlinedIcon />
                    Birth Date
                  </Typography>
                  <Typography className="info-value">
                    {getData(patient.birthDate)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} md={3}>
                <Box className="info-item">
                  <Typography className="info-label">
                    <BusinessCenterOutlinedIcon />
                    Occupation
                  </Typography>
                  <Typography className="info-value">
                    {getData(patient.occupation)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} md={3}>
                <Box className="info-item">
                  <Typography className="info-label">
                    <LocationCityOutlinedIcon />
                    City
                  </Typography>
                  <Typography className="info-value">
                    {getData(patient.city)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} md={3}>
                <Box className="info-item">
                  <Typography className="info-label">
                    <FavoriteBorderOutlinedIcon />
                    Marital Status
                  </Typography>
                  <Typography className="info-value">
                    {getData(patient.maritalStatus)}
                  </Typography>
                </Box>
              </Grid>
              {/* Row 3 */}
              <Grid item xs={6} sm={6} md={3}>
                <Box className="info-item">
                  <Typography className="info-label">
                    <FamilyRestroomOutlinedIcon />
                    Spouse Name
                  </Typography>
                  <Typography className="info-value">
                    {getData(patient.spouseName)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* ===== ALLERGY INFORMATION SECTION ===== */}
          {/* Render this section regardless of content, show appropriate message */}
          <Box className="report-section">
            <Box className="section-title-container">
              <WarningAmberOutlinedIcon
                className="section-icon"
                sx={{ color: "#dc3545" }}
              />
              <Typography
                variant="h2"
                className="section-title"
                sx={{ color: "#dc3545" }}
              >
                Allergy Information
              </Typography>
            </Box>
            {hasAllergies ? (
              <Box className="allergy-content">
                {" "}
                {/* Use allergy-content class */}
                <Typography className="allergy-warning-line">
                  <WarningAmberOutlinedIcon /> This patient has reported
                  allergies:
                </Typography>
                <Box className="allergy-pills-container">
                  {allergiesList.map((allergy, index) => (
                    <span key={index} className="allergy-pill">
                      {allergy}
                    </span>
                  ))}
                </Box>
              </Box>
            ) : (
              <Typography
                sx={{
                  fontStyle: "italic",
                  color: "#6c757d",
                  marginTop: "10px",
                  paddingLeft: "10px",
                }}
              >
                No allergies reported.
              </Typography>
            )}
          </Box>

          {/* ===== MEDICAL HISTORY SECTION ===== */}
          {/* Render this section regardless of content, show appropriate message */}
          <Box className="report-section">
            <Box className="section-title-container">
              <ArticleOutlinedIcon className="section-icon" />
              <Typography variant="h2" className="section-title">
                Medical History
              </Typography>
            </Box>
            {hasMedicalHistory ? (
              <Box className="medical-history-container">
                {medicalHistoryList.map((item, index) => (
                  <Box key={index} className="medical-history-item">
                    <ArticleOutlinedIcon />
                    <Typography>{item}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography
                sx={{
                  fontStyle: "italic",
                  color: "#6c757d",
                  marginTop: "10px",
                  paddingLeft: "10px",
                }}
              >
                No significant medical history reported.
              </Typography>
            )}
          </Box>

          {/* ===== WOMEN'S HEALTH SECTION ===== */}
          {/* Show only if gender is Female */}
          {isFemale && (
            <Box className="report-section">
              <Box className="section-title-container">
                <FemaleOutlinedIcon className="section-icon" />
                <Typography variant="h2" className="section-title">
                  Women’s Health
                </Typography>
              </Box>

              {/* Menstrual Information - Adapt field names if needed */}
              <Box className="menstrual-info-block">
                <Typography className="menstrual-info-title">
                  Menstrual Information
                </Typography>
                <Grid container spacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <Box className="info-item">
                      <Typography className="info-label" fontSize={14}>
                        Period Type
                      </Typography>
                      {/* Adapt 'periodType' if API field name is different */}
                      <Typography className="info-value" fontSize={12}>
                        {getData(patient.periodType)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box className="info-item">
                      <Typography className="info-label" fontSize={14}>
                        Still Having Periods
                      </Typography>
                      {/* Adapt 'stillHavingPeriods' */}
                      <Typography className="info-value" fontSize={12}>
                        {formatYesNo(patient.stillHavingPeriods)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box className="info-item">
                      <Typography className="info-label" fontSize={14}>
                        Difficulty with Periods
                      </Typography>
                      {/* Adapt 'difficultyWithPeriods' */}
                      <Typography className="info-value" fontSize={12}>
                        {getData(patient.difficultyWithPeriods)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Reproductive History - Adapt field names */}
              <Box className="reproductive-history-block">
                <Typography className="reproductive-history-title">
                  Reproductive History
                </Typography>
                <Box className="reproductive-cards-container">
                  {/* Adapt 'pregnancies', 'births', etc. */}
                  <Box className="reproductive-card">
                    <AddCircleOutlineOutlinedIcon className="reproductive-card-icon pregnancies" />
                    <Box className="reproductive-card-content">
                      <Typography
                        className="reproductive-card-number"
                        fontSize={12}
                      >
                        {getNumberData(patient.pregnancies)}
                      </Typography>
                      <Typography
                        className="reproductive-card-label"
                        fontSize={12}
                      >
                        Pregnancies
                      </Typography>
                    </Box>
                  </Box>
                  <Box className="reproductive-card">
                    <ChildFriendlyOutlinedIcon className="reproductive-card-icon births" />
                    <Box className="reproductive-card-content">
                      <Typography
                        className="reproductive-card-number"
                        fontSize={12}
                      >
                        {getNumberData(patient.births)}
                      </Typography>
                      <Typography
                        className="reproductive-card-label"
                        fontSize={12}
                      >
                        Births
                      </Typography>
                    </Box>
                  </Box>
                  <Box className="reproductive-card">
                    <RemoveCircleOutlineOutlinedIcon className="reproductive-card-icon miscarriages" />
                    <Box className="reproductive-card-content">
                      <Typography
                        className="reproductive-card-number"
                        fontSize={12}
                      >
                        {getNumberData(patient.miscarriages)}
                      </Typography>
                      <Typography
                        className="reproductive-card-label"
                        fontSize={12}
                      >
                        Miscarriages
                      </Typography>
                    </Box>
                  </Box>
                  <Box className="reproductive-card">
                    <DoNotDisturbOnOutlinedIcon className="reproductive-card-icon abortions" />
                    <Box className="reproductive-card-content">
                      <Typography
                        className="reproductive-card-number"
                        fontSize={12}
                      >
                        {getNumberData(patient.abortions)}
                      </Typography>
                      <Typography
                        className="reproductive-card-label"
                        fontSize={12}
                      >
                        Abortions
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Detailed Questions - Uses prepared 'womensHealthDetails' array */}
              {/* Render this section only if there are details to show */}
              {womensHealthDetails.length > 0 ? (
                <Box className="womens-health-details-container">
                  <Box className="womens-health-vertical-line" />
                  {womensHealthDetails.map((item) => (
                    <Box key={item.id} className="womens-health-item">
                      {getWomensHealthIcon(item.id)}
                      <Typography className="womens-health-question">
                        {item.question}
                      </Typography>
                      <Typography
                        component="span"
                        className={`womens-health-answer ${
                          item.answer.toLowerCase() === "yes"
                            ? "yes"
                            : item.answer.toLowerCase() === "no"
                            ? "no"
                            : ""
                        }`}
                      >
                        {item.answer}
                      </Typography>
                      {/* Show description only if answer is Yes and description is not N/A */}
                      {item.answer.toLowerCase() === "yes" &&
                        item.description !== NA && (
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
              ) : (
                <Typography
                  sx={{
                    fontStyle: "italic",
                    color: "#6c757d",
                    marginTop: "10px",
                    paddingLeft: "10px",
                  }}
                >
                  No specific gynecological symptoms reported.
                </Typography>
              )}
            </Box>
          )}

          {/* ===== Report Footer ===== */}
          <Typography className="report-footer">
            Patient Report generated on {new Date().toLocaleDateString()}
          </Typography>
          <Typography className="report-footer">
            This is a confidential medical document
          </Typography>
        </Box>{" "}
        {/* End report-content-padding */}
      </Paper>
    </Box>
  );
};

export default PatientDetails;
