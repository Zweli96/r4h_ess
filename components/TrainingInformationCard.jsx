import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import TrainingAvatar from "./TrainingAvatar";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function TrainingCard({
  completedTrainings = 1,
  totalTrainings = 1,
  incompleteTrainingNames = [],
}) {
  const allCompleted =
    completedTrainings === totalTrainings && totalTrainings > 0;
  const title = allCompleted
    ? "All Required Trainings Completed"
    : totalTrainings > 0
    ? `${completedTrainings} out of ${totalTrainings} Trainings Completed`
    : "No Trainings Assigned";

  const description = allCompleted
    ? "All trainings for the current financial year have been completed."
    : incompleteTrainingNames.length > 0
    ? `${incompleteTrainingNames[0]}${
        incompleteTrainingNames.length > 1
          ? ` and ${incompleteTrainingNames.length - 1} other${
              incompleteTrainingNames.length > 2 ? "s" : ""
            }`
          : ""
      } not yet completed.`
    : "No trainings assigned for the current financial year.";

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "100%", md: "40%" },
        maxWidth: "500px",
        minHeight: { xs: "50%", md: "220px" },
        minWidth: { xs: "100%", md: "250px" },
        display: "flex",
        alignSelf: "center",
        justifyContent: "center",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: "24px",
          overflow: "hidden",
          minHeight: "25vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Link href="/Trainings">
              <TrainingAvatar allCompleted={allCompleted} size={48} />
            </Link>
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6" color="text.primary">
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Box>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
          <Button
            color="primary"
            size="small"
            component={Link}
            href="trainings"
            endIcon={<ArrowForwardIcon />}
          >
            Go to Trainings
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
