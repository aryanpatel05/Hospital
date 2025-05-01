// src/pages/PatientHistoryForm.js
import React, { useState } from "react";
import axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";
import DeleteIcon from "@mui/icons-material/Delete";
import "../styles/PatientHistoryForm.css"; // Ensure this path is correct
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Grid,
  RadioGroup,
  Radio,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";

// Helper function to calculate age from birth date
const calculateAge = (birthDate) => {
  const today = new Date();
  const dob = new Date(birthDate);
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age > 0 ? age : 0; // Ensure age is not negative
};

// List of Indian cities (keep as is)
const indianCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Ahmedabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Meerut",
  "Rajkot",
  "Kalyan-Dombivli",
  "Varanasi",
  "Srinagar",
];

const PatientHistoryForm = ({ open, onClose }) => {
  // Basic patient info states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [spouseName, setSpouseName] = useState("");
  const [city, setCity] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [allergic, setAllergic] = useState(false);
  const [allergies, setAllergies] = useState("");
  const [medicalHistory, setMedicalHistory] = useState([]);

  // Photo upload state
  const [photo, setPhoto] = useState(""); // Base64 string or empty

  // Women-only fields
  const [periodType, setPeriodType] = useState("");
  const [stillHavingPeriods, setStillHavingPeriods] = useState("yes"); // Default might be better as 'yes' or ''
  const [difficultyWithPeriods, setDifficultyWithPeriods] = useState("");
  const [pregnancies, setPregnancies] = useState("");
  // REMOVED: births, otherBirths states
  const [miscarriages, setMiscarriages] = useState("");
  const [abortions, setAbortions] = useState("");
  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [ageOnset, setAgeOnset] = useState(""); // Added state for Age Onset

  // Description fields for women-only section
  const [leakageOfUrine, setLeakageOfUrine] = useState("no");
  const [leakageDescription, setLeakageDescription] = useState("");
  const [pelvicPain, setPelvicPain] = useState("no");
  const [pelvicDescription, setPelvicDescription] = useState("");
  const [abnormalDischarge, setAbnormalDischarge] = useState("no");
  const [abnormalDischargeDescription, setAbnormalDischargeDescription] =
    useState("");
  const [abnormalPapSmear, setAbnormalPapSmear] = useState("no");
  const [abnormalPapSmearDescription, setAbnormalPapSmearDescription] =
    useState("");

  // Reset function to clear form fields
  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setPhone("");
    setOccupation("");
    setMaritalStatus("");
    setSpouseName("");
    setCity("");
    setAge("");
    setGender("");
    setBirthDate("");
    setAllergic(false);
    setAllergies("");
    setMedicalHistory([]);
    setPhoto("");
    setPeriodType("");
    setStillHavingPeriods("yes"); // Reset to default
    setDifficultyWithPeriods("");
    setPregnancies("");
    // REMOVED: setBirths(""), setOtherBirths("")
    setMiscarriages("");
    setAbortions("");
    setLastPeriodDate("");
    setAgeOnset(""); // Reset age onset
    setLeakageOfUrine("no");
    setLeakageDescription("");
    setPelvicPain("no");
    setPelvicDescription("");
    setAbnormalDischarge("no");
    setAbnormalDischargeDescription("");
    setAbnormalPapSmear("no");
    setAbnormalPapSmearDescription("");
  };

  // Front-end validation for required fields
  const validateForm = () => {
    const requiredFields = [
      { field: firstName, name: "First Name" },
      { field: lastName, name: "Last Name" },
      { field: phone, name: "Phone" },
      { field: occupation, name: "Occupation" },
      { field: maritalStatus, name: "Marital Status" },
      { field: spouseName, name: "Spouse Name" }, // Often not required if unmarried? Consider logic.
      { field: city, name: "City" },
      { field: age, name: "Age" },
      { field: gender, name: "Gender" },
      { field: birthDate, name: "Birth Date" },
    ];

    for (let { field, name } of requiredFields) {
      // Check for null, undefined, and empty string
      if (field === null || field === undefined || field === "") {
        window.alert(`Please fill the ${name} field.`);
        return false;
      }
    }

    if (gender === "female") {
      const womenRequired = [
        { field: ageOnset, name: "Age onset" }, // Added age onset validation
        { field: periodType, name: "Period Type" },
        { field: stillHavingPeriods, name: "Still having periods" },
        // Add lastPeriodDate only if stillHavingPeriods is 'yes'?
        // { field: lastPeriodDate, name: "Date of last period" }, // Consider making conditional
        { field: difficultyWithPeriods, name: "Difficulty with periods" },
        { field: pregnancies, name: "Pregnancies" },
        // REMOVED: { field: births, name: "Births" },
        { field: miscarriages, name: "Miscarriages" },
        { field: abortions, name: "Abortions" },
        { field: leakageOfUrine, name: "Leakage of urine" },
        { field: pelvicPain, name: "Pelvic pain" },
        { field: abnormalDischarge, name: "Abnormal discharge" },
        { field: abnormalPapSmear, name: "Abnormal Pap Smear" },
      ];
      for (let { field, name } of womenRequired) {
        // Check for null, undefined, and empty string (important for dropdowns/numbers)
        if (field === null || field === undefined || field === "") {
          window.alert(`Please fill the ${name} field.`);
          return false;
        }
      }
      // Additional check for conditional descriptions
      if (leakageOfUrine === "yes" && !leakageDescription) {
        window.alert("Please describe the leakage of urine.");
        return false;
      }
      if (pelvicPain === "yes" && !pelvicDescription) {
        window.alert("Please describe the pelvic pain.");
        return false;
      }
      if (abnormalDischarge === "yes" && !abnormalDischargeDescription) {
        window.alert("Please describe the abnormal discharge.");
        return false;
      }
      if (abnormalPapSmear === "yes" && !abnormalPapSmearDescription) {
        window.alert("Please describe the abnormal Pap Smear.");
        return false;
      }
    }
    return true;
  };

  // handleMedicalHistoryChange (keep as is)
  const handleMedicalHistoryChange = (event, condition) => {
    const isChecked = event.target.checked;
    setMedicalHistory((prevHistory) => {
      if (isChecked) {
        return [...prevHistory, condition];
      } else {
        return prevHistory.filter((item) => item !== condition);
      }
    });
  };

  // handlePhotoChange (keep as is, but be aware of 413 Payload Too Large if not fixed)
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Optional: Add file size check here before reading
      // if (file.size > 5 * 1024 * 1024) { // Example: 5MB limit
      //   window.alert("Image file is too large. Please upload an image smaller than 5MB.");
      //   return;
      // }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result); // This Base64 can be very large
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Ensure numeric fields are numbers, defaulting to 0 if empty/NaN after validation
    const finalPregnancies = Number(pregnancies) || 0;
    const finalMiscarriages = Number(miscarriages) || 0;
    const finalAbortions = Number(abortions) || 0;
    const finalAge = Number(age) || 0;
    const finalAgeOnset = Number(ageOnset) || 0; // Convert ageOnset

    const formData = {
      firstName,
      lastName,
      phone,
      occupation,
      maritalStatus,
      spouseName,
      city,
      age: finalAge,
      gender,
      birthDate,
      allergic,
      allergies: allergic ? allergies : "",
      medicalHistory,
      photo: photo, // Still sending Base64 photo - risk of 413 error remains!
      // Women-only fields:
      ageOnset: finalAgeOnset, // Send ageOnset
      periodType,
      stillHavingPeriods,
      lastPeriodDate, // Send last period date
      difficultyWithPeriods,
      pregnancies: finalPregnancies,
      // REMOVED: births
      miscarriages: finalMiscarriages,
      abortions: finalAbortions,
      leakageOfUrine,
      leakageDescription: leakageOfUrine === "yes" ? leakageDescription : "",
      pelvicPain,
      pelvicDescription: pelvicPain === "yes" ? pelvicDescription : "",
      abnormalDischarge,
      abnormalDischargeDescription:
        abnormalDischarge === "yes" ? abnormalDischargeDescription : "",
      abnormalPapSmear,
      abnormalPapSmearDescription:
        abnormalPapSmear === "yes" ? abnormalPapSmearDescription : "",
    };

    // Log data just before sending
    console.log("Submitting formData:", JSON.stringify(formData, null, 2));

    try {
      const res = await axios.post(
        "https://hospital-qn5w.onrender.com/api/patient-history",
        formData,
        {
          // Optional: If you increased backend limits AND still get 413,
          // you might need to set maxBodyLength here for Axios too,
          // but fixing the photo upload method is better.
          // maxBodyLength: Infinity,
          // maxContentLength: Infinity,
        }
      );
      console.log("Patient data saved:", res.data);
      window.alert("Patient registered successfully!");
      resetForm();
      onClose();
    } catch (error) {
      console.error("--- Error Saving Patient Data ---");
      console.error("Error Object:", error);

      let alertMessage = "Error saving patient data. Please try again.";

      if (error.response) {
        console.error("Backend Status Code:", error.response.status);
        console.error("Backend Response Data:", error.response.data);
        // Try to extract a meaningful message from backend response
        const responseData = error.response.data;
        if (responseData) {
          if (typeof responseData === "string") {
            alertMessage += `\nServer Error: ${responseData}`;
          } else if (responseData.message) {
            alertMessage += `\nServer Error: ${responseData.message}`;
            // Check for Mongoose validation errors object
            if (responseData.errors) {
              const errorFields = Object.keys(responseData.errors).join(", ");
              alertMessage += `\nValidation issues with: ${errorFields}`;
            }
          } else {
            alertMessage += `\nStatus: ${error.response.status}`;
          }
        } else {
          alertMessage += `\nStatus: ${error.response.status}`;
        }
      } else if (error.request) {
        console.error("No response received from backend:", error.request);
        alertMessage =
          "Could not connect to the server. Please check your internet connection or try again later.";
      } else {
        console.error("Error setting up request:", error.message);
        alertMessage = `Error setting up request: ${error.message}`;
      }

      window.alert(alertMessage);
    }
  };

  // --- JSX Structure ---
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>New Patient History Form</DialogTitle>
      <DialogContent dividers className="dialog-content">
        {/* Patient Information Section (Keep As Is) */}
        <Typography variant="subtitle1" className="section-title">
          Patient Information
        </Typography>
        <Box className="form-row">
          <TextField
            label="First Name"
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <TextField
            label="Last Name"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </Box>
        <Box className="form-row">
          <TextField
            label="Phone"
            required
            fullWidth
            value={phone}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              if (digits.length <= 10) setPhone(digits);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+91</InputAdornment>
              ),
            }}
            inputProps={{ maxLength: 10, inputMode: "tel" }}
          />
          <TextField
            label="Occupation"
            required
            fullWidth
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
          />
        </Box>
        <Box className="form-row">
          <FormControl fullWidth className="marital-status-select" required>
            <InputLabel>Marital Status</InputLabel>
            <Select
              value={maritalStatus}
              label="Marital Status"
              onChange={(e) => setMaritalStatus(e.target.value)}
            >
              <MenuItem value="">
                <em>---</em>
              </MenuItem>
              <MenuItem value="married">Married</MenuItem>
              <MenuItem value="unmarried">Unmarried</MenuItem>
              <MenuItem value="divorced">Divorced</MenuItem>
              <MenuItem value="widow">Widow</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Spouse Name"
            fullWidth
            value={spouseName}
            onChange={(e) => setSpouseName(e.target.value)}
            // Conditionally require spouse name if married?
            required={maritalStatus === "married"}
            disabled={maritalStatus !== "married" && maritalStatus !== "widow"} // Example logic
          />
        </Box>
        <Box className="form-row">
          <FormControl className="gender-select" required>
            <InputLabel>Gender</InputLabel>
            <Select
              value={gender}
              label="Gender"
              onChange={(e) => setGender(e.target.value)}
            >
              <MenuItem value="">
                <em>---</em>
              </MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <Box className="birth-date-field">
            <TextField
              label="Birth Date"
              type="date"
              fullWidth
              required
              value={birthDate}
              onChange={(e) => {
                const newBirthDate = e.target.value;
                setBirthDate(newBirthDate);
                setAge(
                  newBirthDate ? calculateAge(newBirthDate).toString() : ""
                );
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box className="small-age-field">
            <TextField
              label="Age"
              type="number"
              fullWidth
              value={age}
              InputProps={{ readOnly: true }}
            />
          </Box>
          <FormControl className="city-select" sx={{ minWidth: 150 }} required>
            {" "}
            {/* Use minWidth */}
            <InputLabel>City</InputLabel>
            <Select
              value={city}
              label="City"
              onChange={(e) => setCity(e.target.value)}
            >
              <MenuItem value="">
                <em>---</em>
              </MenuItem>
              {indianCities.sort().map(
                (
                  c // Sort cities alphabetically
                ) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </Box>
        {/* Photo Upload Section (Keep As Is - but still recommend fixing the upload method) */}
        <Box className="form-row" sx={{ alignItems: "center", mb: 2 }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Upload Photo:
          </Typography>
          <Button variant="contained" component="label">
            {" "}
            Choose File
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhotoChange}
            />
          </Button>
          {photo && (
            <Box sx={{ ml: 2, display: "flex", alignItems: "center" }}>
              <img
                src={photo}
                alt="Preview"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <IconButton
                onClick={() => setPhoto("")}
                size="small"
                aria-label="Remove photo"
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Box>
          )}
        </Box>
        {/* Allergies Section (Keep As Is) */}
        <Typography variant="subtitle1" className="allergy-section">
          Allergies
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={allergic}
                onChange={(e) => setAllergic(e.target.checked)}
              />
            }
            label="Allergic to medications, x-ray dyes, or other substances?"
          />
          <TextField
            label="If yes, list name of medicine and type of reaction"
            multiline
            rows={2}
            fullWidth
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            disabled={!allergic}
            required={allergic}
          />
        </FormGroup>
        {/* Past Medical History Section (Keep As Is) */}
        <Typography variant="subtitle1" className="medical-history-section">
          Past Medical History and Review of Systems
        </Typography>
        <Typography variant="body2" className="medical-history-subtitle">
          (Please check if you have had any problems with or are presently
          experiencing any of the following)
        </Typography>
        <Grid container spacing={1} className="medical-history-grid">
          {" "}
          {/* Reduced spacing */}
          {[
            "High blood pressure",
            "Diabetes",
            "Cancer",
            "Chest pain/tightness",
            "Shortness of Breath",
            "Valve problems",
            "Palpitations",
            "Irregular heartbeat",
            "Rheumatic fever",
            "Asthma",
            "Emphysema",
            "Bronchitis",
            "Pneumonia",
            "TB",
            "Persistent cough",
            "Abdominal discomfort",
            "Indigestion",
            "Nausea",
            "Vomiting",
            "Constipation",
            "Diarrhea",
            "Blood in stool",
            "Ulcers",
            "Change in bowel habits",
            "Unexplained weight gain/loss",
            "Hemorrhoids",
            "Gall Bladder disease",
            "Colitis",
            "Hepatitis or jaundice",
            "Thyroid disease",
            "Head or neck radiation",
            "Headache",
            "Dizziness",
            "Kidney stones",
            "Kidney function",
            "Difficulty urinating",
            "Arthritis",
            "Low back pain",
            "Gout",
            "Sinus disease",
            "Bowel disorders",
            "Nervousness",
            "Anxiety",
            "Depression",
            "Anemia",
            "Alcohol abuse",
            "Drug addiction",
            "Impotence or Erectile Dysfunction",
          ].map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
              {" "}
              {/* Adjusted grid columns */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={medicalHistory.includes(item)}
                    onChange={(event) =>
                      handleMedicalHistoryChange(event, item)
                    }
                    size="small"
                  />
                }
                label={<Typography variant="body2">{item}</Typography>} // Wrap label for better control
                className="nowrap-label" // This class might need CSS adjustment
              />
            </Grid>
          ))}
        </Grid>

        {/* --- WOMEN ONLY SECTION --- */}
        {gender === "female" && (
          <>
            <Typography variant="subtitle1" className="women-only-title">
              WOMEN ONLY:
            </Typography>
            <Typography variant="subtitle2" className="menstrual-periods-title">
              Menstrual Periods
            </Typography>

            <Box className="form-row">
              {/* Added Age Onset Field */}
              <TextField
                label="Age onset"
                type="number"
                className="small-field" // Ensure this class provides appropriate width
                value={ageOnset}
                onChange={(e) => setAgeOnset(e.target.value.replace(/\D/g, ""))} // Allow only digits
                InputProps={{ inputProps: { min: 0, max: 100 } }} // Basic range validation
                required
              />
              <FormControl fullWidth className="period-type-select" required>
                <InputLabel>Period Type</InputLabel>
                <Select
                  value={periodType}
                  label="Period Type"
                  onChange={(e) => setPeriodType(e.target.value)}
                >
                  <MenuItem value="">
                    <em>---</em>
                  </MenuItem>
                  <MenuItem value="regular">Regular</MenuItem>
                  <MenuItem value="irregular">Irregular</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box className="form-row" sx={{ alignItems: "center" }}>
              {" "}
              {/* Align items vertically */}
              <Typography
                variant="body2"
                className="inline-label"
                sx={{ mr: 2 }}
              >
                Still having periods:
              </Typography>
              <RadioGroup
                row
                value={stillHavingPeriods}
                onChange={(e) => setStillHavingPeriods(e.target.value)}
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
              </RadioGroup>
            </Box>

            <Box className="form-row">
              {/* Show Last Period Date only if still having periods */}
              <TextField
                label="Date of last period"
                type="date"
                className="medium-field"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                disabled={stillHavingPeriods === "no"} // Disable if not having periods
                required={stillHavingPeriods === "yes"} // Require only if having periods
              />
              <FormControl fullWidth className="difficulty-select" required>
                <InputLabel>Difficulty with periods</InputLabel>
                <Select
                  value={difficultyWithPeriods}
                  label="Difficulty with periods"
                  onChange={(e) => setDifficultyWithPeriods(e.target.value)}
                >
                  <MenuItem value="">
                    <em>---</em>
                  </MenuItem>
                  <MenuItem value="no">No</MenuItem>
                  <MenuItem value="moderate">Moderate</MenuItem>
                  <MenuItem value="severe">Severe</MenuItem>{" "}
                  {/* Changed 'yes' to 'severe' for clarity */}
                </Select>
              </FormControl>
            </Box>

            {/* Row for Pregnancies, Miscarriages, Abortions */}
            <Box className="form-row">
              <TextField
                label="Pregnancies"
                type="number"
                className="small-field"
                required
                value={pregnancies}
                onChange={(e) =>
                  setPregnancies(e.target.value.replace(/\D/g, ""))
                }
                InputProps={{ inputProps: { min: 0 } }}
              />
              {/* REMOVED Births Dropdown and Other Births Textfield */}
              <TextField
                label="Miscarriages"
                type="number"
                className="small-field"
                required
                value={miscarriages}
                onChange={(e) =>
                  setMiscarriages(e.target.value.replace(/\D/g, ""))
                }
                InputProps={{ inputProps: { min: 0 } }}
              />
              <TextField
                label="Abortions"
                type="number"
                className="small-field"
                required
                value={abortions}
                onChange={(e) =>
                  setAbortions(e.target.value.replace(/\D/g, ""))
                }
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>

            {/* --- Radio Button Sections --- */}
            {/* Leakage of urine */}
            <Box className="women-radio-row">
              <Typography variant="body2" className="inline-label">
                Leakage of urine:
              </Typography>
              <RadioGroup
                row
                value={leakageOfUrine}
                onChange={(e) => setLeakageOfUrine(e.target.value)}
              >
                <FormControlLabel
                  value="no"
                  control={<Radio size="small" />}
                  label="No"
                />
                <FormControlLabel
                  value="yes"
                  control={<Radio size="small" />}
                  label="Yes"
                />
              </RadioGroup>
              {leakageOfUrine === "yes" && (
                <TextField
                  label="Please describe leakage"
                  multiline
                  className="yes-textfield"
                  value={leakageDescription}
                  onChange={(e) => setLeakageDescription(e.target.value)}
                  required={leakageOfUrine === "yes"}
                />
              )}
            </Box>
            {/* Pelvic pain */}
            <Box className="women-radio-row">
              <Typography variant="body2" className="inline-label">
                Pelvic pain:
              </Typography>
              <RadioGroup
                row
                value={pelvicPain}
                onChange={(e) => setPelvicPain(e.target.value)}
              >
                <FormControlLabel
                  value="no"
                  control={<Radio size="small" />}
                  label="No"
                />
                <FormControlLabel
                  value="yes"
                  control={<Radio size="small" />}
                  label="Yes"
                />
              </RadioGroup>
              {pelvicPain === "yes" && (
                <TextField
                  label="Please describe pelvic pain"
                  multiline
                  className="yes-textfield"
                  value={pelvicDescription}
                  onChange={(e) => setPelvicDescription(e.target.value)}
                  required={pelvicPain === "yes"}
                />
              )}
            </Box>
            {/* Abnormal discharge */}
            <Box className="women-radio-row">
              <Typography variant="body2" className="inline-label">
                Abnormal discharge:
              </Typography>
              <RadioGroup
                row
                value={abnormalDischarge}
                onChange={(e) => setAbnormalDischarge(e.target.value)}
              >
                <FormControlLabel
                  value="no"
                  control={<Radio size="small" />}
                  label="No"
                />
                <FormControlLabel
                  value="yes"
                  control={<Radio size="small" />}
                  label="Yes"
                />
              </RadioGroup>
              {abnormalDischarge === "yes" && (
                <TextField
                  label="Please describe discharge"
                  multiline
                  className="yes-textfield"
                  value={abnormalDischargeDescription}
                  onChange={(e) =>
                    setAbnormalDischargeDescription(e.target.value)
                  }
                  required={abnormalDischarge === "yes"}
                />
              )}
            </Box>
            {/* Abnormal Pap Smear */}
            <Box className="women-radio-row">
              <Typography variant="body2" className="inline-label">
                History of abnormal Pap Smear:
              </Typography>
              <RadioGroup
                row
                value={abnormalPapSmear}
                onChange={(e) => setAbnormalPapSmear(e.target.value)}
              >
                <FormControlLabel
                  value="no"
                  control={<Radio size="small" />}
                  label="No"
                />
                <FormControlLabel
                  value="yes"
                  control={<Radio size="small" />}
                  label="Yes"
                />
              </RadioGroup>
              {abnormalPapSmear === "yes" && (
                <TextField
                  label="Please describe abnormal Pap Smear"
                  multiline
                  className="yes-textfield"
                  value={abnormalPapSmearDescription}
                  onChange={(e) =>
                    setAbnormalPapSmearDescription(e.target.value)
                  }
                  required={abnormalPapSmear === "yes"}
                />
              )}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions className="dialog-actions">
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientHistoryForm;
