"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import ViewTimesheetInfoDialog from "../../components/ViewTimesheetInfoDialog";
import LoadingOverlay from "../../components/LoadingOverlay";

export default function ParentComponent() {
  // return <ViewTimesheetInfoDialog open={true} />;
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Simulate an async operation (e.g., API call)
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "20px" }}>
      <h1>My Next.js App</h1>
      <Button variant="contained" onClick={handleClick}>
        Trigger Loading
      </Button>
      <LoadingOverlay open={isLoading} />
    </div>
  );
}
