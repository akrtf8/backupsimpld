import React, { useCallback } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import {
  GearSix as GearSixIcon,
  SignOut as SignOutIcon,
  User as UserIcon,
} from "@phosphor-icons/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useUser } from "../../../hooks/use-user";
import authClient from "../../../lib/auth/client";
import { logger } from "../../../lib/default-logger";
import { paths } from "../../../paths";

export function UserPopover({ anchorEl, onClose, open }) {
  const { checkSession } = useUser();
  const navigate = useNavigate();

  const handleSignOut = useCallback(async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        logger.error("Sign out error", error);
        return;
      }

      // Refresh the auth state
      await checkSession?.();

      // Navigate to login or home page after sign-out
      navigate(paths.auth.signIn, { replace: true });
    } catch (err) {
      logger.error("Sign out error", err);
    }
  }, [checkSession, navigate]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: "240px" } }}
    >
      <Box sx={{ p: "16px 20px" }}>
        <Typography variant="subtitle1">simpld</Typography>
        <Typography color="text.secondary" variant="body2">
          admins@simpld.com
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        sx={{ p: "8px", "& .MuiMenuItem-root": { borderRadius: 1 } }}
      >
        <MenuItem
          component={RouterLink}
          to={paths.dashboard.account}
          onClick={onClose}
        >
          <ListItemIcon>
            <UserIcon fontSize="1.5rem" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <SignOutIcon fontSize="1.5rem" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </MenuList>
    </Popover>
  );
}
