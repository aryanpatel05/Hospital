// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PatientDetails from "./pages/PatientDetails";
import FetchedDataPage from "./pages/FetchedDataPage";
import Register from "./pages/Register";
import DetailsPage from "./pages/DetailsPage";
import NotFound from "../src/components/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patient/:id" element={<PatientDetails />} />
        <Route path="details" element={<DetailsPage />} />
        <Route path="/patients" element={<FetchedDataPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
