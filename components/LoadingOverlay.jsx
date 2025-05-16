import { CircularProgress, Backdrop, Typography, Box } from "@mui/material";

export default function LoadingOverlay({ open }) {
  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Whitish backdrop with 80% opacity
      }}
      open={open}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress color="primary" size={60} /> {/* Larger loader */}
        <Typography variant="h6" color="text.primary">
          Loading, please wait
        </Typography>
      </Box>
    </Backdrop>
  );
}
