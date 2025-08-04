import { Roboto } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "../utils/ThemeRegistry";
import CssBaseline from "@mui/material/CssBaseline";
import { SessionProvider } from "../utils/provider";
import { getSession } from "../utils/session";
import Layout from "@/../../components/Layout";
import LoadingProvider from "../components/LoadingContext";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Suspense } from "react";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });

export default async function RootLayout({ children }) {
  let session = null;
  try {
    session = await getSession();
  } catch (error) {
    console.error("Error fetching session:", error);
  }

  return (
    <SessionProvider session={session}>
      <html lang="en" style={{ height: "100%" }}>
        <head>
          <title>R4H ESS</title>
          <meta name="description" content="R4H Employee Self Service System" />
        </head>
        <body
          className={roboto.className}
          style={{ height: "100%", margin: 0 }}
        >
          <ThemeRegistry options={{ key: "mui-theme" }}>
            <LoadingProvider>
              <Suspense fallback={<Box sx={{ p: 2 }}>Loading...</Box>}>
                <Box
                  sx={{
                    display: "flex",
                    minHeight: "100vh",
                    width: "100%",
                    bgcolor: "#f5f5f5",
                  }}
                >
                  <CssBaseline />
                  {session && <Layout />}
                  <Box
                    component="main"
                    sx={{
                      flexGrow: 1,
                      minHeight: "100vh",
                      display: "flex",
                      flexDirection: "column",
                      bgcolor: "#f5f5f5",
                    }}
                  >
                    <Container
                      maxWidth="lg"
                      sx={{
                        mt: session ? 10 : 4, // Less margin for unauthenticated users
                        mb: 4,
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {children}
                    </Container>
                  </Box>
                </Box>
              </Suspense>
            </LoadingProvider>
          </ThemeRegistry>
        </body>
      </html>
    </SessionProvider>
  );
}
