
import React from 'react';
import { Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TextField, Paper } from '@mui/material';

const TimeSheetWeek = ({
  daysChunk,
  chunkRows,
  chunkIndex,
  handleCellChange,
  handleChargeChange,
  LOE_ACTIVITIES,
  calcRowTotal,
  calcColumnTotal,
  calcChunkGrandTotal,
  calcChunkLOE,
  selectedActivities,
}) => {
  if (!daysChunk.length || !chunkRows.length) return null;

  const chunkTotal = calcChunkGrandTotal(chunkRows);
  const chunkLOE = calcChunkLOE(chunkRows, chunkTotal);

  return (
    <Box key={`chunk-${chunkIndex}`} sx={{ mb: 4 }}>
      <TableContainer component={Paper} sx={{ border: '', boxShadow: 'none', borderRadius: 0 }}>
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
              <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: '80px', border: '1px solid black' }}>
                % LOE
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: '100px', border: '1px solid black' }}>
                Charge Number
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
            {chunkRows.map((row, rowIndex) => {
              if (!selectedActivities.includes(row.activity)) return null;

              const rowTotal = calcRowTotal(row);
              const loe = LOE_ACTIVITIES.includes(row.activity) && chunkTotal > 0 ? (rowTotal / chunkTotal) * 100 : 0;

              return (
                <TableRow key={row.activity}>
                  <TableCell sx={{ fontSize: '12px', padding: 'none', border: '1px solid black' }}>
                    {row.activity}
                  </TableCell>
                  {daysChunk.map((day, dayIdx) => {
                    if (day.dayOfWeek === 0 || day.dayOfWeek === 6) {
                      return (
                        <TableCell key={day.dateStr} align="center" sx={{ backgroundColor: '#C0C0C0', minWidth: '80px', border: '1px solid black' }} />
                      );
                    }

                    return (
                      <TableCell key={day.dateStr} align="center" sx={{ border: '1px solid black' }}>
                        <TextField
                          type="number"
                          size="small"
                          value={row.daily[dayIdx]}
                          onChange={(e) => handleCellChange(chunkIndex, rowIndex, dayIdx, e.target.value)}
                          sx={{
                            width: '80px',
                            borderRadius: '4px',
                            border: 'none',
                            '& fieldset': { border: 'none' },
                            '& input': { textAlign: 'center' },
                          }}
                        />
                      </TableCell>
                    );
                  })}
                 <TableCell align="center" sx={{ minWidth: '80px', border: '1px solid black' }}>
  {rowTotal}
</TableCell>
<TableCell align="center" sx={{ minWidth: '80px', border: '1px solid black' }}>
  {LOE_ACTIVITIES.includes(row.activity) ? `${loe.toFixed(2)}%` : ''}
</TableCell>
<TableCell align="center" sx={{ minWidth: '100px', border: '1px solid black' }}>
  <TextField
    type="text"
    size="small"
    value={row.charge}
    onChange={(e) => handleChargeChange(chunkIndex, rowIndex, e.target.value)}
    sx={{
      width: '100px',
      border: 'none',
      '& fieldset': { border: 'none' },
      '& input': { textAlign: 'center' },
    }}
  />
</TableCell>
</TableRow>
);
})}
<TableRow>
<TableCell />
{daysChunk.map((d, dayIdx) => (
  <TableCell key={d.dateStr} align="center" sx={{ border: '1px solid #ddd', fontWeight: 'bold', minWidth: '80px', border: '1px solid black' }}>
    {calcColumnTotal(chunkRows, dayIdx)}
  </TableCell>
))}
<TableCell align="center" sx={{ border: '1px solid black', fontWeight: 'bold', minWidth: '80px' }}>
  {chunkTotal}
</TableCell>
<TableCell align="center" sx={{ border: '1px solid black', minWidth: '80px' }}>
  {chunkTotal > 0 ? `${(calcChunkLOE(chunkRows, chunkTotal)).toFixed(2)}%` : '0%'}
</TableCell>
<TableCell align="center" sx={{ border: '1px solid black', fontWeight: 'bold', minWidth: '100px' }} />
</TableRow>
</TableBody>
</Table>
</TableContainer>
</Box>
);
};

export default TimeSheetWeek;
