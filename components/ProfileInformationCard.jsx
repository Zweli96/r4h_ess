// components/ProfileInformationCard.jsx
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ProfileAvatar from "./ProfileAvatar"; // Adjust path as needed
import ApartmentIcon from "@mui/icons-material/Apartment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TagIcon from "@mui/icons-material/Tag";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";

export default function ProfileInformationCard({
  name,
  position,
  employee_id,
  district,
  department,
  line_manager,
}) {
  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "100%", md: "40%" },
        maxWidth: "600px",
        minWidth: { xs: "100%", md: "300px" },
        minHeight: { xs: "50%", md: "180px" },
        display: "flex",
        alignSelf: "center",
        justifyContent: "center",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          minHeight: "25vh", // Add this
          borderRadius: "24px",
          overflow: "hidden",
        }}
      >
        <CardContent>
          {/* Avatar, Name, and Position */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
            }}
          >
            <ProfileAvatar name={name} size={48} />
            <Box
              sx={{
                ml: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" component="div">
                {name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary", // Theme primary color (e.g., #1976d2)
                  fontWeight: 500, // Match MUI Button
                }}
              >
                {position}
              </Typography>
            </Box>
          </Box>

          {/* 4x4 Grid for Additional Info */}
          <Box sx={{ p: 2, backgroundColor: "grey.100", borderRadius: "12px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ApartmentIcon sx={{ mr: 1, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.primary">
                    {department} Department
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocationOnIcon sx={{ mr: 1, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.primary">
                    {district}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TagIcon sx={{ mr: 1, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.primary">
                    {employee_id}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <SupervisedUserCircleIcon
                    sx={{ mr: 1, color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="text.primary">
                    {line_manager}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
