import * as React from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ArticleIcon from "@mui/icons-material/Article";

export const menu = [
  {
    icon: <CalendarMonthIcon />,
    title: "Timesheets",
    items: [
      {
        title: "Submit",
        to: "/timesheets",
      },
      {
        title: "My Timesheets",
        to: "/timesheets/history",
      },
      {
        title: "Approvals",
        to: "/approvals",
      },
    ],
  },
  // {
  //   icon: <MeetingRoomIcon />,
  //   // title: "Leave",
  //   // items: [
  //   //   {
  //   //     title: "Apply",
  //   //     to: "/leave",
  //   //   },
  //     // {
  //     //   title: "My Leave",
  //     //   to: "/leave/history",
  //     // },
  //     {
  //       title: "Approvals",
  //       to: "/leave/apporvals",
  //     },
  //   ],
  // },
  {
    icon: <ArticleIcon />,
    title: "Reports",
    items: [
      // {
      //   title: "Compliance Report",
      //   to: "/reports/compliance",
      // },
      {
        title: "Timesheet Report",
        to: "/timesheets/reports",
      },
    ],
  },
];
