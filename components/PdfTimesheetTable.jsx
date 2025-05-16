"use client";
import React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Image from "next/image";
import ESSIcon from "../public/r4hlogo.png";

const PdfTimesheetTable = ({ data }) => {
  if (!data || data.length === 0) return;

  const projectKeys = Object.keys(data[0].project || {});

  return (
    <div id="pdf-content" className="hidden" style={{ padding: 20 }}>
      <Image
        component="img"
        sx={{
          height: "100%",
          width: "100%",
          maxHeight: { xs: 233, md: 167 },
          maxWidth: { xs: 350, md: 250 },
        }}
        src={ESSIcon}
        alt="R4H LOGO"
      />
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: "700", marginTop: "30px" }}
      >
        Timesheet Report
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ fontWeight: "600" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "600" }}>Employee ID</TableCell>
              <TableCell sx={{ fontWeight: "600" }}>Staff Name</TableCell>
              <TableCell sx={{ fontWeight: "600" }}>Department</TableCell>
              <TableCell sx={{ fontWeight: "600" }}>District</TableCell>
              <TableCell sx={{ fontWeight: "600" }}>Period</TableCell>
              {projectKeys.map((proj, index) => (
                <React.Fragment key={index}>
                  <TableCell sx={{ fontWeight: "600" }}>{proj} Hours</TableCell>
                </React.Fragment>
              ))}
              <TableCell sx={{ fontWeight: "600" }}>Work Hours</TableCell>
              <TableCell sx={{ fontWeight: "600" }}>Leave Hours</TableCell>
              <TableCell sx={{ fontWeight: "600" }}>Total Hours</TableCell>
              <TableCell sx={{ fontWeight: "600" }}>LOE (%)</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.employee_id}</TableCell>
                <TableCell>{entry.staff_name}</TableCell>
                <TableCell>{entry.department}</TableCell>
                <TableCell>{entry.district}</TableCell>
                <TableCell>{entry.period}</TableCell>
                {projectKeys.map((proj, i) => (
                  <React.Fragment key={i}>
                    <TableCell>{entry.project?.[proj]?.hours}</TableCell>
                  </React.Fragment>
                ))}

                <TableCell>{entry.total_work_hours}</TableCell>
                <TableCell>{entry.total_leave_hours}</TableCell>
                <TableCell>{entry.total_available_hours}</TableCell>
                <TableCell>{entry.LOE}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PdfTimesheetTable;
