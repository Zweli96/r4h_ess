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
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { IconButton, Paper, TableContainer } from "@mui/material";
import { format } from "date-fns";
import CircularProgress from "@mui/material/CircularProgress";

function preventDefault(event) {
  event.preventDefault();
}

const BoldTableCell = (props) => (
  <TableCell sx={{ fontWeight: "bold" }} {...props} />
);

const Approvals = ({ approvals, onApprove, onView, onReject }) => {
  return (
    <Box sx={{ display: "block" }}>
      <Title>Timesheet Approvals</Title>
      <TableContainer  component={Paper} sx={{ overflowX: "auto" ,boxShadow: "none", borderRadius: 0 }}>
      <Table size="small" sx={{ minWidth: 1000,maxWidth:'100vw' }} stickyHeader>
        <TableHead>
          <TableRow>
            <BoldTableCell>Name</BoldTableCell>
            <BoldTableCell>Period</BoldTableCell>
            <BoldTableCell>Status</BoldTableCell>
            <BoldTableCell>Date Submitted</BoldTableCell>
            <BoldTableCell>Total Hours</BoldTableCell>
            <BoldTableCell>Leave Days</BoldTableCell>
            <BoldTableCell align="center">Action</BoldTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {approvals.map((approval) => (
            <TableRow key={approval.id}>
              <TableCell>{approval.created_by_full_name}</TableCell>
              <TableCell>{approval.period}</TableCell>
              <TableCell>{approval.current_status}</TableCell>
              <TableCell>
                {format(new Date(approval.created_at), "dd-MM-yy")}
              </TableCell>
              <TableCell>
                <Chip color="success" label={approval.total_hours} />
              </TableCell>
              <TableCell>{approval.leave_days}</TableCell>
              <TableCell align="center">
                <Tooltip title="View">
                  <IconButton onClick={() => onView(approval.id)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Approve">
                  <IconButton
                    onClick={() => onApprove(approval.id)}
                    color="primary"
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reject">
                  <IconButton
                    onClick={() => onReject(approval)}
                    color="primary"
                  >
                    <CancelIcon color="error" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>
    </Box>
  );
};

export default Approvals;
