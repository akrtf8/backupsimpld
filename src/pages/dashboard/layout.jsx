import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import GlobalStyles from "@mui/material/GlobalStyles";

import { AuthGuard } from "../../components/auth/auth-guard";
import { MainNav } from "../../components/dashboard/layout/main-nav";
import { SideNav } from "../../components/dashboard/layout/side-nav";

import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../../components/core/theme-provider/theme-provider";
import { useSideNav } from "../../contexts/side-nav-context";

export default function Layout() {
  const { collapsed } = useSideNav();
  return (
    <AuthGuard>
      <ThemeProvider>
        <GlobalStyles
          styles={{
            body: {
              "--MainNav-height": "56px",
              "--MainNav-zIndex": 1000,
              "--SideNav-width": collapsed? "64px" : "240px",
              "--SideNav-zIndex": 1100,
              "--MobileNav-width": "320px",
              "--MobileNav-zIndex": 1100,
              "--mui-palette-background-default": "#f4f5f7", // Add fallback for theme variable
            },
          }}
        />
        <Box
          sx={{
            bgcolor: "var(--mui-palette-background-default, #f4f5f7)", // Add fallback
            display: "flex",
            flexDirection: "column",
            position: "relative",
            minHeight: "100%",
          }}
        >
          <SideNav />
          <Box
            sx={{
              display: "flex",
              flex: "1 1 auto",
              flexDirection: "column",
              pl: { lg: "var(--SideNav-width)" },
            }}
          >
            <MainNav />
            <main>
              <Container maxWidth="xl" sx={{ pb: "64px", pt: "25px" }}>
                <Outlet />
              </Container>
            </main>
          </Box>
        </Box>
      </ThemeProvider>
    </AuthGuard>
  );
}
