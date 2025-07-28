export  function hasChildren(item) {
  const { items: children } = item;

  if (children === undefined) {
    return false;
  }

  if (children.constructor !== Array) {
    return false;
  }

  if (children.length === 0) {
    return false;
  }




  
  return true;
}


//getting date range from 16 to 15 of selected month
export function getFullDateRange(yearNum, monthNum) {
  const prevMonth = monthNum - 1 === 0 ? 12 : monthNum - 1;
  const prevYear = monthNum - 1 === 0 ? yearNum - 1 : yearNum;

  const startDate = new Date(prevYear, prevMonth - 1, 16);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(yearNum, monthNum - 1, 15);
  endDate.setHours(0, 0, 0, 0);

  const days = [];
  let current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    const dayNum = current.getDate();
    const dayName = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][dayOfWeek];

    days.push({
      dateStr: current.toISOString().split('T')[0],
      dayNum,
      dayName,
      dayOfWeek,
    });

    current.setDate(current.getDate() + 1); // ✅ This line is key
  }

  return days;
}



export function chunkDaysByWeek(days) {
  const result = [];
  let currentWeek = [];

  days.forEach((day, index) => {
    currentWeek.push(day);

    // If the day is Saturday (6), or it's the last day, push the week
    if (day.dayOfWeek === 6 || index === days.length - 1) {
      result.push(currentWeek);
      currentWeek = [];
    }
  });

  return result;
}


const calcRowTotal = (row) => {
  return row.daily.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
};

  // Calculate the grand total of a chunk
 export const calcChunkGrandTotal = (chunkRows) => {
    return chunkRows.reduce((sum, row) => sum + calcRowTotal(row), 0);
  };

   // Calculate total for a single column across all rows in a chunk
   export const calcColumnTotal = (chunkRows, dayIndex) => {
    return chunkRows.reduce((sum, row) => sum + (parseFloat(row.daily[dayIndex]) || 0), 0);
  };


    // Calculate total hours for applicable LOE activities in a chunk
export const calcChunkLOE = (chunkRows, chunkTotal) => {
  const loeHours = chunkRows.reduce((sum, row) => {
    if (LOE_ACTIVITIES.includes(row.activity)) {
      return sum + calcRowTotal(row);
    }
    return sum;
  }, 0);
  return chunkTotal > 0 ? (loeHours / chunkTotal) * 100 : 0;
};


export const getProgress = (completedChapters, courseId, totalChapters) => {
  const completed = completedChapters[courseId]?.completed_chapters.length || 0;
  return (completed / (totalChapters || 1)) * 100;
};

export const generateCertificatePDF = async (Certificate, userName, courseTitle, date) => {
  const container = document.createElement("div");
  container.id = "print-certificate";
  container.style.cssText = `
    width: 794px;
    height: 1123px;
    padding: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    box-sizing: border-box;
    overflow: hidden;
  `;
  document.body.appendChild(container);

  const ReactDOM = await import("react-dom");

  ReactDOM.render(
    <Certificate userName={userName} courseTitle={courseTitle} date={date} />,
    container,
    () => {
      const opt = {
        margin: 0,
        filename: `certificate_${courseTitle}_${userName}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 2,
          scrollX: 0,
          scrollY: 0,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
          width: 794,
          height: 1123,
        },
        jsPDF: {
          unit: "px",
          format: [794, 1123],
          orientation: "portrait",
        },
      };

      html2pdf()
        .set(opt)
        .from(container)
        .save()
        .then(() => {
          document.body.removeChild(container);
        });
    }
  );
};
