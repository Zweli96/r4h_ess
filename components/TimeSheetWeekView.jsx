
import React from 'react';
import { Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

const TimeSheetWeekView = ({ daysChunk, chunkRows }) => {
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
              {/* <TableCell>Loe %</TableCell> */}
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#C0C0C0', border: '1px solid black' }} />
              {daysChunk.map((d) => (
                <TableCell key={d.dateStr} align="center" sx={{ minWidth: '80px', border: '1px solid black' }}>
                  {d.dayName}
                </TableCell>
              ))}
              {/* <TableCell /> */}
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
      {/* <TableCell /> */}
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
              {/* <TableCell></TableCell> */}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TimeSheetWeekView;