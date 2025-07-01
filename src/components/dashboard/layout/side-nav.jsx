import React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink, useLocation } from "react-router-dom";

import { navItems } from "./config";
import { isNavItemActive } from "../../../lib/is-nav-item-active";
import { navIcons } from "./nav-icons";

import { Logo } from "../../core/logo";
import { paths } from "../../../paths";
import { useSideNav } from "../../../contexts/side-nav-context";

export function SideNav() {
  const location = useLocation();
  const { collapsed, setCollapsed } = useSideNav();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Box
      sx={{
        "--SideNav-background": "rgba(0, 129, 188, 0.8)",
        "--SideNav-color": "var(--mui-palette-common-white)",
        "--NavItem-color": "var(--mui-palette-common-white)",
        "--NavItem-hover-background": "rgba(255, 255, 255, 0.04)",
        "--NavItem-active-background": "var(--mui-palette-primary-main)",
        "--NavItem-active-color": "var(--mui-palette-primary-contrastText)",
        "--NavItem-disabled-color": "var(--mui-palette-common-white)",
        "--NavItem-icon-color": "var(--mui-palette-common-white)",
        "--NavItem-icon-active-color":
          "var(--mui-palette-primary-contrastText)",
        "--NavItem-icon-disabled-color": "var(--mui-palette-common-white)",
        bgcolor: "var(--SideNav-background)",
        color: "var(--SideNav-color)",
        display: { xs: "none", lg: "flex" },
        flexDirection: "column",
        height: "100%",
        left: 0,
        maxWidth: "100%",
        position: "fixed",
        scrollbarWidth: "none",
        top: 0,
        transition: "width 0.3s",
        width: collapsed ? "64px" : "var(--SideNav-width)", // Toggle width
        zIndex: "var(--SideNav-zIndex)",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Stack spacing={2} sx={{ p: collapsed ? "12px": "16px" }}>
        <Box
          component={RouterLink}
          to={paths.dashboard.home}
          sx={{
            display: "inline-flex",
            justifyContent: collapsed ? "center" : "flex-start",
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
          }}
        >
          {!collapsed && <Logo color="light" height={32} width={122} />}
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              toggleCollapse();
            }}
            sx={{
              color: "var(--SideNav-color)",
              alignSelf: collapsed ? "center" : "flex-end",
              position: collapsed ? "relative" : "absolute",
              right: "-2px",
              top: "-4px"
            }}
          >
            {collapsed ? <MenuIcon /> : <CloseIcon />}
          </IconButton>
        </Box>
      </Stack>
      <Divider sx={{ borderColor: "var(--mui-palette-neutral-700)" }} />
      <Box
        component="nav"
        sx={{
          flex: "1 1 auto",
          p: collapsed ? "8px" : "12px",
        }}
      >
        {renderNavItems({
          pathname: location.pathname,
          items: navItems,
          collapsed,
        })}
      </Box>
      <Divider sx={{ borderColor: "var(--mui-palette-neutral-700)" }} />
    </Box>
  );
}

function renderNavItems({ items = [], pathname, collapsed }) {
  const children = items.reduce((acc, curr) => {
    const { key, ...item } = curr;
    acc.push(
      <NavItem key={key} pathname={pathname} collapsed={collapsed} {...item} />
    );
    return acc;
  }, []);

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: "none", m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

function NavItem({
  disabled,
  external,
  href,
  icon,
  matcher,
  pathname,
  title,
  collapsed,
}) {
  const active = isNavItemActive({
    disabled,
    external,
    href,
    matcher,
    pathname,
  });
  const Icon = icon ? navIcons[icon] : null;

  return (
    <li>
      <Box
        {...(href
          ? {
              component: external ? "a" : RouterLink,
              to: href,
              target: external ? "_blank" : undefined,
              rel: external ? "noreferrer" : undefined,
            }
          : { role: "button" })}
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
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            flex: "0 0 auto",
          }}
        >
          {Icon ? (
            <Icon
              fill={
                active
                  ? "var(--NavItem-icon-active-color)"
                  : "var(--NavItem-icon-color)"
              }
              fontSize="var(--icon-fontSize-md)"
              weight={active ? "fill" : undefined}
            />
          ) : null}
        </Box>
        {!collapsed && (
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
        )}
      </Box>
    </li>
  );
}
