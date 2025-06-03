"use client";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Title from "./Title";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { format, parseISO } from "date-fns";

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
      return "default";
  }
};

const MyTimesheets = ({ timesheets, onView, onInfo, loading }) => {
  // Log raw timesheets data for debugging
  console.log("Raw timesheets data:", timesheets);

  const columns = [
    {
      field: "period",
      headerName: "Period",
      flex: 1,
      minWidth: 120,
      headerClassName: "bold-header",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "current_status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      headerClassName: "bold-header",
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params != null
          ? (console.log(params),
            (
              <Chip
                color={getStatusColor(params.row.current_status)}
                label={params.row.current_status}
              />
            ))
          : "N/A",
    },
    {
      field: "created_at",
      headerName: "Date Submitted",
      flex: 1,
      minWidth: 120,
      headerClassName: "bold-header",
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => {
        // Log params for debugging
        console.log("valueGetter params:", params);
        if (!params || !params) {
          console.warn("Missing created_at in params:", params);
          return "N/A";
        }
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
      align: "center",
      headerAlign: "center",
    },
    {
      field: "leave_days",
      headerName: "Leave Days",
      flex: 1,
      minWidth: 120,
      headerClassName: "bold-header",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      minWidth: 150,
      headerClassName: "bold-header",
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (!params || params.id == null) {
          console.warn("Invalid params in actions renderCell:", params);
          return null;
        }
        return (
          <>
            <Tooltip title="View">
              <IconButton onClick={() => onView(params.row.id)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Information">
              <IconButton
                onClick={() => onInfo(params.row)}
                disabled={loading[params.row.id]}
              >
                {loading[params.row.id] ? (
                  <CircularProgress size={24} />
                ) : (
                  <InfoIcon />
                )}
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  // Filter out invalid rows and ensure unique id
  const processedTimesheets = (timesheets || [])
    .filter((timesheet, index) => {
      if (
        !timesheet ||
        typeof timesheet !== "object" ||
        Object.keys(timesheet).length === 0
      ) {
        console.warn(`Invalid timesheet at index ${index}:`, timesheet);
        return false;
      }
      if (!timesheet.created_at) {
        console.warn(
          `Missing created_at in timesheet at index ${index}:`,
          timesheet
        );
        return false;
      }
      if (timesheet.id == null) {
        console.warn(`Missing id in timesheet at index ${index}:`, timesheet);
      }
      return true;
    })
    .map((timesheet, index) => ({
      ...timesheet,
      id: timesheet.id ?? String(index),
    }));

  // Log processed timesheets
  console.log("Processed timesheets:", processedTimesheets);

  return (
    <Box sx={{ display: "block", width: "100%" }}>
      <Title>My Timesheets</Title>
      <Box sx={{ height: 400, width: "100%", overflowX: "auto" }}>
        <DataGrid
          rows={processedTimesheets}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          showToolbar
          sx={{
            minWidth: 1000,
            border: 0, // Remove outside borders
            "& .bold-header": {
              fontWeight: 700,
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 700,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default MyTimesheets;
