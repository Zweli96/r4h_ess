"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import LoadingOverlay from "./LoadingOverlay"; // Adjust path if needed
import AppDrawer from "./AppDrawer"; // Adjust path if needed
import Navbar from "./Navbar"; // Adjust path if needed
import Box from "@mui/material/Box";

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (router && router.events) {
      const handleRouteChangeStart = () => {
        setIsLoading(true);
      };

      const handleRouteChangeComplete = () => {
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      };

      const handleRouteChangeError = () => {
        setIsLoading(false);
      };

      router.events.on("routeChangeStart", handleRouteChangeStart);
      router.events.on("routeChangeComplete", handleRouteChangeComplete);
      router.events.on("routeChangeError", handleRouteChangeError);

      return () => {
        router.events.off("routeChangeStart", handleRouteChangeStart);
        router.events.off("routeChangeComplete", handleRouteChangeComplete);
        router.events.off("routeChangeError", handleRouteChangeError);
      };
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [router, pathname, searchParams]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Navbar toggleDrawer={toggleDrawer} open={open} />
      <AppDrawer open={open} toggleDrawer={toggleDrawer} />
      <LoadingOverlay open={isLoading} />
    </Box>
  );
}
