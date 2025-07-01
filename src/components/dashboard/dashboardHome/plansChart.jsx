"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { useTheme } from "@mui/material/styles";
import { ApexOptions } from "apexcharts";
import { Chart } from "../../../components/core/chart";
import { fetchPieChart } from "../../../lib/api/dashboardHome/fetchApi";

export function PlansChart({ sx }) {
  const theme = useTheme();
  const [chartSeries, setChartSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [planData, setPlanData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPieChart();
        if (response.data.success) {
          const { plans } = response.data.data;
          setPlanData(plans);

          // Transform the API data into the format required by the pie chart
          const series = [];
          const categories = [];

          for (const [plan, data] of Object.entries(plans)) {
            for (const [category, count] of Object.entries(data.counts)) {
              series.push(count);
              categories.push(`${plan} - ${category}`);
            }
          }

          setChartSeries(series);
          setCategories(categories);
        }
      } catch (error) {
        console.error("Error fetching plans data:", error.message);
        // Handle error (e.g., show a notification to the user)
      }
    };

    fetchData();
  }, []);

  const chartOptions = useChartOptions(categories, planData, chartSeries);

  const handleDataPointSelection = (event, chartContext, config) => {
    const selectedCategory = categories[config.dataPointIndex];
    const [variant, plan] = selectedCategory.split(" - ");
    window.location.href = `/dashboard/clinics?plan=${plan}&varient=${variant}`; // Redirect using window.location.href
  };

  return (
    <Card sx={sx}>
      <CardHeader title="Plans Distribution" />
      <CardContent>
        <Chart
          height={430}
          options={{
            ...chartOptions,
            chart: {
              ...chartOptions.chart,
              events: {
                dataPointSelection: handleDataPointSelection,
              },
            },
          }}
          series={chartSeries}
          type="pie"
          width="100%"
        />
      </CardContent>
    </Card>
  );
}

function useChartOptions(categories, planData, chartSeries) {
  const theme = useTheme();

  return {
    chart: {
      type: "pie",
      toolbar: { show: false },
    },
    colors: [
      "#FF7F00", // Intense orange
      "#FF1744", // Bright neon red
      "#00FF66", // Electric green
      "#8C52FF", // Neon purple
      "#0099FF", // Vibrant sky blue
      "#FFD700", // Bright gold
      "#FF00FF", // Vivid magenta
      "#00FFFF", // Cyan / Electric blue
      "#FF4500", // Deep orange-red
      "#39FF14", // Neon lime green
    ],
    labels: categories, // Labels for each slice of the pie chart
    dataLabels: {
      enabled: true,
      formatter: function (val, { seriesIndex }) {
        return chartSeries[seriesIndex]; // Display the count instead of the percentage
      },
    },
    legend: {
      position: "bottom",
      labels: {
        colors: theme.palette.text.secondary,
      },
    },
    tooltip: {
      y: {
        formatter: (val, { seriesIndex }) => {
          const category = categories[seriesIndex];
          const [plan, variant] = category.split(" - ");
          const percentage = planData[plan]?.percentages[variant] || "0.00";
          return `${val} (${percentage}%)`;
        },
      },
    },
  };
}
