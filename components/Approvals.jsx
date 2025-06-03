"use client";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Title from "./Title";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { format, parseISO } from "date-fns";

const Approvals = ({ approvals, onApprove, onView, onReject }) => {
  const columns = [
    {
      field: "created_by_full_name",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
      headerClassName: "bold-header",
    },
    {
      field: "period",
      headerName: "Period",
      flex: 1,
      minWidth: 120,
      headerClassName: "bold-header",
    },
    {
      field: "current_status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      headerClassName: "bold-header",
    },
    {
      field: "created_at",
      headerName: "Date Submitted",
      flex: 1,
      minWidth: 120,
      headerClassName: "bold-header",
      valueGetter: (params) => {
        // Log params for debugging

        try {
          const date = parseISO(params);
          if (isNaN(date.getTime())) {
            console.warn("Invalid date for created_at:", params);
            return "Invalid Date";
          }
          return format(date, "dd-MM-yy");
        } catch (error) {
          console.error("Date parsing error:", error, params);
          return "Invalid Date";
        }
      },
    },
    {
      field: "total_hours",
      headerName: "Total Hours",
      flex: 1,
      minWidth: 120,
      headerClassName: "bold-header",
      renderCell: (params) => <Chip color="success" label={params.value} />,
    },
    {
      field: "leave_days",
      headerName: "Leave Days",
      flex: 1,
      minWidth: 120,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      minWidth: 150,
      headerClassName: "bold-header",
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <Tooltip title="View">
            <IconButton onClick={() => onView(params.row.id)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Approve">
            <IconButton
              onClick={() => onApprove(params.row.id)}
              color="primary"
            >
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject">
            <IconButton onClick={() => onReject(params.row)} color="primary">
              <CancelIcon color="error" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ display: "block", width: "100%" }}>
      <Title>Timesheet Approvals</Title>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <DataGrid
          rows={approvals}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          sx={{
            minWidth: 1000,
            border: 0, // Remove outside borders
            "& .bold-header": {
              fontWeight: 700, // Use numeric value for bold to ensure compatibility
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 700, // Explicitly set header title to bold
            },
          }}
          showToolbar
        />
      </Box>
    </Box>
  );
};

export default Approvals;
