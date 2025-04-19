"use client";
import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { IconButton } from "@mui/material";
import { format } from "date-fns";
import CircularProgress from "@mui/material/CircularProgress";

function preventDefault(event) {
  event.preventDefault();
}

const BoldTableCell = (props) => (
  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }} {...props} />
);

const getStatusColor = (status) => {
  switch (status) {
    case "Submitted":
      return "default";
    case "Rejected":
      return "error";
    case "Line Manager Approved":
      return "info";
    case "HR Approved":
      return "success";
    default:
      return "default"; // Fallback color
  }
};

const MyTimesheets = ({ timesheets, onView, loading }) => {
  return (
    <Box sx={{ display: "block" }}>
      <Title>My Timesheets</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <BoldTableCell>Period</BoldTableCell>
            <BoldTableCell>Status</BoldTableCell>
            <BoldTableCell>Date Submitted</BoldTableCell>
            <BoldTableCell>Total Hours</BoldTableCell>
            <BoldTableCell>Leave Taken</BoldTableCell>
            <BoldTableCell align="center">Action</BoldTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {timesheets.map((timesheet) => (
            <TableRow key={timesheet.id}>
              <TableCell align="center">{timesheet.period}</TableCell>
              <TableCell align="center">
                <Chip
                  color={getStatusColor(timesheet.current_status)}
                  label={timesheet.current_status}
                />
              </TableCell>
              <TableCell align="center">
                {format(new Date(timesheet.created_at), "dd-MM-yy")}
              </TableCell>
              <TableCell align="center">{timesheet.total_hours}</TableCell>
              <TableCell align="center">{timesheet.leave_days}</TableCell>
              <TableCell align="center">
                <Tooltip title="View">
                  <IconButton onClick={() => onView(timesheet)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Information">
                  <IconButton
                    onClick={() => onApprove(timesheet.id)}
                    disabled={loading[timesheet.id]} // Disable button while loading
                  >
                    {loading[timesheet.id] ? (
                      <CircularProgress size={24} />
                    ) : (
                      <InfoIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default MyTimesheets;
