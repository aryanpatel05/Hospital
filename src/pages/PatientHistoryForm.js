// src/pages/PatientHistoryForm.js
import React, { useState } from "react";
import axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSearchParams } from "react-router-dom";
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
  const today = new Date();
  const dob = new Date(birthDate);
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
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
];

const PatientHistoryForm = ({ open, onClose }) => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId") || "";
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
  const [photo, setPhoto] = useState("");

  // Women-only fields
  const [periodType, setPeriodType] = useState("");
  const [stillHavingPeriods, setStillHavingPeriods] = useState("no");
  const [difficultyWithPeriods, setDifficultyWithPeriods] = useState("");
  const [pregnancies, setPregnancies] = useState("");
  const [births, setBirths] = useState("");
  const [otherBirths, setOtherBirths] = useState("");
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
    setStillHavingPeriods("no");
    setDifficultyWithPeriods("");
    setPregnancies("");
    setBirths("");
    setOtherBirths("");
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

  // Front-end validation for required fields
  const validateForm = () => {
    const requiredFields = [
      { field: firstName, name: "First Name" },
      { field: lastName, name: "Last Name" },
      { field: phone, name: "Phone" },
      { field: occupation, name: "Occupation" },
      { field: maritalStatus, name: "Marital Status" },
      { field: spouseName, name: "Spouse Name" },
      { field: city, name: "City" },
      { field: age, name: "Age" },
      { field: gender, name: "Gender" },
      { field: birthDate, name: "Birth Date" },
    ];

    for (let { field, name } of requiredFields) {
      if (!field) {
        window.alert(`Please fill the ${name} field.`);
        return false;
      }
    }

    if (gender === "female") {
      const womenRequired = [
        { field: periodType, name: "Period Type" },
        { field: stillHavingPeriods, name: "Still having periods" },
        { field: difficultyWithPeriods, name: "Difficulty with periods" },
        { field: pregnancies, name: "Pregnancies" },
        { field: births, name: "Births" },
        { field: miscarriages, name: "Miscarriages" },
        { field: abortions, name: "Abortions" },
        { field: leakageOfUrine, name: "Leakage of urine" },
        { field: pelvicPain, name: "Pelvic pain" },
        { field: abnormalDischarge, name: "Abnormal discharge" },
        { field: abnormalPapSmear, name: "Abnormal Pap Smear" },
      ];
      for (let { field, name } of womenRequired) {
        if (!field) {
          window.alert(`Please fill the ${name} field.`);
          return false;
        }
      }
    }
    return true;
  };

  // Handle file selection for photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = {
      userId: Number(userId),
      firstName,
      lastName,
      phone,
      occupation,
      maritalStatus,
      spouseName,
      city,
      age: Number(age),
      gender,
      birthDate,
      allergic,
      allergies: allergic ? allergies : "",
      medicalHistory,
      photo,
      periodType,
      stillHavingPeriods,
      difficultyWithPeriods,
      pregnancies: Number(pregnancies),
      births: births === "other" ? Number(otherBirths) : Number(births),
      miscarriages: Number(miscarriages),
      abortions: Number(abortions),
      leakageOfUrine,
      leakageDescription,
      pelvicPain,
      pelvicDescription,
      abnormalDischarge,
      abnormalDischargeDescription,
      abnormalPapSmear,
      abnormalPapSmearDescription,
    };

    try {
      const res = await axios.post(
        "https://hospital-qn5w.onrender.com/api/patient-history",
        formData
      );
      console.log("Patient data saved:", res.data);
      window.alert("Patient registered successfully!");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error saving patient data:", error);
      window.alert("Error saving patient data. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>New Patient History Form</DialogTitle>
      <DialogContent dividers className="dialog-content">
        {/* Patient Information Section */}
        <Typography variant="subtitle1" className="section-title">
          Patient Information
        </Typography>
        <Box className="form-row">
          <TextField
            label="First Name"
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            label="Last Name"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Box>
        <Box className="form-row">
          <TextField
            label="Phone"
            fullWidth
            value={phone}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              if (digits.length <= 10) {
                setPhone(digits);
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+91</InputAdornment>
              ),
              inputProps: { maxLength: 10 },
            }}
          />
          <TextField
            label="Occupation"
            fullWidth
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
          />
        </Box>
        {/* Marital Status & Spouse Name */}
        <Box className="form-row">
          <FormControl fullWidth className="marital-status-select">
            <InputLabel>Marital Status</InputLabel>
            <Select
              value={maritalStatus}
              label="Marital Status"
              onChange={(e) => setMaritalStatus(e.target.value)}
            >
              <MenuItem value="">---</MenuItem>
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
          />
        </Box>
        {/* Gender, Birth Date, Age, and City Row */}
        <Box className="form-row">
          <FormControl className="gender-select">
            <InputLabel>Gender</InputLabel>
            <Select
              value={gender}
              label="Gender"
              onChange={(e) => setGender(e.target.value)}
            >
              <MenuItem value="">---</MenuItem>
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
              value={birthDate}
              onChange={(e) => {
                const newBirthDate = e.target.value;
                setBirthDate(newBirthDate);
                if (newBirthDate) {
                  setAge(calculateAge(newBirthDate).toString());
                } else {
                  setAge("");
                }
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
          <FormControl className="city-select" sx={{ width: "150px" }}>
            <InputLabel>City</InputLabel>
            <Select
              value={city}
              label="City"
              onChange={(e) => setCity(e.target.value)}
            >
              {indianCities.map((c, idx) => (
                <MenuItem key={idx} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {/* Photo Upload Section */}
        <Box className="form-row" sx={{ alignItems: "center", mb: 2 }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Upload Photo:
          </Typography>
          <Button variant="contained" component="label">
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
                alt="Uploaded"
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
              <IconButton onClick={() => setPhoto("")}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
        {/* Allergies Section */}
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
          />
        </FormGroup>
        {/* Past Medical History Section */}
        <Typography variant="subtitle1" className="medical-history-section">
          Past Medical History and Review of Systems
        </Typography>
        <Typography variant="body2" className="medical-history-subtitle">
          (Please check off if you have had any problems with or are presently
          experiencing any of the following)
        </Typography>
        <Grid container spacing={2} className="medical-history-grid">
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
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FormControlLabel
                control={<Checkbox />}
                label={item}
                className="nowrap-label"
              />
            </Grid>
          ))}
        </Grid>
        {/* WOMEN ONLY SECTION - conditionally rendered */}
        {gender === "female" && (
          <>
            <Typography variant="subtitle1" className="women-only-title">
              WOMEN ONLY:
            </Typography>
            <Typography variant="subtitle2" className="menstrual-periods-title">
              Menstrual Periods
            </Typography>
            <Box className="form-row">
              <TextField label="Age onset" className="small-field" />
              <FormControl fullWidth className="period-type-select">
                <InputLabel>Period Type</InputLabel>
                <Select
                  value={periodType}
                  label="Period Type"
                  onChange={(e) => setPeriodType(e.target.value)}
                >
                  <MenuItem value="regular">Regular</MenuItem>
                  <MenuItem value="irregular">Irregular</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box className="form-row">
              <Typography variant="body2" className="inline-label">
                Still having periods:
              </Typography>
              <RadioGroup
                row
                value={stillHavingPeriods}
                onChange={(e) => setStillHavingPeriods(e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>
            <Box className="form-row">
              <TextField
                label="Date of last period"
                type="date"
                className="medium-field"
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth className="difficulty-select">
                <InputLabel>Difficulty with periods</InputLabel>
                <Select
                  value={difficultyWithPeriods}
                  label="Difficulty with periods"
                  onChange={(e) => setDifficultyWithPeriods(e.target.value)}
                >
                  <MenuItem value="no">No</MenuItem>
                  <MenuItem value="moderate">Moderate</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box className="form-row">
              <TextField
                label="Pregnancies"
                type="number"
                className="small-field"
                slotProps={{ htmlInput: { min: 0 } }}
              />
              <FormControl fullWidth className="births-select">
                <InputLabel>Births</InputLabel>
                <Select
                  value={births}
                  label="Births"
                  onChange={(e) => setBirths(e.target.value)}
                >
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="twins">Twins</MenuItem>
                  <MenuItem value="triplets">Triplets</MenuItem>
                  <MenuItem value="quadruplets">Quadruplets</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              {births === "other" && (
                <TextField
                  label="Number of Births"
                  type="number"
                  className="small-field"
                  slotProps={{ htmlInput: { min: 0 } }}
                />
              )}
              <TextField
                label="Miscarriages"
                type="number"
                className="small-field"
                slotProps={{ htmlInput: { min: 0 } }}
              />
              <TextField
                label="Abortions"
                type="number"
                className="small-field"
                slotProps={{ htmlInput: { min: 0 } }}
              />
            </Box>
            <Box className="women-radio-row">
              <Typography variant="body2" className="inline-label">
                Leakage of urine:
              </Typography>
              <RadioGroup
                row
                value={leakageOfUrine}
                onChange={(e) => setLeakageOfUrine(e.target.value)}
              >
                <FormControlLabel value="no" control={<Radio />} label="No" />
                <FormControlLabel
                  value="yes"
                  control={<Radio />}
                  label="Yes (Please describe)"
                />
              </RadioGroup>
              {leakageOfUrine === "yes" && (
                <TextField
                  label="Please describe"
                  multiline
                  className="yes-textfield"
                  value={leakageDescription}
                  onChange={(e) => setLeakageDescription(e.target.value)}
                />
              )}
            </Box>
            <Box className="women-radio-row">
              <Typography variant="body2" className="inline-label">
                Pelvic pain:
              </Typography>
              <RadioGroup
                row
                value={pelvicPain}
                onChange={(e) => setPelvicPain(e.target.value)}
              >
                <FormControlLabel value="no" control={<Radio />} label="No" />
                <FormControlLabel
                  value="yes"
                  control={<Radio />}
                  label="Yes (Please describe)"
                />
              </RadioGroup>
              {pelvicPain === "yes" && (
                <TextField
                  label="Please describe"
                  multiline
                  className="yes-textfield"
                  value={pelvicDescription}
                  onChange={(e) => setPelvicDescription(e.target.value)}
                />
              )}
            </Box>
            <Box className="women-radio-row">
              <Typography variant="body2" className="inline-label">
                Abnormal discharge:
              </Typography>
              <RadioGroup
                row
                value={abnormalDischarge}
                onChange={(e) => setAbnormalDischarge(e.target.value)}
              >
                <FormControlLabel value="no" control={<Radio />} label="No" />
                <FormControlLabel
                  value="yes"
                  control={<Radio />}
                  label="Yes (Please describe)"
                />
              </RadioGroup>
              {abnormalDischarge === "yes" && (
                <TextField
                  label="Please describe"
                  multiline
                  className="yes-textfield"
                  value={abnormalDischargeDescription}
                  onChange={(e) =>
                    setAbnormalDischargeDescription(e.target.value)
                  }
                />
              )}
            </Box>
            <Box className="women-radio-row">
              <Typography variant="body2" className="inline-label">
                History of abnormal Pap Smear:
              </Typography>
              <RadioGroup
                row
                value={abnormalPapSmear}
                onChange={(e) => setAbnormalPapSmear(e.target.value)}
              >
                <FormControlLabel value="no" control={<Radio />} label="No" />
                <FormControlLabel
                  value="yes"
                  control={<Radio />}
                  label="Yes (Please describe)"
                />
              </RadioGroup>
              {abnormalPapSmear === "yes" && (
                <TextField
                  label="Please describe"
                  multiline
                  className="yes-textfield"
                  value={abnormalPapSmearDescription}
                  onChange={(e) =>
                    setAbnormalPapSmearDescription(e.target.value)
                  }
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
