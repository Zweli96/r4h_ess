import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import { handleChapterComplete } from "../utils/trainingUtils";
import ReactMarkdown from "react-markdown";

/**
 * CourseContent component to display a course's chapters in a stepper.
 * @param {Object} props
 * @param {number} props.courseId - The course ID.
 * @param {Array} props.courses - List of courses.
 * @param {Object} props.completedChapters - Progress map.
 * @param {Function} props.setCompletedChapters - State setter for completed chapters.
 * @param {Object} props.session - User session.
 */
export default function CourseContent({
  courseId,
  courses,
  completedChapters,
  setCompletedChapters,
  session,
}) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const selectedCourse = courses.find((course) => course.id === courseId);

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // if (!selectedCourse) {
  //   return (
  //     <Paper sx={{ p: { xs: 1, sm: 2, md: 3 }, width: '100%', mx: 'auto' }}>
  //       <Alert severity="error" sx={{ width: '100%' }}>
  //         Course not found for ID: {courseId}
  //       </Alert>
  //     </Paper>
  //   );
  // }

  return (
    <Paper
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        width: "100%",
        mx: "auto",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
          width: "100%",
        }}
      >
        {selectedCourse.title}
      </Typography>
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        sx={{ mb: 3, width: "100%" }}
      >
        {selectedCourse.chapters.map((chapter, index) => (
          <Step
            key={chapter.id}
            completed={completedChapters[
              selectedCourse.id
            ]?.completed_chapters.includes(chapter.id)}
            sx={{ width: "100%" }}
          >
            <StepLabel sx={{ width: "100%" }}>{chapter.title}</StepLabel>
            {index === activeStep && (
              <Box sx={{ pl: { xs: 2, sm: 4 }, pb: 2, width: "100%" }}>
                <Typography
                  sx={{
                    whiteSpace: "pre-line",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    width: "100%",
                  }}
                >
                  <ReactMarkdown>{chapter.content}</ReactMarkdown>
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mt: 2,
                    justifyContent: "center",
                    flexWrap: "wrap",
                    width: "100%",
                  }}
                >
                  <Button
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep((prev) => prev - 1)}
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() =>
                      handleChapterComplete(
                        selectedCourse.id,
                        chapter.id,
                        completedChapters,
                        setCompletedChapters,
                        selectedCourse,
                        setActiveStep,
                        router,
                        session,
                        setSnackbar
                      )
                    }
                    disabled={
                      index !== selectedCourse.chapters.length - 1 &&
                      completedChapters[
                        selectedCourse.id
                      ]?.completed_chapters.includes(chapter.id)
                    }
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                  >
                    {activeStep === selectedCourse.chapters.length - 1
                      ? "Finish Course"
                      : "Complete Chapter"}
                  </Button>
                  <Button
                    disabled={activeStep === selectedCourse.chapters.length - 1}
                    onClick={() => setActiveStep((prev) => prev + 1)}
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            )}
          </Step>
        ))}
      </Stepper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.type}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
