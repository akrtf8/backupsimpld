"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Logo } from "../../../components/core/logo";
import { navIcons } from "./nav-icons";
import { navItems } from "./config";
import { isNavItemActive } from "../../../lib/is-nav-item-active";

export function MobileNav({ open, onClose, items = navItems }) {
  const { pathname } = useLocation();

  return (
    <Drawer
      PaperProps={{
        sx: {
          "--MobileNav-background": "darkblue",
          "--MobileNav-color": "white",
          "--NavItem-color": "lightblue",
          "--NavItem-hover-background": "rgba(255, 255, 255, 0.04)",
          "--NavItem-active-background": "var(--mui-palette-primary-main)",
          "--NavItem-active-color": "var(--mui-palette-primary-contrastText)",
          "--NavItem-disabled-color": "var(--mui-palette-neutral-500)",
          "--NavItem-icon-color": "var(--mui-palette-neutral-400)",
          "--NavItem-icon-active-color":
            "var(--mui-palette-primary-contrastText)",
          "--NavItem-icon-disabled-color": "lightblue",
          bgcolor: "var(--MobileNav-background)",
          color: "var(--MobileNav-color)",
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
          scrollbarWidth: "none",
          width: "var(--MobileNav-width)",
          zIndex: "var(--MobileNav-zIndex)",
          "&::-webkit-scrollbar": { display: "none" },
        },
      }}
      onClose={onClose}
      open={open}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box component={RouterLink} to="/" sx={{ display: "inline-flex" }}>
          <Logo color="light" height={32} width={122} />
        </Box>
      </Stack>
      <Divider sx={{ borderColor: "var(--mui-palette-neutral-700)" }} />
      <Box component="nav" sx={{ flex: "1 1 auto", p: "12px" }}>
        {renderNavItems({ pathname, items, onClose })}
      </Box>
      <Divider sx={{ borderColor: "var(--mui-palette-neutral-700)" }} />
    </Drawer>
  );
}

function renderNavItems({ items = [], pathname, onClose }) {
  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: "none", m: 0, p: 0 }}>
      {items.map(({ key, ...item }) => (
        <NavItem key={key} pathname={pathname} {...item} />
      ))}
    </Stack>
  );
}

function NavItem({ disabled, external, href, icon, matcher, pathname, title, onClose }) {
  const navigate = useNavigate();
  const Icon = icon ? navIcons[icon] : null;
  const active = isNavItemActive({
    disabled,
    external,
    href,
    matcher,
    pathname,
  });
  
  const innerContent = (
    <Box
       sx={{
        alignItems: "center",
        borderRadius: 1,
          color: "var(--NavItem-color)",
          cursor: "pointer",
          display: "flex",
          flex: "0 0 auto",
          gap: 1,
          p: "6px 16px",
          position: "relative",
          textDecoration: "none",
          whiteSpace: "nowrap",
          ...(disabled && {
            bgcolor: "var(--NavItem-disabled-background)",
            color: "var(--NavItem-disabled-color)",
            cursor: "not-allowed",
          }),
          ...(active && {
            bgcolor: "var(--NavItem-active-background)",
            color: "var(--NavItem-active-color)",
          }),
      }}>
        {Icon && (
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              flex: "0 0 auto",
            }}
          >
            <Icon
              fill={
                active
                  ? "var(--NavItem-icon-active-color)"
                  : "var(--NavItem-icon-color)"
              }
              fontSize="var(--icon-fontSize-md)"
              weight={active ? "fill" : undefined}
            />
          </Box>
        )}
        <Box sx={{ flex: "1 1 auto" }}>
          <Typography
            component="span"
            sx={{
              color: "inherit",
              fontSize: "0.875rem",
              fontWeight: 500,
              lineHeight: "28px",
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
  );

  if (href && !external) { // Conditional return for internal links
    return (
      <li>
        <RouterLink // Use RouterLink for internal navigation
          to={href} // Set the destination using the 'to' prop
          onClick={() => { // Handle click event to close drawer and navigate
            if (typeof onClose === 'function') onClose();
          }}
          to={href}
          style={{ textDecoration: 'none' }} // Remove default link underline
        >
          {innerContent}
        </RouterLink>
      </li>
    );
  }

  // For external links or items without href
  return (
    <li>
      {innerContent}
    </li>
  );

}
