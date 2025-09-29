import { Typography } from "@mui/material";

export default function AssessmentHeader({ courseTitle }) {
  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
      >
        Assessment for {courseTitle}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 3,
          fontSize: { xs: "0.875rem", sm: "1rem" },
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
      >
        A score of 100% is required to pass the assessment.
      </Typography>
    </>
  );
}
