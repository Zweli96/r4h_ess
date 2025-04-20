import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import Image from "next/image";
import * as React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Copyright from "@../../../components/Copyright";
import Link from "@mui/material/Link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import ESSIcon from "@../../../public/ESS.svg";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { useSearchParams } from "next/navigation"; // For Next.js 13+ App Router

const getBackgroundColor = (theme) =>
  theme.palette.mode === "light"
    ? theme.palette.grey[50]
    : theme.palette.grey[900];

export default function SignInSide() {
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    username: false,
    password: false,
  });

  // Get callbackUrl from URL query parameters
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/"; // Fallback to "/" if no callbackUrl

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");
    setFieldErrors({ username: false, password: false });

    // Check if fields are empty
    if (!userInfo.username || !userInfo.password) {
      setError(true);
      setErrorMessage("Please fill in all required fields");
      setFieldErrors({
        username: !userInfo.username,
        password: !userInfo.password,
      });
      return;
    }

    const res = await signIn("credentials", {
      username: userInfo.username,
      password: userInfo.password,
      redirect: false, // Keep redirect false to handle manually
      callbackUrl, // Pass the callbackUrl to NextAuth
    });

    if (res?.error === "Service Unavailable") {
      setError(true);
      setErrorMessage(
        "Service temporarily unavailable, please try again later"
      );
    } else if (res?.error === "CredentialsSignin") {
      setError(true);
      setErrorMessage("Incorrect username or password");
    } else if (!res?.error) {
      // Redirect to callbackUrl on success
      window.location.href = callbackUrl; // Use callbackUrl instead of "/"
    }

    console.log(res);
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage:
            "url(https://i.ibb.co/x5JDJVQ/Outdoor-Signage-Mockup-R4-H.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) => getBackgroundColor(t),
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Image
            component="img"
            sx={{
              height: 233,
              width: 350,
              maxHeight: { xs: 233, md: 167 },
              maxWidth: { xs: 350, md: 250 },
            }}
            src={ESSIcon}
            alt="R4H LOGO"
          />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              type="text"
              id="username"
              label="Username"
              name="username"
              value={userInfo.username}
              autoComplete="username"
              autoFocus
              onChange={({ target }) =>
                setUserInfo({ ...userInfo, username: target.value })
              }
              error={fieldErrors.username}
              helperText={fieldErrors.username ? "Username is required" : ""}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              value={userInfo.password}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={({ target }) =>
                setUserInfo({ ...userInfo, password: target.value })
              }
              error={fieldErrors.password}
              helperText={fieldErrors.password ? "Password is required" : ""}
            />
            <Link>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Link>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
