"use client";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import ApprovalsWaitingCard from "../../components/ApprovalsCard";
import DaysUntilTimesheetCard from "../../components/DaysUntilTimesheet";
import ProfileInformationCard from "../../components/ProfileInformationCard";
import ApprovalsCard from "../../components/ApprovalsCard";
import Title from "../../components/Title";
import axios from "axios";
import Typography from "@mui/material/Typography";
import { fetchApprovals } from "../api/api";
import { useContext } from "react";
import { LoadingContext } from "../../components/LoadingContext";

export default function Home() {
  const { data: session, status } = useSession({ required: true });
  const context = useContext(LoadingContext);
  const { setIsLoading } = context || {};
  const [approvals, setApprovals] = useState([]);
  const [response, setResponse] = useState("{}");

  useEffect(() => {
    const loadApprovals = async () => {
      setIsLoading(true);
      try {
        const data = await fetchApprovals();
        setIsLoading(false);
        setApprovals(data);
      } catch (error) {
        setIsLoading(false);
        console.log("Error fetching approvals" + error);
      } finally {
        setIsLoading(false);
      }
    };
    loadApprovals();
  }, []);

  if (status == "loading") {
    return <CircularProgress />;
  }

  if (session) {
    const fullName =
      `${session.user.first_name} ${session.user.last_name}`.trim();
    const approvalCount = approvals.length;
    return (
      <Box sx={{ m: 4 }}>
        <Title>Dashboard</Title>
        <Stack
          direction={{ xs: "column", sm: "column", md: "row" }}
          spacing={3}
          sx={{ alignItems: "stretch" }}
        >
          <ProfileInformationCard
            name={fullName}
            position={session.user.staff.position}
            employee_id={session.user.staff.employee_number}
            district={session.user.staff.district}
            department={session.user.staff.department}
            line_manager={session.user.staff.line_manager}
          />
        </Stack>
        <br />
        <Stack
          direction={{ xs: "column", sm: "column", md: "row" }}
          spacing={3}
          sx={{ alignItems: "stretch" }}
        >
          <DaysUntilTimesheetCard
            is_submitted={session.user.timesheet_submitted}
          />
          <ApprovalsCard pending_count={approvalCount} />
        </Stack>
      </Box>
    );
  }

  return <></>;
}
