// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const startFaceScan = () => API.get("/start-scan");
export const getPatientDetails = (id) => API.get(`/patient/${id}`);
export const registerPatient = (patientData) =>
  API.post("/register", patientData);
