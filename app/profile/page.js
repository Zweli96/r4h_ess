"use client";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import axios from "axios";

export default function Home() {
  const { data: session, status } = useSession({ required: true });
  const [response, setResponse] = useState("{}");

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
    return (
      <Box sx={{ m: 4 }}>
        <Stack direction={"column"}>
          <p>PK: {session.user.pk}</p>
          <p>Username: {session.user.username}</p>
          <p>Email: {session.user.email || "Not provided"}</p>
          <code>{response}</code>
        </Stack>
        <Stack direction={"row"}>
          <Button color={"secondary"} onClick={() => getUserDetails(true)}>
            User details (with token)
          </Button>
          <Button color={"info"} onClick={() => getUserDetails(false)}>
            User details (without token)
          </Button>
          <Button color={"error"} onClick={() => signOut({ callbackUrl: "/" })}>
            Sign out
          </Button>
        </Stack>
      </Box>
    );
  }

  return <></>;
}
