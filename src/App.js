import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import pages
import Home from "./pages/dashboard/homeDashboard";
import AuthLayout from "./pages/layout";
import ResetPassword from "./pages/auth/reset-password/page";
import ResetPasswordConfirm from "./pages/auth/reset-password-confirm/page";

import SignIn from "./pages/auth/sign-in/page";
import SignUp from "./pages/auth/sign-up/page";

import DashboardLayout from "./pages/dashboard/layout";
import DashboardHome from "./pages/dashboard/homeDashboard";
import Clinics from "./pages/dashboard/clinics/page";
import ClinicDetails from "./pages/dashboard/clinicDetails/page";
import PopUpNotification from "./pages/dashboard/popUpNotification/page";
import InAppNotification from "./pages/dashboard/InAppNotification/page";
import Account from "./pages/dashboard/account/page";

import NotFound from "./pages/errors/not-found/page"; // 404 page
import { AuthGuard } from "./components/auth/auth-guard";
import { GuestGuard } from "./components/auth/guest-guard";
import { SideNavProvider } from "./contexts/side-nav-context";

import AdminUsersTable from "./components/dashboard/settingsMsTables/adminUsersTable";
import DoctorsTable from "./components/dashboard/settingsMsTables/doctorsTable";
import TreatmentsTable from "./components/dashboard/settingsMsTables/treatmentsTable";
import MedicinesTable from "./components/dashboard/settingsMsTables/medicinesTable";
import LabTable from "./components/dashboard/settingsMsTables/labsTable";
import LabWorksTable from "./components/dashboard/settingsMsTables/labWorksTable";

function App() {
  return (
    <Routes>
      {/* Home Route (Redirect to Dashboard) */}
      <Route
        path="/"
        element={
          <AuthGuard>
            <SideNavProvider>
              <DashboardLayout />
            </SideNavProvider>
          </AuthGuard>
        }
      >
        <Route index element={<DashboardHome />} />
      </Route>

      {/* Auth Routes */}
      <Route
        path="/auth"
        element={
          <GuestGuard>
            <AuthLayout />
          </GuestGuard>
        }
      >
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route
          path="reset-password-confirm"
          element={<ResetPasswordConfirm />}
        />
      </Route>

      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <SideNavProvider>
              <DashboardLayout />
            </SideNavProvider>
          </AuthGuard>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="clinics" element={<Clinics />} />
        <Route path="clinic-details" element={<ClinicDetails />} />
        <Route path="pop-up-notification" element={<PopUpNotification />} />
        <Route path="in-app-notification" element={<InAppNotification />} />

        <Route path="settings/admin-users" element={<AdminUsersTable />} />
        <Route path="settings/doctors" element={<DoctorsTable />} />
        <Route path="settings/treatments" element={<TreatmentsTable />} />
        <Route path="settings/medicines" element={<MedicinesTable />} />
        <Route path="settings/labs" element={<LabTable />} />
        <Route path="settings/lab-works" element={<LabWorksTable />} />

        <Route path="account" element={<Account />} />
      </Route>

      {/* Catch-All Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
