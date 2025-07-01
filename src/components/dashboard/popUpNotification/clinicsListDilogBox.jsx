"use client";

import React, { useEffect, useState } from "react";
// import { useRouter } from 'next/navigation';
import { useNavigate } from "react-router-dom";
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
import { Chip, TableSortLabel } from "@mui/material";
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

export function CustomersTableDilogBox({ selectedItems, setSelectedItems }) {
  const [customers, setCustomers] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [plan, setPlan] = useState("");
  const [date, setDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState(selectedItems);
  const [planStatus, setPlanStatus] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const loadCustomers = async (newPage) => {
    setIsLoading(true);
    try {
      const params = {
        page: newPage,
        rowsPerPage,
        plan,
        status: planStatus,
        sortExpiry: sortDirection,
        date,
        searchTerm,
      };
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
        setRows(data.data);
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
  }, [rowsPerPage, plan, date, searchTerm, planStatus, sortDirection]);

  const statusMap = {
    "": { label: "-", color: "warning" },
    active: { label: "Active", color: "success" },
    live: { label: "Live", color: "success" },
    paused: { label: "Paused", color: "error" },
    pause: { label: "Pause", color: "error" },
    intrial: { label: "Trial", color: "success" },
  };

  const handleAddRow = (row) => {
    const alreadyAdded = selectedRows.find((item) => item._id === row._id);
    if (!alreadyAdded) {
      const updatedRows = [
        ...selectedRows,
        { _id: row._id, company: row.clinic_name },
      ];
      setSelectedRows(updatedRows);
      setSelectedItems(updatedRows); // Pass to parent
    }
  };

  const handleRemoveChip = (id) => {
    const updatedRows = selectedRows.filter((row) => row._id !== id);
    setSelectedRows(updatedRows);
    setSelectedItems(updatedRows); // Pass to parent
  };

  // const router = useRouter();
  const navigate = useNavigate();

  const handleRowClick = (customerId) => {
    //
  };

  const handlePlanChange = (event) => {
    setPlan(event.target.value);
    setPage(1);
    setHasMoreData(true);
  };

  const handleStatusChange = (event) => {
    setPlanStatus(event.target.value);
    setPage(1);
    setHasMoreData(true);
  };

  const handleSortChange = () => {
    const newSortDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newSortDirection);
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
    <div className="clinicListDilogBox">
      <Card
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", marginRight: "2rem" }}
        >
          Add Clinics
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

        <Box sx={{ display: "flex", gap: 1 }}>
          <FormControl sx={{ minWidth: 250 }}>
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

          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={planStatus}
              onChange={handleStatusChange}
              label="Filter by Status"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="inTrial">Trial</MenuItem>
              <MenuItem value="Paused">Paused</MenuItem>
              <MenuItem value="">All</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Card>

      {/* Chips for selected items */}
      <Box sx={{ p: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
        {selectedRows.map((row) => (
          <Chip
            key={row._id || row.hospital_id}
            label={row.name || row.company}
            onDelete={() => handleRemoveChip(row._id)}
            sx={{ borderRadius: "16px" }}
          />
        ))}
      </Box>

      <Card sx={{ overflow: "scroll" }}>
        <Box sx={{ overflow: "scroll" }}>
          <Table sx={{ minWidth: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell>S. no</TableCell>
                <TableCell>Clinic Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>City</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell sortDirection={sortDirection}>
                  <TableSortLabel
                    active
                    direction={sortDirection}
                    onClick={handleSortChange}
                  >
                    Expiry
                  </TableSortLabel>
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row) => {
                  const status = row.status ? row.status : "-";
                  const { color } = statusMap[status.toLowerCase()] ?? {
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
                          {row.clinic_name}
                        </Stack>
                      </TableCell>
                      <TableCell>{row.phone_number}</TableCell>
                      <TableCell>{row.city}</TableCell>
                      <TableCell>{row.state}</TableCell>
                      <TableCell>{row.plan}</TableCell>
                      <TableCell>
                        {row.expiry
                          ? dayjs(row.expiry).format("MMM D, YYYY")
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
                      <TableCell>
                        <Chip
                          color="primary"
                          variant="outlined"
                          label="Add"
                          size="small"
                          onClick={() => handleAddRow(row)}
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
    </div>
  );
}
