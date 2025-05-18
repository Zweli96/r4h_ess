"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import LoadingOverlay from "../components/LoadingOverlay";
import { useContext } from "react";
import { LoadingContext } from "../components/LoadingContext";
import { set } from "date-fns";

const label = { inputProps: { "aria-label": "Switch demo" } };

const Protected = () => {
  const { data: session, status } = useSession();
  const context = useContext(LoadingContext);
  const { setIsLoading } = context || {};

  useEffect(() => {
    setIsLoading(true);
    if (status === "unauthenticated") {
      setIsLoading(false);
      redirect("/signin");
    } else if (status === "authenticated") {
      setIsLoading(false);
      redirect("/dashboard");
    } else if (status === "loading") {
      setIsLoading(true);
    }
    setIsLoading(false);
  }, [status]);

  return <LoadingOverlay open={true} />;
};

export default Protected;
