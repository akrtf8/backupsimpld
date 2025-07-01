"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Chip, CircularProgress, TableSortLabel } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MagnifyingGlass as MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import dayjs from "dayjs";

import { fetchCustomers } from "../../../lib/api/api";
import { paths } from "../../../paths";
import {
  setCustomers,
  setRows,
  setPage,
  setRowsPerPage,
  setIsLoading,
  setHasMoreData,
  setPlan,
  setPlanStatus,
  setDate,
  setSearchTerm,
  setSortDirection,
  setWASortDirection,
  setSMSSortDirection,
  setExpiryDateStart,
  setExpiryDateEnd,
  setCity,
  setFilterState,
  setVariantFilter,
} from "../../../actions/customerActions";

const statusMap = {
  "": { label: "-", color: "warning" },
  active: { label: "Active", color: "success" },
  live: { label: "Live", color: "success" },
  paused: { label: "Paused", color: "error" },
  pause: { label: "Pause", color: "error" },
  intrial: { label: "Trial", color: "success" },
  essentials: { label: "Essentials", color: "primary" },
  pro: { label: "Pro", color: "success" },
  freetrial: { label: "Freetrial", color: "primary" },
  yearly: { label: "Yearly", color: "info" },
  "3-years": { label: "3-Years", color: "success" },
};

