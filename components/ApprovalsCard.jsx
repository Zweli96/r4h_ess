// components/ApprovalsCard.jsx
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import CustomLink from "./CustomLink";
import ApprovalsAvatar from "./ApprovalsAvatar";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function ApprovalsCard({ pending_count = 0 }) {
  const isPending = pending_count > 0;

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "100%", md: "40%" },
        maxWidth: "500px",
        minWidth: { xs: "100%", md: "250px" },
        minHeight: { xs: "50%", md: "220px" },
        display: "flex",
        alignSelf: "center",
        justifyContent: "center",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: "24px",
          overflow: "hidden",
          minHeight: "25vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <CustomLink href="/approvals">
              <ApprovalsAvatar pending_count={pending_count} size={48} />
            </CustomLink>
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6" color="text.primary">
                {isPending ? `Approvals ` : "No Approvals Waiting"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isPending
                  ? "Timesheets awaiting your approval"
                  : "No timesheets awaiting your approval"}
              </Typography>
            </Box>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
          <Button
            color="primary"
            size="small"
            component={Link}
            href="/approvals"
            endIcon={<ArrowForwardIcon />}
          >
            Go to Approvals
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
