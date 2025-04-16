// components/ApprovalsAvatar.jsx
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
export default function ApprovalsAvatar({ pending_count = 0, size = 48 }) {
  const isPending = pending_count > 0;

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        backgroundColor: isPending ? "warning.main" : "success.main",
        color: "#fff",
        border: "2px solid #fff",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 500,
        fontSize: size * 0.5,
        "&:hover": {
          opacity: 0.9,
        },
      }}
    >
      {isPending ? (
        pending_count
      ) : (
        <SentimentSatisfiedAltIcon sx={{ fontSize: size * 0.6 }} />
      )}
    </Avatar>
  );
}
