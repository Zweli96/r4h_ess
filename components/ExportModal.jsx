"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

const ExportModal = ({
  open,
  onClose,
  filters,
  onChange,
  financial_years_list = [],
  courses_list = [],
  onExport,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export Reports</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="export-financial-year-label">
              Financial Year
            </InputLabel>
            <Select
              labelId="financial-year-export-label"
              value={
                financial_years_list.some(
                  (fy) => fy.id === filters.financial_year
                )
                  ? filters.financial_year
                  : ""
              }
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
            <InputLabel id="export-course-label">Course</InputLabel>
            <Select
              labelId="course-export-label"
              value={
                courses_list.some((course) => course.id === filters.course)
                  ? filters.course
                  : ""
              }
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

          <FormControl>
            <RadioGroup
              row={false}
              value={filters.format || "excel"}
              onChange={(e) => onChange({ format: e.target.value })}
            >
              <FormControlLabel
                value="excel"
                control={<Radio />}
                label="Excel"
              />
            </RadioGroup>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onExport}>
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportModal;
