// src/pages/FetchedDataPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import "../styles/FetchedDataPage.css";

const defaultPhoto = "https://via.placeholder.com/40";

const FetchedDataPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPatients = () => {
      axios
        .get("https://hospital-qn5w.onrender.com/api/patients")
        .then((res) => {
          setPatients(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Error fetching patients.");
          setLoading(false);
        });
    };

    fetchPatients();
    const intervalId = setInterval(fetchPatients, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Filter patients based on search query (case-insensitive)
  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const phone = patient.phone;
    const city = patient.city ? patient.city.toLowerCase() : "";
    const gender = patient.gender ? patient.gender.toLowerCase() : "";
    const query = searchQuery.toLowerCase();

    return (
      fullName.includes(query) ||
      phone.includes(query) ||
      city.includes(query) ||
      gender.includes(query)
    );
  });

  // Sidebar "Details" callback
  const handleDetailsClick = () => {
    navigate("/details");
  };

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      {/* Pass the onDetailsClick prop to Sidebar */}
      <Sidebar onDetailsClick={handleDetailsClick} />
      <Box className="fetched-content">
        <AppBar position="fixed" className="fetched-appbar">
          <Toolbar>
            <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Patients Data
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Sticky Header with Title and Search Bar */}
        <Box className="fetched-header">
          <Typography variant="h6" className="fetched-title">
            List of Registered Patients
          </Typography>
          <TextField
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ width: "250px" }}
          />
        </Box>

        {/* Scrollable List */}
        <Box className="fetched-list-container">
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography>{error}</Typography>}
          {!loading && !error && (
            <Paper className="fetched-paper">
              {filteredPatients.length === 0 ? (
                <Typography>No patients found.</Typography>
              ) : (
                filteredPatients.map((patient, index) => (
                  <ListItem
                    key={patient._id}
                    className="fetched-list-item"
                    disablePadding
                  >
                    <ListItemButton
                      onClick={() => navigate(`/patient/${patient._id}`)}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          gap: "16px",
                        }}
                      >
                        {/* Index number */}
                        <Typography variant="body2" sx={{ width: "30px" }}>
                          {index + 1}.
                        </Typography>
                        {/* User Photo */}
                        <img
                          src={patient.photo ? patient.photo : defaultPhoto}
                          alt="User"
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                          }}
                        />
                        {/* Patient Name */}
                        <Typography
                          variant="body2"
                          sx={{ flexGrow: 1, textAlign: "center" }}
                        >
                          {patient.firstName} {patient.lastName}
                        </Typography>
                        {/* Mobile Number */}
                        <Typography
                          variant="body2"
                          sx={{ width: "150px", textAlign: "center" }}
                        >
                          +91 {patient.phone}
                        </Typography>
                        {/* City */}
                        <Typography
                          variant="body2"
                          sx={{
                            width: "150px",
                            textAlign: "center",
                            color: "#555",
                            fontSize: "14px",
                          }}
                        >
                          {patient.city ? patient.city : "N/A"}
                        </Typography>
                        {/* Gender */}
                        <Typography
                          variant="body2"
                          sx={{ width: "80px", textAlign: "center" }}
                        >
                          {patient.gender}
                        </Typography>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                ))
              )}
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FetchedDataPage;
