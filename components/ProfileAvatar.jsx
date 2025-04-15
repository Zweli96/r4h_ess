// components/ProfileAvatar.jsx
import * as React from "react";
import Avatar from "@mui/material/Avatar";

// Array of pleasing colors for random selection
const colors = [
  "#f44336", // Red
  "#e91e63", // Pink
  "#9c27b0", // Purple
  "#673ab7", // Deep Purple
  "#3f51b5", // Indigo
  "#2196f3", // Blue
  "#03a9f4", // Light Blue
  "#00bcd4", // Cyan
  "#009688", // Teal
  "#4caf50", // Green
];

// Function to pick a color based on name (consistent for same name)
const getColorForName = (name) => {
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export default function ProfileAvatar({ name, size = 40 }) {
  // Get first letter (uppercase) or fallback to "?"
  const initial = name ? name.trim().charAt(0).toUpperCase() : "?";

  // Get background color based on name
  const backgroundColor = getColorForName(name || "unknown");

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        backgroundColor,
        color: "#fff", // White text
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Match MUI theme
        fontWeight: 500,
        fontSize: size * 0.5, // Scale font size with avatar size
        border: "2px solid #fff", // Optional: white border for polish
        "&:hover": {
          opacity: 0.9, // Subtle hover effect
        },
      }}
    >
      {initial}
    </Avatar>
  );
}
