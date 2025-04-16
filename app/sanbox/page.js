"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import RejectTimesheetDialog from "../../components/RejectTimesheetDialog";

export default function ParentComponent() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = React.useState(null);

  const timesheets = [
    { id: 1, name: "John Doe - Week 1" },
    { id: 2, name: "Jane Smith - Week 1" },
    { id: 3, name: "Bob Johnson - Week 2" },
  ];

  const handleOpenDialog = (timesheet) => {
    setSelectedTimesheet(timesheet);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleFormSubmit = (formData) => {
    console.log(`Rejecting Timesheet ID: ${selectedTimesheet.id}`, formData);
    setDialogOpen(false); // Close dialog after submission
    setSelectedTimesheet(null);
  };

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {timesheets.map((timesheet) => (
            <TableRow key={timesheet.id}>
              <TableCell>{timesheet.name}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleOpenDialog(timesheet)}
                >
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <RejectTimesheetDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleFormSubmit}
        title={`Reject Timesheet: ${selectedTimesheet?.name || ""}`}
        contentText="Please enter your reason for rejecting this timesheet."
      />
    </div>
  );
}
