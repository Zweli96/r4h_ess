"use client";
import Image from "next/image";
import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Copyright from "@../../../components/Copyright";
import SignInSide from "@../../../components/SignInSide";
import ESSIcon from "../../public/ESS.svg";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return <SignInSide />;
}
