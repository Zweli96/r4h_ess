"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import LoadingOverlay from "./LoadingOverlay"; // Adjust path if needed
import AppDrawer from "./AppDrawer"; // Adjust path if needed
import Navbar from "./Navbar"; // Adjust path if needed
import { LoadingContext } from "./LoadingContext"; // Adjust path
import Box from "@mui/material/Box";

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  console.log("Layout rendered, isLoading:", isLoading);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    console.log("Layout useEffect running, isLoading:", isLoading);

    if (router && router.events) {
      const handleRouteChangeStart = () => {
        console.log("Route change started, setting isLoading: true");
        setIsLoading(true);
      };

      const handleRouteChangeComplete = () => {
        console.log("Route change completed, setting isLoading: false");
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      };

      const handleRouteChangeError = () => {
        console.log("Route change error, setting isLoading: false");
        setIsLoading(false);
      };

      router.events.on("routeChangeStart", handleRouteChangeStart);
      router.events.on("routeChangeComplete", handleRouteChangeComplete);
      router.events.on("routeChangeError", handleRouteChangeError);

      return () => {
        console.log("Cleaning up router events");
        router.events.off("routeChangeStart", handleRouteChangeStart);
        router.events.off("routeChangeComplete", handleRouteChangeComplete);
        router.events.off("routeChangeError", handleRouteChangeError);
      };
    }

    console.log("Pathname/searchParams changed, setting isLoading: true");
    setIsLoading(true);
    const timer = setTimeout(() => {
      console.log("Pathname/searchParams timer, setting isLoading: false");
      setIsLoading(false);
    }, 400);

    return () => {
      console.log("Cleaning up pathname/searchParams timer");
      clearTimeout(timer);
    };
  }, [router, pathname, searchParams, setIsLoading]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Navbar toggleDrawer={toggleDrawer} open={open} />
      <AppDrawer open={open} toggleDrawer={toggleDrawer} />
      <LoadingOverlay open={isLoading} />
    </Box>
  );
}
