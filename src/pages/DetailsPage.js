// src/pages/DetailsPage.js
import React from "react";
import PatientHistoryForm from "./PatientHistoryForm";
import { useNavigate } from "react-router-dom";

const DetailsPage = () => {
  const navigate = useNavigate();

  // When the dialog closes, navigate back
  const handleClose = () => {
    navigate(-1);
  };

  return <PatientHistoryForm open={true} onClose={handleClose} />;
};

export default DetailsPage;
