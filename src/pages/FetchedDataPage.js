import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  ListItem,
  ListItemButton,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../components/Sidebar";
import "../styles/FetchedDataPage.css";

const defaultPhoto = "https://via.placeholder.com/40";

const FetchedDataPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract "adharcard" from query parameters if present
    const params = new URLSearchParams(location.search);
    const adharcard = params.get("adharcard");
    if (adharcard) {
      setSearchQuery(adharcard);
    }
    fetchPatients();
  }, [location.search]);

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

  // Filter patients based on adharcard and other fields
  const filteredPatients = patients.filter((patient) => {
    const adhar = patient.adharcard ? patient.adharcard : "";
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const phone = patient.phone;
    const city = patient.city ? patient.city.toLowerCase() : "";
    const gender = patient.gender ? patient.gender.toLowerCase() : "";
    const query = searchQuery.toLowerCase().trim();

    return (
      adhar.includes(query) ||
      fullName.includes(query) ||
      phone.includes(query) ||
      city.includes(query) ||
      gender.includes(query)
    );
  });

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Sidebar />
      <Box className="fetched-content">
        <AppBar
          position="fixed"
          sx={{ backgroundColor: "#1976d2", zIndex: 1300 }}
        >
          <Toolbar>
            <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Patients Data
            </Typography>
          </Toolbar>
        </AppBar>
        <Box className="fetched-header">
          <Typography variant="h6" className="fetched-title">
            List of Registered Patients
          </Typography>
          <TextField
            placeholder="Search by Adharcard..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              navigate(`?adharcard=${encodeURIComponent(e.target.value)}`);
            }}
            size="small"
            sx={{ width: "250px" }}
          />
          <Button onClick={fetchPatients}>Refresh</Button>
        </Box>
        <Box className="fetched-list-container">
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography>{error}</Typography>}
          {!loading && !error && (
            <Paper className="fetched-paper">
              {filteredPatients.length === 0 ? (
                <Typography>No patients found.</Typography>
              ) : (
                filteredPatients.map((patient, index) => (
                  <ListItem key={patient._id} disablePadding>
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
                        <Typography variant="body2" sx={{ width: "30px" }}>
                          {index + 1}.
                        </Typography>
                        <img
                          src={patient.photo ? patient.photo : defaultPhoto}
                          alt="User"
                          style={{ width: 40, height: 40, borderRadius: "50%" }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ flexGrow: 1, textAlign: "center" }}
                        >
                          {patient.firstName} {patient.lastName}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ width: "150px", textAlign: "center" }}
                        >
                          +91 {patient.phone}
                        </Typography>
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
                        <Typography
                          variant="body2"
                          sx={{ width: "80px", textAlign: "center" }}
                        >
                          {patient.gender}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            width: "150px",
                            textAlign: "center",
                            color: "#333",
                            fontSize: "14px",
                          }}
                        >
                          {patient.adharcard}
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
