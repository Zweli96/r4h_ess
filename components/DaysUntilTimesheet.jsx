// components/DaysUntilTimesheetCard.jsx
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TimesheetAvatar from "./TimesheetAvatar";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";

export default function DaysUntilTimesheetCard({ is_submitted = false }) {
  // Get current date and calculate days to/from 17th
  const today = new Date();
  const currentMonth = today.toLocaleString("default", { month: "long" }); // e.g., "April"
  const currentYear = today.getFullYear();
  const dueDate = new Date(currentYear, today.getMonth(), 17);
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days until 17th
  const isPastDue = diffDays < 0; // True if 17th has passed
  const displayDays = Math.abs(diffDays); // Absolute value for display

  // Determine text based on conditions
  let primaryText = "";
  let secondaryText = "";

  if (is_submitted) {
    primaryText = "Completed";
    secondaryText = `${currentMonth} Timesheet completed`;
  } else if (isPastDue) {
    primaryText = `${displayDays} days`;
    secondaryText = `${currentMonth} Timesheet was due ${displayDays} days ago`;
  } else {
    primaryText = `${displayDays} days`;
    secondaryText = `Until ${currentMonth} Timesheet is Due`;
  }

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "100%", md: "40%" },
        maxWidth: "500px",
        minWidth: { xs: "100%", md: "250px" },
        display: "flex",
        alignSelf: "center",
        justifyContent: "center",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          minHeight: "25vh",
          borderRadius: "24px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <TimesheetAvatar
              is_submitted={is_submitted}
              is_past_due={isPastDue}
              size={48}
            />
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6" color="text.primary">
                {primaryText}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {secondaryText}
              </Typography>
            </Box>
          </Box>
        </CardContent>
        {!is_submitted && (
          <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
            <Button
              color="primary"
              size="small"
              component={Link}
              href="/timesheets"
              endIcon={<ArrowForwardIcon />}
            >
              Go To Submit Timesheet
            </Button>
          </CardActions>
        )}
      </Card>
    </Box>
  );
}
