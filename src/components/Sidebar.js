// src/components/Sidebar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  Box,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// Import icons from Material UI Icons
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PeopleIcon from "@mui/icons-material/People";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FeedIcon from "@mui/icons-material/Feed";
import PaymentIcon from "@mui/icons-material/Payment";
import SettingsIcon from "@mui/icons-material/Settings";

const drawerWidth = 240;

const Sidebar = ({ onDetailsClick }) => {
  // React Router hook for navigation
  const navigate = useNavigate();

  // Define your menu items with an onClick that navigates or calls props
  const menuItems = [
    {
      label: "Dashboard",
      icon: <SpaceDashboardIcon />,
      onClick: () => navigate("/"), // Navigates to the dashboard home
    },
    {
      label: "Schedules",
      icon: <EventNoteIcon />,
      onClick: () => navigate("/schedules"), // Example route
    },
    {
      label: "Patients",
      icon: <PeopleIcon />,
      onClick: () => navigate("/patients"), // Navigates to the patients page
    },
    {
      label: "Appointments",
      icon: <CalendarTodayIcon />,
      onClick: () => navigate("/appointments"), // Example route
    },
    {
      label: "Details",
      icon: <FeedIcon />,
      onClick: onDetailsClick, // Uses the prop for your PatientHistoryForm or other action
    },
    {
      label: "Billing",
      icon: <PaymentIcon />,
      onClick: () => navigate("/billing"), // Example route
    },
    {
      label: "Settings",
      icon: <SettingsIcon />,
      onClick: () => navigate("/settings"), // Example route
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      {/* Space for AppBar */}
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton onClick={item.onClick}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
