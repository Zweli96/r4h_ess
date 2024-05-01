"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { Box, Button, CircularProgress, Stack } from "@mui/material";

const Dashboard = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/signin");
    }
  }, [status]);

  return (
    <Box>
      <p>Dashboard</p>
      <p>Hello {session.user.first_name}</p>
      <p>Current period: April 2024</p>
      <p>Timesheet due: 16 April 2024</p>
    </Box>
  );
};

export default Dashboard;
