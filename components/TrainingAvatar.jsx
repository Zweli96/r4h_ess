import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";

export default function TrainingAvatar({ allCompleted = false, size = 48 }) {
  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        backgroundColor: allCompleted ? "success.main" : "error.main",
        color: allCompleted ? "#fff" : "#fff",
        border: "2px solid #fff",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 500,
        fontSize: size * 0.5,
        "&:hover": {
          opacity: 0.9,
        },
      }}
    >
      {allCompleted ? (
        <CheckCircleIcon sx={{ fontSize: size * 0.6 }} />
      ) : (
        <WarningIcon sx={{ fontSize: size * 0.6 }} />
      )}
    </Avatar>
  );
}
