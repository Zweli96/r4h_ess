"use client";
import React, { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import { Key } from "@mui/icons-material";

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
  const sampleTimesheet = {
    1: {
      date: "2024-02-15",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    2: {
      date: "2024-02-16",
      projects: {
        CDC: 6,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    3: {
      date: "2024-02-17",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    4: {
      date: "2024-02-18",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    5: {
      date: "2024-02-19",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    6: {
      date: "2024-02-20",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    7: {
      date: "2024-02-21",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    8: {
      date: "2024-02-22",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    9: {
      date: "2024-02-23",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    10: {
      date: "2024-02-24",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    11: {
      date: "2024-02-25",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    12: {
      date: "2024-02-26",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    13: {
      date: "2024-02-27",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    14: {
      date: "2024-02-28",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    15: {
      date: "2024-02-29",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    17: {
      date: "2024-03-01",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    18: {
      date: "2024-03-02",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    19: {
      date: "2024-03-03",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    20: {
      date: "2024-03-04",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    21: {
      date: "2024-03-05",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    22: {
      date: "2024-03-06",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    23: {
      date: "2024-03-07",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    24: {
      date: "2024-03-08",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    25: {
      date: "2024-03-09",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    26: {
      date: "2024-03-10",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    27: {
      date: "2024-03-11",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    28: {
      date: "2024-03-12",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    29: {
      date: "2024-03-13",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    30: {
      date: "2024-03-14",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
    31: {
      date: "2024-03-15",
      projects: {
        CDC: 8.5,
        R4H: 0,
        TOIL: 0,
      },
      leave: {
        sick_leave: 0,
        study_leave: 0,
        maternity_paternity_leave: 0,
        compassionate_leave: 0,
        unpaid_leave: 0,
        administrative_leave: 0,
        public_leave: 0,
        annual_leave: 0,
      },
    },
  };

  const [timesheet, setTimesheet] = useState(sampleTimesheet);

  const timesheetEntries = Object.entries(sampleTimesheet);

  const handleChange = (dayId, hourType, hourName, value) => {
    setTimesheet((prevTimesheet) => {
      const updatedTimesheet = { ...prevTimesheet };
      const day = updatedTimesheet[dayId];
      const updatedDay = { ...day };
      const type = updatedDay[hourType];
      const updatedType = { ...type };
      updatedType[hourName] = value;
      updatedDay[hourType] = updatedType;
      updatedTimesheet[dayId] = updatedDay;
      return updatedTimesheet;
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
    <div>
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
    </div>
  );
}

function Totals({ currentStatus, totalHours, leaveDays }) {
  return (
    // <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
    //   <h5>
    //     Total Hours&nbsp;&nbsp;
    //     <Chip label={20} color="primary" />
    //   </h5>
    //   <h5>
    //     Leave Days&nbsp;&nbsp;
    //     <Chip label={0} color="success" />
    //   </h5>
    //   <Button variant="contained">Submit</Button>
    //   <br />
    // </Stack>
    <Grid container direction="row" sx={{ mb: 2 }}>
      <Grid item xs={5}>
        <Stack direction="row" spacing={1}>
          <h5>
            Total Hours&nbsp;&nbsp;
            <Chip label={20} color="primary" />
          </h5>
          <h5>
            Leave Days&nbsp;&nbsp;
            <Chip label={0} color="success" />
          </h5>
        </Stack>
      </Grid>
      <Grid container xs={5} justifyContent="center"></Grid>
      <Grid item xs={2}>
        <Button variant="contained">Submit</Button>
      </Grid>
    </Grid>
  );
}

function DayCard({ dayId, day, projects, leave, handleChange, totalHours }) {
  const [hover, setHover] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState("select_leave");

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedLeaveType(selectedValue);
  };

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
          fieldType={"leave"}
          dayId={dayId}
          handleChange={handleChange}
        />
      ))}
      <select onChange={handleSelectChange} value={selectedLeaveType}>
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
        value={leave[selectedLeaveType]} // Value of the selected leave type
        fieldType={"projects"}
        handleChange={handleChange}
      />

      <div className="dayCardTotal">
        {" "}
        <b>{totalHours}</b> hours
      </div>
    </div>
  );
}

function Input({ label, displayLabel, value, fieldType, dayId, handleChange }) {
  return (
    <label>
      {displayLabel}
      {"   "}
      <input
        value={value}
        onChange={(e) => handleChange(dayId, "projects", label, e.target.value)}
        // dayId, hourType, hourName, value
        fieldType={fieldType}
        type="number"
        className="resizedTextbox"
        min={0}
        max={24}
        step={0.5}
      />
    </label>
  );
}
