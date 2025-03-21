// src/theme.js
import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    background: { default: "#f9fafb", paper: "#fff" },
    text: { primary: "#333" },
    // add other customizations if needed
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    background: { default: "#121212", paper: "#1d1d1d" },
    text: { primary: "#fff" },
    // adjust other color values as needed for dark mode
  },
});
