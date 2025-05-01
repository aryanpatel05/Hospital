// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your page components
import Dashboard from "./pages/Dashboard"; // Assuming this is your main dashboard/home
import PatientDetails from "./pages/PatientDetails"; // Page to view patient details
import FetchedDataPage from "./pages/FetchedDataPage"; // Page to list patients
import Register from "./pages/Register"; // Page for new patient registration
import DetailsPage from "./pages/DetailsPage"; // Your existing DetailsPage
import EditPatientPage from "./pages/EditPatientPage"; // *** IMPORT THE NEW EDIT PAGE ***
import NotFound from "../src/components/NotFound"; // Your existing NotFound component

function App() {
  return (
    <Router>
      <Routes>
        {/* Existing Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/details" element={<DetailsPage />} />
        <Route path="/patients" element={<FetchedDataPage />} />
        <Route path="/register" element={<Register />} />

        {/* Patient Specific Routes */}
        {/* Route to VIEW details */}
        <Route path="/patient/:id" element={<PatientDetails />} />
        {/* Route to EDIT details *** THIS IS THE NEWLY ADDED ROUTE *** */}
        <Route path="/patient/:id/edit" element={<EditPatientPage />} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
