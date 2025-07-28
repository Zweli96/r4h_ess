"use client";
import React, { useState, useEffect, useContext } from "react";
import { LoadingContext } from "../../../components/LoadingContext";
import { Stack } from "@mui/material";
import Title from "../../../components/Title";
import SearchFilters from "../../../components/TrainingReportFilters";
import SearchButton from "../../../components/TrainingReportButton";
import TrainingReportTable from "../../../components/TrainingReportTable";
import { fetchTrainingReports } from "../../api/api";

const page = () => {
  const context = useContext(LoadingContext);
  const [error, setError] = useState(null);
  const { setIsLoading } = context || {};
  const [filters, setFilters] = useState({ query: "", category: "" });
  const [results, setResults] = useState([]);
  const [trainingReports, setTrainingReports] = useState([]);

  useEffect(() => {
    const loadTrainingReports = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTrainingReports();
        setTrainingReports(data);
      } catch (error) {
        setIsLoading(false);
        setError("Error loading training reports" + error);
        console.error("Error loading training reports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTrainingReports();
  }, []);
  return (
    <div>
      <Title>Training Reports</Title>
      <Stack
        direction={"row"}
        spacing={2}
        sx={{
          padding: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <SearchButton />
        <SearchFilters filters={filters} />
      </Stack>
      <TrainingReportTable trainingReports={trainingReports} />
    </div>
  );
};

export default page;
