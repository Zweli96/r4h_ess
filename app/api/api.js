import axiosInstance from "../api/axiosInstance";

//getting activities from database
export const fetchActivities = async () => {
  try {
    const response = await axiosInstance.get("/timesheets/activities");
    console.log(response);
    return response.data;
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

export const fetchUserData = async () => {
  try {
    const response = await axiosInstance.get("/auth/user/");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const fetchTrainingReports = async (
  course_id = "",
  financial_year_id = ""
) => {
  try {
    const params = {};

    if (course_id) params.course_id = course_id;
    if (financial_year_id) params.financial_year_id = financial_year_id;

    const response = await axiosInstance.get(
      "/training/user-progress-report-list/",
      { params }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching training reports:", error);
    throw error;
  }
};

export const fetchFinancialYears = async () => {
  try {
    const response = await axiosInstance.get("/training/financial-years-list/");
    return response.data;
  } catch (error) {
    console.error("Error fetching training financial years:", error);
    throw error;
  }
};

export const fetchCourses = async () => {
  try {
    const response = await axiosInstance.get("/training/courses/");
    return response.data;
  } catch (error) {
    console.error("Error fetching training courses:", error);
    throw error;
  }
};

export const fetchReportExport = async (params) => {
  try {
    const response = await axiosInstance.post("/training/report/", params, {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    console.error("Error fetching exported report:", error);
    throw error;
  }
};

export const submitApproval = async (id) => {
  try {
    const response = await axiosInstance.put(
      `/timesheets/approvals/approve/${id}`,
      {}, // Empty body to satisfy JSON parsing
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
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
      { rejection_reason },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
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
