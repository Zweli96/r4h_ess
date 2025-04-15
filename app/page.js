"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";

const label = { inputProps: { "aria-label": "Switch demo" } };

const Protected = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/signin");
    } else if (status === "authenticated") {
      redirect("/dashboard");
    }
  }, [status]);

  return <CircularProgress />;
};

export default Protected;
