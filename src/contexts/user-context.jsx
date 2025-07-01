"use client";

import * as React from "react";
import authClient from "../lib/auth/client";
import { logger } from "../lib/default-logger";

export const UserContext = React.createContext();

export function UserProvider({ children }) {
  const [state, setState] = React.useState({
    user: null,
    error: null,
    isLoading: true, // Initial loading state
  });

  const checkSession = React.useCallback(async () => {
    try {
      const { data, error } = await authClient.getUser();

      if (error) {
        logger.error("[UserProvider]: Error fetching user session:", error);
        setState((prevState) => ({
          ...prevState,
          user: null,
          error: "Unable to fetch user session",
          isLoading: false,
        }));
        return;
      }

      setState((prevState) => ({
        ...prevState,
        user: data || null,
        error: null,
        isLoading: false,
      }));
    } catch (err) {
      logger.error(
        "[UserProvider]: Unexpected error during session check:",
        err
      );
      setState((prevState) => ({
        ...prevState,
        user: null,
        error: "Unexpected error occurred",
        isLoading: false,
      }));
    }
  }, []);

  React.useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <UserContext.Provider value={{ ...state, checkSession }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
