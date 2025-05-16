"use client";
import { useState } from "react";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import CustomLink from "./CustomLink"; // Import CustomLink if needed
import Link from "next/link"; // Import Next.js Link
import LogoutIcon from "@mui/icons-material/Logout"; // Import LogoutIcon
import Tooltip from "@mui/material/Tooltip";
import { signOut, useSession } from "next-auth/react";

const drawerWidth = 240;
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Navbar({ toggleDrawer, open, drawerWidth }) {
  const { data: session, status } = useSession({ required: true });
  return (
    <AppBar position="absolute" open={open}>
      <Toolbar
        sx={{
          pr: "24px", // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: "36px",
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          <CustomLink
            href="/"
            passHref
            style={{ textDecoration: "none", color: "inherit" }}
          >
            R4H ESS
          </CustomLink>
        </Typography>
        {/* <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton> */}
        <Typography sx={{ display: { xs: "none", sm: "block" } }}>
          Logged in as {session?.user?.username || "unknown"}
        </Typography>
        <Tooltip title="Logout">
          <IconButton
            color="inherit"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
