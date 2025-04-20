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
    <Box>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <TextField
          label="Select Month"
          type="month"
          value={selectedMonth}
          onChange={handleMonthChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 }, marginTop: "22px" }}
        />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            variant="h8"
            gutterBottom
            sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 }, color: "gray" }}
          >
            Select Activities:
          </Typography>
          <Select
            multiple
            value={selectedActivities}
            onChange={handleActivityChange}
            renderValue={(selected) => selected.join(", ")}
          >
            {ACTIVITIES.map((activity) => (
              <MenuItem key={activity} value={activity}>
                {activity}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
      <Box>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {selectedMonth
            ? (() => {
                const [year, month] = selectedMonth.split("-").map(Number);
                const prevMonth = new Date(year, month - 2, 16);
                const currMonth = new Date(year, month - 1, 15);

                const prevMonthDate = prevMonth.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });
                const currMonthDate = currMonth.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });
                return `Selected period ${prevMonthDate} to ${currMonthDate}`;
              })()
            : "No period selected"}
        </Typography>
      </Box>
    </Box>
  );
};

export default TimesheetSelectors;
