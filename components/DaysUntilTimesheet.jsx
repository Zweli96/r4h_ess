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
import CustomLink from "./CustomLink";

export default function DaysUntilTimesheetCard({ is_submitted = false }) {
  // Get current date and calculate days to/from 20th
  const today = new Date();
  const currentMonth = today.toLocaleString("default", { month: "long" }); // e.g., "April"
  const currentYear = today.getFullYear();
  const dueDate = new Date(currentYear, today.getMonth(), 16);
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days until 20th
  const isPastDue = diffDays < 0; // True if 20th has passed
  const isDueToday = diffDays === 0; // True if today is the 20th
  const displayDays = Math.abs(diffDays); // Absolute value for display
  const formatDate = (date) => {
    const formatted = new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
      .format(date)
      .replace(/,/, ""); // Remove any commas from the output
    return formatted;
  };

  // Determine text based on conditions
  let primaryText = "";
  let secondaryText = "";

  if (is_submitted) {
    primaryText = "Completed";
    secondaryText = `${currentMonth} Timesheet completed`;
  } else if (isDueToday) {
    primaryText = `${currentMonth} Timesheet Due Today`;
    secondaryText = `Please submit timesheet for ${currentMonth} ${currentYear}`;
  } else if (isPastDue) {
    primaryText = `${displayDays} days late`;
    secondaryText = `${currentMonth} Timesheet was due ${displayDays} days ago on ${formatDate(
      dueDate
    )}`;
  } else {
    primaryText = `${displayDays} days`;
    secondaryText = `Until ${currentMonth} Timesheet is due on ${formatDate(
      dueDate
    )}`;
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
          minHeight: { xs: "50%", md: "220px" },
          borderRadius: "24px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <CustomLink href="/timesheets">
              <TimesheetAvatar
                is_submitted={is_submitted}
                is_past_due={isPastDue}
                is_due_today={isDueToday}
                size={48}
              />
            </CustomLink>
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
