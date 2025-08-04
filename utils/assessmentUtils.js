import html2pdf from "html2pdf.js";
import AssessmentCertificate from "../components/AssessmentCertificate";
import axiosInstance from "../app/api/axiosInstance";

/**
 * Fetches course and progress data, selecting 2 random questions.
 * @param {string} courseId - The course ID.
 * @param {string} userId - The user ID.
 * @param {Object} session - User session.
 * @param {Function} setSnackbar - Function to set snackbar state.
 * @returns {Promise<{questions: Array, title: string, progress: Object}>}
 */
export async function fetchAssessmentData(
  courseId,
  userId,
  session,
  setSnackbar
) {
  if (!session?.user?.id) {
    setSnackbar({
      open: true,
      message: "User not authenticated. Please log in.",
      severity: "error",
    });
    throw new Error("User not authenticated");
  }

  try {
    console.log("Fetching course data for courseId:", courseId);
    const courseRes = await axiosInstance.get(`/training/courses/${courseId}/`);
    console.log("Course response:", courseRes.data);

    console.log("Fetching progress for userId:", userId);
    const progressRes = await axiosInstance.get(
      `/training/user-progress/?user_id=${userId}`
    );
    console.log("Progress response:", progressRes.data);

    const allQuestions = courseRes.data.assessment_questions || [];
    const selectedQuestions =
      allQuestions.length > 1
        ? allQuestions.sort(() => Math.random() - 0.5).slice(0, 10)
        : allQuestions;

    return {
      questions: selectedQuestions,
      title: courseRes.data.title || "Course",
      progress: progressRes.data.find((p) => p.course === Number(courseId)),
    };
  } catch (err) {
    console.error(
      "fetchAssessmentData error:",
      err.response?.data || err.message
    );
    setSnackbar({
      open: true,
      message: err.response?.data?.detail || "Failed to fetch assessment data",
      severity: "error",
    });
    throw err;
  }
}

/**
 * Resets invalid progress if assessment score is missing or < 100%, preserving completed_chapters.
 * @param {string} courseId - The course ID.
 * @param {string} userId - The user ID.
 * @param {Object} session - User session.
 * @param {Function} setSnackbar - Function to set snackbar state.
 */
export async function resetAssessmentProgress(
  courseId,
  userId,
  session,
  setSnackbar
) {
  if (!session?.user?.id) {
    setSnackbar({
      open: true,
      message: "User not authenticated. Please log in.",
      severity: "error",
    });
    return;
  }

  try {
    // Fetch current progress to preserve completed_chapters
    console.log("Fetching progress for userId:", userId);
    const progressRes = await axiosInstance.get(
      `/training/user-progress/?user_id=${userId}`
    );
    console.log("Progress response:", progressRes.data);
    const currentProgress =
      progressRes.data.find((p) => p.course === Number(courseId)) || {};

    const payload = {
      user: userId,
      course: Number(courseId),
      assessment_score: null,
      is_completed: false,
      completed_date: null,
      completed_chapters: currentProgress.completed_chapters || [],
    };
    console.log(
      "Resetting progress to:",
      `/training/user-progress/${courseId}/`,
      "Payload:",
      payload
    );
    const res = await axiosInstance.put(
      `/training/user-progress/${courseId}/`,
      payload
    );
    console.log("Reset response:", res.status);
  } catch (err) {
    console.error(
      "resetAssessmentProgress error:",
      err.response?.data || err.message
    );
    setSnackbar({
      open: true,
      message:
        err.response?.data?.detail ||
        `Error resetting progress: ${err.message}`,
      severity: "error",
    });
    throw err;
  }
}

/**
 * Submits assessment responses and updates progress, preserving completed_chapters.
 * @param {string} courseId - The course ID.
 * @param {Object} session - User session.
 * @param {Array} questions - Assessment questions (2 or fewer).
 * @param {Array} responses - User responses.
 * @param {Function} setScore - Sets score state.
 * @param {Function} setScorePercentage - Sets percentage state.
 * @param {Function} setSubmitted - Sets submitted state.
 * @param {Function} setIsCompleted - Sets completion state.
 * @param {Function} setSnackbar - Sets snackbar state.
 * @param {Object} router - Next.js router.
 */
