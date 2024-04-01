"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";

const Protected = () => {
  const { status, data } = useSession();

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

  return <div>Loading...</div>;
};

export default Protected;
