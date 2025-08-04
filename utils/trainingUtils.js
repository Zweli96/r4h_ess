/**
 * Helper functions for training page.
 */
import html2pdf from 'html2pdf.js';
import ReactDOM from 'react-dom';
import Certificate from '../components/Certificate';
import axiosInstance from '../app/api/axiosInstance';

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
    setSnackbar({
      open: true,
      message: 'User not authenticated. Please log in.',
      severity: 'error',
    });
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

    console.log('Submitting progress to:', `/training/user-progress/${courseId}/`, 'Payload:', payload);

    const response = await axiosInstance.put(
      `/training/user-progress/${courseId}/`, // Trailing slash
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Response status:', response.status, 'Response data:', response.data);

    setCompletedChapters((prev) => ({
      ...prev,
      [courseId]: { ...prev[courseId], completed_chapters: updatedChapters },
    }));

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
        severity: 'success',
      });
      setTimeout(() => router.push(`/assessment/${courseId}`), 2000);
    }
  } catch (error) {
    console.error('handleChapterComplete error:', error.response?.data || error.message);
    setSnackbar({
      open: true,
      message: error.response?.data?.detail || 'Failed to save progress',
      severity: 'error',
    });
    throw error;
  }
}

/**
 * Generates and downloads a certificate as PDF.
 * @param {string} courseTitle - The course title.
 * @param {Object} session - User session.
 * @param {Function} setSnackbar - State setter for snackbar.
 */
export async function handleDownloadCertificate(courseTitle, session, setSnackbar) {
  if (!session?.user?.id) {
    setSnackbar({
      open: true,
      message: 'User not authenticated. Please log in.',
      severity: 'error',
    });
    return;
  }

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

  try {
    const ReactDOM = await import('react-dom');
    ReactDOM.render(
      <Certificate userName={userName} courseTitle={courseTitle} date={date} />,
      container,
      () => {
        const opt = {
          margin: 0,
          filename: `certificate_${userName.replace(/\s/g, '_')}_${courseTitle.replace(/\s/g, '_')}.pdf`,
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

        console.log('Generating certificate for:', userName, courseTitle);
        html2pdf()
          .set(opt)
          .from(container)
          .save()
          .catch((err) => {
            console.error('PDF Generation Error:', err.message);
            setSnackbar({ open: true, message: 'Failed to generate certificate PDF', severity: 'error' });
          })
          .finally(() => {
            document.body.removeChild(container);
          });
      }
    );
  } catch (err) {
    console.error('ReactDOM Render Error:', err.message);
    setSnackbar({ open: true, message: 'Failed to render certificate', severity: 'error' });
    document.body.removeChild(container);
  }
}