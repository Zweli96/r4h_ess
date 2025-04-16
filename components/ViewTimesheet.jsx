"use client"
import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function ViewTimesheet({ timesheetData }) {
  const [projects, setProjects] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [tableData, setTableData] = useState({});
  const [dates, setDates] = useState([]);
  const [chunkedDates, setChunkedDates] = useState([]);

  useEffect(() => {
    if (timesheetData) {
      const projectsSet = new Set();
      const leaveTypesSet = new Set();
      const tableData = {};
      const dates = Object.keys(timesheetData);
      setDates(dates);
      dates.forEach((date) => {
        tableData[date] = {};
        Object.keys(timesheetData[date].projects).forEach((project) => {
          projectsSet.add(project);
          tableData[date][project] = timesheetData[date].projects[project];
        });
        Object.keys(timesheetData[date].leave).forEach((leaveType) => {
          leaveTypesSet.add(leaveType);
          tableData[date][leaveType] = timesheetData[date].leave[leaveType];
        });
      });
      setProjects([...projectsSet]);
      setLeaveTypes([...leaveTypesSet]);
      setTableData(tableData);
    }
  }, [timesheetData]);

  useEffect(() => {
    if (dates.length > 0) {
      const chunk = (array, size) => {
        const chunked_arr = [];
        let index = 0;
        while (index < array.length) {
          chunked_arr.push(array.slice(index, size + index));
          index += size;
        }
        return chunked_arr;
      };
      setChunkedDates(chunk(dates, 7));
    }
  }, [dates]);

  if (!timesheetData || Object.keys(timesheetData).length === 0) {
    return <div>No data available</div>;
  }

  return (
    <TableContainer component={Paper}>
      {chunkedDates.map((week, weekIndex) => (
        <Table key={weekIndex}>
          <TableHead>
            <TableRow>
              {week.map((date) => (
                <TableCell key={date}>{date}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...projects, ...leaveTypes].map((activity) => (
              <TableRow key={activity}>
                {week.map((date) => (
                  <TableCell key={date + activity}>
                    {tableData[date] && tableData[date][activity]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ))}
    </TableContainer>
  );
}

export default ViewTimesheet;