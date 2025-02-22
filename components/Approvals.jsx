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
import { IconButton } from "@mui/material";
import { format } from "date-fns";
import CircularProgress from "@mui/material/CircularProgress";

function preventDefault(event) {
  event.preventDefault();
}

const Approvals = ({ approvals, onApprove, onView, onReject, loading }) => {
  return (
    <Box sx={{ display: "block" }}>
      <Title>Timesheet Approvals</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Period</TableCell>
            <TableCell>Date Submitted</TableCell>
            <TableCell>Total Hours</TableCell>
            <TableCell>Leave Taken</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {approvals.map((approval) => (
            <TableRow key={approval.id}>
              <TableCell>{approval.current_status}</TableCell>
              <TableCell>{approval.created_by_full_name}</TableCell>
              <TableCell>{approval.period_name}</TableCell>
              <TableCell>
                {format(new Date(approval.created_at), "dd-MM-yy")}
              </TableCell>
              <TableCell>
                <Chip color="success" label={approval.total_hours} />
              </TableCell>
              <TableCell>{approval.leave_days}</TableCell>
              <TableCell align="right">
                <Tooltip title="View">
                  <IconButton onClick={() => onView(approval.id)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Approve">
                  <IconButton
                    onClick={() => onApprove(approval.id)}
                    color="primary"
                    disabled={loading[approval.id]} // Disable button while loading
                  >
                    {loading[approval.id] ? (
                      <CircularProgress size={24} />
                    ) : (
                      <CheckCircleIcon />
                    )}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reject">
                  <IconButton
                    onClick={() => onReject(approval.id)}
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
    </Box>
  );
};

export default Approvals;
