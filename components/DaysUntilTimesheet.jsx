import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function DaysUntilTimesheetCard() {
  return (
    <Box
      sx={{
        width: "20vw", // Always 20% of viewport width
        height: "20vh", // Limits height to 20% of viewport height
        overflow: "hidden", // Prevents content from overflowing
        maxWidth: "300px", // Prevents it from getting too large
        minWidth: "200px", // Ensures it doesn’t become too small
        display: "flex",
        alignSelf: "flex-start", // Aligns it to the start of the parent container
      }}
    >
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h10" component="div">
            10 Days until March Timesheet Submission
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">View Details</Button>
        </CardActions>
      </Card>
    </Box>
  );
}
