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
export  function getFullDateRange(yearNum, monthNum) {
  const prevMonth = monthNum - 1 === 0 ? 12 : monthNum - 1;
  const prevYear = monthNum - 1 === 0 ? yearNum - 1 : yearNum;
  const startDate = new Date(prevYear, prevMonth - 1, 16);
  const endDate = new Date(yearNum, monthNum - 1, 15);
  const days = [];
  let current = new Date(startDate);
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
    current.setDate(dayNum + 1);
  }
  return days;
}


//grouping days per week
export function chunkDaysByWeek(days, chunkSize = 7) {
  const result = [];
  for (let i = 0; i < days.length; i += chunkSize) {
    result.push(days.slice(i, i + chunkSize));
  }
  return result;
}



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
