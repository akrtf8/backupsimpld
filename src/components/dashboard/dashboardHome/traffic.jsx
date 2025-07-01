"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Desktop as DesktopIcon } from "@phosphor-icons/react/dist/ssr/Desktop";
import { DeviceTablet as DeviceTabletIcon } from "@phosphor-icons/react/dist/ssr/DeviceTablet";
import { Phone as PhoneIcon } from "@phosphor-icons/react/dist/ssr/Phone";
import { ApexOptions } from "apexcharts";

import { Chart } from "../../../components/core/chart";
import { fetchPieChart } from "../../../lib/api/dashboardHome/fetchApi";

const iconMapping = {
  Desktop: DesktopIcon,
  Tablet: DeviceTabletIcon,
  Phone: PhoneIcon,
};

export function Traffic({ sx }) {
  const theme = useTheme();
  const [chartSeries, setChartSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [counts, setCounts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPieChart();
        if (response.data.success) {
          const { variants } = response.data.data;

          // Transform the API data into the format required by the chart
          const series = [];
          const labels = [];
          const counts = [];
          for (const [variant, data] of Object.entries(variants)) {
            labels.push(variant);
            series.push(parseFloat(data.percentage));
            counts.push(data.count); // Store the count
          }

          setChartSeries(series);
          setLabels(labels);
          setCounts(counts); // Store counts in state
        }
      } catch (error) {
        console.error("Error fetching pie chart data:", error.message);
        // Handle error (e.g., show a notification to the user)
      }
    };

    fetchData();
  }, []);

  const chartOptions = useChartOptions(labels);

  return (
    <Card sx={sx}>
      <CardHeader title="Variant Traffic" />
      <CardContent>
        <Stack spacing={2}>
          <Chart
            height={300}
            options={chartOptions}
            series={chartSeries}
            type="donut"
            width="100%"
          />
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", justifyContent: "center" }}
          >
            {chartSeries.map((item, index) => {
              const label = labels[index];
              const count = counts[index]; // Get the count
              const Icon = iconMapping[label];

              return (
                <Stack key={label} spacing={1} sx={{ alignItems: "center" }}>
                  {Icon ? <Icon fontSize="var(--icon-fontSize-lg)" /> : null}
                  <Typography variant="h6">{label}</Typography>
                  <Typography color="text.secondary" variant="subtitle2">
                    {item}% {/* Display percentage */}
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle2">
                    {count} {/* Display count */}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function useChartOptions(labels) {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const selectedVariant = labels[config.dataPointIndex]; // Get the clicked variant
          window.location.href = `/dashboard/clinics?varient=${selectedVariant}`; // Redirect
        },
      },
    },
    colors: [
      "#FEB019", // Vibrant orange
      "#008FFB", // Vibrant blue
      "#00E396", // Vibrant green
      "#FF4560", // Vibrant red
      "#775DD0", // Vibrant purple
    ],
    dataLabels: { enabled: false },
    labels,
    legend: { show: false },
    plotOptions: { pie: { expandOnClick: false } },
    states: { active: { filter: {} }, hover: { filter: {} } },
    stroke: { width: 0 },
    theme: { mode: theme.palette.mode },
    tooltip: { fillSeriesColor: false },
  };
}
