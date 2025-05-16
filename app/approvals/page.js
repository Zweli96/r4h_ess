"use client";
import Approvals from "../../components/Approvals";
import RejectTimesheetDialog from "../../components/RejectTimesheetDialog";
import ViewTimesheet from "../../components/ViewTimesheet.jsx";
import Box from "@mui/material/Box";
import Nav from "../../components/Navbar";
import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { fetchApprovals, submitApproval, submitRejection } from "../api/api";
import { signOut, useSession } from "next-auth/react";
import { useContext } from "react";
import { LoadingContext } from "../../components/LoadingContext";
import { set } from "date-fns";

const page = () => {
  const { data: session, status } = useSession({ required: true });
  const context = useContext(LoadingContext);
  const { setIsLoading } = context || {};
  console.log("Timesheets: LoadingContext value:", context);
  const [approvals, setApprovals] = useState([]);
  const [selectedRejectTimesheet, setSelectedRejectTimesheet] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState(null);
  const [viewTimesheetOpen, setViewTimesheetOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success", });
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false);

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const handleReject = async (id, rejection_reason) => {
    setIsLoading(true);
    try {
      const response = await submitRejection(id, rejection_reason);
      if (response.status !== 200) {
        throw new Error(`Rejection failed: ${response.status}: ${response.data.message || "Unknown error"}`);
      }
      setIsLoading(false);
      setSnackbar({
        open: true,
        message: "Timesheet rejected successfully!",
        type: "success",
      });
      setRefresh((prev) => !prev); // Trigger a refresh
      setRejectDialogOpen(false);
    } catch (error) {
      setIsLoading(false);
      setSnackbar({
        open: true,
        message: "Failed to approve timesheet.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenRejectDialog = (timesheet) => {
    setSelectedRejectTimesheet(timesheet);
    setRejectDialogOpen(true);
  };

  const handleApprove = async (id) => {
    setIsLoading(true);
    try {
      const response = await submitApproval(id);
      if (response.status !== 200) {
        throw new Error(`Approval failed: ${response.status}: ${response.data.message || "Unknown error"}`);
      }
      setIsLoading(false);
      setSnackbar({
        open: true,
        message: "Timesheet approved successfully!",
        type: "success",
      });
      setRefresh((prev) => !prev); // Trigger a refresh
    } catch (error) {
      setIsLoading(false);
      setSnackbar({
        open: true,
        message: "Failed to approve timesheet.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseViewTimesheet = () => {
    setViewTimesheetOpen(false);
    setViewedTimesheet(null);
  };

  const handleView = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/timesheets/${id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setViewedTimesheet(data);
    } catch (error) {
      console.error("Error viewing timesheet:", error);
    }
  };

  useEffect(() => {
    if (viewedTimesheet) {
      setViewTimesheetOpen(true);
    }
  }, [viewedTimesheet]);

  useEffect(() => {
    const loadApprovals = async () => {
      setIsLoading(true);
      try {
        const data = await fetchApprovals();
        setApprovals(data);
      } catch (error) {
        setIsLoading(false);
        setError("Error fetching approvals");
      } finally {
        setIsLoading(false);
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