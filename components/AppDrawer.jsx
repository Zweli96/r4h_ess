"use client";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import List from "@mui/material/List";
import { menu } from "./listItems";
import { hasChildren } from "@../../../utils/utils";
import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import CustomLink from "./CustomLink";
import { useState } from "react";
import MuiDrawer from "@mui/material/Drawer";
import { useSession } from "next-auth/react"; // Import useSession

const drawerWidth = 240;
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: 0, // Completely hide the drawer on small screens when closed
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(7),
      },
      [theme.breakpoints.up("md")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const MenuItem = ({ item, drawerOpen }) => {
  const Component = hasChildren(item) ? MultiLevel : SingleLevel;
  return <Component item={item} drawerOpen={drawerOpen} />;
};

const SingleLevel = ({ item }) => {
  return (
    <CustomLink href={item.to}>
      <ListItem>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.title} />
      </ListItem>
    </CustomLink>
  );
};

const MultiLevel = ({ item, drawerOpen }) => {
  const { items: children } = item;
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    drawerOpen ? setOpen((prev) => !prev) : setOpen(false);
  };

  return (
    <React.Fragment>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.title} />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <Collapse in={drawerOpen ? open : false} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children.map((child, key) => (
            <MenuItem key={key} item={child} />
          ))}
        </List>
      </Collapse>
    </React.Fragment>
  );
};

export default function AppDrawer({ open, toggleDrawer }) {
  const { data: session, status } = useSession();

  // Filter menu based on hr_approvals
  const filteredMenu = menu.filter((item) => {
    if (item.title === "Reports") {
      return session?.user?.staff?.hr_approval === true;
    }
    return true;
  });

  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>

      <List component="nav">
        {filteredMenu.map((item, key) => (
          <MenuItem key={key} item={item} drawerOpen={open} />
        ))}
        {/* <Divider sx={{ my: 1 }} />
            {secondaryListItems} */}
      </List>
    </Drawer>
  );
}
