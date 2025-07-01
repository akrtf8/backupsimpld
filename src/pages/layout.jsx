import React from "react";
import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";

import "../styles/global.css";

import { LocalizationProvider } from "../components/core/localization-provider";
import { ThemeProvider } from "../components/core/theme-provider/theme-provider";
import { UserProvider } from "../contexts/user-context";

export default function AuthLayout() {
  return (
      <LocalizationProvider>
        <UserProvider>
          <ThemeProvider>
            <Outlet /> {/* Important for rendering nested routes */}
          </ThemeProvider>
        </UserProvider>
      </LocalizationProvider>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node,
};
