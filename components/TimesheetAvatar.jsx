// components/TimesheetAvatar.jsx
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function TimesheetAvatar({
  is_submitted,
  is_past_due,
  size = 48,
}) {
  // Determine icon and background color
  let IconComponent;
  let backgroundColor;

  if (is_submitted) {
    IconComponent = CheckCircleIcon;
    backgroundColor = "success.main"; // Green (e.g., #2e7d32)
  } else if (is_past_due) {
    IconComponent = WarningIcon;
    backgroundColor = "error.main"; // Red (e.g., #d32f2f)
  } else {
    IconComponent = AccessTimeIcon;
    backgroundColor = "grey.500"; // Grey (e.g., #9e9e9e)
  }

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        backgroundColor,
        color: "#fff", // White icon
        border: "2px solid #fff", // White border for polish
        "&:hover": {
          opacity: 0.9, // Subtle hover effect
        },
      }}
    >
      <IconComponent sx={{ fontSize: size * 0.6 }} />
    </Avatar>
  );
}
