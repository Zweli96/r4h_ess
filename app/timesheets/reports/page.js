 "use client";
import React, { useState, useEffect } from "react";
import TimesheetReport from "../../../components/TimesheetReport"
import PdfTimesheetTable from "../../../components/PdfTimesheetTable";
import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";
import {useSession } from "next-auth/react";

const TimesheetReports = () => {

    //declaring session and other variables
 const { data: session, status } = useSession({ required: true });

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    format: "",
    district: "",
  });

  const [timesheets, setTimesheets] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [districts, setDistricts] = useState([]);


  //fetching districts
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/timesheets/districts/')
      .then(response => response.json())
      .then(data => setDistricts(data));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/timesheets/timesheetReport")
      .then((response) => response.json())
      .then((data) => setTimesheets(data));
  }, []);


//   useEffect(() => {
//     const params = new URLSearchParams();
//     if (filters.startDate) params.append('start_date', filters.startDate);
//     if (filters.endDate) params.append('end_date', filters.endDate);
//     if (filters.district) params.append('district', filters.district);

//     fetch(`http://127.0.0.1:8000/api/timesheets/timesheetReport?${params.toString()}`)
//         .then((response) => response.json())
//         .then((data) => setTimesheets(data));
// }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };


  const handleExport = () => {
    if (!filters.startDate || !filters.endDate || !filters.district || !filters.format) {
      alert("Please fill out all required fields.");
      return;
    }
   const filteredData = timesheets.filter((entry) => {

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const formatPeriod = (period) => {
      const [monthName, year] = period.split(" ");
      const month = (monthNames.indexOf(monthName) + 1).toString().padStart(2, '0');
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
    const fileName = `Timesheet Report_${filters.district} (${filters.startDate} to ${filters.endDate})`;

    
    console.log(filteredData)
    // if (filters.format === "excel") {
    //   const worksheetData = filteredData.map((entry) => {
    //     const projects = Object.keys(entry.project).map((project) => {
    //       return entry.project[project];
    //     });
    //     return [
    //       entry.employee_id,
    //       entry.staff_name,
    //       entry.department,
    //       entry.district,
    //       entry.period,
    //       ...projects,
    //       entry.total_work_hours,
    //       entry.total_leave_hours,
    //       entry.total_available_hours,
    //       entry.LOE,
    //     ];
    //   });
    //   const worksheet = XLSX.utils.aoa_to_sheet([
    //     [
    //       "Employee ID",
    //       "Staff Name",
    //       "Department",
    //       "District",
    //       "Period",
    //       ...filteredData[0].project
    //         ? Object.keys(filteredData[0].project)
    //         : [],
    //       "Total Work Hours",
    //       "Total Leave Hours",
    //       "Total Available Hours",
    //       "LOE (%)",
    //     ],
    //     ...worksheetData,
    //   ]);
    //   const workbook = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheet Report");
    //   XLSX.writeFile(workbook,`${fileName}.xlsx` );

    // }


    if (filters.format === "excel") {
      const projects = filteredData[0].project ? Object.keys(filteredData[0].project) : [];
      const worksheetData = filteredData.map((entry) => {
        const projectHours = projects.map((project) => entry.project[project].hours);
        const projectLoe = projects.map((project) => entry.project[project].loe);
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
        const element = document.getElementById("pdf-content");
        if (element) {
          element.classList.remove("hidden");
          element.classList.add("visible");
          const opt = {
            margin: 0.2,
            filename: `${fileName}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
          };
          html2pdf().set(opt).from(element).save().then(() => {
            element.classList.remove("visible");
            element.classList.add("hidden");
          });
      
        } else {
          console.error("PDF content not found");
        }
      }, 500); // wait 0.5s to let React render
    }
    
    
  }
  else {
    alert("No data available for the selected filters.");
}
    
    
    
    
  };


  return (
    

<>
<TimesheetReport
handleFilterChange={handleFilterChange}
handleExport={handleExport}
filters={filters}
districts={districts}
/>


<PdfTimesheetTable data={filteredData} />

</>
  );
};

export default TimesheetReports;
