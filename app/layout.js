// "use client";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "../utils/ThemeRegistry";
import CssBaseline from "@mui/material/CssBaseline";
import { SessionProvider } from "../utils/provider";
import { getSession } from "../utils/session";
import AppDrawer from "@/../../components/AppDrawer";
import Navbar from "@/../../components/Navbar";
import Layout from "@/../../components/Layout";
import Box from "@mui/material/Box";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "R4H ESS",
//   description: "R4H Employee Self Service System",
// };

export default async function RootLayout({ children }) {
  // const [open, setOpen] = useState(true);
  // const toggleDrawer = () => {
  //   setOpen(!open);
  // };

  const session = await getSession();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <head>
          <title>R4H ESS</title>
          <meta
            name="description"
            content="R4H Employee Self Service System"
          ></meta>
        </head>
        <body className={inter.className}>
          <ThemeRegistry options={{ key: "mui-theme" }}>
            <Box sx={{ display: "flex" }}>
              <CssBaseline />
              <Layout />
              {children}
            </Box>
          </ThemeRegistry>
        </body>
      </html>
    </SessionProvider>
  );
}
