import React, { createContext, useContext, useState } from "react";

// Create Context
const SideNavContext = createContext();

// Create Provider
export const SideNavProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <SideNavContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SideNavContext.Provider>
  );
};

// Hook to use Context
export const useSideNav = () => {
  return useContext(SideNavContext);
};
