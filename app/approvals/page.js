import React from "react";
import Approvals from "@components/Approvals";
import Box from "@mui/material/Box";
import Nav from "@components/Navbar";

const page = () => {
  return (
    <Box sx={{ display: "block" }}>
      <Nav />
      <Approvals />
    </Box>
  );
};

export default page;