export async function submitAssessment(
  courseId,
  session,
  questions,
  responses,
  setScore,
  setScorePercentage,
  setSubmitted,
  setIsCompleted,
  setSnackbar,
  router
) {
  if (!session?.user?.id) {
    setSnackbar({
      open: true,
      message: "User not authenticated. Please log in again.",
      severity: "error",
    });
    router.push("/");
    return;
  }

  try {
    const correct = calculateScore(responses, questions);
    const percentage = questions.length
      ? Math.round((correct / questions.length) * 100)
      : 0;
    setScore(correct);
    setScorePercentage(percentage);
    const isPassed = percentage === 100;
    setSubmitted(true);

    // Fetch current progress to preserve completed_chapters
    console.log("Fetching progress for userId:", session.user.id);
    const progressRes = await axiosInstance.get(
      `/training/user-progress/?user_id=${session.user.id}`
    );
    console.log("Progress response:", progressRes.data);
    const currentProgress =
      progressRes.data.find((p) => p.course === Number(courseId)) || {};

    const payload = {
      user: session.user.id,
      course: Number(courseId),
      assessment_score: percentage,
      is_completed: isPassed,
      completed_date: isPassed ? new Date().toISOString() : null,
      completed_chapters: currentProgress.completed_chapters || [],
    };
    console.log(
      "Submitting assessment to:",
      `/training/user-progress/${courseId}/`,
      "Payload:",
      payload
    );
    const res = await axiosInstance.put(
      `/training/user-progress/${courseId}/`,
      payload
    );
    console.log("Submit response:", res.status);

    setIsCompleted(isPassed);
    if (isPassed) {
      setSnackbar({
        open: true,
        message: "Assessment passed! Redirecting...",
        severity: "success",
      });
      setTimeout(() => router.push("/trainings"), 2000);
    } else {
      setSnackbar({
        open: true,
        message: "Assessment failed. Please try again.",
        severity: "error",
      });
    }
  } catch (err) {
    console.error("submitAssessment error:", err.response?.data || err.message);
    setSnackbar({
      open: true,
      message: err.response?.data?.detail || `Error: ${err.message}`,
      severity: "error",
    });
  }
}

/**
 * Resets assessment for a new attempt with randomized questions, preserving completed_chapters.
 * @param {string} courseId - The course ID.
 * @param {Object} session - User session.
 * @param {Function} setQuestions - Sets questions state.
 * @param {Function} setResponses - Sets responses state.
 * @param {Function} setScore - Sets score state.
 * @param {Function} setScorePercentage - Sets percentage state.
 * @param {Function} setSubmitted - Sets submitted state.
 * @param {Function} setIsCompleted - Sets completion state.
 * @param {Function} setSnackbar - Sets snackbar state.
 */
