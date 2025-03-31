"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";

export default function DataTable() {
  const [rows, setRows] = useState([
    { id: "staff_1", name: "Staff 1", workingDays: 0, leaveDays: 0 },
    { id: "staff_2", name: "Staff 2", workingDays: 0, leaveDays: 0 },
  ]);

  const handleChange = (id, field, value) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: Number(value) || 0 } : row
    );
    setRows(updatedRows);
  };

  const handleSubmit = () => {
    const tableData = rows.reduce((acc, row) => {
      acc[row.id] = {
        leave_days: row.leaveDays,
        working_days: row.workingDays,
        total: row.workingDays + row.leaveDays,
      };
      return acc;
    }, {});
    console.log(JSON.stringify(tableData, null, 2));
  };

  return (
    <TableContainer component={Paper} className="p-4">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Staff</TableCell>
            <TableCell>Days Worked</TableCell>
            <TableCell>Leave Days</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={row.workingDays}
                  onChange={(e) =>
                    handleChange(row.id, "workingDays", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={row.leaveDays}
                  onChange={(e) =>
                    handleChange(row.id, "leaveDays", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>{row.workingDays + row.leaveDays}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        className="mt-4"
      >
        Log Data
      </Button>
    </TableContainer>
  );
}
