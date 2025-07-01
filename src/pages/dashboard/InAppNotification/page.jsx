"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Notifications } from "../../../components/dashboard/inAppNotification/notifications";
import { config } from "../../../config";

export default function Page() {
  React.useEffect(() => {
    document.title = `In-app Notification | Dashboard | ${config.site.name}`;
  }, []);
  return <Notifications />;
}
