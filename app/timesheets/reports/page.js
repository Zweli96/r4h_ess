"use client";
import React, { useState, useEffect, useContext } from "react";
import TimesheetReport from "../../../components/TimesheetReport";
import PdfTimesheetTable from "../../../components/PdfTimesheetTable";
import axiosInstance from "../../api/axiosInstance";
import { LoadingContext } from "../../../components/LoadingContext";
import { fetchMyTimesheets } from "../../api/api";
import * as XLSX from "xlsx";
import { useSession } from "next-auth/react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TextField,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  MenuItem,
  Paper,
  Box,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ViewTimesheet from "../../../components/ViewTimesheet";
import TablePagination from "@mui/material/TablePagination";

const TimesheetReports = () => {
  const { data: session, status } = useSession({ required: true });
  const context = useContext(LoadingContext);
  const { setIsLoading } = context || {};
  console.log("Timesheets: LoadingContext value:", context);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    format: "",
    district: "",
  });
  const [timesheets, setTimesheets] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [viewedTimesheet, setViewedTimesheet] = useState(null);
  const [viewedpageTimesheet, setViewedpageTimesheet] = useState("download");
  const [periodFilter, setPeriodFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [html2pdf, setHtml2pdf] = useState(null);
  const [isHtml2PdfLoaded, setIsHtml2PdfLoaded] = useState(false);

  // Load html2pdf.js client-side
  useEffect(() => {
    import("html2pdf.js")
      .then((mod) => {
        const lib = mod.default || mod;
        console.log("html2pdf loaded:", typeof lib, lib);
        setHtml2pdf(() => lib);
        setIsHtml2PdfLoaded(true);
      })
      .catch((error) => {
        console.error("Failed to load html2pdf:", error);
        setIsHtml2PdfLoaded(false);
      });
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/timesheets/districts/");
        setDistricts(response.data);
        console.log("Districts:", response.data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDistricts();
  }, [setIsLoading]);

  useEffect(() => {
    const fetchTimesheetReport = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/timesheets/timesheetReport");
        setTimesheets(response.data);
        console.log("Timesheet Report:", response.data);
      } catch (error) {
        console.error("Error fetching timesheet report:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimesheetReport();
  }, [setIsLoading]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleShowExport = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const filteredTimesheets = timesheets.filter((entry) => {
    const search = searchTerm.toLowerCase();
    return (
      (entry.employee_id.toString().includes(search) ||
        entry.staff_name.toLowerCase().includes(search) ||
        entry.department.toLowerCase().includes(search) ||
        entry.district.toLowerCase().includes(search) ||
        entry.period.toLowerCase().includes(search)) &&
      (districtFilter === "" ||
        entry.district.toLowerCase() === districtFilter.toLowerCase()) &&
      (periodFilter === "" ||
        entry.period.toLowerCase().includes(periodFilter.toLowerCase()))
    );
  });

  const handleDownload = async (entry) => {
    try {
      const response = await axiosInstance.get(`/timesheets/${entry.id}/`);
      const data = response.data;
      setViewedTimesheet(data);
      setTimeout(() => {
        const downloadelement = document.getElementById("content");
        if (
          downloadelement &&
          isHtml2PdfLoaded &&
          typeof html2pdf === "function"
        ) {
          downloadelement.classList.remove("hidden");
          downloadelement.classList.add("visible");
          const opt = {
            margin: 0.2,
            filename: `Timesheet Report_${entry.employee_id}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a3", orientation: "landscape" },
          };

          console.log("Calling html2pdf for download:", html2pdf);
          html2pdf()
            .set(opt)
            .from(downloadelement)
            .save()
            .then(() => {
              downloadelement.classList.remove("visible");
              downloadelement.classList.add("hidden");
            })
            .catch((error) => {
              console.error("PDF generation error:", error);
              alert("Failed to generate PDF. Please try again.");
            });
        } else {
          console.error(
            "PDF generation failed:",
            !downloadelement ? "Content not found" : "",
            !isHtml2PdfLoaded ? "html2pdf not loaded" : "",
            typeof html2pdf !== "function" ? "html2pdf is not a function" : ""
          );
          alert("PDF generation failed: Library or content not available.");
        }
      }, 1000);
    } catch (error) {
      console.error("Error fetching timesheet:", error);
      alert("Failed to fetch timesheet data.");
    }
  };

  const handleExport = () => {
    if (
      !filters.startDate ||
      !filters.endDate ||
      !filters.district ||
      !filters.format
    ) {
      alert("Please fill out all required fields.");
      return;
    }
    const filteredData = timesheets.filter((entry) => {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const formatPeriod = (period) => {
        const [monthName, year] = period.split(" ");
        const month = (monthNames.indexOf(monthName) + 1)
          .toString()
          .padStart(2, "0");
        return `${year}-${month}`;
      };
      const periodDate = formatPeriod(entry.period);
      const filterStartDate = filters.startDate || "";
      const filterEndDate = filters.endDate || "";
      return (
        (filterStartDate === "" || periodDate >= filterStartDate) &&
        (filterEndDate === "" || periodDate <= filterEndDate) &&
        (filters.district === "" || entry.district === filters.district)
      );
    });
    setFilteredData(filteredData);
    if (filteredData.length > 0) {
      const fileName = `Timesheet Report_${filters.district}_${filters.startDate}_to_${filters.endDate}`;
      if (filters.format === "excel") {
        const projects = filteredData[0].project
          ? Object.keys(filteredData[0].project)
          : [];
        const worksheetData = filteredData.map((entry) => {
          const projectHours = projects.map(
            (project) => entry.project[project].hours
          );
          const projectLoe = projects.map(
            (project) => entry.project[project].loe
          );
          return [
            entry.employee_id,
            entry.staff_name,
            entry.department,
            entry.district,
            entry.period,
            ...projectHours,
            entry.total_work_hours,
            entry.total_leave_hours,
            entry.total_available_hours,
            ...projectLoe,
            entry.LOE,
          ];
        });
        const worksheet = XLSX.utils.aoa_to_sheet([
          [
            "Employee ID",
            "Staff Name",
            "Department",
            "District",
            "Period",
            ...projects.map((project) => `${project} Hours`),
            "Total Work Hours",
            "Total Leave Hours",
            "Total Hours",
            ...projects.map((project) => `${project} LOE (%)`),
            "LOE (%)",
          ],
          ...worksheetData,
        ]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheet Report");
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
      }
      if (filters.format === "pdf") {
        setFilteredData(filteredData);
        setTimeout(() => {
          const downloadelement = document.getElementById("pdf-content");
          if (
            downloadelement &&
            isHtml2PdfLoaded &&
            typeof html2pdf === "function"
          ) {
            downloadelement.classList.remove("hidden");
            downloadelement.classList.add("visible");
            const opt = {
              margin: 0.2,
              filename: `Timesheet Report_${filters.district}_${filters.startDate}_to_${filters.endDate}.pdf`,
              image: { type: "jpeg", quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: { unit: "mm", format: "a3", orientation: "landscape" },
            };

            console.log("Calling html2pdf for export:", html2pdf);
            html2pdf()
              .set(opt)
              .from(downloadelement)
              .save()
              .then(() => {
                downloadelement.classList.remove("visible");
                downloadelement.classList.add("hidden");
              })
              .catch((error) => {
                console.error("PDF generation error:", error);
                alert("Failed to generate PDF. Please try again.");
              });
          } else {
            console.error(
              "PDF generation failed:",
              !downloadelement ? "Content not found" : "",
              !isHtml2PdfLoaded ? "html2pdf not loaded" : "",
              typeof html2pdf !== "function" ? "html2pdf is not a function" : ""
            );
            alert("PDF generation failed: Library or content not available.");
          }
        }, 1000);
      }
    } else {
      alert("No data available for the selected filters.");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedTimesheets = filteredTimesheets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <Box>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Export Timesheet Report</DialogTitle>
          <DialogContent>
            <TimesheetReport
              handleFilterChange={handleFilterChange}
              handleExport={handleExport}
              filters={filters}
              districts={districts}
            />
          </DialogContent>
        </Dialog>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "700", marginTop: "10px" }}
        >
          Timesheet Report
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button variant="contained" onClick={handleShowExport}>
            Export Reports
          </Button>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <TextField
              label="Search"
              placeholder="Search by ID, Name or Department"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: "300px" }}
              inputProps={{ style: { textAlign: "left" } }}
            />
            <TextField
              select
              label="District"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              sx={{ width: "150px" }}
            >
              <MenuItem value="">All</MenuItem>
              {districts.map((district, index) => (
                <MenuItem key={index} value={district.name}>
                  {district.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Period"
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              sx={{ width: "150px" }}
            >
              <MenuItem value="">All</MenuItem>
              {[
                ...new Set(timesheets.map((timesheet) => timesheet.period)),
              ].map((period, index) => (
                <MenuItem key={index} value={period}>
                  {period}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "700" }}>EmpID</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>StaffName</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Department</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>District</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Period</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Work Hours</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Leave Hours</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Total Hours</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTimesheets.map((entry) => (
              <TableRow key={entry.employee_id}>
                <TableCell>{entry.employee_id}</TableCell>
                <TableCell>{entry.staff_name}</TableCell>
                <TableCell>{entry.department}</TableCell>
                <TableCell>{entry.district}</TableCell>
                <TableCell>{entry.period}</TableCell>
                <TableCell>{entry.total_work_hours}</TableCell>
                <TableCell>{entry.total_leave_hours}</TableCell>
                <TableCell>{entry.total_available_hours}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDownload(entry)}>
                    <DownloadForOfflineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 75, 100]}
          component="div"
          count={filteredTimesheets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <PdfTimesheetTable data={filteredData} />
        <div id="content" className="hidden">
          <ViewTimesheet
            viewedTimesheet={viewedTimesheet}
            viewedpageTimesheet={viewedpageTimesheet}
          />
        </div>
      </Box>
    </div>
  );
};

export default TimesheetReports;
