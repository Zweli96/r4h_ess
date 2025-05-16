"use client";

import { useContext } from "react";
import { LoadingContext } from "../../components/LoadingContext"; // Adjust path
import { Button } from "@mui/material";

export default function Timesheets() {
  const context = useContext(LoadingContext);
  const { setIsLoading } = context || {};
  console.log("Timesheets: LoadingContext value:", context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!setIsLoading) return; // Guard against undefined context
    setIsLoading(true);
    try {
      // Simulate async operation (e.g., API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return <div>Loading session...</div>; // Prevent rendering until session is ready
  }

  return (
    <form onSubmit={handleSubmit}>
      <Button type="submit" variant="contained">
        Submit Timesheet
      </Button>
    </form>
  );
}
