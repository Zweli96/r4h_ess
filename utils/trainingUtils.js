/**
 * Helper functions for training page.
 */
import html2pdf from 'html2pdf.js';
import ReactDOM from 'react-dom';
import Certificate from '../components/Certificate';
import axiosInstance from '../app/api/axiosInstance'; // Corrected path, kept for potential future use

/**
 * Calculates progress percentage for a course.
 * @param {number} courseId - The course ID.
 * @param {number} totalChapters - Total number of chapters in the course.
 * @param {Object.<number, {completed_chapters: number[], is_completed: boolean}>} completedChapters - Progress map.
 * @returns {number} Progress percentage.
 */
export function getProgress(courseId, totalChapters, completedChapters) {
  const completed = completedChapters[courseId]?.completed_chapters.length || 0;
  return (completed / (totalChapters || 1)) * 100;
}

/**
 * Handles course selection and resets active step.
 * @param {number} courseId - The course ID.
 * @param {Object} router - Next.js router instance.
 * @param {Function} setCompletedChapters - State setter for completed chapters.
 */
export function handleCourseClick(courseId, router, setCompletedChapters) {
  setCompletedChapters((prev) => ({ ...prev }));
  router.push(`/Trainings?courseId=${courseId}`);
}

/**
 * Handles chapter completion and updates progress.
 * @param {number} courseId - The course ID.
 * @param {number} chapterId - The chapter ID.
 * @param {Object} completedChapters - Current progress map.
 * @param {Function} setCompletedChapters - State setter for completed chapters.
 * @param {Object} selectedCourse - The selected course.
 * @param {Function} setActiveStep - State setter for active step.
 * @param {Object} router - Next.js router instance.
 * @param {Object} session - User session.
 * @param {Function} setSnackbar - State setter for snackbar.
 */
export async function handleChapterComplete(
  courseId,
  chapterId,
  completedChapters,
  setCompletedChapters,
  selectedCourse,
  setActiveStep,
  router,
  session,
  setSnackbar
) {
  if (!session?.user?.id) {
    router.push('/');
    return;
  }

  try {
    const currentProgress = completedChapters[courseId] || { completed_chapters: [] };
    const updatedChapters = [...new Set([...currentProgress.completed_chapters, chapterId])];

    const payload = {
      user: session.user.id,
      course: courseId,
      completed_chapters: updatedChapters,
      is_completed: updatedChapters.length === selectedCourse?.chapters.length,
    };
   
    const response = await fetch(`http://localhost:8000/api/training/user-progress/${courseId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to save progress: ${response.status} ${errorText.slice(0, 100)}`);
    }

    setCompletedChapters((prev) => ({
      ...prev,
      [courseId]: { ...prev[courseId], completed_chapters: updatedChapters },
    }));

    // Get current activeStep
    let activeStep = 0;
    setActiveStep((prev) => {
      activeStep = prev;
      return prev;
    });

    if (activeStep < selectedCourse.chapters.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      setSnackbar({
        open: true,
        message: 'Course completed! Proceeding to assessment...',
        type: 'success',
      });
      setTimeout(() => router.push(`/assessment/${courseId}`), 2000);
    }
  } catch (error) {
    console.error('handleChapterComplete error:', error.message || error);
    setSnackbar({
      open: true,
      message: error.message || 'Failed to save progress',
      type: 'error',
    });
  }
}

/**
 * Generates and downloads a certificate as PDF.
 * @param {string} courseTitle - The course title.
 * @param {Object} session - User session.
 */
export function handleDownloadCertificate(courseTitle, session) {
  const container = document.createElement('div');
  container.id = 'print-certificate';
  container.style.width = '794px';
  container.style.height = '1123px';
  container.style.padding = '40px';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.backgroundColor = '#ffffff';
  container.style.boxSizing = 'border-box';
  container.style.overflow = 'hidden';

  document.body.appendChild(container);

  const userName = `${session?.user?.first_name || 'User'} ${session?.user?.last_name || ''}`;
  const date = new Date().toLocaleDateString();

  ReactDOM.render(
    <Certificate userName={userName} courseTitle={courseTitle} date={date} />,
    container,
    () => {
      const opt = {
        margin: 0,
        filename: `certificate_${courseTitle}_${session?.user?.first_name || 'User'}_${session?.user?.last_name || ''}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          scale: 2,
          scrollX: 0,
          scrollY: 0,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: 794,
          height: 1123,
        },
        jsPDF: {
          unit: 'px',
          format: [794, 1123],
          orientation: 'portrait',
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
}