"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { LoadingContext } from "../../components/LoadingContext";
import { getFullDateRange, chunkDaysByWeek } from "@../../../utils/utils";
import TimeSheetWeek from "../../components/TimeSheetWeek";
import TimesheetSummary from "../../components/TimesheetSammary";
import TimesheetSelectors from "../../components/TimesheetSelectors";
import { fetchActivities } from "../api/api";
import axiosInstance from "../api/axiosInstance";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useRouter } from "next/navigation";

import { Container, Typography } from "@mui/material";
import { set } from "date-fns";

//declaring actities and loa activities
let LOE_ACTIVITIES = [];
let ACTIVITIES = [];
const defaultActivities = ["R4H", "CDC", "Public Leave"];
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1; // Months are 0-based
const defaultSelectedMonth = `${currentYear}-${String(currentMonth).padStart(
  2,
  "0"
)}`;

//data input for all activities
function initChunkData(numDays) {
  return ACTIVITIES.map((activity) => ({
    activity,
    daily: Array(numDays).fill(""),
    charge: "",
  }));
}

export default function TimesheetPage() {
  //declaring session and other variables
  const { data: session, status } = useSession({ required: true });
  const context = useContext(LoadingContext);
  const { setIsLoading } = context || {};

  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(defaultSelectedMonth);
  const [chunkedDays, setChunkedDays] = useState([]);
  const [chunkedData, setChunkedData] = useState([]);
  const [selectedActivities, setSelectedActivities] =
    useState(defaultActivities);
  const [activities, setActivities] = useState([]);
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

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    if (activities.length > 0) {
      handleMonthChange({ target: { value: defaultSelectedMonth } });
      setSelectedActivities(defaultActivities);
    }
  }, [activities]);

  useEffect(() => {
    setSelectedActivities(defaultActivities);
  }, [activities]);


  // getting activities from database
  const fetchActivities = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/timesheets/activities"
      );
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error(error);
    }
  };

  //assigning loa activities from database
  const loeActivities = activities.filter((activity) => activity.is_loe);
  LOE_ACTIVITIES = loeActivities.map((activity) => activity.name);

  //filtering activities with activity name
  const projectActivities = activities.filter(
    (activity) => activity.type === "PROJECT"
  );

  //maping database actity to activity list
  ACTIVITIES = activities.map((activity) => activity.name);

  //selecting month
  const handleMonthChange = (e) => {
    //getting value of selected month
    const val = e.target.value;
    setSelectedMonth(val);
    if (!val) {
      setChunkedDays([]);
      setChunkedData([]);
      return;
    }

    //assigning year and month from selected month value
    const [yearStr, monthStr] = val.split("-");
    const yearNum = parseInt(yearStr, 10);
    const monthNum = parseInt(monthStr, 10);

    //calling getfull date range with selecting year and month parameter
    const allDays = getFullDateRange(yearNum, monthNum);

    //calling grouping of days function into weekes
    const chunks = chunkDaysByWeek(allDays, 7);

    //adding days in chunk days array
    setChunkedDays(chunks);

    //adding data in chunk days
    const dataChunks = chunks.map((chunk) => initChunkData(chunk.length));
    setChunkedData(dataChunks);
  };

  //selecting activity
  const handleActivityChange = (e) => {
    const value = e.target.value;
    setSelectedActivities(typeof value === "string" ? value.split(",") : value);
  };

  //cell value change
  const handleCellChange = (chunkIndex, rowIndex, dayIndex, value) => {
    const updated = [...chunkedData];

    //value entered in input
    updated[chunkIndex][rowIndex].daily[dayIndex] = value;

    //adding daily value in chunkdata array
    setChunkedData(updated);
  };

  //charge change
  const handleChargeChange = (chunkIndex, rowIndex, value) => {
    const updated = [...chunkedData];

    //getting charge value
    updated[chunkIndex][rowIndex].charge = value;

    //adding charge chunk data array
    setChunkedData(updated);
  };

  // Calculate total hours for a row
  const calcRowTotal = (row) => {
    return row.daily.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  };

  // Calculate total for a single column across all rows in a chunk
  const calcColumnTotal = (chunkRows, dayIndex) => {
    return chunkRows.reduce(
      (sum, row) => sum + (parseFloat(row.daily[dayIndex]) || 0),
      0
    );
  };

  // Calculate the grand total of a chunk
  const calcChunkGrandTotal = (chunkRows) => {
    return chunkRows.reduce((sum, row) => sum + calcRowTotal(row), 0);
  };

  // Calculate total hours for applicable LOE activities in a chunk
  const calcChunkLOE = (chunkRows, chunkTotal) => {
    const loeHours = chunkRows.reduce((sum, row) => {
      if (LOE_ACTIVITIES.includes(row.activity)) {
        return sum + calcRowTotal(row);
      }
      return sum;
    }, 0);
    return chunkTotal > 0 ? (loeHours / chunkTotal) * 100 : 0;
  };

  const projectNames = projectActivities.map((activity) => activity.name);

  const calculateTotals = () => {
    const projectTotals = {};
    let totalWorkHours = 0;
    let totalLeaveHours = 0;
    let totalLeaveDays = 0;
    let totalWorkingDays = 0;
    let totalDays = chunkedDays.flat().length;
    let totalLOEHours = 0;

    for (let i = 0; i < chunkedDays.length; i++) {
      const daysChunk = chunkedDays[i];
      const chunkRows = chunkedData[i] || [];

      for (let dayIdx = 0; dayIdx < daysChunk.length; dayIdx++) {
        const day = daysChunk[dayIdx];

        if (day.dayOfWeek === 0 || day.dayOfWeek === 6) {
          continue; // skip weekends
        }

        let dailyWorkHours = 0;
        let dailyLeaveHours = 0;

        for (let rowIdx = 0; rowIdx < chunkRows.length; rowIdx++) {
          const row = chunkRows[rowIdx];
          const hours = parseFloat(row.daily[dayIdx]) || 0;
          const projectName = row.activity;

          if (!projectTotals[projectName]) {
            projectTotals[projectName] = 0;
          }

          projectTotals[projectName] += hours;

          if (row.activity.includes("Leave")) {
            dailyLeaveHours += hours;
            totalLeaveHours += hours;
          } else {
            dailyWorkHours += hours;
            totalWorkHours += hours;
            totalLOEHours += hours;
          }
        }

        if (dailyWorkHours > 0) {
          totalWorkingDays++;
        }

        if (dailyLeaveHours > 0) {
          totalLeaveDays++;
        }
      }
    }

    const totalHours = totalWorkHours + totalLeaveHours;
    const totalLOE = (totalLOEHours / totalHours) * 100 || 0;
    const leavePercentage = (totalLeaveHours / totalHours) * 100 || 0;
    totalDays = totalLeaveDays + totalWorkingDays;
    const projectPercentages = {};

    //projects names with its percentage

    for (let i = 0; i < projectNames.length; i++) {
      let projectName = projectNames[i];
      projectPercentages[projectName] =
        (projectTotals[projectName] / totalHours) * 100;
    }

    return {
      projectPercentages,
      totalWorkHours,
      totalLeaveHours,
      totalLeaveDays,
      totalWorkingDays,
      totalDays,
      totalLOE: totalLOE.toFixed(2),
      leavePercentage: leavePercentage.toFixed(2),
    };
  };

  const totals = calculateTotals();

  const handleSubmit = async () => {
    if (!selectedMonth) {
      alert("Please select a month first.");
      return;
    }
    const [year, month] = selectedMonth.split("-");
    const period = `${monthNames[parseInt(month) - 1]} ${year}`;

    // Initialize timesheet object with empty strings for all dates
    const timesheet = {};
    chunkedDays.flat().forEach((day) => {
      if (!day.dateStr) return;
      const actualDate = new Date(day.dateStr);
      actualDate.setDate(actualDate.getDate() + 1);
      const actualDateStr = actualDate.toISOString().split("T")[0];
      timesheet[actualDateStr] = {
        projects: {},
        leave: {},
      };
      ACTIVITIES.forEach((activity) => {
        if (LOE_ACTIVITIES.includes(activity) && activity !== "Public Leave") {
          timesheet[actualDateStr].projects[activity] = "";
        } else {
          timesheet[actualDateStr].leave[activity] = "";
        }
      });
    });

    // Populate timesheet object with actual data
    chunkedDays.forEach((daysChunk, i) => {
      const chunkRows = chunkedData[i] || [];
      daysChunk.forEach((day, dayIdx) => {
        if (!day.dateStr) return;
        const actualDate = new Date(day.dateStr);
        actualDate.setDate(actualDate.getDate() + 1);
        const actualDateStr = actualDate.toISOString().split("T")[0];
        chunkRows.forEach((row) => {
          const hours = row.daily[dayIdx];
          if (
            LOE_ACTIVITIES.includes(row.activity) &&
            row.activity !== "Public Leave"
          ) {
            timesheet[actualDateStr].projects[row.activity] = hours || "";
          } else {
            timesheet[actualDateStr].leave[row.activity] = hours || "";
          }
        });
      });
    });

    // Calculate totals
    const totals = calculateTotals();

    // Whole data object for timesheet submission to API
    const data = {
      period,
      total_hours: totals.totalWorkHours + totals.totalLeaveHours,
      leave_days: totals.totalLeaveDays,
      working_days: totals.totalWorkingDays,
      filled_timesheet: timesheet,
      created_by: session.user.id,
    };

    // Check for missing dates
    let missingDates = [];
    chunkedDays.forEach((daysChunk, i) => {
      const chunkRows = chunkedData[i] || [];
      daysChunk.forEach((day, dayIdx) => {
        if (day.dayOfWeek === 0 || day.dayOfWeek === 6) return;
        const actualDate = new Date(day.dateStr);
        actualDate.setDate(actualDate.getDate() + 1);
        const actualDateStr = actualDate.toISOString().split("T")[0];
        let hasValue = false;
        chunkRows.forEach((row) => {
          if (row.daily[dayIdx] !== "") {
            hasValue = true;
          }
        });
        if (!hasValue && day.dateStr) {
          missingDates.push(actualDateStr);
        }
      });
    });

    if (missingDates.length > 0) {
      alert(
        `Please fill in hours for the following dates: ${missingDates.join(
          ", "
        )}`
      );
      return;
    }

    // // Submit timesheet data to API
    // fetch("http://127.0.0.1:8000/api/timesheets/timesheets", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     if (data.id) {
    //       // alert("Timesheet submitted successfully!");
    //       setSnackbar({
    //         open: true,
    //         message: "Timesheet submitted successfully!",
    //         type: "success",
    //       });
    //       setTimeout(() => {
    //         router.push("/timesheets/history");
    //       }, 5000);
    //     } else {
    //       // alert("Submission failed. Please check your data and try again.");
    //       setSnackbar({
    //         open: true,
    //         message: "Submission failed. Please check your data.",
    //         type: "error",
    //       });
    //     }
    //     console.log("Response:", data);
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //     // alert(
    //     //   "An error occurred while submitting the timesheet. Please try again."
    //     // );
    //     setSnackbar({
    //       open: true,
    //       message: "An error occurred while submitting the timesheet.",
    //       type: "error",
    //     });
    //   });
    // Assuming this code is inside an async function (e.g., a form submission handler)
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        "/timesheets/timesheets",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;
      console.log("Response:", result);

      if (result.id) {
        setIsLoading(false);
        setSnackbar({
          open: true,
          message:
            "Timesheet submitted successfully! Redirecting to My Timesheets...",
          type: "success",
        });
        setTimeout(() => {
          router.push("/timesheets/history");
        }, 5000);
      } else {
        setIsLoading(false);
        setSnackbar({
          open: true,
          message: "Submission failed. Please check your data.",
          type: "error",
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
      setSnackbar({
        open: true,
        message: "An error occurred while submitting the timesheet.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Timesheet (Monthly)
      </Typography>
      <TimesheetSelectors
        selectedMonth={selectedMonth}
        handleMonthChange={handleMonthChange}
        selectedActivities={selectedActivities}
        handleActivityChange={handleActivityChange}
        ACTIVITIES={ACTIVITIES}
      />
      {chunkedDays.map((daysChunk, i) => (
        <TimeSheetWeek
          key={`daysChunk-${i}`}
          daysChunk={daysChunk}
          chunkRows={chunkedData[i] || []}
          chunkIndex={i}
          handleCellChange={handleCellChange}
          handleChargeChange={handleChargeChange}
          LOE_ACTIVITIES={LOE_ACTIVITIES}
          calcRowTotal={calcRowTotal}
          calcColumnTotal={calcColumnTotal}
          calcChunkGrandTotal={calcChunkGrandTotal}
          calcChunkLOE={calcChunkLOE}
          selectedActivities={selectedActivities}
        />
      ))}

      {chunkedDays.length > 0 && (
        <TimesheetSummary
          totals={totals}
          chunkedData={chunkedData}
          projectNames={projectNames}
          calcChunkGrandTotal={calcChunkGrandTotal}
          handleSubmit={handleSubmit}
        />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={10000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.type}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
