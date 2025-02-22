"use client";
import Approvals from "../../components/Approvals";
import Box from "@mui/material/Box";
import Nav from "../../components/Navbar";
import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { fetchApprovals, submitApproval } from "../api/api";
// Generate Order Data
function createData(
  id,
  name,
  period,
  date_submitted,
  total_hours,
  leave_taken
) {
  return { id, name, period, date_submitted, total_hours, leave_taken };
}

const page = () => {
  const [approvals, setApprovals] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleReject = async (id) => {
    try {
      await fetch(`/api/approvals/${id}/reject`, { method: "POST" });
      setRefresh((prev) => !prev); // Trigger a refresh
    } catch (error) {
      console.error("Error rejecting:", error);
    }
  };

  const handleApprove = async (id) => {
    debugger;
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
        onReject={() => console.log("Reject handler")}
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
    </Box>
  );
};

export default page;
