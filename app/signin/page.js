"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import * as React from "react";
import SignInSide from "@../../../components/SignInSide";

export default function SignInPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      redirect("/dashboard");
    }
  }, [status]);
  return <SignInSide />;
}
