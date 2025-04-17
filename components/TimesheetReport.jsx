import React from 'react';
import {   Button,
 
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel, } from '@mui/material';
    

const TimesheetReport = ({ handleFilterChange,
    handleExport,filters,districts
   })=>{
    return(
         

<div style={{ maxWidth: 500, marginLeft: 0, padding: 20,textAlign: "left" }}>
    <h2>Export Timesheet Report</h2>
    <TextField
  label="Start Month"
  type="month"
  name="startDate"
  required
  value={filters.startDate}
  onChange={handleFilterChange}
  fullWidth
  margin="normal"
  InputLabelProps={{ shrink: true }}
/>

<TextField
  label="End Month"
  type="month"
  name="endDate"
  value={filters.endDate}
  onChange={handleFilterChange}
  fullWidth
  required
  margin="normal"
  InputLabelProps={{ shrink: true }}
/>

<FormControl fullWidth margin="normal">
        <InputLabel>District</InputLabel>
        <Select
          name="district"
          required
          value={filters.district}
          onChange={handleFilterChange}
        >
          <MenuItem value="">Select District</MenuItem>
          {districts.map(district => (
            <MenuItem key={district.id} value={district.name}>
              {district.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    <FormControl fullWidth margin="normal">
      <InputLabel>Export Format</InputLabel>
      <Select
        name="format"
        required
        value={filters.format}
        onChange={handleFilterChange}
      >
        <MenuItem value="excel">Excel</MenuItem>
        <MenuItem value="pdf">PDF</MenuItem>
      </Select>
    </FormControl>
    <Button variant="contained" onClick={handleExport}>
      Export
    </Button>
  </div>

     );
              };
              
 export default TimesheetReport;
              
  
              