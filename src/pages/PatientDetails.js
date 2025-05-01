// src/pages/PatientDetails.js

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Button, // Import Button
  List, // For action list
  ListItem, // For action list
  ListItemButton, // For clickable actions
  ListItemIcon, // For icons in actions
  ListItemText, // For text in actions
  Divider, // To separate sections visually
} from "@mui/material";
import "../styles/PatientDetailsReport.css"; // Your existing report styles
import "../styles/PatientDetailsSidebar.css"; // Your new CSS file for sidebar styles

// --- Import Icons ---
// (Keep all your existing icon imports for the report)
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
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
import ChildFriendlyOutlinedIcon from "@mui/icons-material/ChildFriendlyOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import MoodBadOutlinedIcon from "@mui/icons-material/MoodBadOutlined";
// --- Add icon for Edit action ---
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";

// --- Constants and Helpers ---
const defaultPhoto = "https://via.placeholder.com/60"; // Default avatar URL
const NA = "N/A"; // Constant for Not Applicable/Available

// Helper function to safely get data or return NA
const getData = (value) => {
  if (value === null || value === undefined || value === "") {
    return NA;
  }
  return value;
};

// Helper function to get number or default (e.g., 0), then format with getData
const getNumberData = (value, defaultValue = 0) => {
  const num =
    value === null || value === undefined || value === ""
      ? defaultValue
      : value;
  // Return the number directly if it's valid, otherwise NA
  return typeof num === "number" && !isNaN(num) ? num : NA;
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
  // Handle 'na' explicitly if stored in DB
  if (typeof value === "string" && value.toLowerCase() === "na") {
    return "N/A";
  }
  return NA; // Treat null, undefined, other strings as N/A
};

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook for navigation
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Fetch Data Effect ---
  useEffect(() => {
    setLoading(true);
    setError("");
    axios
      .get(`https://hospital-qn5w.onrender.com/api/patient/${id}`)
      .then((res) => {
        console.log("API Response:", res.data);
        setPatient(res.data);
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
          errorMsg = "Network error or server did not respond.";
        } else {
          errorMsg = `Error: ${err.message}`;
        }
        setError(errorMsg);
        setLoading(false);
      });
  }, [id]);

  // --- Action Handlers ---
  const handleUpdateReport = () => {
    // Navigate to the edit page for this patient
    console.log("Navigate to edit page for patient:", id);
    navigate(`/patient/${id}/edit`); // Use the defined edit route
  };

  // --- Loading and Error States ---
  if (loading) {
    return (
      <Box
        className="loading-container"
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
      <Box
        className="error-container"
        sx={{ padding: 5, textAlign: "center", color: "red" }}
      >
        <Typography>
          Could not load patient data. <br /> {error}
        </Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Box>
    );
  }
  if (!patient) {
    return (
      <Box className="error-container" sx={{ padding: 5, textAlign: "center" }}>
        <Typography>No patient data found for this ID.</Typography>
      </Box>
    );
  }

  // --- Prepare data safely for display ---

  // Allergies: Handle string or array from backend
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
    // Should be array based on schema
    allergiesList = patient.allergies.filter(
      (a) => typeof a === "string" && a.trim() !== ""
    );
  }
  const hasAllergies = patient.allergic === true && allergiesList.length > 0; // Use the 'allergic' boolean flag

  // Medical History: Should be an array based on schema
  let medicalHistoryList = [];
  if (Array.isArray(patient.medicalHistory)) {
    medicalHistoryList = patient.medicalHistory.filter(
      (h) => typeof h === "string" && h.trim() !== ""
    );
  }
  const hasMedicalHistory = medicalHistoryList.length > 0;

  // Check if Women's Health section should be shown
  const isFemale = patient.gender && patient.gender.toLowerCase() === "female";

  // Prepare Women's Health Details only if female
  let womensHealthDetails = [];
  if (isFemale) {
    // Adjust field names based on your ACTUAL API response/Schema
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
        return <WaterDropOutlinedIcon className="womens-health-item-icon" />;
      default:
        return <MonitorHeartOutlinedIcon className="womens-health-item-icon" />;
    }
  };

  // ----- Render Component -----
  return (
    <Box className="patient-details-layout">
      {/* ===== Left Sidebar for Actions ===== */}
      <Paper className="details-sidebar" elevation={1}>
        <Box className="sidebar-header">
          <Typography variant="h6" gutterBottom>
            Actions
          </Typography>
          <Typography variant="caption">
            Patient ID: {getData(patient._id)} {/* Use _id */}
          </Typography>
        </Box>
        <Divider />
        <List component="nav" aria-label="patient actions">
          <ListItem disablePadding>
            <ListItemButton onClick={handleUpdateReport}>
              <ListItemIcon>
                <EditNoteOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Edit Patient Details" />
            </ListItemButton>
          </ListItem>
          {/* Other action items removed as requested */}
        </List>
        {/* Optional: Add other non-action info like last updated? */}
        <Divider sx={{ my: 2 }} />
        <Typography
          variant="caption"
          sx={{ display: "block", textAlign: "center", color: "#6c757d" }}
        >
          Last Updated: {new Date(patient.updatedAt).toLocaleString()}
        </Typography>
      </Paper>
      {/* ===== Right Side: Patient Report Content ===== */}
      <Box className="report-content-area">
        <Paper
          className="patient-report-paper" // Uses styles from PatientDetailsReport.css
          elevation={0}
          variant="outlined"
        >
          {/* ===== Top Blue Header Section ===== */}
          <Box className="report-header-blue">
            <img
              src={getData(patient.photo) === NA ? defaultPhoto : patient.photo}
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
                {/* Conditionally show Allergy Tag based on boolean flag */}
                {patient.allergic === true && (
                  <span className="header-allergy-tag">
                    <WarningAmberOutlinedIcon /> Allergies Reported
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
                PATIENT HISTORY REPORT
              </Typography>
              <Typography className="report-subtitle">
                Report ID: #{getData(patient._id)} {/* Use _id */}
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
                    <Typography
                      className="info-value"
                      sx={{ textTransform: "capitalize" }}
                    >
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
                      Kin Name
                    </Typography>
                    <Typography className="info-value">
                      {getData(patient.spouseName)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* ===== ALLERGY INFORMATION SECTION ===== */}
            <Box className="report-section">
              <Box className="section-title-container">
                <WarningAmberOutlinedIcon
                  className="section-icon"
                  sx={{ color: patient.allergic ? "#dc3545" : "#6c757d" }}
                />
                <Typography
                  variant="h2"
                  className="section-title"
                  sx={{ color: patient.allergic ? "#dc3545" : "#6c757d" }}
                >
                  Allergy Information
                </Typography>
              </Box>
              {patient.allergic === true ? (
                <Box className="allergy-content">
                  <Typography className="allergy-warning-line">
                    <WarningAmberOutlinedIcon /> This patient has reported
                    allergies:
                  </Typography>
                  {hasAllergies ? (
                    <Box className="allergy-pills-container">
                      {allergiesList.map((allergy, index) => (
                        <span key={index} className="allergy-pill">
                          {allergy}
                        </span>
                      ))}
                    </Box>
                  ) : (
                    <Typography
                      sx={{
                        fontStyle: "italic",
                        color: "#842029",
                        mt: 1,
                        ml: "30px",
                      }}
                    >
                      Specific allergies not listed.
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography
                  className="no-data-message"
                  sx={{ pl: "10px", mt: "10px" }}
                >
                  {" "}
                  {/* Added padding/margin */}
                  No allergies reported by the patient.
                </Typography>
              )}
            </Box>

            {/* ===== MEDICAL HISTORY SECTION ===== */}
            <Box className="report-section">
              <Box className="section-title-container">
                <ArticleOutlinedIcon className="section-icon" />
                <Typography variant="h2" className="section-title">
                  {" "}
                  Medical History{" "}
                </Typography>
              </Box>
              {hasMedicalHistory ? (
                <Box className="medical-history-container">
                  {" "}
                  {/* Uses Flexbox wrap */}
                  {medicalHistoryList.map((item, index) => (
                    <Box key={index} className="medical-history-item">
                      {" "}
                      {/* Styled as pills */}
                      <ArticleOutlinedIcon /> <Typography>{item}</Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography
                  className="no-data-message"
                  sx={{ pl: "10px", mt: "10px" }}
                >
                  No significant medical history reported.
                </Typography>
              )}
            </Box>

            {/* ===== WOMEN'S HEALTH SECTION ===== */}
            {isFemale && (
              <Box className="report-section">
                <Box className="section-title-container">
                  <FemaleOutlinedIcon className="section-icon" />
                  <Typography variant="h2" className="section-title">
                    {" "}
                    Women’s Health{" "}
                  </Typography>
                </Box>

                {/* Menstrual Information */}
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
                        <Typography className="info-value" fontSize={12}>
                          {getData(patient.difficultyWithPeriods)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Reproductive History */}
                <Box className="reproductive-history-block">
                  <Typography className="reproductive-history-title">
                    Reproductive History
                  </Typography>
                  <Box className="reproductive-cards-container">
                    <Box className="reproductive-card">
                      <AddCircleOutlineOutlinedIcon className="reproductive-card-icon pregnancies" />
                      <Box className="reproductive-card-content">
                        <Typography className="reproductive-card-number">
                          {getNumberData(patient.pregnancies)}
                        </Typography>
                        <Typography className="reproductive-card-label">
                          Pregnancies
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="reproductive-card">
                      <ChildFriendlyOutlinedIcon className="reproductive-card-icon births" />
                      <Box className="reproductive-card-content">
                        <Typography className="reproductive-card-number">
                          {getNumberData(patient.births)}
                        </Typography>
                        <Typography className="reproductive-card-label">
                          Births
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="reproductive-card">
                      <RemoveCircleOutlineOutlinedIcon className="reproductive-card-icon miscarriages" />
                      <Box className="reproductive-card-content">
                        <Typography className="reproductive-card-number">
                          {getNumberData(patient.miscarriages)}
                        </Typography>
                        <Typography className="reproductive-card-label">
                          Miscarriages
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="reproductive-card">
                      <DoNotDisturbOnOutlinedIcon className="reproductive-card-icon abortions" />
                      <Box className="reproductive-card-content">
                        <Typography className="reproductive-card-number">
                          {getNumberData(patient.abortions)}
                        </Typography>
                        <Typography className="reproductive-card-label">
                          Abortions
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Detailed Questions */}
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
                        {/* Show description only if answer is Yes and description is available */}
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
                    className="no-data-message"
                    sx={{ pl: "10px", mt: "10px" }}
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
              This is a confidential medical document. Last updated:{" "}
              {new Date(patient.updatedAt).toLocaleString()}
            </Typography>
          </Box>{" "}
          {/* End report-content-padding */}
        </Paper>
      </Box>{" "}
      {/* End report-content-area */}
    </Box> // End patient-details-layout
  );
};

export default PatientDetails;
