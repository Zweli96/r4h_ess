"use client";
import { useState } from "react";
import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

function SearchFilters({
  filters,
  onChange,
  financial_years_list,
  courses_list,
}) {
  return (
    <Stack direction={"row"} spacing={2} sx={{ padding: 2, minWidth: 350 }}>
      <FormControl fullWidth>
        <InputLabel id="financial-year-select-label">Financial Year</InputLabel>
        <Select
          labelId="financial-year-select-label"
          id="financial-year-select"
          value={filters.financial_year}
          label="Financial Year"
          onChange={(e) =>
            onChange({
              financial_year:
                e.target.value === "" ? "" : Number(e.target.value),
            })
          }
        >
          {financial_years_list.map((year) => (
            <MenuItem key={year.id} value={year.id}>
              {year.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="course-select-label">Course</InputLabel>
        <Select
          labelId="course-select-label"
          id="course-select"
          value={filters.course}
          label="Course"
          onChange={(e) => onChange({ course: e.target.value })}
        >
          {courses_list.map((course) => (
            <MenuItem key={course.id} value={course.id}>
              {course.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}

export default SearchFilters;
