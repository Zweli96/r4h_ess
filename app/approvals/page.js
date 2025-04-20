"use client";
import Approvals from "../../components/Approvals";
import RejectTimesheetDialog from "../../components/RejectTimesheetDialog";
import Box from "@mui/material/Box";
import Nav from "../../components/Navbar";
import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { fetchApprovals, submitApproval, submitRejection } from "../api/api";
import { signOut, useSession } from "next-auth/react";

const page = () => {
  const { data: session, status } = useSession({ required: true });
  const [approvals, setApprovals] = useState([]);
  const [selectedRejectTimesheet, setSelectedRejectTimesheet] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false);

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleReject = async (id, rejection_reason) => {
    setLoading((prev) => ({ ...prev, [id]: true })); // Set loading for the specific item
    try {
      const response = await submitRejection(id, rejection_reason);

      if (response.status !== 200) {
        throw new Error(
          `Rejection failed: ${response.status}: ${
            response.data.message || "Unknown error"
          }`
        );
      }

      setSnackbar({
        open: true,
        message: "Timesheet rejected successfully!",
        type: "success",
      });
      setRefresh((prev) => !prev); // Trigger a refresh
      setRejectDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to approve timesheet.",
        type: "error",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false })); // Reset loading
    }
  };

  const handleOpenRejectDialog = (timesheet) => {
    setSelectedRejectTimesheet(timesheet);
    setRejectDialogOpen(true);
  };

  const handleApprove = async (id) => {
    setLoading((prev) => ({ ...prev, [id]: true })); // Set loading for the specific item
    try {
      const response = await submitApproval(id);

      if (response.status !== 200) {
        throw new Error(
          `Approval failed: ${response.status}: ${
            response.data.message || "Unknown error"
          }`
        );
      }

      setSnackbar({
        open: true,
        message: "Timesheet approved successfully!",
        type: "success",
      });
      setRefresh((prev) => !prev); // Trigger a refresh
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to approve timesheet.",
        type: "error",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false })); // Reset loading
    }
  };

  const handleView = async (id) => {
    try {
      await fetch(`/api/approvals/${id}/view`, { method: "POST" });
      setRefresh((prev) => !prev); // Trigger a refresh
    } catch (error) {
      console.error("Error viewing:", error);
    }
  };

  useEffect(() => {
    const loadApprovals = async () => {
      try {
        const data = await fetchApprovals();
        setApprovals(data);
      } catch (error) {
        setError("Error fetching approvals");
      } finally {
        setLoading(false);
      }
    };
    loadApprovals();
  }, [refresh]);

  return (
    <Box sx={{ display: "block" }}>
      <Approvals
        approvals={approvals}
        onApprove={handleApprove}
        onReject={handleOpenRejectDialog}
        onView={() => console.log("View handler")}
        loading={loading}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.type}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <RejectTimesheetDialog
        open={rejectDialogOpen}
        onClose={handleCloseRejectDialog}
        onSubmit={handleReject}
        rejectTimesheetId={selectedRejectTimesheet?.id}
        title={`Reject Timesheet: ${
          selectedRejectTimesheet?.created_by_full_name || ""
        } - ${selectedRejectTimesheet?.period || ""}`}
        contentText="Please enter your reason for rejecting this timesheet."
      />
    </Box>
  );
};

export default page;
