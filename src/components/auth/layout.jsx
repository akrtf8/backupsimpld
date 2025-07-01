import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Link as RouterLink } from "react-router-dom";

import { paths } from "../../paths";
import { DynamicLogo } from "../core/logo";

export function Layout({ children }) {
  return (
    <Box
      sx={{
        display: { xs: "flex", lg: "grid" },
        flexDirection: "column",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "100%",
      }}
    >
      {/* Left Side Background Section */}
      <Box
        sx={{
          alignItems: "center",
          backgroundImage: 'url("/assets/auth-bg.svg")',
          color: "var(--mui-palette-common-white)",
          display: { xs: "none", lg: "flex" },
          justifyContent: "center",
          p: 3,
        }}
      >
        <Stack spacing={3}>
          <Box
            sx={{ display: "flex", justifyContent: "center" }}
            className="sideNavIconMain"
          >
            <Box
              component="img"
              alt="Widgets"
              src="/assets/login-img-main.svg"
              sx={{ height: "auto", width: "100%", maxWidth: "600px" }}
            />
          </Box>
        </Stack>
      </Box>

      {/* Right Side Content Section */}
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          background: "rgba(0, 129, 188, 0.8)",
          color: "white",
        }}
      >
        {/* Logo Section */}
        <Box sx={{ p: 3 }}>
          <RouterLink
            to={paths.home}
            style={{ display: "inline-block", fontSize: 0 }}
          >
            <DynamicLogo
              colorDark="light"
              colorLight="dark"
              height={32}
              width={122}
            />
          </RouterLink>
        </Box>

        {/* Main Content Section */}
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flex: "1 1 auto",
            justifyContent: "center",
            p: 3,
          }}
        >
          <Box sx={{ maxWidth: "550px", width: "100%", marginBottom: "9rem" }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