export function CustomersTable() {
  const dispatch = useDispatch();
  const {
    customers,
    rows,
    page,
    rowsPerPage,
    isLoading,
    hasMoreData,
    plan,
    planStatus,
    date,
    searchTerm,
    sortDirection,
    sortWADirection,
    sortSMSDirection,
    expiryDateStart,
    expiryDateEnd,
    city,
    filterState,
    variantFilter,
  } = useSelector((state) => state.customer);

  const location = useLocation();
  const navigate = useNavigate();

  const [isInitialLoad, setInitialLoad] = useState(true);

  const loadCustomers = async (newPage, status = false, extraParams = {}) => {
    dispatch(setIsLoading(true));
    try {
      const params = {
        page: newPage,
        rowsPerPage,
        plan,
        status: status ? status : planStatus,
        sortExpiry: sortDirection,
        sort_wa: sortWADirection,
        sort_sms: sortSMSDirection,
        date,
        searchTerm,
        expiryDateStart,
        expiryDateEnd,
        city,
        filterState,
        variantFilter,
        ...extraParams
      };
      const data = await fetchCustomers(params);

      if (data.data.length > 0 || newPage < page) {
        dispatch(setCustomers(data.data));
        dispatch(setRows(data.data));
        dispatch(setPage(newPage));

        if (data.data.length < rowsPerPage) {
          dispatch(setHasMoreData(false));
        } else {
          dispatch(setHasMoreData(true));
        }
      } else {
        dispatch(setRows(data.data));
        dispatch(setHasMoreData(false));
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const isMounted = useRef(false);


  // Effect for initial load: process URL params and set state
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("statusFilter");
    const plan = queryParams.get("plan");
    const expiryDateStart = queryParams.get("startDate");
    const expiryDateEnd = queryParams.get("endDate");
    const varient = queryParams.get("varient");
    const city = queryParams.get("city");
    const selectState = queryParams.get("state");
    const extraParams = {};

    // Dispatch actions to update state from URL params
    if (status) {
      dispatch(setPlanStatus(status));
      extraParams.status = status;
    }
    if (plan) {
      const formattedPlan = plan === "ThreeYears" ? "3-Years" : plan;
      dispatch(setPlan(formattedPlan));
      extraParams.plan = formattedPlan;
    }
    if (expiryDateStart) {
      dispatch(setExpiryDateStart(expiryDateStart));
      extraParams.expiryDateStart = expiryDateStart;
    }
    if (expiryDateEnd) {
      dispatch(setExpiryDateEnd(expiryDateEnd));
      extraParams.expiryDateEnd = expiryDateEnd;
    }
    if (varient) {
      dispatch(setVariantFilter(varient));
      extraParams.variantFilter = varient;
    }
    if (city) {
      dispatch(setCity(city));
      extraParams.city = city;
    }
    if (selectState) {
      dispatch(setFilterState(selectState));
      extraParams.filterState = selectState;
    }

    // Clean up URL
    queryParams.delete("statusFilter");
    queryParams.delete("plan");
    queryParams.delete("startDate");
    queryParams.delete("endDate");
    queryParams.delete("varient");
    queryParams.delete("city");
    queryParams.delete("state");

    const newUrl = `${location.pathname}?${queryParams.toString()}`;
    window.history.replaceState(null, "", newUrl);

    // Initial API call with URL-derived state
    loadCustomers(1, false, extraParams); // Pass extraParams
  }, []); // Runs once on mount

  // Effect to handle API calls when dependencies change
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    loadCustomers(page);
  }, [
    rowsPerPage,
    plan,
    searchTerm,
    planStatus,
    sortDirection,
    sortWADirection,
    sortSMSDirection,
    expiryDateStart,
    expiryDateEnd,
    city,
    filterState,
    variantFilter,
    page, // Ensure page is a dependency
  ]);

  const handleRowClick = (customerId) => {
    localStorage.setItem("simpld-customerId", customerId);
    navigate(`${paths.dashboard.clinicDetails}?${customerId}`);
  };

  const handlePlanChange = (event) => {
    dispatch(setPlan(event.target.value));
    dispatch(setPage(1));
    dispatch(setHasMoreData(true));
  };

  const handleStatusChange = (event) => {
    dispatch(setPlanStatus(event.target.value));
    dispatch(setPage(1));
    dispatch(setHasMoreData(true));
  };

  const handleSortChange = () => {
    const newSortDirection = sortDirection === "asc" ? "desc" : "asc";
    dispatch(setSortDirection(newSortDirection));
    dispatch(setPage(1));
    dispatch(setHasMoreData(true));
  };

  const handleWASortChange = () => {
    const newSortDirection = sortWADirection === "asc" ? "desc" : "asc";
    dispatch(setWASortDirection(newSortDirection));
    dispatch(setPage(1));
    dispatch(setHasMoreData(true));
  };

  const handleSMSSortChange = () => {
    const newSortDirection = sortSMSDirection === "asc" ? "desc" : "asc";
    dispatch(setSMSSortDirection(newSortDirection));
    dispatch(setPage(1));
    dispatch(setHasMoreData(true));
  };

  const handleSearchChange = (event) => {
    dispatch(setSearchTerm(event.target.value));
    dispatch(setPage(1));
    dispatch(setHasMoreData(true));
  };

  const handleExpiryDateStartChange = (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    dispatch(setExpiryDateStart(formattedDate));
  };

  const handleExpiryDateEndChange = (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    dispatch(setExpiryDateEnd(formattedDate));
  };

  const handleCityChange = (event) => {
    dispatch(setCity(event.target.value));
  };

  const handleStateChange = (event) => {
    dispatch(setFilterState(event.target.value));
  };

  const handleVariantFilterChange = (event) => {
    dispatch(setVariantFilter(event.target.value));
  };

  const handlePageChange = (event, newPage) => {
    if (newPage + 1 < page || hasMoreData) {
      loadCustomers(newPage + 1);
    }
  };

  const handleRowsPerPageChange = (event) => {
    dispatch(setRowsPerPage(parseInt(event.target.value, 10)));
    dispatch(setPage(1));
    dispatch(setHasMoreData(true));
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
        {/* <Typography
          variant="h5"
          sx={{ fontWeight: "bold", marginRight: "2rem" }}
        >
          Clinics
        </Typography> */}

        <OutlinedInput
          value={searchTerm}
          onChange={(e) => {
            handleSearchChange(e);
          }}
          placeholder="Search by Clinic Name"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ flexGrow: 1, marginRight: 2, minWidth: 300 }} // Medium height
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          {/* <FormControl sx={{ minWidth: 200 }}>
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
          </FormControl> */}

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={planStatus}
              onChange={(e) => {
                handleStatusChange(e);
              }}
              label="Filter by Status"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="inTrial">Trial</MenuItem>
              <MenuItem value="Paused">Paused</MenuItem>
              <MenuItem value="">All</MenuItem>
            </Select>
          </FormControl>

          {/* Input for City */}
          <OutlinedInput
            value={city}
            onChange={(e) => {
              handleCityChange(e);
            }}
            placeholder="City"
            sx={{ maxWidth: 200 }}
          />

          {/* Input for State */}
          <OutlinedInput
            value={filterState}
            onChange={(e) => {
              handleStateChange(e);
            }}
            placeholder="State"
            sx={{ maxWidth: 180 }}
          />

          {/* Date Pickers for Expiry Date */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* Date Picker for Expiry Date Start */}
            <DatePicker
              label="Expiry Date Start"
              value={expiryDateStart ? dayjs(expiryDateStart) : null}
              onChange={(e) => {
                handleExpiryDateStartChange(e);
              }}
              textField={(params) => (
                <OutlinedInput {...params} sx={{ minWidth: 150 }} />
              )}
            />

            {/* Date Picker for Expiry Date End */}
            <DatePicker
              label="Expiry Date End"
              value={expiryDateEnd ? dayjs(expiryDateEnd) : null}
              onChange={(e) => {
                handleExpiryDateEndChange(e);
              }}
              textField={(params) => (
                <OutlinedInput {...params} sx={{ minWidth: 150 }} />
              )}
            />
          </LocalizationProvider>
        </Box>
      </Card>

      <Card>
      {isLoading ? (
          // Loader component
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
            }}
          >
            <CircularProgress />
            <p>Loading data...</p>
          </div>
        ) : <>
        <Box sx={{ overflowX: "auto", maxHeight: "650px" }}>
          {/* Header Table with sticky positioning */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "background.paper",
            }}
          >
            <Table sx={{ minWidth: "1000px", tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "60px" }}>S. no</TableCell>
                  <TableCell sx={{ width: "180px" }}>Clinic Name</TableCell>
                  <TableCell sx={{ width: "130px" }}>Phone Number</TableCell>
                  <TableCell sx={{ width: "120px" }}>City</TableCell>
                  <TableCell sx={{ width: "120px" }}>State</TableCell>
                  {/* <TableCell sx={{ width: "100px" }}>WA Count</TableCell>
                  <TableCell sx={{ width: "100px" }}>SMS Count</TableCell> */}
                  <TableCell sx={{ width: "100px" }}>
                    <TableSortLabel
                      active
                      direction={sortWADirection || "desc"}
                      onClick={handleWASortChange}
                    >
                      WA Count
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ width: "100px" }}>
                    <TableSortLabel
                      active
                      direction={sortSMSDirection || "desc"}
                      onClick={handleSMSSortChange}
                    >
                      SMS Count
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ width: "140px" }}>
                    Appointment Count
                  </TableCell>
                  <TableCell sx={{ width: "120px" }}>
                    <FormControl variant="standard" sx={{ minWidth: 120 }}>
                      <InputLabel>Variant</InputLabel>
                      <Select
                        value={variantFilter}
                        onChange={(e) => {
                          handleVariantFilterChange(e);
                        }}
                        label="Variant"
                      >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Pro">Pro</MenuItem>
                        <MenuItem value="Essentials">Essentials</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell sx={{ width: "120px" }}>
                    <FormControl variant="standard" sx={{ minWidth: 120 }}>
                      <InputLabel>Plan</InputLabel>
                      <Select
                        value={plan}
                        onChange={(e) => {
                          handlePlanChange(e);
                        }}
                        label="Filter by Plan"
                      >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Freetrial">Freetrial</MenuItem>
                        <MenuItem value="Yearly">Yearly</MenuItem>
                        <MenuItem value="3-Years">3-Years</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell sx={{ width: "120px" }}>
                    <TableSortLabel
                      active
                      direction={sortDirection || "desc"}
                      onClick={handleSortChange}
                    >
                      Expiry
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ width: "120px" }}>Status</TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </Box>

          {/* Body Table with matching column widths */}
          <Box sx={{ overflowY: "auto", maxHeight: "600px" }}>
            <Table sx={{ minWidth: "1000px", tableLayout: "fixed" }}>
              <TableBody>
                {rows.length > 0 ? (
                  rows.map((row) => {
                    const status = row.status ? row.status : "-";
                    const { color } = statusMap[status.toLowerCase()] ?? {
                      label: "-",
                      color: "default",
                    };

                    const planStatusMap = statusMap[
                      row?.plan.toLowerCase()
                    ] ?? {
                      label: "-",
                      color: "default",
                    };

                    const variantStatusMap = statusMap[
                      row?.variant.toLowerCase()
                    ] ?? {
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
                        <TableCell sx={{ width: "60px" }}>{row.sno}</TableCell>
                        <TableCell sx={{ width: "180px" }}>
                          <Stack
                            sx={{ alignItems: "center" }}
                            direction="row"
                            spacing={2}
                          >
                            {row.clinic_name}
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ width: "130px" }}>
                          {row.phone_number}
                        </TableCell>
                        <TableCell sx={{ width: "120px" }}>
                          {row.city}
                        </TableCell>
                        <TableCell sx={{ width: "120px" }}>
                          {row.state}
                        </TableCell>
                        <TableCell sx={{ width: "100px" }}>
                          {row.wa_count}
                        </TableCell>
                        <TableCell sx={{ width: "100px" }}>
                          {row.sms_count}
                        </TableCell>
                        <TableCell sx={{ width: "140px" }}>
                          {row.appointment_count}
                        </TableCell>
                        <TableCell sx={{ width: "120px" }}>
                          <Chip
                            color={
                              row?.variant ? variantStatusMap?.color : "default"
                            }
                            label={row?.variant || "-"}
                            size="small"
                            sx={{
                              width: "80px",
                              height: "24px",
                              borderRadius: "5px",
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ width: "120px" }}>
                          <Chip
                            color={row?.plan ? planStatusMap?.color : "default"}
                            label={row?.plan || "-"}
                            size="small"
                            sx={{
                              width: "80px",
                              height: "24px",
                              borderRadius: "5px",
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ width: "120px" }}>
                          {row.expiry
                            ? dayjs(row.expiry).format("MMM D, YYYY")
                            : "-"}
                        </TableCell>
                        <TableCell sx={{ width: "120px" }}>
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
                    <TableCell colSpan={12} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Box>
        <Divider />
        <TablePagination
          component="div"
          count={-1}
          page={page - 1}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[250, 500, 1000]}
          labelDisplayedRows={({ from, to }) =>
            hasMoreData ? `${from}-${to}` : `${from}-${to} of ${to}`
          }
        />
        </> }
      </Card>
    </>
  );
}
