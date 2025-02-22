"use client";
import React, { useState, useEffect } from "react";
import { Key } from "@mui/icons-material";
import Totals from "@../../../components/Totals";
import PeriodSelector from "@../../../components/PeriodSelector";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import axios from "axios";
import { getSession } from "next-auth/react";

function formatDate(dateString) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const date = new Date(dateString);
  const dayOfWeek = days[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];

  return `${dayOfWeek} ${dayOfMonth} ${month}`;
}

const type_leave = "leave";
const type_projects = "projects";

export default function App() {
  const [period, setPeriod] = useState(""); // this is the period selector
  const [loading, setLoading] = useState(false); // this is the universal loading
  const [timesheet, setTimesheet] = useState(""); // This is now for populating the actual timesheet
  const [error, setError] = useState({});
  async function submitTimesheet() {
    const session = await getSession();
  }

  // When a period is selected this runs
  useEffect(() => {
    const fetchData = async () => {
      console.log(`The period is ${period}`);
      const session = await getSession();
      if (session) {
        try {
          setLoading(true);
          const response = await axios({
            method: "get",
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}timesheets/periods/employee/${period}`,
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });
          const result = await response.data;
          setLoading(false);

          // Update the timesheet state after data is fetched
          if (result.status) {
            setTimesheet(result.timesheet);
          } else {
            setTimesheet(result);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      }
    };

    if (period) {
      fetchData();
    }
  }, [period]);

  // This is for the period selector
  const handlePeriodChange = (value) => {
    setPeriod(value);
  };

  function countActiveDays(timesheet) {
    let activeDays = 0;

    for (const day in timesheet) {
      const entry = timesheet[day];
      const { projects, leave } = entry;

      const projectHours = Object.values(projects).reduce(
        (sum, val) => sum + val,
        0
      );
      const leaveHours = Object.values(leave).reduce(
        (sum, val) => sum + val,
        0
      );

      if (projectHours > 0 || leaveHours > 0) {
        activeDays++;
      }
    }

    return activeDays;
  }

  function sumAllHours(timesheet) {
    let totalHours = 0;

    for (const day in timesheet) {
      const entry = timesheet[day];
      const { projects, leave } = entry;

      const projectHours = Object.values(projects)
        .map((val) => parseFloat(val) || 0)
        .reduce((sum, val) => sum + val, 0);
      const leaveHours = Object.values(leave)
        .map((val) => parseFloat(val) || 0)
        .reduce((sum, val) => sum + val, 0);

      totalHours += projectHours + leaveHours;
    }

    // Determine if the total hours should be an integer or a float with one decimal place
    return totalHours % 1 === 0 ? totalHours.toFixed(0) : totalHours.toFixed(1);
  }

  function countLeaveDays(timesheet) {
    let leaveDays = 0;

    for (const day in timesheet) {
      const entry = timesheet[day];
      const { leave } = entry;

      const leaveHours = Object.values(leave)
        .map((val) => parseFloat(val) || 0)
        .reduce((sum, val) => sum + val, 0);

      if (leaveHours > 0) {
        leaveDays++;
      }
    }

    return leaveDays;
  }

  function countLeaveDays(timesheet) {
    let leaveDays = 0;

    for (const day in timesheet) {
      const entry = timesheet[day];
      const { leave } = entry;

      const leaveHours = Object.values(leave)
        .map((val) => parseFloat(val) || 0)
        .reduce((sum, val) => sum + val, 0);

      if (leaveHours > 0) {
        leaveDays++;
      }
    }

    return leaveDays;
  }

  function calculateProjectPercentages(timesheet) {
    const totalProjectHours = {};
    let totalHoursWorked = 0;

    for (const day in timesheet) {
      const { projects } = timesheet[day];

      for (const project in projects) {
        const hours = parseFloat(projects[project]) || 0;
        totalProjectHours[project] = (totalProjectHours[project] || 0) + hours;
        totalHoursWorked += hours;
      }
    }

    const projectPercentages = {};
    for (const project in totalProjectHours) {
      const percentage = (totalProjectHours[project] / totalHoursWorked) * 100;
      projectPercentages[project] = percentage.toFixed(1); // one decimal place
    }

    return projectPercentages;
  }

  const daysTotal = Object.keys(timesheet).length;
  const daysFilled = countActiveDays(timesheet);
  const hoursFilled = sumAllHours(timesheet);
  const hoursTotal = 176;
  const leaveDays = countLeaveDays(timesheet);
  const levelOfEffort = calculateProjectPercentages(timesheet);

  const handleChange = (dayId, hourType, hourName, value) => {
    setTimesheet((prevTimesheet) => {
      if (hourType === "projects") {
        const updatedTimesheet = { ...prevTimesheet };
        const day = updatedTimesheet[dayId];
        const updatedDay = { ...day };
        const type = updatedDay[hourType];
        const updatedType = { ...type };
        updatedType[hourName] = value;
        updatedDay[hourType] = updatedType;
        updatedTimesheet[dayId] = updatedDay;
        console.log(updatedTimesheet);
        return updatedTimesheet;
      }
      if (hourType === "leave") {
        const updatedTimesheet = { ...prevTimesheet };
        const day = updatedTimesheet[dayId];
        const updatedDay = { ...day };
        const type = updatedDay[hourType];
        let updatedType = { ...type };
        updatedType = Object.keys(updatedType).reduce(
          (acc, key) => ({ ...acc, [key]: 0 }),
          {}
        );
        if (hourName) {
          updatedType = {
            [hourName]: value,
          };
        }
        updatedDay[hourType] = updatedType;
        updatedTimesheet[dayId] = updatedDay;
        console.log(updatedTimesheet);
        return updatedTimesheet;
      }
    });
  };

  const calculateTotalHours = (day) => {
    let total = 0;
    for (const project in day.projects) {
      total += Number(day.projects[project]);
    }
    for (const leave in day.leave) {
      total += Number(day.leave[leave]);
    }
    return total;
  };

  return (
    <Box sx={{ flexGrow: 1, mr: 2 }}>
      <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
        <Grid item xs={12} sm={4}>
          <h2>Submit Timesheet</h2>
        </Grid>
        <Grid item xs={false} sm={4}></Grid>
        <Grid item xs={12} sm={4}>
          <PeriodSelector setPeriod={handlePeriodChange} value={period} />
        </Grid>
        <Grid item xs={12}>
          <hr />
        </Grid>
      </Grid>
      {timesheet ? (
        <>
          <Totals
            daysTotal={daysTotal}
            daysFilled={daysFilled}
            hoursFilled={hoursFilled}
            hoursTotal={hoursTotal}
            leaveDays={leaveDays}
            levelOfEffort={levelOfEffort}
          />
          <>
            {Object.keys(timesheet).map((key) => (
              <DayCard
                key={key}
                dayId={key}
                day={timesheet[key].date}
                leave={timesheet[key].leave}
                projects={timesheet[key].projects}
                handleChange={handleChange}
                totalHours={calculateTotalHours(timesheet[key])}
              />
            ))}
          </>
        </>
      ) : (
        <div>
          <h3>No timesheet selected, please select a timesheet</h3>
        </div>
      )}
    </Box>
  );
}

function DayCard({ dayId, day, projects, leave, handleChange, totalHours }) {
  const [hover, setHover] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState("select_leave");
  const [leaveSelected, setLeaveSelected] = useState(false);

  function handleSelectChange(e, dayID) {
    const selectedValue = e.target.value;
    setSelectedLeaveType(selectedValue);
    handleChange(dayID, "leave");
    if (selectedValue === "select_leave") {
      setLeaveSelected(false);
    } else {
      setLeaveSelected(true);
    }
  }

  let className = "daycard";
  if (hover) {
    className += " hover";
  }

  return (
    <div
      className="daycard"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <text className="dateTitle">{formatDate(day)}</text>
      {Object.keys(projects).map((item, index) => (
        <Input
          key={index}
          label={item}
          displayLabel={item}
          value={projects[item]}
          fieldType={"projects"}
          dayId={dayId}
          handleChange={handleChange}
        />
      ))}
      <select
        onChange={(e) => handleSelectChange(e, dayId)}
        value={selectedLeaveType}
      >
        <option value="select_leave" selected>
          Select Leave
        </option>
        <option value="sick_leave">Sick Leave</option>
        <option value="study_leave">Study Leave</option>
        <option value="maternity_paternity_leave">
          Maternity_Paternity Leave
        </option>
        <option value="compassionate_leave">Compassionate Leave</option>
        <option value="unpaid_leave">Unpaid Leave</option>
        <option value="administrative_leave">Administrative Leave</option>
        <option value="public_leave">Public Leave</option>
        <option value="annual_leave">Annual Leave</option>
      </select>

      <Input // Use selectedLeaveType as key to track the specific input
        label={selectedLeaveType}
        displayLabel={"Leave"}
        value={leave[selectedLeaveType] ?? ""} // Value of the selected leave type or empty string if it doesn't exist
        fieldType={"leave"}
        handleChange={handleChange}
        dayId={dayId}
        leaveSelected={leaveSelected}
      />

      <div className="dayCardTotal">
        {" "}
        <b>{totalHours}</b> hours
      </div>
    </div>
  );
}

function Input({
  label,
  displayLabel,
  value,
  fieldType,
  dayId,
  handleChange,
  leaveSelected,
}) {
  const isDisabled = fieldType === "leave" && !leaveSelected;

  return (
    <label>
      {displayLabel}
      {"   "}
      <input
        value={value}
        onChange={(e) => handleChange(dayId, fieldType, label, e.target.value)}
        // dayId, hourType, hourName, value
        fieldType={fieldType}
        type="number"
        className="resizedTextbox"
        min={0}
        max={24}
        step={0.5}
        disabled={isDisabled}
      />
    </label>
  );
}
