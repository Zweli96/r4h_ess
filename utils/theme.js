"use client";
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    // background: {
    //   default: "#F5F5F4", // Set your desired background color (light gray)
    // },
    primary: {
      main: "#2AB4A6",
      contrastText: "#fff",
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      // Optional: Customize specific variants if needed
      h1: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 700,
      },
      h2: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 700,
      },
      h3: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 700,
      },
      h4: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 700,
      },
      h5: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 700,
      },
      h6: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 700,
      },
      body1: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
      },
      body2: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
      },
      button: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 700,
      },
    },
  },
});
