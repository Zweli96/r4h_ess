"use client";
import "@./../../app/globals.css";
import AppDrawer from "@/../../components/AppDrawer";
import Navbar from "@/../../components/Navbar";
import { useState } from "react";
import Box from "@mui/material/Box";

// export const metadata = {
//   title: "R4H ESS",
//   description: "R4H Employee Self Service System",
// };

export default function Layout() {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar toggleDrawer={toggleDrawer} open={open} />
      <AppDrawer open={open} toggleDrawer={toggleDrawer} />
    </Box>
  );
}
