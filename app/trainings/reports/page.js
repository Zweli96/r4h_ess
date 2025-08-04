"use client";
import React, { useState, useEffect, useContext } from "react";
import { LoadingContext } from "../../../components/LoadingContext";
import { Stack } from "@mui/material";
import Title from "../../../components/Title";
import SearchFilters from "../../../components/TrainingReportFilters";
import SearchButton from "../../../components/TrainingReportButton";
import TrainingReportTable from "../../../components/TrainingReportTable";
import ExportModal from "../../../components/ExportModal";
import {
  fetchTrainingReports,
  fetchCourses,
  fetchFinancialYears,
  fetchReportExport,
} from "../../api/api";

const page = () => {
  const context = useContext(LoadingContext);
  const [error, setError] = useState(null);
  const { setIsLoading } = context || {};
  const [filters, setFilters] = useState({ course: "", financial_year: "" });
  const [trainingReports, setTrainingReports] = useState([]);
  const [courses, setCourses] = useState([]);
  const [financialYears, setFinancialYears] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFilters, setExportFilters] = useState({
    course: "",
    financial_year: "",
    format: "pdf",
  });

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleExportClick = () => {
    setExportFilters(filters); // pre-fill from current search filters
    setShowExportModal(true);
  };

  const handleExportFiltersChange = (newFilters) => {
    setExportFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleExport = async () => {
    try {
      const response = await fetchReportExport();

      // Create a blob from the response
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create a temporary download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "training_report.xlsx");
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);

      setShowExportModal(false);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  useEffect(() => {
    const loadTrainingReports = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTrainingReports(
          filters.course,
          filters.financial_year
        );
        setTrainingReports(data);
      } catch (error) {
        setError("Error loading training reports: " + error);
        console.error("Error loading training reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrainingReports();
  }, [filters]); //

  useEffect(() => {
    const loadFinancialYears = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFinancialYears();
        setFinancialYears(data);
      } catch (error) {
        setIsLoading(false);
        setError("Error loading financial years" + error);
        console.error("Error loading financial years:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFinancialYears();
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (error) {
        setIsLoading(false);
        setError("Error loading courses" + error);
        console.error("Error loading courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCourses();
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
        <SearchButton onClick={() => setShowExportModal(true)} />
        <SearchFilters
          filters={filters}
          onChange={handleFilterChange}
          financial_years_list={financialYears}
          courses_list={courses}
        />
      </Stack>
      <TrainingReportTable trainingReports={trainingReports} />
      <ExportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        filters={filters}
        onChange={handleFilterChange}
        financial_years_list={financialYears} // ✅ correct name
        courses_list={courses} // ✅ correct name
      />
    </div>
  );
};

export default page;
