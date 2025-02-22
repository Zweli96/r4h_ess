import axiosInstance from "../api/axiosInstance";

export const fetchApprovals = async () => {
  try {
    const response = await axiosInstance.get("/timesheets/approvals");
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
