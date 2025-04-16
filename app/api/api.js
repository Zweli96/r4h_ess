import axiosInstance from "../api/axiosInstance";

//getting activities from database
export const fetchActivities = async () => {
  try {
    const response = await axiosInstance.get("/timesheets/activities");
    debugger;
    const data = response.json();

    console.log(data);
    return data;
    // setActivities(data);
  } catch (error) {
    console.error(error);
  }
};

export const fetchApprovals = async () => {
  try {
    const response = await axiosInstance.get("/timesheets/approvals");
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching approvals:", error);
    throw error;
  }
};

export const submitApproval = async (id) => {
  try {
    const response = await axiosInstance.put(
      `/timesheets/approvals/approve/${id}`
    );
    return response;
  } catch (error) {
    console.error("Error approving timesheet:", error);
    throw error;
  }
};

export const submitRejection = async (id, rejection_reason) => {
  try {
    const response = await axiosInstance.put(
      `/timesheets/approvals/reject/${id}`,
      { rejection_reason }
    );
    return response;
  } catch (error) {
    console.error("Error rejecting timesheet:", error);
    throw error;
  }
};

export const fetchMyTimesheets = async () => {
  try {
    const response = await axiosInstance.get("/timesheets/timesheets");
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching timesheets:", error);
    throw error;
  }
};
