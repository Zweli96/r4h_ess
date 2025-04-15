// "use client";
import { Roboto } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "../utils/ThemeRegistry";
import CssBaseline from "@mui/material/CssBaseline";
import { SessionProvider } from "../utils/provider";
import { getSession } from "../utils/session";
import AppDrawer from "@/../../components/AppDrawer";
import Navbar from "@/../../components/Navbar";
import Layout from "@/../../components/Layout";
import LayoutX from "@/../../components/LayoutX";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });

// export const metadata = {
//   title: "R4H ESS",
//   description: "R4H Employee Self Service System",
// };

export default async function RootLayout({ children }) {
  // const [open, setOpen] = useState(true);
  // const toggleDrawer = () => {
  //   setOpen(!open);
  // };

  const session = await getSession();
  return (
    <SessionProvider session={session}>
      <html lang="en" style={{ height: "100%" }}>
        <head>
          <title>R4H ESS</title>
          <meta
            name="description"
            content="R4H Employee Self Service System"
          ></meta>
        </head>
        <body
          className={roboto.className}
          style={{ height: "100%", margin: 0 }}
        >
          <ThemeRegistry options={{ key: "mui-theme" }}>
            <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
              <CssBaseline />
              {session ? (
                <>
                  <LayoutX />
                  <Box
                    component="main"
                    sx={{
                      flexGrow: 1,
                      minHeight: "100vh",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Container
                      sx={{
                        mt: 10,
                        mb: 4,
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {children}
                    </Container>
                  </Box>
                </>
              ) : (
                <Box sx={{ minHeight: "100vh", width: "100%" }}>{children}</Box>
              )}
              {/*  */}
            </Box>
          </ThemeRegistry>
        </body>
      </html>
    </SessionProvider>
  );
}
