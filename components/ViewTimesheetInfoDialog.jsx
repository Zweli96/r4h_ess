// components/ViewTimesheetInfoDialog.jsx
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

export default function ViewTimesheetInfoDialog({ open, onClose, timesheet }) {
  // Default values to handle null/undefined fields
  const staffName = timesheet?.created_by
    ? `${timesheet.created_by_full_name}`.trim()
    : "N/A";
  const period = timesheet?.period || "N/A";
  const currentStatus = timesheet?.current_status || "N/A";
  const totalHours = timesheet?.total_hours || "N/A";
  const workingDays = timesheet?.working_days || "N/A";
  const leaveDays = timesheet?.leave_days || "N/A";
  const lineManagerApprovalDate = timesheet?.first_approval_date
    ? new Date(timesheet.first_approval_date).toLocaleDateString()
    : "N/A";
  const lineManagerApprovalBy = timesheet?.first_approver
    ? `${timesheet.line_manager_full_name}`.trim()
    : "N/A";
  const hrApprovalDate = timesheet?.second_approval_date
    ? new Date(timesheet.second_approval_date).toLocaleDateString()
    : "N/A";
  const hrApprovalBy = timesheet?.second_approver
    ? `${timesheet.second_approver_full_name}`.trim()
    : "N/A";
  const rejectedDate = timesheet?.rejected_date
    ? new Date(timesheet.rejected_date).toLocaleDateString()
    : "N/A";
  const rejectedBy = timesheet?.rejected_by
    ? `${timesheet.rejected_by_full_name}`.trim()
    : "N/A";
  const rejectionComment = timesheet?.comment || "N/A";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Timesheet Details {staffName} - {period}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Staff Name
            </Typography>
            <Typography variant="body1">{staffName}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Period
            </Typography>
            <Typography variant="body1">{period}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Current Status
            </Typography>
            <Typography variant="body1">{currentStatus}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Total Hours
            </Typography>
            <Typography variant="body1">{totalHours}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Working Days
            </Typography>
            <Typography variant="body1">{workingDays}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Leave Days
            </Typography>
            <Typography variant="body1">{leaveDays}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Line Manager Approval Date
            </Typography>
            <Typography variant="body1">{lineManagerApprovalDate}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Line Manager Approval By
            </Typography>
            <Typography variant="body1">{lineManagerApprovalBy}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              HR Approval Date
            </Typography>
            <Typography variant="body1">{hrApprovalDate}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              HR Approval By
            </Typography>
            <Typography variant="body1">{hrApprovalBy}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Rejected Date
            </Typography>
            <Typography variant="body1">{rejectedDate}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Rejected By
            </Typography>
            <Typography variant="body1">{rejectedBy}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Rejection Comment
            </Typography>
            <Typography variant="body1">{rejectionComment}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
