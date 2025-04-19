import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function RejectTimesheetDialog({
  open,
  onClose,
  onSubmit,
  rejectTimesheetId,
  title,
  contentText,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          onSubmit(rejectTimesheetId, formJson.rejection_reason); // Pass form data to parent
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{contentText}</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="rejection_reason"
            name="rejection_reason"
            label="Rejection Reason"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" type="submit">
            Reject
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
