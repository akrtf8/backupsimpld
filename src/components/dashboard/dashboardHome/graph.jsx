import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import { alpha, useTheme } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Chart } from "../../../components/core/chart";
import { fetchSubscriptionsExpiring } from "../../../lib/api/dashboardHome/fetchApi";

export function Graph({ sx }) {
  const theme = useTheme();
  const [dateRange, setDateRange] = useState(
    new Date().getFullYear().toString()
  );
  const [plan, setPlan] = useState("Yearly");
  const [chartSeries, setChartSeries] = useState([]);

  const handleDateChange = (event) => {
    setDateRange(event.target.value);
  };

  const handlePlanChange = (event) => {
    setPlan(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchSubscriptionsExpiring({ plan, dateRange });
        if (response.data.success) {
          const seriesData = response.data.data.map((item) => item.count);
          setChartSeries([{ data: seriesData }]);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [dateRange, plan]);

  const getMonthDateRange = (year, monthIndex) => {
    // For first day of month, set date to 1
    const startDate = new Date(year, monthIndex, 1);

    // For last day of month, set date to 0 of next month to get last day of current month
    const endDate = new Date(year, monthIndex + 1, 0);

    // Format dates as YYYY-MM-DD, ensuring day part is padded with zero if needed
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  };

  const chartOptions = {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: { show: false },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const selectedYear = parseInt(dateRange);
          const monthIndex = config.dataPointIndex; // 0-11 for Jan-Dec
          const selectedPlan = plan;

          // Get the full date range for the selected month
          const { startDate, endDate } = getMonthDateRange(
            selectedYear,
            monthIndex
          );

          // Redirect to the dashboard with query parameters
          window.location.href = `/dashboard/clinics?year=${selectedYear}&startDate=${startDate}&endDate=${endDate}&plan=${selectedPlan}`;
        },
      },
    },
    colors: ["#FF4560"],
    dataLabels: { enabled: false },
    fill: { opacity: 1, type: "solid" },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: { show: false },
    plotOptions: { bar: { columnWidth: "20px", borderRadius: 10 } },
    stroke: { colors: ["transparent"], show: true, width: 2 },
    theme: { mode: theme.palette.mode },
    xaxis: {
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: { offsetY: 5, style: { colors: theme.palette.text.secondary } },
    },
    yaxis: {
      labels: {
        formatter: (value) => (value > 0 ? `${value}` : `${value}`),
        offsetX: -10,
        style: { colors: theme.palette.text.secondary },
      },
    },
    tooltip: {
      enabled: true,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const month = w.globals.labels[dataPointIndex];
        const count = series[seriesIndex][dataPointIndex];
        return `<div style="padding: 8px; background: ${theme.palette.background.paper}; border: 1px solid ${theme.palette.divider}; border-radius: 4px;">
                  <strong>${month}</strong>: ${count} subscriptions expiring
                </div>`;
      },
    },
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 16 }, (_, i) => currentYear + 5 - i);

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <>
            <FormControl sx={{ minWidth: 120, mr: 2 }}>
              <Select
                value={dateRange}
                onChange={handleDateChange}
                displayEmpty
                inputProps={{ "aria-label": "Select Year" }}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year.toString()}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <Select
                value={plan}
                onChange={handlePlanChange}
                displayEmpty
                inputProps={{ "aria-label": "Select Plan" }}
              >
                <MenuItem value="Yearly">Yearly</MenuItem>
                <MenuItem value="Freetrial">Free Trial</MenuItem>
              </Select>
            </FormControl>
          </>
        }
        title="Subscriptions Expiring"
      />
      <CardContent>
        <Chart
          height={350}
          options={chartOptions}
          series={chartSeries}
          type="bar"
          width="100%"
        />
      </CardContent>
      <Divider />
    </Card>
  );
}

export default Graph;
