"use client";
import MyTimesheets from "../../../components/MyTimesheets";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import { fetchMyTimesheets } from "../../api/api";
import ViewTimesheetInfoDialog from "../../../components/ViewTimesheetInfoDialog";

const page = () => {
  const [myTimesheets, setMyTimesheets] = useState([]);
  const [selectedViewTimesheet, setSelectedViewTimesheet] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);

  const [viewTimesheetInfoDialogOpen, setViewTimesheetInfoDialogOpen] =
    React.useState(false);

  const handleTimesheetInfoDialog = (timesheet) => {
    setSelectedViewTimesheet(timesheet);
    setViewTimesheetInfoDialogOpen(true);
  };

  const handleCloseTimesheetInfoDialog = () => {
    setViewTimesheetInfoDialogOpen(false);
  };

  useEffect(() => {
    const loadMyTimesheets = async () => {
      try {
        const data = await fetchMyTimesheets();
        setMyTimesheets(data);
      } catch (error) {
        setError("Error fetching timesheets");
      } finally {
        setLoading(false);
      }
    };
    loadMyTimesheets();
  }, [refresh]);

  return (
    <Box sx={{ display: "block" }}>
      <MyTimesheets
        timesheets={myTimesheets}
        onView={handleTimesheetInfoDialog}
        loading={loading}
      />
      <ViewTimesheetInfoDialog
        open={viewTimesheetInfoDialogOpen}
        onClose={handleCloseTimesheetInfoDialog}
        timesheet={selectedViewTimesheet}
      />
    </Box>
  );
};

export default page;
