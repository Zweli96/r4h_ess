import React from "react";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";

function Totals({
  daysTotal,
  daysFilled,
  hoursTotal,
  hoursFilled,
  leaveDays,
  levelOfEffort,
}) {
  return (
    <Grid container direction="row" spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={5}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap">
          <h5>
            Days&nbsp;&nbsp;
            <Chip label={`${daysFilled} / ${daysTotal}`} color="primary" />
          </h5>
          <h5>
            Total Hours&nbsp;&nbsp;
            <Chip label={`${hoursFilled} / ${hoursTotal}`} color="primary" />
          </h5>
          <h5>
            Leave Days&nbsp;&nbsp;
            <Chip label={leaveDays} color="success" />
          </h5>
        </Stack>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <h5>LOE&nbsp;&nbsp;</h5>
          {Object.keys(levelOfEffort).map((project) => (
            <h5 key={project}>
              {project} - {levelOfEffort[project]}%&nbsp;&nbsp;
            </h5>
          ))}
        </Stack>
      </Grid>
      <Grid container xs={5} justifyContent="center"></Grid>
      <Grid item xs={2}>
        <Button variant="contained">Submit</Button>
      </Grid>
    </Grid>
  );
}

export default Totals;
