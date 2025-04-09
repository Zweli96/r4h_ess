import React from 'react';
import { Typography, Box, TextField, Select, MenuItem } from '@mui/material';

const TimesheetSelectors =({  selectedMonth,
    handleMonthChange,
    selectedActivities,
    handleActivityChange,
    ACTIVITIES,})=>{
    return(
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          label="Select Month"
          type="month"
          value={selectedMonth}
          onChange={handleMonthChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 }, marginTop: "22px" }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h8" gutterBottom sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 }, color: "gray" }}>
            Select Activities:
          </Typography>
          <Select
            multiple
            value={selectedActivities}
            onChange={handleActivityChange}
            renderValue={(selected) => selected.join(', ')}
          >
            {ACTIVITIES.map((activity) => (
              <MenuItem key={activity} value={activity}>
                {activity}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
      )
}

export default TimesheetSelectors
