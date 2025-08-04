import html2pdf from "html2pdf.js";
import AssessmentCertificate from "../components/AssessmentCertificate";

/**
 * Fetches course and progress data for the assessment.
 * @param {string} courseId - The course ID.
 * @param {string} userId - The user ID.
 * @returns {Promise<{questions: Array, title: string, progress: Object}>}
 */
export async function fetchAssessmentData(courseId, userId) {
  try {
    console.log("Fetching course data for courseId:", courseId);
    const courseRes = await fetch(
      `http://localhost:8000/api/training/courses/${courseId}/`
    );
    if (!courseRes.ok) {
      const errorText = await courseRes.text();
      throw new Error(
        `Failed to fetch course: ${courseRes.status} ${errorText.slice(0, 100)}`
      );
    }
    const courseData = await courseRes.json();

    console.log("Fetching progress for userId:", userId);
    const progressRes = await fetch(
      `http://localhost:8000/api/training/user-progress/?user_id=${userId}`
    );
    if (!progressRes.ok) {
      const errorText = await progressRes.text();
      throw new Error(
        `Failed to fetch progress: ${progressRes.status} ${errorText.slice(
          0,
          100
        )}`
      );
    }
    const progressData = await progressRes.json();

    return {
      questions: courseData.assessment_questions || [],
      title: courseData.title || "Course",
      progress: progressData.find((p) => p.course === Number(courseId)),
    };
  } catch (err) {
    console.error("fetchAssessmentData error:", err.message);
    throw err;
  }
}

/**
 * Resets invalid progress if assessment score is missing or < 100%.
 * @param {string} courseId - The course ID.
 * @param {string} userId - The user ID.
 * @param {Function} setSnackbar - Function to set snackbar state.
 */
export async function resetAssessmentProgress(courseId, userId, setSnackbar) {
  try {
    const payload = {
      user: userId,
      course: courseId,
      assessment_score: null,
      is_completed: false,
      completed_date: null,
    };
    console.log(
      "Resetting progress to:",
      `http://localhost:8000/api/training/user-progress/${courseId}/`,
      "Payload:",
      payload
    );
    const res = await fetch(
      `http://localhost:8000/api/training/user-progress/${courseId}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to reset progress: ${res.status} ${errorText.slice(0, 100)}`
      );
    }
    console.log("Reset response:", res.status);
  } catch (err) {
    console.error("resetAssessmentProgress error:", err.message);
    setSnackbar({
      open: true,
      message: `Error resetting progress: ${err.message}`,
      severity: "error",
    });
    throw err;
  }
}

/**
 * Submits assessment responses and updates progress.
 * @param {string} courseId - The course ID.
 * @param {Object} session - User session.
 * @param {Array} questions - Assessment questions.
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
      message: "User ID not available. Please log in again.",
      severity: "error",
    });
    return;
  }

  const correct = calculateScore(responses, questions);
  const percentage = questions.length
    ? Math.round((correct / questions.length) * 100)
    : 0;
  setScore(correct);
  setScorePercentage(percentage);
  const isPassed = percentage >= 80;
  setSubmitted(true);

  try {
    const payload = {
      user: session.user.id,
      course: courseId,
      assessment_score: percentage,
      is_completed: isPassed,
      completed_date: isPassed ? new Date().toISOString() : null,
    };
    console.log(
      "Submitting assessment to:",
      `http://localhost:8000/api/training/user-progress/${courseId}/`,
      "Payload:",
      payload
    );
    const res = await fetch(
      `http://localhost:8000/api/training/user-progress/${courseId}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to update progress: ${res.status} ${errorText.slice(0, 100)}`
      );
    }
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
    console.error("submitAssessment error:", err.message);
    setSnackbar({
      open: true,
      message: `Error: ${err.message}`,
      severity: "error",
    });
  }
}

/**
 * Resets assessment for a new attempt.
 */
export async function retakeAssessment(
  courseId,
  session,
  questions,
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
      message: "User ID not found. Please log in again.",
      severity: "error",
    });
    return;
  }

  try {
    setSubmitted(false);
    setResponses(new Array(questions.length).fill(null));
    setScore(0);
    setScorePercentage(0);
    const payload = {
      user: session.user.id,
      course: courseId,
      assessment_score: null,
      is_completed: false,
      completed_date: null,
    };
    console.log(
      "Resetting assessment to:",
      `http://localhost:8000/api/training/user-progress/${courseId}/`,
      "Payload:",
      payload
    );
    const res = await fetch(
      `http://localhost:8000/api/training/user-progress/${courseId}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to reset progress: ${res.status} ${errorText.slice(0, 100)}`
      );
    }
    console.log("Reset response:", res.status);
    setIsCompleted(false);
    setSnackbar({
      open: true,
      message: "Assessment reset. You can now retake it.",
      severity: "success",
    });
  } catch (err) {
    console.error("retakeAssessment error:", err.message);
    setSnackbar({
      open: true,
      message: `Error resetting assessment: ${err.message}`,
      severity: "error",
    });
  }
}

/**
 * Generates and downloads a certificate.
 * @param {string} courseTitle - The course title.
 * @param {Object} session - User session object.
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
      message: "User ID not available. Please log in again.",
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
 * @param {Array<number>} responses - Array of user responses.
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
