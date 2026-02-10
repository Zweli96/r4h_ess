"use client";
import { useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import ApprovalsCard from "../../components/ApprovalsCard";
import DaysUntilTimesheetCard from "../../components/DaysUntilTimesheet";
import ProfileInformationCard from "../../components/ProfileInformationCard";
import TrainingInformationCard from "../../components/TrainingInformationCard";
import Title from "../../components/Title";
import { fetchApprovals, fetchUserData } from "../api/api";
import { LoadingContext } from "../../components/LoadingContext";

export default function Home() {
  const { data: session, status } = useSession({ required: true });
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const [approvals, setApprovals] = useState([]);
  const [userData, setUserData] = useState(null);

  // Fetch approvals
  useEffect(() => {
    const loadApprovals = async () => {
      setIsLoading(true);
      try {
        const data = await fetchApprovals();
        setApprovals(data ?? []);
      } catch (error) {
        console.error("Error fetching approvals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadApprovals();
  }, [setIsLoading]);

  // Fetch user data
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchUserData();
        setUserData(data);
        console.log("Fetched user data:", data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, [setIsLoading]);

  // ── Loading / auth states ─────────────────────────────────────
  if (status === "loading" || isLoading) {
    return (
      <Box sx={{ m: 4, textAlign: "center", py: 10 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3, color: "text.secondary" }}>
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  // Safety guard in case session or critical data is missing
  if (!session) {
    return (
      <Box sx={{ m: 4, textAlign: "center", py: 10 }}>
        <Typography color="error" variant="h6">
          Please sign in to view the dashboard
        </Typography>
      </Box>
    );
  }

  // ── Main render ───────────────────────────────────────────────
  const fullName = `${userData?.first_name || ""} ${
    userData?.last_name || ""
  }`.trim();
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
          name={fullName || "—"}
          position={userData?.staff?.position ?? "—"}
          employee_id={userData?.staff?.employee_number ?? "—"}
          district={userData?.staff?.district ?? "—"}
          department={userData?.staff?.department ?? "—"}
          line_manager={userData?.staff?.line_manager ?? "—"}
        />

        <TrainingInformationCard
          completedTrainings={
            userData?.training_status?.completed_trainings ?? 0
          }
          totalTrainings={userData?.training_status?.total_trainings ?? 0}
          incompleteTrainingNames={
            userData?.training_status?.incomplete_training_names ?? []
          }
        />
      </Stack>

      <br />

      <Stack
        direction={{ xs: "column", sm: "column", md: "row" }}
        spacing={3}
        sx={{ alignItems: "stretch" }}
      >
        <DaysUntilTimesheetCard
          is_submitted={userData?.timesheet_submitted ?? false}
        />
        <ApprovalsCard pending_count={approvalCount} />
      </Stack>
    </Box>
  );
}
