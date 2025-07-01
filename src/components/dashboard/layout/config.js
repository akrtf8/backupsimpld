import { paths } from "../../../paths";

export const navItems = [
  {
    key: "overview",
    title: "Dashboard",
    href: paths.dashboard.overview,
    icon: "chart-pie",
  },
  {
    key: "clinics",
    title: "Clinics",
    href: paths.dashboard.clinics,
    icon: "users",
    // children: [
    //   {
    //     key: "clinic-details",
    //     title: "clinic-details",
    //     href: paths.dashboard.clinicDetails,
    //   },
    //   {
    //     key: "clinicDetails",
    //     title: "Clinic Details",
    //     href: paths.dashboard.clinicDetails,
    //   },
    // ],
  },
  // { key: 'clinicDetails', title: 'Clinic Details', href: paths.dashboard.clinicDetails, icon: 'users' },
  {
    key: "popUpNotification",
    title: "Popup Notification",
    href: paths.dashboard.popUpNotification,
    icon: "plugs-connected",
  },
  {
    key: "InAppNotification",
    title: "In-app Notification",
    href: paths.dashboard.InAppNotification,
    icon: "gear-six",
  },
  // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
];
