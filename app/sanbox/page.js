import * as React from "react";
import Button from "@mui/material/Button";
import RejectTimesheetDialog from "../../components/RejectTimesheetDialog";

export default function ParentComponent() {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleFormSubmit = (formData) => {
    console.log("Form submitted with:", formData.email);
    setDialogOpen(false); // Close dialog after submission
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleOpenDialog}>
        Open Reject Timesheet Dialog
      </Button>
      <RejectTimesheetDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleFormSubmit}
        title="Reject Timesheet"
        contentText="Please enter your email to reject the timesheet."
      />
    </div>
  );
}
