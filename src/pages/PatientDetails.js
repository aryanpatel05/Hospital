// src/pages/PatientDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Paper, Typography, Grid } from "@mui/material";
import Sidebar from "../components/Sidebar";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import "../styles/PatientDetailsReport.css";

const defaultPhoto = "https://via.placeholder.com/100";

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`https://hospital-qn5w.onrender.com/api/patient/${id}`)
      .then((res) => {
        setPatient(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching patient details:", err);
        setError("Error fetching patient details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>{error}</Typography>;
  if (!patient) return <Typography>No patient found.</Typography>;

  // Helper to convert boolean to Yes/No
  const boolToYesNo = (val) => (val ? "Yes" : "No");

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Patient Details
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ marginTop: "64px", p: 2 }}>
          <Paper className="patient-report-paper" elevation={3}>
            {/* Photo Container on Top-Right */}
            <Box className="photo-container">
              <img
                src={patient.photo ? patient.photo : defaultPhoto}
                alt="Patient"
              />
            </Box>
            <Typography
              variant="h5"
              align="center"
              className="report-title"
              gutterBottom
            >
              NEW PATIENT HISTORY REPORT
            </Typography>
            {/* Basic Information Section */}
            <Box className="report-section">
              <Typography variant="h6" className="section-header">
                Basic Information
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={3} className="field-label">
                  Adharcard:
                </Grid>
                <Grid item xs={12} sm={3} className="field-value">
                  {patient.adharcard}
                </Grid>
                {/* Row 1: Name / Phone */}
                <Grid item xs={12} sm={3} className="field-label">
                  Name:
                </Grid>
                <Grid item xs={12} sm={3} className="field-value">
                  {patient.firstName} {patient.lastName}
                </Grid>
                <Grid item xs={12} sm={3} className="field-label">
                  Phone:
                </Grid>
                <Grid item xs={12} sm={3} className="field-value">
                  +91 {patient.phone}
                </Grid>
                {/* Row 2: Occupation / Marital Status */}
                <Grid item xs={12} sm={3} className="field-label">
                  Occupation:
                </Grid>
                <Grid item xs={12} sm={3} className="field-value">
                  {patient.occupation}
                </Grid>
                <Grid item xs={12} sm={3} className="field-label">
                  Marital Status:
                </Grid>
                <Grid item xs={12} sm={3} className="field-value">
                  {patient.maritalStatus}
                </Grid>
                {/* Row 3: Spouse Name / City */}
                <Grid item xs={12} sm={3} className="field-label">
                  Spouse Name:
                </Grid>
                <Grid item xs={12} sm={3} className="field-value">
                  {patient.spouseName}
                </Grid>
                <Grid item xs={12} sm={3} className="field-label">
                  City:
                </Grid>
                <Grid item xs={12} sm={3} className="field-value">
                  {patient.city}
                </Grid>
                {/* Row 4: Age / Gender */}
                <Grid item xs={12} sm={3} className="field-label">
                  Age:
                </Grid>
                <Grid item xs={12} sm={3} className="field-value">
                  {patient.age}
                </Grid>
                <Grid item xs={12} sm={3} className="field-label">
                  Gender:
                </Grid>
                <Grid item xs={12} sm={3} className="field-value">
                  {patient.gender}
                </Grid>
                {/* Row 5: Birth Date / Allergic */}
                <Grid item xs={12} sm={3} className="field-label">
                  Birth Date:
                </Grid>
                <Grid item xs={12} sm={3} className="field-value">
                  {patient.birthDate}
                </Grid>
                <Grid item xs={12} sm={3} className="field-label">
                  Allergic:
                </Grid>
                <Grid item xs={12} sm={3} className="field-value">
                  {boolToYesNo(patient.allergic)}
                </Grid>
              </Grid>
            </Box>

            {/* Allergies Section */}
            {patient.allergic && (
              <Box className="report-section">
                <Typography variant="h6" className="section-header">
                  Allergy Details
                </Typography>
                <Typography className="field-value">
                  {patient.allergies}
                </Typography>
              </Box>
            )}

            {/* Past Medical History Section */}
            <Box className="report-section">
              <Typography variant="h6" className="section-header">
                Past Medical History
              </Typography>
              {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                <Typography className="field-value">
                  {patient.medicalHistory.join(", ")}
                </Typography>
              ) : (
                <Typography className="field-value">
                  No significant medical history reported.
                </Typography>
              )}
            </Box>

            {/* Women Only Section */}
            {patient.gender && patient.gender.toLowerCase() === "female" && (
              <Box className="report-section">
                <Typography variant="h6" className="section-header">
                  Women Only
                </Typography>
                <Grid container spacing={1}>
                  {/* Row 1: Period Type / Still Having Periods */}
                  <Grid item xs={12} sm={3} className="field-label">
                    Period Type:
                  </Grid>
                  <Grid item xs={12} sm={3} className="field-value">
                    {patient.periodType}
                  </Grid>
                  <Grid item xs={12} sm={3} className="field-label">
                    Still Having Periods:
                  </Grid>
                  <Grid item xs={12} sm={3} className="field-value">
                    {patient.stillHavingPeriods}
                  </Grid>
                  {/* Row 2: Difficulty with Periods / Pregnancies */}
                  <Grid item xs={12} sm={3} className="field-label">
                    Difficulty with Periods:
                  </Grid>
                  <Grid item xs={12} sm={3} className="field-value">
                    {patient.difficultyWithPeriods}
                  </Grid>
                  <Grid item xs={12} sm={3} className="field-label">
                    Pregnancies:
                  </Grid>
                  <Grid item xs={12} sm={3} className="field-value">
                    {patient.pregnancies}
                  </Grid>
                  {/* Row 3: Births / Miscarriages */}
                  <Grid item xs={12} sm={3} className="field-label">
                    Births:
                  </Grid>
                  <Grid item xs={12} sm={3} className="field-value">
                    {patient.births}
                  </Grid>
                  <Grid item xs={12} sm={3} className="field-label">
                    Miscarriages:
                  </Grid>
                  <Grid item xs={12} sm={3} className="field-value">
                    {patient.miscarriages}
                  </Grid>
                  {/* Row 4: Abortions / Leakage of Urine */}
                  <Grid item xs={12} sm={3} className="field-label">
                    Abortions:
                  </Grid>
                  <Grid item xs={12} sm={3} className="field-value">
                    {patient.abortions}
                  </Grid>
                  <Grid item xs={12} sm={3} className="field-label">
                    Leakage of Urine:
                  </Grid>
                  <Grid item xs={12} sm={3} className="field-value">
                    {patient.leakageOfUrine}
                  </Grid>
                  {/* Row 5: If leakage is yes */}
                  {patient.leakageOfUrine === "yes" && (
                    <>
                      <Grid item xs={12} sm={3} className="field-label">
                        Leakage Description:
                      </Grid>
                      <Grid item xs={12} sm={3} className="field-value">
                        {patient.leakageDescription}
                      </Grid>
                    </>
                  )}
                  {/* Row 6: Pelvic Pain */}
                  <Grid item xs={12} sm={3} className="field-label">
                    Pelvic Pain:
                  </Grid>
                  <Grid item xs={12} sm={3} className="field-value">
                    {patient.pelvicPain}
                  </Grid>
                  {patient.pelvicPain === "yes" && (
                    <>
                      <Grid item xs={12} sm={3} className="field-label">
                        Pelvic Description:
                      </Grid>
                      <Grid item xs={12} sm={3} className="field-value">
                        {patient.pelvicDescription}
                      </Grid>
                    </>
                  )}
                  {/* Row 7: Abnormal Discharge */}
                  <Grid item xs={12} sm={3} className="field-label">
                    Abnormal Discharge:
                  </Grid>
                  <Grid item xs={12} sm={3} className="field-value">
                    {patient.abnormalDischarge}
                  </Grid>
                  {patient.abnormalDischarge === "yes" && (
                    <>
                      <Grid item xs={12} sm={3} className="field-label">
                        Abnormal Discharge Description:
                      </Grid>
                      <Grid item xs={12} sm={3} className="field-value">
                        {patient.abnormalDischargeDescription}
                      </Grid>
                    </>
                  )}
                  {/* Row 8: Abnormal Pap Smear */}
                  <Grid item xs={12} sm={3} className="field-label">
                    Abnormal Pap Smear:
                  </Grid>
                  <Grid item xs={12} sm={3} className="field-value">
                    {patient.abnormalPapSmear}
                  </Grid>
                  {patient.abnormalPapSmear === "yes" && (
                    <>
                      <Grid item xs={12} sm={3} className="field-label">
                        Abnormal Pap Smear Description:
                      </Grid>
                      <Grid item xs={12} sm={3} className="field-value">
                        {patient.abnormalPapSmearDescription}
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default PatientDetails;
