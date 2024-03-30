"use client";
import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "@components/Title";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

// Generate Order Data
function createData(
  id,
  name,
  period,
  date_submitted,
  total_hours,
  leave_taken
) {
  return { id, name, period, date_submitted, total_hours, leave_taken };
}

const rows = [
  createData(
    0,
    "Madalitso Gombwa",
    "February - 2024",
    "16 Mar, 2024",
    "176 / 176",
    "0 Days"
  ),
  createData(
    1,
    "Felix Petro",
    "February - 2024",
    "16 Mar, 2024",
    "176 / 176",
    "0 Days"
  ),
  createData(
    2,
    "Blessings Gausi",
    "February - 2024",
    "16 Mar, 2024",
    "176 / 176",
    "0 Days"
  ),
  createData(
    3,
    "Hope Mwase",
    "February - 2024",
    "16 Mar, 2024",
    "176 / 176",
    "10 Days"
  ),
  createData(
    4,
    "Emmanuel Potani",
    "February - 2024",
    "16 Mar, 2024",
    "176 / 176",
    "0 Days"
  ),
];

function preventDefault(event) {
  event.preventDefault();
}

export default function Approvals() {
  return (
    <Box sx={{ display: "block" }}>
      <Title>Timesheet Approvals</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox />
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Period</TableCell>
            <TableCell>Date Submitted</TableCell>
            <TableCell>Total Hours</TableCell>
            <TableCell>Leave Taken</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.period}</TableCell>
              <TableCell>{row.date_submitted}</TableCell>
              <TableCell>
                <Chip color="success" label={row.total_hours} />
              </TableCell>
              <TableCell>{row.leave_taken}</TableCell>
              <TableCell align="right">
                <Tooltip title="View">
                  <VisibilityIcon />
                </Tooltip>
                <Tooltip title="Approve">
                  <CheckCircleIcon color="primary" />
                </Tooltip>
                <Tooltip title="Reject">
                  <CancelIcon color="error" />
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
