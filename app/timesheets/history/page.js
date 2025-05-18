"use client";
import MyTimesheets from "../../../components/MyTimesheets";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { LoadingContext } from "../../../components/LoadingContext";
import { fetchMyTimesheets } from "../../api/api";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ViewTimesheetInfoDialog from "../../../components/ViewTimesheetInfoDialog";
import { signOut, useSession } from "next-auth/react";
import ViewTimesheet from "../../../components/ViewTimesheet";

const page = () => {
  const { data: session, status } = useSession({ required: true });
  const context = useContext(LoadingContext);
  const { setIsLoading } = context || {};
  console.log("Timesheets: LoadingContext value:", context);
  const [myTimesheets, setMyTimesheets] = useState([]);
  const [selectedViewTimesheet, setSelectedViewTimesheet] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);
  const [viewedTimesheet, setViewedTimesheet] = useState(null);
  const [viewTimesheetOpen, setViewTimesheetOpen] = useState(false);
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
      setIsLoading(true);
      try {
        const data = await fetchMyTimesheets();
        setMyTimesheets(data);
      } catch (error) {
        setIsLoading(false);
        setError("Error fetching timesheets");
      } finally {
        setLoading(false);
      }
    };
    loadMyTimesheets();
  }, [refresh]);


  const handleCloseViewTimesheet = () => {
    setViewTimesheetOpen(false);
    setViewedTimesheet(null);
  };


  const handleView = async (id) => {
    try {
      const response = await fetch(`/api/proxy/timesheets/${id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setViewedTimesheet(data);
      setViewTimesheetOpen(true);
    } catch (error) {
      console.error("Error viewing timesheet:", error);
    }
  };

  return (
    <Box sx={{ display: "block" }}>
      <MyTimesheets
        timesheets={myTimesheets}
        onInfo={handleTimesheetInfoDialog}
        loading={loading}
        onView={handleView}
      />
      <ViewTimesheetInfoDialog
        open={viewTimesheetInfoDialogOpen}
        onClose={handleCloseTimesheetInfoDialog}
        timesheet={selectedViewTimesheet}
      />


<Dialog 
  open={viewTimesheetOpen} 
  onClose={handleCloseViewTimesheet} 
  fullWidth={true} 
  maxWidth={'xl'}
>{viewedTimesheet && 
  <>
    <DialogTitle>Timesheet for {viewedTimesheet.created_by_full_name} - {viewedTimesheet.period}</DialogTitle>
    <DialogContent>
      <ViewTimesheet viewedTimesheet={viewedTimesheet} />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseViewTimesheet}>Close</Button>
    </DialogActions>
  </>
}
</Dialog>
    </Box>
  );
};

export default page;
