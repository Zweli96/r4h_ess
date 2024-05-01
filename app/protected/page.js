"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";

const Protected = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/signin");
    }
  }, [status]);

  if (status === "authenticated") {
    return (
      <div>
        This page is protected for special people like {"\n"}
        {JSON.stringify(data.user, null, 2)}
      </div>
    );
  }

  return <CircularProgress />;
};

export default Protected;
