import React, { useState } from "react";
import "../styles/Dashboard.css"; // Import the external CSS
import Calendar from "../components/Calendar";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Grid,
  Card,
  Paper,
} from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../components/Sidebar";

// Icons for each card
import LocalHotelIcon from "@mui/icons-material/LocalHotel";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import GroupsIcon from "@mui/icons-material/Groups";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// Import the PatientHistoryForm
import PatientHistoryForm from "../pages/PatientHistoryForm";

const Dashboard = () => {
  // States
  const [doctorName, setDoctorName] = useState(null);
  const [patientsWaiting, setPatientsWaiting] = useState(null);
  const [stats, setStats] = useState(null);

  // State to control showing/hiding the patient history form
  const [showHistoryForm, setShowHistoryForm] = useState(false);

  // Render a placeholder bar chart with CSS classes
  const renderBarChart = () => (
    <div className="bar-chart">
      <div className="bar small" />
      <div className="bar medium" />
      <div className="bar tiny" />
      <div className="bar large" />
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Top Bar */}
      <AppBar position="fixed" className="app-bar">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left side: App logo/name + menu icon */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              {/* <MenuIcon /> */}
            </IconButton>
            <div class="MuiToolbar-root MuiToolbar-gutters MuiToolbar-regular css-awgou1">
              <div class="Title">Medicare</div>
            </div>
          </Box>
          {/* Greeting & Info */}
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="subtitle2" component="div">
              Good Morning, {doctorName ? doctorName : "Data not available"}!
            </Typography>
            <Typography variant="subtitle2" component="div">
              Here is the hospital dashboard. There are{" "}
              {patientsWaiting !== null
                ? patientsWaiting
                : "Data not available"}{" "}
              patients waiting for you today.
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Component */}
      <Sidebar onDetailsClick={() => setShowHistoryForm(true)} />

      {/* Main Content Area */}
      <div className="main-content">
        {/* This spacer accounts for the AppBar’s height */}
        <div className="toolbar-spacer" />

        {/* Stats Cards */}
        <Grid container spacing={2} className="stats-grid">
          {/* Beds Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined" className="stats-card">
              <div className="stats-card-header">
                <div className="stats-card-title">
                  <LocalHotelIcon className="stats-card-icon" />
                  <Typography variant="subtitle1" className="stats-card-text">
                    Beds
                  </Typography>
                </div>
                <ArrowForwardIosIcon
                  className="stats-card-arrow"
                  fontSize="10px"
                />
              </div>
              <hr />
              <div className="Wrapp">
                <div className="stats-card-body">
                  <Typography className="stats-card-number">
                    {stats && stats.beds !== undefined
                      ? stats.beds
                      : "Data not available"}
                  </Typography>
                  <Typography variant="body2" className="stats-card-subtitle">
                    Available hospital beds
                  </Typography>
                </div>
                {renderBarChart()}
              </div>
            </Card>
          </Grid>

          {/* Doctors Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined" className="stats-card">
              <div className="stats-card-header">
                <div className="stats-card-title">
                  <MedicalServicesIcon className="stats-card-icon" />
                  <Typography variant="subtitle1" className="stats-card-text">
                    Doctors
                  </Typography>
                </div>
                <ArrowForwardIosIcon
                  className="stats-card-arrow"
                  fontSize="10px"
                />
              </div>
              <hr />
              <div className="Wrapp">
                <div className="stats-card-body">
                  <Typography className="stats-card-number">
                    {stats && stats.doctors !== undefined
                      ? stats.doctors
                      : "Data not available"}
                  </Typography>
                  <Typography variant="body2" className="stats-card-subtitle">
                    Available doctors
                  </Typography>
                </div>
                {renderBarChart()}
              </div>
            </Card>
          </Grid>

          {/* Staff Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined" className="stats-card">
              <div className="stats-card-header">
                <div className="stats-card-title">
                  <GroupsIcon className="stats-card-icon" />
                  <Typography variant="subtitle1" className="stats-card-text">
                    Staff
                  </Typography>
                </div>
                <ArrowForwardIosIcon
                  className="stats-card-arrow"
                  fontSize="10px"
                />
              </div>
              <hr />
              <div className="Wrapp">
                <div className="stats-card-body">
                  <Typography className="stats-card-number">
                    {stats && stats.staff !== undefined
                      ? stats.staff
                      : "Data not available"}
                  </Typography>
                  <Typography variant="body2" className="stats-card-subtitle">
                    Available staff
                  </Typography>
                </div>
                {renderBarChart()}
              </div>
            </Card>
          </Grid>
        </Grid>

        {/* Patient Table & Calendar Side-by-Side */}
        <Grid container spacing={2}>
          {/* Left Column: Patient Table & Schedule */}
          <Grid item xs={12} md={8}>
            {/* Patient Table Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">Patient</Typography>
              <Paper sx={{ mt: 2, p: 2 }}>
                <Typography variant="body2">
                  [Placeholder for a patient table or list component]
                </Typography>
              </Paper>
            </Box>

            {/* Schedule Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">Schedule</Typography>
              <Paper sx={{ mt: 2, p: 2 }}>
                <Typography variant="body2">
                  [Placeholder for schedule or timeline]
                </Typography>
              </Paper>
            </Box>
          </Grid>

          {/* Right Column: Calendar */}
          <Grid item xs={12} md={2}>
            <Box sx={{ mt: 4 }}>
              <Calendar />
            </Box>
          </Grid>
        </Grid>
      </div>

      {/* Patient History Form (Modal) */}
      <PatientHistoryForm
        open={showHistoryForm}
        onClose={() => setShowHistoryForm(false)}
      />
    </div>
  );
};

export default Dashboard;
