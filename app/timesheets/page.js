"use client";
import React from "react";
import MenuAppBar from "@components/Navbar";
import BasicCard from "@components/DayCard";
import { Box } from "@mui/material";
import Title from "@components/Title";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

const page = () => {
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <Box>
      <MenuAppBar />
      <Title>Timesheet Submission</Title>
      <Stack spacing={2} direction="row" alignItems={"center"}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="demo-simple-select-standard-label">Period</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={age}
            onChange={handleChange}
            label="Period"
          >
            <MenuItem value={10}>January - 2024</MenuItem>
            <MenuItem value={20}>February - 2024</MenuItem>
            <MenuItem value={30}>March - 2024</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained">Submit</Button>
      </Stack>
      <Box sx={{ mt: 2 }}>
        <Stack
          spacing={{ xs: 1, sm: 6 }}
          direction="row"
          useFlexGap
          flexWrap="wrap"
        >
          <BasicCard />
          <BasicCard />
          <BasicCard />
          <BasicCard />
          <BasicCard />
          <BasicCard />
        </Stack>
      </Box>
    </Box>
  );
};

export default page;
