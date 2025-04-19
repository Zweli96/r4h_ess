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

export default function Home() {
  const { data: session, status } = useSession({ required: true });
  const [approvals, setApprovals] = useState([]);
  const [response, setResponse] = useState("{}");

  useEffect(() => {
    const loadApprovals = async () => {
      try {
        const data = await fetchApprovals();
        setApprovals(data);
      } catch (error) {
        console.log("Error fetching approvals" + error);
      }
    };
    loadApprovals();
  }, []);

  const getUserDetails = async (useToken) => {
    try {
      const response = await axios({
        method: "get",
        url: process.env.NEXT_PUBLIC_BACKEND_URL + "auth/user/",
        headers: useToken
          ? { Authorization: "Bearer " + session?.access_token }
          : {},
      });
      console.log(response);
      setResponse(JSON.stringify(response.data));
    } catch (error) {
      setResponse(error.message);
    }
  };

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
