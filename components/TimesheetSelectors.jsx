import React from "react";
import { Typography, Box, TextField, Select, MenuItem } from "@mui/material";

const TimesheetSelectors = ({
  selectedMonth,
  handleMonthChange,
  selectedActivities,
  handleActivityChange,
  ACTIVITIES,
}) => {
  return (
   <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap",padding:3 }}>
  <TextField
    label="Select Month"
    type="month"
    value={selectedMonth}
    onChange={handleMonthChange}
    InputLabelProps={{ shrink: true }}
    sx={{ minWidth: 150 }}
  />
  <Box sx={{ display: "flex", flexDirection: "column" }}>
    <Typography variant="body2" sx={{ color: "gray", mb: 1,mt:-3 }}>
      Select Activities:
    </Typography>
    <Select
      multiple
      value={selectedActivities}
      onChange={handleActivityChange}
      renderValue={(selected) => selected.join(", ")}
      sx={{ minWidth: 150,mt:-0.4 }}
    >
      {ACTIVITIES.map((activity) => (
        <MenuItem key={activity} value={activity}>
          {activity}
        </MenuItem>
      ))}
    </Select>
  </Box>
</Box>

  );
};

export default TimesheetSelectors;
