"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
} from "@mui/material";

export default function EditTimesheet({ timesheet, onSuccess }) {
  const [entries, setEntries] = useState(timesheet.entries);

  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const handleSubmit = async () => {
    await fetch(`/api/proxy/timesheets/${timesheet.id}/resubmit/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries }),
    });

    onSuccess();
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Hours</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {entries.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.date}</TableCell>
              <TableCell>
                <TextField
                  value={row.project}
                  onChange={(e) =>
                    handleChange(index, "project", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={row.hours}
                  onChange={(e) =>
                    handleChange(index, "hours", e.target.value)
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button
        sx={{ mt: 2 }}
        variant="contained"
        onClick={handleSubmit}
      >
        Resubmit Timesheet
      </Button>
    </>
  );
}
