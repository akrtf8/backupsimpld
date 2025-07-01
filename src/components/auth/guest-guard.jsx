"use client";

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import { useUser } from "../../hooks/use-user";
import { logger } from "../../lib/default-logger";
import { paths } from "../../paths";

export function GuestGuard({ children }) {
  const navigate = useNavigate();
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      if (error) {
        logger.error("[GuestGuard]: Error during permission check", error);
        return; // Optionally handle the error differently (e.g., navigate to an error page)
      }

      if (user) {
        logger.debug(
          "[GuestGuard]: User is logged in, redirecting to dashboard"
        );
        navigate(paths.dashboard.overview, { replace: true });
      }
    }
  }, [user, error, isLoading, navigate]);

  if (isLoading) {
    // Show a loading spinner while checking permissions
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return !user ? <>{children}</> : null;
}
