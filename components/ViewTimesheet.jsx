import React, { useState, useEffect } from "react";
import TimeSheetWeekView from "../components/TimeSheetWeekView";
import Image from "next/image";
import ESSIcon from "../public/r4hlogo.jpg";

export default function Viewtimesheet({ viewedTimesheet,viewedpageTimesheet}) {
  const [chunkedDays, setChunkedDays] = useState([]);
  const [chunkedData, setChunkedData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loeActivities, setLoeActivities] = useState([]);

  useEffect(() => {
    if (!viewedTimesheet) return;
    const { filled_timesheet } = viewedTimesheet;

    //getting dates array from filled timesheet
    const dates = Object.keys(filled_timesheet);

    //setting first index of dates array as start date
    const startDate = new Date(dates[0]);

    //setting last index of dates array as end date
    const endDate = new Date(dates[dates.length - 1]);

    const allDays = [];

    //creating an array of all days
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      allDays.push(dateStr);
    }


    const chunkDaysByWeek = (days, chunkSize) => {
      const chunks = [];
      let chunk = [];
    
      // Loop through the days array
      for (const date of days) {
        // Add the date to the current chunk
        chunk.push({
          dateStr: date,
          dayNum: new Date(date).getDate(),
          dayName: new Date(date).toLocaleString('default', { weekday: 'short' }),
          dayOfWeek: new Date(date).getDay(),
        });
    
        // If the chunk is full, add it to the result array and start a new chunk
        if (chunk.length === chunkSize) {
          chunks.push(chunk);
          chunk = [];
        }
      }
    
      // Add the last chunk to the result array if it's not empty
      if (chunk.length > 0) {
        chunks.push(chunk);
      }
    
      return chunks;
    };
    
    const chunks = chunkDaysByWeek(allDays, 14);
    //creating a set of unique activities
    const activitiesSet = new Set();
    
    //getting activities from filled timesheet
    for (let day of Object.values(filled_timesheet)) {
      for (let activity of Object.keys({ ...day.projects, ...day.leave })) {
        activitiesSet.add(activity);
      }
    }
   
    //converting a set of activities to an array
    const activityArray = Array.from(activitiesSet);
    setActivities(activityArray);

    //this is not being used
    setLoeActivities(activityArray.filter((a) => a.includes("Leave")));


  //creating data chunks with empty strings
 const dataChunks = [];
for (let i = 0; i < chunks.length; i++) {
  const chunk = chunks[i];
  const chunkData = [];
  for (let j = 0; j < activityArray.length; j++) {
    const activity = activityArray[j];
    chunkData.push({
      activity,
      daily: new Array(chunk.length).fill(""),
    });
  }
  dataChunks.push(chunkData);
}

for (let i = 0; i < chunks.length; i++) {
  const chunk = chunks[i];
  for (let j = 0; j < chunk.length; j++) {
    const day = chunk[j];
    const date = day.dateStr;
    let entry = filled_timesheet[date];
    if (!entry) continue;

    for (let project in entry.projects) {
      for (let k = 0; k < dataChunks[i].length; k++) {
        if (dataChunks[i][k].activity === project) {
          dataChunks[i][k].daily[j] = entry.projects[project];
        }
      }
    }


    for (let leaveType in entry.leave) {
      for (let k = 0; k < dataChunks[i].length; k++) {
        if (dataChunks[i][k].activity === leaveType) {
          dataChunks[i][k].daily[j] = entry.leave[leaveType];
        }
      }
      
    }
  }
}

setChunkedDays(chunks);
setChunkedData(dataChunks);

  }, [viewedTimesheet]);

  
  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      {viewedpageTimesheet === "download" && viewedTimesheet && (
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Image
            src={ESSIcon}
            alt="R4H LOGO"
            style={{ height: "auto", width: "auto", marginBottom: 10 }}
          />
          <h1 style={{ fontSize: 26, fontWeight: "bold", marginBottom: 10 }}>
            Timesheet For {viewedTimesheet.period}
          </h1>
          <div style={{ fontSize: 20, marginBottom: 5 }}>
            Submitted by: {viewedTimesheet.created_by_full_name} - {viewedTimesheet.total_hours} hrs 
          </div>
          <div style={{ fontSize: 20, marginBottom: 5 }}>
            Line Manager Approval: {viewedTimesheet.line_manager_full_name}
          </div>
          <div style={{ fontSize: 20, marginBottom: 10 }}>
            HR Approval: {viewedTimesheet.second_approver_full_name}
          </div>
        </div>

        
      )}
    
      {chunkedDays.length === 0 ? (
        <div style={{ textAlign: "center", fontSize: 18 }}>
          Loading data...
        </div>
      ) : (
        chunkedDays.map((daysChunk, i) => (
          <TimeSheetWeekView
            key={`daysChunk-${i}`}
            daysChunk={daysChunk}
            chunkRows={chunkedData[i] || []}
          />
        ))
      )}
   
    </div>
  );
}
