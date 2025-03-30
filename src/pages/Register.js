// src/pages/Register.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  // Updated state: adding adharcard
  const [formData, setFormData] = useState({
    adharcard: "",
    age: "",
    medicalHistory: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Updated change handler: handle adharcard input as well
  const handleChange = (e) => {
    const { name, value } = e.target;
    // For adharcard, allow only numbers and limit to 12 digits
    if (name === "adharcard") {
      const numericValue = value.replace(/\D/g, "").slice(0, 12);
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Optionally, validate that adharcard is exactly 12 digits
    if (formData.adharcard.length !== 12) {
      setError("Adharcard must be exactly 12 digits.");
      return;
    }
    axios
      .post("https://hospital-qn5w.onrender.com/api/register", formData)
      .then((res) => {
        // Assuming response.redirect contains the URL to go to
        navigate(res.data.redirect);
      })
      .catch((err) => {
        console.error(err);
        setError("Registration failed. Please try again.");
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Register Patient</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Adharcard Number: </label>
          <input
            name="adharcard"
            type="text"
            value={formData.adharcard}
            onChange={handleChange}
            placeholder="Enter 12-digit Adharcard"
            required
          />
        </div>
        <div>
          <label>Age: </label>
          <input
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Medical History: </label>
          <textarea
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
