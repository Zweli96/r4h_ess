"use client";
import React from "react";
import { Button } from "@mui/material";

function ExportReportButton({ onClick }) {
  return (
    <Button variant="contained" color="primary" onClick={onClick}>
      Export Reports
    </Button>
  );
}

export default ExportReportButton;
