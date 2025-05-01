// src/pages/EditPatientPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Alert,
  Divider,
} from "@mui/material";

// Helper to safely get string value for form fields, handling 0 correctly
const getFormValue = (value) => {
  if (value === null || value === undefined) return "";
  return String(value);
};

// Helper to convert DB value (string 'yes'/'no'/'na' or boolean/null) to form value ('yes'/'no'/'na')
const toFormBooleanString = (value) => {
  if (value === true || String(value).toLowerCase() === "yes") return "yes";
  if (value === false || String(value).toLowerCase() === "no") return "no";
  // Treat null, undefined, 'na', or anything else as 'na' for the form default
  return "na";
};

// Helper to handle Array <-> Comma-separated String
const arrayToString = (arr) => (Array.isArray(arr) ? arr.join(", ") : "");
const stringToArray = (str) =>
  typeof str === "string" && str.trim() !== ""
    ? str
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const EditPatientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null); // Start with null to indicate not loaded
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Fetch Patient Data ---
  useEffect(() => {
    setLoading(true);
    setError("");
    axios
      .get(`https://hospital-qn5w.onrender.com/api/patient/${id}`)
      .then((res) => {
        const patientData = res.data;
        // Prepare data for the form
        setFormData({
          firstName: getFormValue(patientData.firstName),
          lastName: getFormValue(patientData.lastName),
          phone: getFormValue(patientData.phone),
          city: getFormValue(patientData.city),
          occupation: getFormValue(patientData.occupation),
          maritalStatus: getFormValue(patientData.maritalStatus),
          spouseName: getFormValue(patientData.spouseName),
          age: getFormValue(patientData.age),
          gender: getFormValue(patientData.gender),
          birthDate: getFormValue(patientData.birthDate),
          allergic: patientData.allergic === true, // Convert to boolean for Checkbox
          allergies: getFormValue(patientData.allergies), // Use string from DB directly if it's stored as string
          medicalHistory: arrayToString(patientData.medicalHistory), // Convert array to string
          // Women's Health
          periodType: getFormValue(patientData.periodType),
          stillHavingPeriods: toFormBooleanString(
            patientData.stillHavingPeriods
          ), // Convert to 'yes'/'no'/'na'
          difficultyWithPeriods: getFormValue(
            patientData.difficultyWithPeriods
          ),
          pregnancies: getFormValue(patientData.pregnancies), // Keep as string for TextField
          births: getFormValue(patientData.births),
          miscarriages: getFormValue(patientData.miscarriages),
          abortions: getFormValue(patientData.abortions),
          leakageOfUrine: toFormBooleanString(patientData.leakageOfUrine), // Convert to 'yes'/'no'/'na'
          leakageDescription: getFormValue(patientData.leakageDescription),
          pelvicPain: toFormBooleanString(patientData.pelvicPain), // Convert to 'yes'/'no'/'na'
          pelvicDescription: getFormValue(patientData.pelvicDescription),
          abnormalDischarge: toFormBooleanString(patientData.abnormalDischarge), // Convert to 'yes'/'no'/'na'
          abnormalDischargeDescription: getFormValue(
            patientData.abnormalDischargeDescription
          ),
          abnormalPapSmear: toFormBooleanString(patientData.abnormalPapSmear), // Convert to 'yes'/'no'/'na'
          abnormalPapSmearDescription: getFormValue(
            patientData.abnormalPapSmearDescription
          ),
          photo: getFormValue(patientData.photo),
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching patient details for edit:", err);
        let errorMsg = "Failed to load patient data.";
        if (err.response) {
          errorMsg = `Error ${err.response.status}: ${
            err.response.data?.message || "Could not fetch data"
          }`;
        } else if (err.request) {
          errorMsg = "Network error. Please check your connection.";
        }
        setError(errorMsg);
        setLoading(false);
      });
  }, [id]);

  // --- Handle Form Input Changes ---
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear submit messages on input change
    if (submitError) setSubmitError("");
    if (submitSuccess) setSubmitSuccess("");
  };

  // --- Handle Form Submission ---
  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    setIsSubmitting(true);

    // --- Prepare data for backend ---
    const dataToSend = {
      ...formData,
      // Convert types back for the API/DB Schema
      age: Number(formData.age) || 0, // Ensure number, default 0 if invalid/empty
      allergic: formData.allergic, // Boolean from checkbox is fine
      medicalHistory: stringToArray(formData.medicalHistory), // String to array
      // Keep 'yes'/'no'/'na' as strings for fields stored as String in schema
      stillHavingPeriods: formData.stillHavingPeriods,
      leakageOfUrine: formData.leakageOfUrine,
      pelvicPain: formData.pelvicPain,
      abnormalDischarge: formData.abnormalDischarge,
      abnormalPapSmear: formData.abnormalPapSmear,
      // Convert numbers - handle potential non-female cases
      pregnancies:
        formData.gender?.toLowerCase() === "female"
          ? Number(formData.pregnancies) || 0
          : undefined,
      births:
        formData.gender?.toLowerCase() === "female"
          ? Number(formData.births) || 0
          : undefined,
      miscarriages:
        formData.gender?.toLowerCase() === "female"
          ? Number(formData.miscarriages) || 0
          : undefined,
      abortions:
        formData.gender?.toLowerCase() === "female"
          ? Number(formData.abortions) || 0
          : undefined,

      // Ensure descriptions are only sent if the answer is 'yes', otherwise send empty string or null
      leakageDescription:
        formData.leakageOfUrine === "yes" ? formData.leakageDescription : "",
      pelvicDescription:
        formData.pelvicPain === "yes" ? formData.pelvicDescription : "",
      abnormalDischargeDescription:
        formData.abnormalDischarge === "yes"
          ? formData.abnormalDischargeDescription
          : "",
      abnormalPapSmearDescription:
        formData.abnormalPapSmear === "yes"
          ? formData.abnormalPapSmearDescription
          : "",
    };

    // Explicitly remove women's health fields if gender is not 'female' before sending
    if (formData.gender?.toLowerCase() !== "female") {
      delete dataToSend.periodType;
      delete dataToSend.stillHavingPeriods;
      delete dataToSend.difficultyWithPeriods;
      delete dataToSend.pregnancies;
      delete dataToSend.births;
      delete dataToSend.miscarriages;
      delete dataToSend.abortions;
      // Optionally reset gynae question flags and descriptions as well
      // dataToSend.leakageOfUrine = 'na'; // or null
      // dataToSend.pelvicPain = 'na';
      // dataToSend.abnormalDischarge = 'na';
      // dataToSend.abnormalPapSmear = 'na';
      dataToSend.leakageDescription = "";
      dataToSend.pelvicDescription = "";
      dataToSend.abnormalDischargeDescription = "";
      dataToSend.abnormalPapSmearDescription = "";
    }

    console.log("Submitting data to PUT /api/patient/:id :", dataToSend);

    axios
      .put(`https://hospital-qn5w.onrender.com/api/patient/${id}`, dataToSend)
      .then((res) => {
        console.log("Update successful:", res.data);
        setSubmitSuccess("Patient details updated successfully!");
        setIsSubmitting(false);
        // Navigate back to details page after a short delay
        setTimeout(() => navigate(`/patient/${id}`), 1500);
      })
      .catch((err) => {
        console.error("Error updating patient:", err.response || err);
        let errorMsg = "Failed to update patient details.";
        if (err.response && err.response.data) {
          // Use backend message if available
          if (typeof err.response.data.message === "string") {
            errorMsg = err.response.data.message;
          }
          // Append validation errors if they exist
          if (Array.isArray(err.response.data.errors)) {
            errorMsg += ` Details: ${err.response.data.errors.join(". ")}`;
          }
        } else if (err.request) {
          errorMsg = "Network Error: Could not reach server.";
        }
        setSubmitError(errorMsg);
        setIsSubmitting(false);
      });
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          p: 2,
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>
          Loading patient data for editing...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: { xs: 2, sm: 5 }, textAlign: "center" }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => navigate(`/patient/${id}`)}
        >
          Back to Details
        </Button>
        <Button
          variant="outlined"
          sx={{ mt: 2, ml: 1 }}
          onClick={() => window.location.reload()}
        >
          Reload Edit Page
        </Button>
      </Box>
    );
  }

  if (!formData) {
    // Fallback if data isn't loaded for some reason
    return (
      <Typography sx={{ p: 3, textAlign: "center" }}>
        Could not load form data.
      </Typography>
    );
  }

  // Determine if gender is female for conditional rendering
  const isFemale = formData.gender?.toLowerCase() === "female";

  return (
    <Box sx={{ maxWidth: 900, margin: "20px auto", p: { xs: 1, sm: 2 } }}>
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{ mb: 3, textAlign: "center" }}
        >
          Edit Patient Details
        </Typography>

        {/* Display Submission Status */}
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {submitSuccess}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* --- Personal Information Section --- */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{ borderBottom: 1, borderColor: "divider", pb: 1, mb: 2 }}
          >
            Personal Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Fields: firstName, lastName, phone, city, occupation, maritalStatus, spouseName, age, gender, birthDate, photo */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Phone (+91)"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="city"
                label="City"
                value={formData.city}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="occupation"
                label="Occupation"
                value={formData.occupation}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="marital-status-label">
                  Marital Status
                </InputLabel>
                <Select
                  labelId="marital-status-label"
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  label="Marital Status"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Married">Married</MenuItem>
                  <MenuItem value="Divorced">Divorced</MenuItem>
                  <MenuItem value="Widowed">Widowed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="spouseName"
                label="Spouse Name"
                value={formData.spouseName}
                onChange={handleChange}
                fullWidth
                required={formData.maritalStatus === "Married"}
                disabled={formData.maritalStatus !== "Married"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="age"
                label="Age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  name="gender"
                  value={formData.gender}
                  label="Gender"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="birthDate"
                label="Birth Date"
                value={formData.birthDate}
                onChange={handleChange}
                fullWidth
                required
                placeholder="YYYY-MM-DD or DD/MM/YYYY"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="photo"
                label="Photo URL"
                value={formData.photo}
                onChange={handleChange}
                fullWidth
                helperText="Optional: URL of the patient's photo."
              />
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />

          {/* --- Allergy Information --- */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{ borderBottom: 1, borderColor: "divider", pb: 1, mb: 2 }}
          >
            Allergy Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="allergic"
                    checked={formData.allergic}
                    onChange={handleChange}
                  />
                }
                label="Any Known Allergies?"
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                name="allergies"
                label="List Allergies (comma-separated)"
                value={formData.allergies}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                disabled={!formData.allergic}
                required={formData.allergic}
                placeholder={
                  formData.allergic ? "e.g. Penicillin, Peanuts, Latex" : ""
                }
                helperText={
                  !formData.allergic
                    ? "Enable checkbox to list allergies"
                    : "Required if checkbox is enabled"
                }
              />
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />

          {/* --- Medical History --- */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{ borderBottom: 1, borderColor: "divider", pb: 1, mb: 2 }}
          >
            Medical History
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField
                name="medicalHistory"
                label="Significant Medical History (comma-separated)"
                value={formData.medicalHistory}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                placeholder="e.g., Hypertension, Diabetes Type 2, Asthma, Previous Surgeries"
              />
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />

          {/* --- Women's Health (Conditional Rendering) --- */}
          {isFemale ? (
            <>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ borderBottom: 1, borderColor: "divider", pb: 1, mb: 2 }}
              >
                Women's Health
              </Typography>
              {/* Menstrual Info */}
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ mt: 1, mb: 1, fontWeight: 500 }}
              >
                Menstrual & Reproductive
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth required>
                    <InputLabel id="period-type-label">Period Type</InputLabel>
                    <Select
                      labelId="period-type-label"
                      name="periodType"
                      value={formData.periodType}
                      label="Period Type"
                      onChange={handleChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Regular">Regular</MenuItem>
                      <MenuItem value="Irregular">Irregular</MenuItem>
                      <MenuItem value="Painful">Painful</MenuItem>
                      <MenuItem value="Heavy">Heavy</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                      <MenuItem value="N/A">
                        N/A (Post-Menopause/Hysterectomy/Etc)
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl component="fieldset" required>
                    <Typography
                      component="legend"
                      variant="caption"
                      sx={{ mb: -0.5 }}
                    >
                      Still Having Periods?
                    </Typography>
                    <RadioGroup
                      row
                      name="stillHavingPeriods"
                      value={formData.stillHavingPeriods}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio size="small" />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio size="small" />}
                        label="No"
                      />
                      <FormControlLabel
                        value="na"
                        control={<Radio size="small" />}
                        label="N/A"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="difficultyWithPeriods"
                    label="Difficulty w/ Periods (Details)"
                    value={formData.difficultyWithPeriods}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                {/* Reproductive History Numbers */}
                <Grid item xs={6} sm={3}>
                  {" "}
                  <TextField
                    name="pregnancies"
                    label="Pregnancies #"
                    type="number"
                    value={formData.pregnancies}
                    onChange={handleChange}
                    fullWidth
                    required
                    inputProps={{ min: 0 }}
                  />{" "}
                </Grid>
                <Grid item xs={6} sm={3}>
                  {" "}
                  <TextField
                    name="births"
                    label="Births #"
                    type="number"
                    value={formData.births}
                    onChange={handleChange}
                    fullWidth
                    required
                    inputProps={{ min: 0 }}
                  />{" "}
                </Grid>
                <Grid item xs={6} sm={3}>
                  {" "}
                  <TextField
                    name="miscarriages"
                    label="Miscarriages #"
                    type="number"
                    value={formData.miscarriages}
                    onChange={handleChange}
                    fullWidth
                    required
                    inputProps={{ min: 0 }}
                  />{" "}
                </Grid>
                <Grid item xs={6} sm={3}>
                  {" "}
                  <TextField
                    name="abortions"
                    label="Abortions #"
                    type="number"
                    value={formData.abortions}
                    onChange={handleChange}
                    fullWidth
                    required
                    inputProps={{ min: 0 }}
                  />{" "}
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />

              {/* Gynae Questions */}
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ mt: 1, mb: 1, fontWeight: 500 }}
              >
                Gynecological Symptoms
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {/* Shared function to render Yes/No/NA + Description */}
                {[
                  {
                    name: "leakageOfUrine",
                    label: "Leakage of Urine?",
                    descName: "leakageDescription",
                    descLabel: "Leakage Description",
                  },
                  {
                    name: "pelvicPain",
                    label: "Pelvic Pain?",
                    descName: "pelvicDescription",
                    descLabel: "Pelvic Pain Description",
                  },
                  {
                    name: "abnormalDischarge",
                    label: "Abnormal Discharge?",
                    descName: "abnormalDischargeDescription",
                    descLabel: "Discharge Description",
                  },
                  {
                    name: "abnormalPapSmear",
                    label: "Abnormal Pap Smear?",
                    descName: "abnormalPapSmearDescription",
                    descLabel: "Pap Smear Description",
                  },
                ].map((field) => (
                  <Grid item xs={12} sm={6} key={field.name}>
                    <FormControl component="fieldset" required>
                      <Typography
                        component="legend"
                        variant="caption"
                        sx={{ mb: -0.5 }}
                      >
                        {field.label}
                      </Typography>
                      <RadioGroup
                        row
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                      >
                        <FormControlLabel
                          value="yes"
                          control={<Radio size="small" />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio size="small" />}
                          label="No"
                        />
                        <FormControlLabel
                          value="na"
                          control={<Radio size="small" />}
                          label="N/A"
                        />
                      </RadioGroup>
                    </FormControl>
                    <TextField
                      name={field.descName}
                      label={field.descLabel}
                      value={formData[field.descName]}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={1}
                      disabled={formData[field.name] !== "yes"}
                      required={formData[field.name] === "yes"}
                      sx={{ mt: 1 }}
                    />
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{ my: 3 }} />
            </>
          ) : (
            // Optional: Show a placeholder or nothing if not female
            <Box sx={{ mb: 3 }}></Box>
          )}

          {/* --- Submit/Cancel Buttons --- */}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate(`/patient/${id}`)} // Navigate back to details
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || !!submitSuccess} // Disable if processing or already succeeded
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditPatientPage;
