"use client";

import * as React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import dayjs from "dayjs";

import { DashboardCards } from "../../components/dashboard/dashboardHome/dashboard-cards";
import { config } from "../../config";
import { Box } from "@mui/system";
import { Check as CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";
import { Clock as ClockIcon } from "@phosphor-icons/react/dist/ssr/Clock";
import { House as HomeIcon } from "@phosphor-icons/react/dist/ssr/House";
import { Pause as PauseIcon } from "@phosphor-icons/react/dist/ssr/Pause";
import DownloadIcon from "@mui/icons-material/Download";

import { Graph } from "../../components/dashboard/dashboardHome/graph";

import "../../styles/customstyles.css";
import "../../styles/adminMainStyles.css";
import { Traffic } from "../../components/dashboard/dashboardHome/traffic";
import { Sales } from "../../components/dashboard/dashboardHome/sales";
import { LatestOrders } from "../../components/dashboard/dashboardHome/latest-orders";
import { LatestProducts } from "../../components/dashboard/dashboardHome/latest-products";
import { LocationWiseCount } from "../../components/dashboard/dashboardHome/city-wise-count";
import {
  fetchCSVData,
  fetchHomePageCount,
} from "../../lib/api/dashboardHome/fetchApi";
import { PlansChart } from "../../components/dashboard/dashboardHome/plansChart";
import DownloadCSVComponent, {
  CSVDownloader,
} from "../../components/dashboard/dashboardHome/csvDownloader";
import { Button } from "@mui/material";

export default function homeDashboard() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [countData, setCountData] = React.useState([]);

  React.useEffect(() => {
    document.title = `Home | Dashboard | ${config.site.name}`;
    loadCountData();
  }, []);

  const loadCountData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchHomePageCount();

      setCountData(data.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadExcel = (data, filename) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000); // Revoke the URL after 1 second
  };

  const handleDownload = async () => {
    try {
      const response = await fetchCSVData({
        type: "user_list",
        from_date: "",
        to_date: "",
      });

      if (response.data) {
        downloadExcel(response.data, `report`);
        // alert("Report downloaded successfully", {
        //   variant: "success",
        // });
      }
    } catch (error) {
      console.error("Error downloading report:", error);
      alert(error.message || "Error downloading report. Please try again.", {
        variant: "error",
      });

      if (error.message === "Session expired. Please log in again.") {
        // Handle session expiration
        // window.location.href = '/login';
      }
    }
  };

  return (
    <div className="aks">
      <Box sx={{ pb: 2, display: "flex", justifyContent: "space-between" }}>
        <h3>Welcome Admin</h3>
        <div
          className="download-icon"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "blue",
            cursor: "pointer",
            // fontSize: "20px",
            // padding: "20px 10px",
            // border: "1px solid blue",
            // width: 0,
            // height: 0
          }}
          onClick={handleDownload}
        >
          <DownloadIcon />
        </div>
      </Box>
      <Grid container spacing={3}>
        <Grid lg={12 / 4} sm={6} xs={12}>
          <DashboardCards
            diff={12}
            cardheading="Total Clinics"
            trend="up"
            sx={{ height: "100%" }}
            value={countData?.counts?.all || 0}
            Icon={HomeIcon}
            path=""
          />
        </Grid>
        <Grid lg={12 / 4} sm={6} xs={12}>
          <DashboardCards
            diff={12}
            cardheading="Active"
            trend="up"
            sx={{ height: "100%" }}
            value={countData?.counts?.Active || 0}
            Icon={CheckIcon}
            path="Active"
          />
        </Grid>
        <Grid lg={12 / 4} sm={6} xs={12}>
          <DashboardCards
            diff={12}
            cardheading="Trial"
            trend="up"
            sx={{ height: "100%" }}
            value={countData?.counts?.inTrial || 0}
            Icon={ClockIcon}
            path="inTrial"
          />
        </Grid>
        <Grid lg={12 / 4} sm={6} xs={12}>
          <DashboardCards
            diff={12}
            cardheading="Paused"
            trend="up"
            sx={{ height: "100%" }}
            value={countData?.counts?.Paused || 0}
            Icon={PauseIcon}
            path="Paused"
          />
        </Grid>

        {/* Subscriptions Expiring */}

        <Grid lg={8} xs={12}>
          <Graph sx={{ height: "100%" }} />
        </Grid>

        <Grid lg={4} md={6} xs={12}>
          <Traffic
            chartSeries={[30, 70]}
            labels={["Pro", "Essentials"]}
            sx={{ height: "100%" }}
          />
        </Grid>

        {/* <Grid lg={8} xs={12}>
          <Sales
            chartSeries={[
              {
                name: "This year",
                data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
              },
              {
                name: "Last year",
                data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13],
              },
            ]}
            sx={{ height: "100%" }}
          />
        </Grid> */}

        {/* city wise table */}
        <Grid lg={8} xs={12}>
          <LocationWiseCount />
        </Grid>

        <Grid lg={4} md={6} xs={12}>
          <PlansChart sx={{ height: "100%" }} />
        </Grid>
        {/* 
        <Grid lg={4} md={6} xs={12}>
          <CSVDownloader />
        </Grid> */}
      </Grid>
    </div>
  );
}
