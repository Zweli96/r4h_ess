
import React from 'react';
import { Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import  { useState, useEffect } from "react";
import { fetchActivities } from "../app/api/api";
const TimeSheetWeekView = ({ daysChunk, chunkRows }) => {
  const [activities, setActivities] = useState([]);
 // getting activities from database
 const fetchActivities = async () => {
  try {
    const response = await fetch(
      "/api/proxy/timesheets/activities"
    );
    const data = await response.json();
    console.log(data)
    setActivities(data);
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    fetchActivities();
//     let activities_data = fetchActivities();
//  setActivities(activities_data);
  }, []);


//assigning loa activities from database
const loeActivities = activities.filter((activity) => activity.is_loe);
const LOE_ACTIVITIES = loeActivities.map((activity) => activity.name);


  // const LOE_ACTIVITIES = ["Leave", "Other LOE Activity"];

  if (!daysChunk.length || !chunkRows.length) return null;

  const calcRowTotal = (row) => {
    return row.daily.reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
  };

  const calcColumnTotal = (rows, columnIndex) => {
    return rows.reduce((acc, row) => acc + (parseFloat(row.daily[columnIndex]) || 0), 0);
  };

  const calcChunkGrandTotal = (rows) => {
    return rows.reduce((acc, row) => acc + calcRowTotal(row), 0);
  };

  const chunkTotal = calcChunkGrandTotal(chunkRows);


  const calcLOE = (chunkRows, chunkTotal) => {
    const loeHours = chunkRows.reduce((sum, row) => {
      if (LOE_ACTIVITIES.includes(row.activity)) {
        return sum + calcRowTotal(row);
      }
      return sum;
    }, 0);
    return chunkTotal > 0 ? (loeHours / chunkTotal) * 100 : 0;
  };

  return (
    <Box sx={{ mb: 3 }}>
      <TableContainer component={Paper} sx={{ border: '', boxShadow: 'none', borderRadius: 0,marginBottom:-1 }}>
        <Table size="small" padding="none" sx={{ '& .MuiTableCell-root': { padding: '2px', fontSize: '12px', border: '1px solid black' } }}>
          <TableHead sx={{ fontWeight: 'bold', backgroundColor: '#C0C0C0', fontSize: '12px', border: '1px solid black' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#C0C0C0', fontSize: '12px', border: '1px solid black' }}>
                ACTIVITY
              </TableCell>
              {daysChunk.map((d) => (
                <TableCell key={d.dateStr} align="center" sx={{ fontWeight: 'bold', minWidth: '80px', fontSize: '12px', border: '1px solid black' }}>
                  {d.dayNum}
                </TableCell>
              ))}
              <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: '80px', border: '1px solid black' }}>
                Total Hours
              </TableCell>
              <TableCell>Loe %</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: '100px', border: '1px solid black' }}>
  Charge
</TableCell>

            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#C0C0C0', border: '1px solid black' }} />
              {daysChunk.map((d) => (
                <TableCell key={d.dateStr} align="center" sx={{ minWidth: '80px', border: '1px solid black' }}>
                  {d.dayName}
                </TableCell>
              ))}
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
            
          </TableHead>
          <TableBody>
            {/* {chunkRows.map((row) => (
              <TableRow key={row.activity}>
                <TableCell sx={{ fontSize: '12px', padding: 'none', border: '1px solid black' }}>
                  {row.activity}
                </TableCell>
                {daysChunk.map((day, dayIdx) => (
                  <TableCell key={day.dateStr} align="center" sx={{ backgroundColor: day.dayOfWeek === 0 || day.dayOfWeek === 6 ? '#C0C0C0' : '', border: '1px solid black' }}>
                    {row.daily[dayIdx]}
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ minWidth: '80px', border: '1px solid black' }}>
                  {calcRowTotal(row)}
                </TableCell>
                <TableCell/>
              </TableRow>
            ))} */}
              {chunkRows.map((row) => (
    <TableRow key={row.activity}>
      <TableCell sx={{ fontSize: '12px', padding: 'none', border: '1px solid black' }}>
        {row.activity}
      </TableCell>
      {row.daily.length === daysChunk.length ? (
        daysChunk.map((day, dayIdx) => (
          <TableCell key={day.dateStr} align="center" sx={{ backgroundColor: day.dayOfWeek === 0 || day.dayOfWeek === 6 ? '#C0C0C0' : '', border: '1px solid black' }}>
            {row.daily[dayIdx]}
          </TableCell>
        ))
      ) : (
        <TableCell colSpan={daysChunk.length}>Error: Daily data length mismatch</TableCell>
      )}
      <TableCell align="center" sx={{ minWidth: '80px', border: '1px solid black' }}>
        {calcRowTotal(row)}
      </TableCell>
      <TableCell align="center" sx={{ minWidth: '80px', border: '1px solid black' }}>
            {LOE_ACTIVITIES.includes(row.activity) ? `${((calcRowTotal(row) / chunkTotal) * 100).toFixed(2)}%` : ''}
          </TableCell>
          <TableCell sx={{ minWidth: '100px', border: '1px solid black' }}></TableCell>

    </TableRow>
  ))}

            <TableRow>
              <TableCell />
              {daysChunk.map((d, dayIdx) => (
                <TableCell key={d.dateStr} align="center" sx={{ border: '1px solid black', fontWeight: 'bold', minWidth: '80px', backgroundColor: d.dayOfWeek === 0 || d.dayOfWeek === 6 ? '#C0C0C0' : '' }}>
                  {calcColumnTotal(chunkRows, dayIdx)}
                </TableCell>
              ))}
              <TableCell align="center" sx={{ border: '1px solid black', fontWeight: 'bold', minWidth: '80px' }}>
                {chunkTotal}
              </TableCell>
              <TableCell align="center" sx={{ border: '1px solid black', fontWeight: 'bold', minWidth: '80px' }}>
          {`${calcLOE(chunkRows, chunkTotal).toFixed(2)}%`}
        </TableCell>
        <TableCell sx={{ minWidth: '100px', border: '1px solid black' }}></TableCell>

            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TimeSheetWeekView;