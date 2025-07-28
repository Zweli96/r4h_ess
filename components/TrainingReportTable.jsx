import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material"; // Import Button component
import Tooltip from "@mui/material/Tooltip";
import DownloadIcon from "@mui/icons-material/Download";
import IconButton from "@mui/material/IconButton";

// Define the columns for the Data Grid
const columns = [
  { field: "id", headerName: "ID", hide: true }, // Hidden ID field for DataGrid requirement
  { field: "financial_year_name", headerName: "Financial Year", flex: 1 }, // Use flex for proportional width
  { field: "user_full_name", headerName: "Staff Name", flex: 1 },
  { field: "position", headerName: "Position", flex: 1 }, // Added back to display position data
  { field: "course_title", headerName: "Course", flex: 1 },
  {
    field: "is_completed",
    headerName: "Status",
    flex: 0.5, // Slightly smaller width for status
    renderCell: (params) => (params.value ? "Completed" : "Not Complete"),
  },
  {
    field: "action", // New field for the Action column
    headerName: "Action",
    flex: 0.5, // Smaller width for action buttons
    sortable: false, // Actions columns are typically not sortable
    filterable: false, // Actions columns are typically not filterable
    renderCell: (params) => {
      // renderCell allows you to render custom content in a cell
      const handleDownload = () => {
        // In a real application, you would implement the download logic here.
        // For demonstration, we'll log the row data.
        console.log("Download clicked for row:", params.row);
        alert(
          `Downloading report for: ${params.row.staffName} - ${params.row.course}`
        );
        // You might trigger an API call to download a file related to this row
      };

      return (
        <>
          <Tooltip title="Download Certificate">
            <IconButton onClick={() => handleDownload()}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </>
      );
    },
  },
];

const TrainingReportTable = ({ trainingReports }) => {
  return (
    <Box sx={{ height: "85%", width: "100%", padding: 2 }}>
      <DataGrid
        rows={trainingReports}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10, // Default number of rows per page
            },
          },
        }}
        pageSizeOptions={[5, 10, 25]} // Options for rows per page
        disableRowSelectionOnClick // Disables row selection when clicking anywhere on the row
        sx={{
          // Target the main DataGrid root element to remove its border
          border: "none",
          // Target individual cells to remove their borders
          "& .MuiDataGrid-cell": {
            borderBottom: "none", // Remove horizontal borders between cells
          },
          // Target column headers to remove their borders
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "none", // Remove border below column headers
          },
          // Target the header separator lines if they appear
          // "& .MuiDataGrid-columnSeparator": {
          //   display: "none", // Hide vertical lines between column headers
          // },
        }}
        columnVisibilityModel={{
          id: false,
        }}
        showToolbar
      />
    </Box>
  );
};

export default TrainingReportTable;
