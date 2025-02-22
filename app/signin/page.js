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

// const getBackgroundColor = (theme) =>
//   theme.palette.mode === "light"
//     ? theme.palette.grey[50]
//     : theme.palette.grey[900];

// const Copyright = (props) => {
//   return (
//     <Typography
//       variant="body2"
//       color="text.secondary"
//       align="center"
//       {...props}
//     >
//       {"Copyright © "}
//       <Link color="inherit" href="https://r4hmw.org/">
//         R4H ICT
//       </Link>{" "}
//       {new Date().getFullYear()}
//       {"."}
//     </Typography>
//   );
// };

// TODO remove, this demo shouldn't need to reset the theme.

// export default function SignInSide() {
//   const [userInfo, setUserInfo] = useState({ username: "", password: "" });
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await signIn("credentials", {
//       username: userInfo.username,
//       password: userInfo.password,
//       redirect: true,
//       callbackUrl: "/",
//     });

//     console.log(res);
//   };

//   return (
//     <Grid container component="main" sx={{ height: "100vh" }}>
//       <CssBaseline />
//       <Grid
//         item
//         xs={false}
//         sm={4}
//         md={7}
//         sx={{
//           backgroundImage:
//             "url(https://i.ibb.co/x5JDJVQ/Outdoor-Signage-Mockup-R4-H.jpg)",
//           backgroundRepeat: "no-repeat",
//           backgroundColor: (t) =>
//             t.palette.mode === "light"
//               ? t.palette.grey[50]
//               : t.palette.grey[900],
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       />
//       <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
//         <Box
//           sx={{
//             my: 8,
//             mx: 4,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           <Image
//             component="img"
//             sx={{
//               height: 233,
//               width: 350,
//               maxHeight: { xs: 233, md: 167 },
//               maxWidth: { xs: 350, md: 250 },
//             }}
//             src={ESSIcon}
//             alt="R4H LOGO"
//           />
//           <Typography component="h1" variant="h5">
//             Sign in
//           </Typography>
//           <Box
//             component="form"
//             noValidate
//             onSubmit={handleSubmit}
//             sx={{ mt: 1 }}
//           >
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               type="text"
//               id="username"
//               label="Username"
//               name="username"
//               value={userInfo.username}
//               autoComplete="username"
//               autoFocus
//               onChange={({ target }) =>
//                 setUserInfo({ ...userInfo, username: target.value })
//               }
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               value={userInfo.password}
//               label="Password"
//               type="password"
//               id="password"
//               autoComplete="current-password"
//               onChange={({ target }) =>
//                 setUserInfo({ ...userInfo, password: target.value })
//               }
//             />
//             <Link>
//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 sx={{ mt: 3, mb: 2 }}
//               >
//                 Sign In
//               </Button>
//             </Link>
//             <Copyright sx={{ mt: 5 }} />
//           </Box>
//         </Box>
//       </Grid>
//     </Grid>
//   );
// }

export default function SignInPage() {
  return <SignInSide />;
}
