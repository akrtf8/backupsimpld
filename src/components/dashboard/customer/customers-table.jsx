"use client";

import React, { useEffect, useState } from "react";
// import { useRouter } from 'next/navigation';
import { useNavigate } from "react-router-dom";
import { Chip } from "@mui/material";
// import Avatar from '@mui/material/Avatar';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
// import Typography from '@mui/material/Typography';
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput, { OutlinedInputProps } from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // Import DatePicker from MUI X

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MagnifyingGlass as MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import dayjs from "dayjs";

import { fetchCustomers } from "../../../lib/api/api";

// import { useSelection } from '@/hooks/use-selection';

const statusMap = {
  none: { label: "-", color: "warning" },
  Active: { label: "Active", color: "success" },
  Paused: { label: "Paused", color: "error" },
};

export function CustomersTable() {
  const [customers, setCustomers] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [plan, setPlan] = useState("");
  const [date, setDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadCustomers = async (newPage) => {
    setIsLoading(true);
    try {
      const params = { page: newPage, rowsPerPage, plan, date, searchTerm };
      const data = await fetchCustomers(params);

      if (data.data.length > 0 || newPage < page) {
        setCustomers(data.data);
        setRows(data.data);
        setPage(newPage);

        if (data.data.length < rowsPerPage) {
          setHasMoreData(false);
        } else {
          setHasMoreData(true);
        }
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers(page);
  }, [rowsPerPage, plan, date, searchTerm]);

  // const router = useRouter();
  const navigate = useNavigate();

  const handleRowClick = (customerId) => {
    localStorage.setItem("simpld-customerId", customerId);
    // router.push(`/dashboard/clinicDetails?${customerId}`);
    navigate(`/dashboard/clinicDetails?${customerId}`);
  };

  const handlePlanChange = (event) => {
    setPlan(event.target.value);
    setPage(1);
    setHasMoreData(true);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setPage(1);
    setHasMoreData(true);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
    setHasMoreData(true);
  };

  const handlePageChange = (event, newPage) => {
    if (newPage + 1 < page || hasMoreData) {
      loadCustomers(newPage + 1);
    }
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    setHasMoreData(true);
  };

  return (
    <>
      <Card
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", marginRight: "2rem" }}
        >
          Clinics
        </Typography>

        <OutlinedInput
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by Clinic Name"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ flexGrow: 1, marginRight: 2 }}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Plan</InputLabel>
            <Select
              value={plan}
              onChange={handlePlanChange}
              label="Filter by Plan"
            >
              <MenuItem value="Pro">Pro</MenuItem>
              <MenuItem value="Essentials">Essentials</MenuItem>
              <MenuItem value="">All</MenuItem>
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Filter by Date"
              value={date}
              onChange={handleDateChange}
              renderInput={(params) => <OutlinedInput {...params} />}
            />
          </LocalizationProvider>
        </Box>
      </Card>

      <Card>
        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: "1000px" }}>
            <TableHead>
              <TableRow>
                <TableCell>Clinic ID</TableCell>
                <TableCell>Clinic Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Subscription</TableCell>
                <TableCell>Expiry</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row) => {
                  const status = row.isdeleted ? "Paused" : "Active";
                  const { color } = statusMap[status] ?? {
                    label: "-",
                    color: "default",
                  };

                  return (
                    <TableRow
                      hover
                      key={row._id}
                      onClick={() => handleRowClick(row._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <TableCell>{row.sno}</TableCell>
                      <TableCell>
                        <Stack
                          sx={{ alignItems: "center" }}
                          direction="row"
                          spacing={2}
                        >
                          {row.company}
                        </Stack>
                      </TableCell>
                      <TableCell>{row.phoneNumber1}</TableCell>
                      <TableCell>{row.city}</TableCell>
                      <TableCell>{row.subscription}</TableCell>
                      <TableCell>
                        {row.subscription_expires_at
                          ? dayjs(row.subscription_expires_at).format(
                              "MMM D, YYYY"
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          color={color}
                          label={status}
                          size="small"
                          sx={{
                            width: "80px",
                            height: "24px",
                            borderRadius: "5px",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
        <Divider />
        <TablePagination
          component="div"
          count={-1}
          page={page - 1}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelDisplayedRows={({ from, to }) =>
            hasMoreData ? `${from}-${to}` : `${from}-${to} of ${to}`
          }
        />
      </Card>
    </>
  );
}
