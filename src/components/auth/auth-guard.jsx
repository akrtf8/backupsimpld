"use client";

import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

import { useUser } from "../../hooks/use-user";
import { logger } from "../../lib/default-logger";
import { paths } from "../../paths";

export function AuthGuard({ children }) {
  const navigate = useNavigate();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      if (isLoading) return; // Wait for the user loading state

      if (error) {
        logger.error("[AuthGuard]: Permission check failed", error);
        setIsChecking(false);
        return;
      }

      if (!user) {
        logger.debug("[AuthGuard]: User not logged in, redirecting to sign-in");
        navigate(paths.auth.signIn, { replace: true });
        return;
      }

      setIsChecking(false);
    };

    checkPermissions().catch((err) => {
      logger.error(
        "[AuthGuard]: Unexpected error during permission check",
        err
      );
    });
  }, [user, error, isLoading, navigate]);

  if (isChecking || isLoading) {
    // Render a loading spinner or skeleton while checking permissions
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

  if (error) {
    return <Alert severity="error">{error}</Alert>; // Render error message if any
  }

  return <>{children}</>;
}
