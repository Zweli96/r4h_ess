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


  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/timesheets/timesheetReport")
      .then((response) => response.json())
      .then((data) => setTimesheets(data));
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };


  const handleExport = () => {
   const filteredData = timesheets.filter((entry) => {
      const periodDate = `${entry.period.split("/")[1]}-${entry.period.split("/")[0]}`;
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
    if (filters.format === "excel") {
      const worksheetData = filteredData.map((entry) => {
        const projects = Object.keys(entry.project).map((project) => {
          return entry.project[project];
        });
        return [
          entry.employee_id,
          entry.staff_name,
          entry.department,
          entry.district,
          entry.period,
          ...projects,
          entry.total_work_hours,
          entry.total_leave_hours,
          entry.total_available_hours,
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
          ...filteredData[0].project
            ? Object.keys(filteredData[0].project)
            : [],
          "Total Work Hours",
          "Total Leave Hours",
          "Total Available Hours",
          "LOE (%)",
        ],
        ...worksheetData,
      ]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheet Report");
      XLSX.writeFile(workbook,`${fileName}.xlsx` );

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
/>


<PdfTimesheetTable data={filteredData} />

</>
  );
};

export default TimesheetReports;