export async function retakeAssessment(
  courseId,
  session,
  setQuestions,
  setResponses,
  setScore,
  setScorePercentage,
  setSubmitted,
  setIsCompleted,
  setSnackbar
) {
  if (!session?.user?.id) {
    setSnackbar({
      open: true,
      message: "User not authenticated. Please log in again.",
      severity: "error",
    });
    return;
  }

  try {
    // Fetch new course data to get randomized questions
    console.log("Fetching course data for retake, courseId:", courseId);
    const courseRes = await axiosInstance.get(`/training/courses/${courseId}/`);
    console.log("Retake course response:", courseRes.data);

    const allQuestions = courseRes.data.assessment_questions || [];
    const selectedQuestions =
      allQuestions.length > 1
        ? allQuestions.sort(() => Math.random() - 0.5).slice(0, 10)
        : allQuestions;

    // Fetch current progress to preserve completed_chapters
    console.log("Fetching progress for userId:", session.user.id);
    const progressRes = await axiosInstance.get(
      `/training/user-progress/?user_id=${session.user.id}`
    );
    console.log("Progress response:", progressRes.data);
    const currentProgress =
      progressRes.data.find((p) => p.course === Number(courseId)) || {};

    // Reset state
    setQuestions(selectedQuestions);
    setResponses(new Array(selectedQuestions.length).fill(null));
    setScore(0);
    setScorePercentage(0);
    setSubmitted(false);

    // Update progress
    const payload = {
      user: session.user.id,
      course: Number(courseId),
      assessment_score: null,
      is_completed: false,
      completed_date: null,
      completed_chapters: currentProgress.completed_chapters || [],
    };
    console.log(
      "Resetting assessment to:",
      `/training/user-progress/${courseId}/`,
      "Payload:",
      payload
    );
    const res = await axiosInstance.put(
      `/training/user-progress/${courseId}/`,
      payload
    );
    console.log("Reset response:", res.status);

    setIsCompleted(false);
    setSnackbar({
      open: true,
      message: "Assessment reset with new questions. You can now retake it.",
      severity: "success",
    });
  } catch (err) {
    console.error("retakeAssessment error:", err.response?.data || err.message);
    setSnackbar({
      open: true,
      message:
        err.response?.data?.detail ||
        `Error resetting assessment: ${err.message}`,
      severity: "error",
    });
  }
}

/**
 * Generates and downloads a certificate.
 * @param {string} courseTitle - The course title.
 * @param {Object} session - User session.
 * @param {Function} setSnackbar - Function to set snackbar state.
 */
export async function downloadAssessmentCertificate(
  courseTitle,
  session,
  setSnackbar
) {
  if (!session?.user?.id) {
    setSnackbar({
      open: true,
      message: "User not authenticated. Please log in again.",
      severity: "error",
    });
    return;
  }

  const container = document.createElement("div");
  container.id = "print-certificate";
  container.style.width = "794px";
  container.style.height = "1123px";
  container.style.padding = "40px";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.backgroundColor = "#ffffff";
  container.style.boxSizing = "border-box";
  container.style.overflow = "hidden";

  document.body.appendChild(container);

  const userName = `${session.user.first_name || "User"} ${
    session.user.last_name || ""
  }`;
  const date = new Date().toLocaleDateString();

  try {
    const ReactDOM = await import("react-dom");
    ReactDOM.render(
      <AssessmentCertificate
        userName={userName}
        courseTitle={courseTitle}
        date={date}
      />,
      container,
      () => {
        const opt = {
          margin: 0,
          filename: `certificate_${userName.replace(
            /\s/g,
            "_"
          )}_${courseTitle.replace(/\s/g, "_")}.pdf`,
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

        console.log("Generating certificate for:", userName, courseTitle);
        html2pdf()
          .set(opt)
          .from(container)
          .save()
          .catch((err) => {
            console.error("PDF Generation Error:", err.message);
            setSnackbar({
              open: true,
              message: "Failed to generate certificate PDF",
              severity: "error",
            });
          })
          .finally(() => {
            document.body.removeChild(container);
          });
      }
    );
  } catch (err) {
    console.error("ReactDOM Render Error:", err.message);
    setSnackbar({
      open: true,
      message: "Failed to render certificate",
      severity: "error",
    });
    document.body.removeChild(container);
  }
}

/**
 * Calculates score from responses.
 * @param {Array} responses - Array of user responses.
 * @param {Array} questions - Array of question objects with correct answers.
 * @returns {number} Number of correct answers.
 */
export function calculateScore(responses, questions) {
  return responses.reduce(
    (sum, response, index) =>
      sum + (response === questions[index].answer ? 1 : 0),
    0
  );
}

/**
 * Closes the snackbar.
 * @param {Function} setSnackbar - Function to set snackbar state.
 * @param {Object} snackbar - Current snackbar state.
 */
export function handleAssessmentSnackbarClose(setSnackbar, snackbar) {
  setSnackbar({ ...snackbar, open: false });
}
