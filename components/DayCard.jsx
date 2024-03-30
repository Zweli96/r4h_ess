import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

const ProjectBox = () => {
  return (
    <Box width={400} boxShadow={3} borderRadius={4} mr={2}>
      <div>
        {" "}
        {/* Apply scale transformation to the content */}
        <Typography variant="h6" gutterBottom style={{ textAlign: "center" }}>
          March 13, 2024 {/* Date */}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Projects
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project Name</TableCell>
                <TableCell> </TableCell>
                <TableCell>Hours</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Project 1</TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <TextField label="Hours" type="number" defaultValue="0" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Project 2</TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <TextField label="Hours" type="number" defaultValue="0" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Box>
  );
};

export default ProjectBox;
