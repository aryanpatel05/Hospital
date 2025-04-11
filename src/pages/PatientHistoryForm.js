// src/pages/PatientHistoryForm.js
import React, { useState } from "react";
import axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";
import DeleteIcon from "@mui/icons-material/Delete";
// Make sure this CSS file exists and is correctly linked, or remove if not needed
import "../styles/PatientHistoryForm.css";
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
  if (!birthDate) return 0;
  const today = new Date();
  const dob = new Date(birthDate);
  if (isNaN(dob.getTime())) return 0; // Invalid date
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 0 ? age : 0; // Ensure age is not negative
};

// List of Indian cities
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
  // Add more cities as needed
].sort(); // Keep the list sorted

// List of medical history items
const medicalHistoryOptions = [
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
  const [medicalHistory, setMedicalHistory] = useState([]); // State for selected history items

  // Photo upload state
  const [photo, setPhoto] = useState(""); // Stores base64 string

  // Women-only fields
  const [periodType, setPeriodType] = useState("");
  const [stillHavingPeriods, setStillHavingPeriods] = useState("no");
  const [difficultyWithPeriods, setDifficultyWithPeriods] = useState("");
  const [pregnancies, setPregnancies] = useState("");
  const [births, setBirths] = useState("");
  // const [otherBirths, setOtherBirths] = useState(""); // Removed, simplify births to just a number
  const [miscarriages, setMiscarriages] = useState("");
  const [abortions, setAbortions] = useState("");

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

  // Handler for Medical History Checkboxes
  const handleMedicalHistoryChange = (event) => {
    const { value, checked } = event.target;
    setMedicalHistory((prev) => {
      if (checked) {
        return [...prev, value]; // Add item
      } else {
        return prev.filter((item) => item !== value); // Remove item
      }
    });
  };

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
    setMedicalHistory([]); // Reset medical history
    setPhoto("");
    setPeriodType("");
    setStillHavingPeriods("no");
    setDifficultyWithPeriods("");
    setPregnancies("");
    setBirths("");
    // setOtherBirths(""); // Removed
    setMiscarriages("");
    setAbortions("");
    setLeakageOfUrine("no");
    setLeakageDescription("");
    setPelvicPain("no");
    setPelvicDescription("");
    setAbnormalDischarge("no");
    setAbnormalDischargeDescription("");
    setAbnormalPapSmear("no");
    setAbnormalPapSmearDescription("");
  };

  // Front-end validation
  const validateForm = () => {
    const requiredFields = [
      { field: firstName, name: "First Name" },
      { field: lastName, name: "Last Name" },
      { field: phone, name: "Phone" },
      { field: occupation, name: "Occupation" },
      { field: maritalStatus, name: "Marital Status" },
      { field: spouseName, name: "Spouse Name" }, // Consider making optional if unmarried
      { field: city, name: "City" },
      { field: age, name: "Age" },
      { field: gender, name: "Gender" },
      { field: birthDate, name: "Birth Date" },
    ];

    for (let { field, name } of requiredFields) {
      // Check for empty string, null, undefined but allow 0 for age
      if (!field && field !== 0) {
        window.alert(`Please fill the ${name} field.`);
        return false;
      }
    }

    // Phone number specific validation (optional but good)
    if (phone.length !== 10) {
      window.alert(`Phone number must be exactly 10 digits.`);
      return false;
    }

    // Allergy description validation
    if (allergic && !allergies.trim()) {
      window.alert(`Please describe the allergies.`);
      return false;
    }

    // Women-only validation
    if (gender === "female") {
      const womenRequired = [
        // Add 'value' for easier checking below
        { field: periodType, name: "Period Type", value: periodType },
        {
          field: stillHavingPeriods,
          name: "Still having periods",
          value: stillHavingPeriods,
        },
        {
          field: difficultyWithPeriods,
          name: "Difficulty with periods",
          value: difficultyWithPeriods,
        },
        { field: pregnancies, name: "Pregnancies", value: pregnancies },
        { field: births, name: "Births", value: births },
        { field: miscarriages, name: "Miscarriages", value: miscarriages },
        { field: abortions, name: "Abortions", value: abortions },
        {
          field: leakageOfUrine,
          name: "Leakage of urine",
          value: leakageOfUrine,
        },
        { field: pelvicPain, name: "Pelvic pain", value: pelvicPain },
        {
          field: abnormalDischarge,
          name: "Abnormal discharge",
          value: abnormalDischarge,
        },
        {
          field: abnormalPapSmear,
          name: "Abnormal Pap Smear",
          value: abnormalPapSmear,
        },
      ];

      for (let { field, name, value } of womenRequired) {
        // Check numeric fields carefully (allow 0, but not empty string or negative)
        const isNumericField = [
          "Pregnancies",
          "Births",
          "Miscarriages",
          "Abortions",
        ].includes(name);
        const isEmpty = value === "" || value === null || value === undefined;
        const isInvalidNumber =
          isNumericField && (isNaN(Number(value)) || Number(value) < 0);

        if (isEmpty || isInvalidNumber) {
          // Allow empty string for specific non-numeric fields if it's a valid option (e.g., empty MenuItem value)
          if (
            (name === "Period Type" || name === "Difficulty with periods") &&
            value === ""
          ) {
            window.alert(`Please select an option for ${name}.`);
            return false;
          } else if (!isNumericField && isEmpty) {
            window.alert(`Please fill the ${name} field.`);
            return false;
          } else if (isNumericField && (isEmpty || isInvalidNumber)) {
            window.alert(
              `Please enter a valid number (0 or more) for ${name}.`
            );
            return false;
          }
        }

        // Check description fields if 'yes' is selected
        if (
          name === "Leakage of urine" &&
          value === "yes" &&
          !leakageDescription.trim()
        ) {
          window.alert(`Please describe the leakage of urine.`);
          return false;
        }
        if (
          name === "Pelvic pain" &&
          value === "yes" &&
          !pelvicDescription.trim()
        ) {
          window.alert(`Please describe the pelvic pain.`);
          return false;
        }
        if (
          name === "Abnormal discharge" &&
          value === "yes" &&
          !abnormalDischargeDescription.trim()
        ) {
          window.alert(`Please describe the abnormal discharge.`);
          return false;
        }
        if (
          name === "Abnormal Pap Smear" &&
          value === "yes" &&
          !abnormalPapSmearDescription.trim()
        ) {
          window.alert(`Please describe the abnormal Pap Smear history.`);
          return false;
        }
      }
    }
    return true; // All validations passed
  };

  // Handle file selection for photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic size check (e.g., < 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large. Please select an image under 2MB.");
        e.target.value = null; // Clear the input
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result); // Store as base64 string
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        alert("Error reading file. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return; // Stop submission if validation fails

    // Helper to safely parse numbers, returning 0 if invalid/empty
    const parseNumberSafe = (value) => {
      const num = Number(value);
      return isNaN(num) || num < 0 ? 0 : num;
    };

    // Construct the data payload
    const formData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone, // Already validated for 10 digits
      occupation: occupation.trim(),
      maritalStatus,
      spouseName: spouseName.trim(), // Send even if empty? Or trim? Check requirements
      city,
      age: parseNumberSafe(age),
      gender,
      birthDate,
      allergic,
      allergies: allergic ? allergies.trim() : "", // Send trimmed allergies or empty string
      medicalHistory, // Already an array of selected strings
      photo: photo || null, // Send base64 string or null if no photo
      // Conditionally include women-only fields
      ...(gender === "female" && {
        periodType,
        stillHavingPeriods,
        difficultyWithPeriods,
        pregnancies: parseNumberSafe(pregnancies),
        births: parseNumberSafe(births),
        miscarriages: parseNumberSafe(miscarriages),
        abortions: parseNumberSafe(abortions),
        leakageOfUrine,
        leakageDescription:
          leakageOfUrine === "yes" ? leakageDescription.trim() : "",
        pelvicPain,
        pelvicDescription: pelvicPain === "yes" ? pelvicDescription.trim() : "",
        abnormalDischarge,
        abnormalDischargeDescription:
          abnormalDischarge === "yes"
            ? abnormalDischargeDescription.trim()
            : "",
        abnormalPapSmear,
        abnormalPapSmearDescription:
          abnormalPapSmear === "yes" ? abnormalPapSmearDescription.trim() : "",
      }),
      // Add default/null values for fields not applicable to non-females if schema requires them
      ...(gender !== "female" && {
        periodType: null,
        stillHavingPeriods: null,
        difficultyWithPeriods: null,
        pregnancies: null,
        births: null,
        miscarriages: null,
        abortions: null,
        leakageOfUrine: null, // Assuming backend handles null
        leakageDescription: null,
        pelvicPain: null,
        pelvicDescription: null,
        abnormalDischarge: null,
        abnormalDischargeDescription: null,
        abnormalPapSmear: null,
        abnormalPapSmearDescription: null,
      }),
    };

    // Optional: Remove null fields if the backend prefers absence over null
    Object.keys(formData).forEach((key) => {
      if (formData[key] === null) {
        delete formData[key];
      }
      // Remove empty description fields even if 'no' was selected, unless backend requires empty string
      if (key.endsWith("Description") && formData[key] === "") {
        delete formData[key];
      }
    });

    console.log("Submitting patient data:", JSON.stringify(formData, null, 2)); // Log the exact data being sent

    try {
      // Replace with your actual API endpoint
      const res = await axios.post(
        "https://hospital-qn5w.onrender.com/api/patient-history",
        formData,
        {
          // If sending base64 photo, ensure backend expects it or handle separately
          // headers: { 'Content-Type': 'application/json' } // Usually default for axios post
        }
      );
      console.log("Patient data saved:", res.data);
      window.alert("Patient registered successfully!");
      resetForm(); // Clear the form
      onClose(); // Close the dialog
    } catch (error) {
      console.error(
        "Error saving patient data:",
        error.response ? error.response.data : error.message
      );
      let errorMsg =
        "Error saving patient data. Please check console for details.";
      // Try to get specific message from backend response
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMsg = `Error: ${error.response.data.message}`;
      } else if (error.response && error.response.statusText) {
        errorMsg = `Server Error: ${error.response.status} - ${error.response.statusText}`;
      } else if (error.message) {
        errorMsg = `Request Error: ${error.message}`;
      }
      window.alert(errorMsg); // Show more specific error to user
    }
  };

  // --- Render Form ---
  return (
    // Using Dialog for modal presentation
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ borderBottom: 1, borderColor: "divider", pb: 1.5 }}>
        New Patient History Form
      </DialogTitle>
      <DialogContent
        dividers
        sx={{ p: { xs: 1.5, sm: 3 }, backgroundColor: "#fcfcfc" }}
      >
        {" "}
        {/* Add padding and slight background */}
        {/* Patient Information Section */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 600, color: "primary.main", mb: 2 }}
        >
          Patient Information
        </Typography>
        {/* Use Grid for better layout control */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              fullWidth
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              fullWidth
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              fullWidth
              required
              value={phone}
              type="tel"
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, ""); // Allow only digits
                if (digits.length <= 10) {
                  setPhone(digits);
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+91</InputAdornment>
                ),
                inputProps: { maxLength: 10, pattern: "[0-9]*" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Occupation"
              fullWidth
              required
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Marital Status</InputLabel>
              <Select
                value={maritalStatus}
                label="Marital Status"
                onChange={(e) => setMaritalStatus(e.target.value)}
              >
                <MenuItem value="">
                  <em>--- Select ---</em>
                </MenuItem>
                <MenuItem value="married">Married</MenuItem>
                <MenuItem value="unmarried">Unmarried</MenuItem>
                <MenuItem value="divorced">Divorced</MenuItem>
                <MenuItem value="widow">Widow</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Spouse Name"
              fullWidth
              required
              value={spouseName}
              onChange={(e) => setSpouseName(e.target.value)}
              // disabled={maritalStatus !== 'married'} // Optional: disable if not married
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth required>
              <InputLabel>Gender</InputLabel>
              <Select
                value={gender}
                label="Gender"
                onChange={(e) => setGender(e.target.value)}
              >
                <MenuItem value="">
                  <em>--- Select ---</em>
                </MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              label="Birth Date"
              type="date"
              fullWidth
              required
              value={birthDate}
              onChange={(e) => {
                const newBirthDate = e.target.value;
                setBirthDate(newBirthDate);
                setAge(calculateAge(newBirthDate).toString()); // Update age on date change
              }}
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: new Date().toISOString().split("T")[0] }} // Prevent future dates
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField
              label="Age"
              type="number"
              fullWidth
              required
              value={age}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth required>
              <InputLabel>City</InputLabel>
              <Select
                value={city}
                label="City"
                onChange={(e) => setCity(e.target.value)}
                MenuProps={{ PaperProps: { sx: { maxHeight: 250 } } }}
              >
                <MenuItem value="">
                  <em>--- Select ---</em>
                </MenuItem>
                {indianCities.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {/* Photo Upload Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 3,
            mb: 2,
            borderTop: 1,
            borderColor: "divider",
            pt: 2,
          }}
        >
          <Typography variant="body1" sx={{ mr: 2, fontWeight: 500 }}>
            Upload Photo:
          </Typography>
          <Button variant="outlined" component="label" size="small">
            Choose File
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhotoChange}
            />
          </Button>
          {photo && (
            <Box
              sx={{
                ml: 2,
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                p: 0.5,
                borderRadius: "50%",
              }}
            >
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
                title="Remove photo"
                sx={{ ml: 0.5 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
        {/* Allergies Section */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 600, color: "error.main", mt: 3 }}
        >
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
            label="Any known allergies (medications, dyes, substances)?"
          />
          <TextField
            label="If yes, please specify allergy and reaction"
            multiline
            rows={2}
            fullWidth
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            disabled={!allergic}
            required={allergic} // Make description required if checkbox is checked
            sx={{ mt: 1, display: allergic ? "block" : "none" }} // Show only if allergic
          />
        </FormGroup>
        {/* Past Medical History Section */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 600, color: "primary.main", mt: 3 }}
        >
          Past Medical History & Review of Systems
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Check any conditions you have experienced:
        </Typography>
        <Grid container spacing={0.5} className="medical-history-grid">
          {" "}
          {/* Minimal spacing */}
          {medicalHistoryOptions.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
              {" "}
              {/* Ensure unique key */}
              <FormControlLabel
                control={
                  <Checkbox
                    value={item}
                    checked={medicalHistory.includes(item)}
                    onChange={handleMedicalHistoryChange}
                    size="small"
                  />
                }
                label={item}
                sx={{
                  "& .MuiFormControlLabel-label": { fontSize: "0.875rem" },
                }} // Slightly smaller label
              />
            </Grid>
          ))}
        </Grid>
        {/* --- WOMEN ONLY SECTION (Conditionally Rendered) --- */}
        {gender === "female" && (
          <Box sx={{ borderTop: 1, borderColor: "divider", mt: 3, pt: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, color: "#c678dd" }}
            >
              {" "}
              {/* Distinctive color */}
              WOMEN ONLY Section
            </Typography>

            {/* Menstrual Information */}
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 500, mt: 1 }}
            >
              Menstrual History
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel>Period Type</InputLabel>
                  <Select
                    value={periodType}
                    label="Period Type"
                    onChange={(e) => setPeriodType(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>--- Select ---</em>
                    </MenuItem>
                    <MenuItem value="regular">Regular</MenuItem>
                    <MenuItem value="irregular">Irregular</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel>Difficulty with Periods</InputLabel>
                  <Select
                    value={difficultyWithPeriods}
                    label="Difficulty with Periods"
                    onChange={(e) => setDifficultyWithPeriods(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>--- Select ---</em>
                    </MenuItem>
                    <MenuItem value="no">No Difficulty</MenuItem>
                    <MenuItem value="moderate">Moderate Difficulty</MenuItem>
                    <MenuItem value="severe">Severe Difficulty</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body2" sx={{ mr: 1 }}>
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
              </Grid>
            </Grid>

            {/* Reproductive History */}
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 500, mt: 2.5 }}
            >
              Reproductive History
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                {" "}
                <TextField
                  label="Pregnancies"
                  type="number"
                  fullWidth
                  required
                  value={pregnancies}
                  onChange={(e) =>
                    setPregnancies(e.target.value.replace(/\D/g, ""))
                  }
                  InputProps={{ inputProps: { min: 0 } }}
                />{" "}
              </Grid>
              <Grid item xs={6} sm={3}>
                {" "}
                <TextField
                  label="Births"
                  type="number"
                  fullWidth
                  required
                  value={births}
                  onChange={(e) => setBirths(e.target.value.replace(/\D/g, ""))}
                  InputProps={{ inputProps: { min: 0 } }}
                />{" "}
              </Grid>
              <Grid item xs={6} sm={3}>
                {" "}
                <TextField
                  label="Miscarriages"
                  type="number"
                  fullWidth
                  required
                  value={miscarriages}
                  onChange={(e) =>
                    setMiscarriages(e.target.value.replace(/\D/g, ""))
                  }
                  InputProps={{ inputProps: { min: 0 } }}
                />{" "}
              </Grid>
              <Grid item xs={6} sm={3}>
                {" "}
                <TextField
                  label="Abortions"
                  type="number"
                  fullWidth
                  required
                  value={abortions}
                  onChange={(e) =>
                    setAbortions(e.target.value.replace(/\D/g, ""))
                  }
                  InputProps={{ inputProps: { min: 0 } }}
                />{" "}
              </Grid>
            </Grid>

            {/* Gynecological Symptoms */}
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 500, mt: 2.5 }}
            >
              Gynecological Symptoms
            </Typography>
            {[
              {
                key: "leakageOfUrine",
                state: leakageOfUrine,
                setState: setLeakageOfUrine,
                descState: leakageDescription,
                setDescState: setLeakageDescription,
                label: "Leakage of urine",
              },
              {
                key: "pelvicPain",
                state: pelvicPain,
                setState: setPelvicPain,
                descState: pelvicDescription,
                setDescState: setPelvicDescription,
                label: "Pelvic pain",
              },
              {
                key: "abnormalDischarge",
                state: abnormalDischarge,
                setState: setAbnormalDischarge,
                descState: abnormalDischargeDescription,
                setDescState: setAbnormalDischargeDescription,
                label: "Abnormal discharge",
              },
              {
                key: "abnormalPapSmear",
                state: abnormalPapSmear,
                setState: setAbnormalPapSmear,
                descState: abnormalPapSmearDescription,
                setDescState: setAbnormalPapSmearDescription,
                label: "History of abnormal Pap Smear",
              },
            ].map(
              ({ key, state, setState, descState, setDescState, label }) => (
                <Box key={key} sx={{ mb: 1.5 }}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" sx={{ mr: 1, flexShrink: 0 }}>
                      {label}:
                    </Typography>
                    <RadioGroup
                      row
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    >
                      <FormControlLabel
                        value="no"
                        control={<Radio size="small" />}
                        label="No"
                        sx={{ mr: 0.5 }}
                      />
                      <FormControlLabel
                        value="yes"
                        control={<Radio size="small" />}
                        label="Yes"
                      />
                    </RadioGroup>
                  </Box>
                  <TextField
                    label={`If yes, please describe ${label
                      .toLowerCase()
                      .replace("history of ", "")}`}
                    fullWidth
                    multiline
                    rows={1}
                    value={descState}
                    onChange={(e) => setDescState(e.target.value)}
                    disabled={state !== "yes"}
                    required={state === "yes"}
                    sx={{
                      mt: 0.5,
                      display: state === "yes" ? "block" : "none",
                    }} // Show only if 'yes'
                  />
                </Box>
              )
            )}
          </Box> // End Women Only Box
        )}
      </DialogContent>

      {/* Dialog Actions (Footer) */}
      <DialogActions
        sx={{
          borderTop: 1,
          borderColor: "divider",
          p: 1.5,
          backgroundColor: "#f8f9fa",
        }}
      >
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit History
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientHistoryForm;
