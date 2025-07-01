import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import DownloadIcon from "@mui/icons-material/Download";
import { fetchCSVData } from "../../../lib/api/dashboardHome/fetchApi";
import { useSnackbar } from "notistack";

export function CSVDownloader({ sx }) {
  const [type, setType] = useState("appointment");
  const [dateRange, setDateRange] = useState("1month");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
    if (event.target.value !== "custom") {
      setCustomStartDate("");
      setCustomEndDate("");
    }
  };

  const getDateRange = () => {
    const today = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case "1year":
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      case "6months":
        startDate.setMonth(today.getMonth() - 6);
        break;
      case "3months":
        startDate.setMonth(today.getMonth() - 3);
        break;
      case "1month":
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "custom":
        return {
          startDate: customStartDate,
          endDate: customEndDate,
        };
      default:
        startDate.setMonth(today.getMonth() - 1);
    }

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
    };
  };

  const convertXMLtoCSV = (xmlData) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");

    // Get all unique tags to create CSV headers
    const getAllTags = (node, tags = new Set()) => {
      if (node.children.length === 0) {
        tags.add(node.parentNode.tagName);
      } else {
        Array.from(node.children).forEach((child) => getAllTags(child, tags));
      }
      return tags;
    };

    const tags = Array.from(getAllTags(xmlDoc.documentElement));
    const headers = tags.join(",");

    // Convert XML data to CSV rows
    const getNodeValues = (node, values = {}) => {
      if (node.children.length === 0) {
        values[node.parentNode.tagName] = node.textContent;
      } else {
        Array.from(node.children).forEach((child) =>
          getNodeValues(child, values)
        );
      }
      return values;
    };

    const rows = [];
    const dataNodes = xmlDoc.documentElement.children;
    Array.from(dataNodes).forEach((node) => {
      const values = getNodeValues(node);
      const row = tags.map((tag) => values[tag] || "").join(",");
      rows.push(row);
    });

    return `${headers}\n${rows.join("\n")}`;
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
    if (!type) {
      alert("Please select a type", { variant: "warning" });
      return;
    }

    const { startDate, endDate } = getDateRange();
    if (!startDate || !endDate) {
      alert("Please select valid dates", { variant: "warning" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetchCSVData({
        type,
        from_date: startDate,
        to_date: endDate,
      });

      if (response.data) {
        downloadExcel(
          response.data,
          `${type}-report-${startDate}-to-${endDate}`
        );
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={sx}>
      <CardHeader title="Download Reports" />
      <CardContent>
        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={type}
              label="Report Type"
              onChange={handleTypeChange}
            >
              <MenuItem value="appointment">Appointment</MenuItem>
              <MenuItem value="paymenthistory">Payment History</MenuItem>
              <MenuItem value="invoicereport">Invoice Report</MenuItem>
              <MenuItem value="expenses">Expenses</MenuItem>
              <MenuItem value="laborders">Lab Orders</MenuItem>
              <MenuItem value="treatments">Treatments</MenuItem>
              <MenuItem value="patientsdatabase">Patients Database</MenuItem>
              <MenuItem value="stockreport">Stock Report</MenuItem>
              <MenuItem value="stockinreport">Stock In Report</MenuItem>
              <MenuItem value="stockoutreport">Stock Out Report</MenuItem>
              <MenuItem value="paymentslog">Payments Log</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateRange}
              label="Date Range"
              onChange={handleDateRangeChange}
            >
              <MenuItem value="1year">Last 1 Year</MenuItem>
              <MenuItem value="6months">Last 6 Months</MenuItem>
              <MenuItem value="3months">Last 3 Months</MenuItem>
              <MenuItem value="1month">Last 1 Month</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </Select>
          </FormControl>

          {dateRange === "custom" && (
            <Stack direction="row" spacing={2}>
              <TextField
                type="date"
                label="Start Date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                type="date"
                label="End Date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>
          )}

          <Button
            variant="contained"
            onClick={handleDownload}
            disabled={loading}
            startIcon={<DownloadIcon />}
          >
            {loading ? "Downloading..." : "Download Report"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
