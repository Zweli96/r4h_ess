import axiosInstance from "../api/axiosInstance";

 //getting activities from database
 export const fetchActivities = async () => {
  try {
    const response = await axiosInstance.get('/timesheets/activities');
    debugger;
    const data =  response.json();
    
    console.log(data)
    return(data)
    // setActivities(data);
  } catch (error) {
    console.error(error);
  }
};


// const fetchActivities = async () => {
//   try {
//     const response = await fetch('http://localhost:8000/api/timesheets/activities/');
//     const data = await response.json();
//     setActivities(data);
//   } catch (error) {
//     console.error(error);
//   }
// };
export const fetchApprovals = async () => {
  try {
    const response = await axiosInstance.get("/timesheets/approvals");
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error fetching approvals:", error);
    throw error;
  }
};

export const submitApproval = async (id) => {
  try {
    const response = await axiosInstance.put(`/timesheets/approvals/${id}`);
    return response;
  } catch (error) {
    console.error("Error approving timesheet:", error);
    throw error;
  }
};


