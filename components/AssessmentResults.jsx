import { Box, Typography, Button, Alert } from "@mui/material";

export default function AssessmentResults({
  isPassed,
  scorePercentage,
  submitted,
  handleRetake,
  handleDownload,
  router,
}) {
  return (
    <Box mt={2}>
      {submitted ? (
        <>
          <Alert
            severity={isPassed ? "success" : "error"}
            sx={{
              mb: 2,
              width: "100%",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            You {isPassed ? "passed" : "did not pass"} the assessment!
          </Alert>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            Score: {scorePercentage}%
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            {isPassed && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDownload}
                sx={{
                  minWidth: { xs: 100, sm: 120 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Download Certificate
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={() => router.push("/trainings")}
              sx={{
                minWidth: { xs: 100, sm: 120 },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Back to Courses
            </Button>
            {!isPassed && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleRetake}
                sx={{
                  minWidth: { xs: 100, sm: 120 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Retake Assessment
              </Button>
            )}
          </Box>
        </>
      ) : (
        <>
          <Alert
            severity="success"
            sx={{
              mb: 2,
              width: "100%",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            You have already passed this assessment with a score of{" "}
            {scorePercentage}%. Would you like to retake it?
          </Alert>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleRetake}
              sx={{
                minWidth: { xs: 100, sm: 120 },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Retake Assessment
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownload}
              sx={{
                minWidth: { xs: 100, sm: 120 },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Download Certificate
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push("/Trainings")}
              sx={{
                minWidth: { xs: 100, sm: 120 },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Back to Courses
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
