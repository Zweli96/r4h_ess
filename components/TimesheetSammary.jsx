import React from 'react';
import { Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';

const TimesheetSummary = ({ totals,
    chunkedData,
    projectNames,
    calcChunkGrandTotal,
    handleSubmit,})=>{
    return(
        <Box sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontSize: "20px", fontWeight: 510 }}>
        Timesheet Summary
      </Typography>
      <TableContainer style={{ marginBottom: '20px', borderRadius: "5px", border: '1px solid silver' }}>
        <Table sx={{ border: '1px solid silver' }}>
          <TableHead sx={{ background: "#7CB9E8", color: "white" }}>
            <TableRow sx={{ border: '1px solid silver' }}>
              <TableCell sx={{ border: '1px solid silver' }}>Work Hours</TableCell>
              <TableCell sx={{ border: '1px solid silver' }}>Leave Hours</TableCell>
              <TableCell sx={{ border: '1px solid silver' }}>Total Hours</TableCell>
              <TableCell sx={{ border: '1px solid silver' }}>Leave Days</TableCell>
              <TableCell sx={{ border: '1px solid silver' }}>Working Days</TableCell>
              <TableCell sx={{ border: '1px solid silver' }}>Total Days</TableCell>
              <TableCell>Leave(%)</TableCell>
              {projectNames.map((projectName) => (
                <TableCell key={projectName} sx={{ border: '1px solid silver' }}>{projectName}(%)</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ border: '1px solid silver' }}>
            <TableRow sx={{ border: '1px solid silver' }}>
              <TableCell sx={{ border: '1px solid silver' }}>{totals.totalWorkHours}</TableCell>
              <TableCell sx={{ border: '1px solid silver' }}>{totals.totalLeaveHours}</TableCell>
              <TableCell variant="h6" sx={{ border: '1px solid silver' }}>
                {chunkedData.reduce((acc, chunk) => acc + calcChunkGrandTotal(chunk), 0)}
              </TableCell>
              <TableCell sx={{ border: '1px solid silver' }}>{totals.totalLeaveDays}</TableCell>
              <TableCell sx={{ border: '1px solid silver' }}>{totals.totalWorkingDays}</TableCell>
              <TableCell sx={{ border: '1px solid silver' }}>{totals.totalDays}</TableCell>
              <TableCell>{totals.leavePercentage}%</TableCell>
              {projectNames.map((projectName) => (
                <TableCell key={projectName} sx={{ border: '1px solid silver' }}>
                {totals.projectPercentages && totals.projectPercentages[projectName] ? totals.projectPercentages[projectName].toFixed(2) + '%' : '0%'}
              </TableCell>
              ))}
              </TableRow>
              </TableBody>
              </Table>
              </TableContainer>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit Timesheet
              </Button>
              </Box>
              );
              };
              
 export default TimesheetSummary;
              
  
              