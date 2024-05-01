"use client";
import "./globals.css";
import AppDrawer from "@/../../components/AppDrawer";
import Navbar from "@/../../components/Navbar";
import { useState } from "react";

// export const metadata = {
//   title: "R4H ESS",
//   description: "R4H Employee Self Service System",
// };

export default function Layout() {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <Navbar toggleDrawer={toggleDrawer} open={open} />
      <AppDrawer open={open} toggleDrawer={toggleDrawer} />
    </>
  );
}
