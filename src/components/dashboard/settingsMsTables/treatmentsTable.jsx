import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import "../../../styles/settingsMsTables/main.css";
import {
  addTreatments,
  deleteTreatments,
  fetchTreatments,
  updateTreatments,
} from "../../../lib/api/settingsMsTable/api";

const TreatmentsTable = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editRowModal, setEditRowModal] = useState(false);

  const [rows, setRows] = useState([{ id: 1, value: "", charges: 0 }]);
  const [editRow, setEditRow] = useState([{ id: 1, name: "", charges: 0 }]);

  const addRow = () => {
    const newRow = {
      id: rows.length + 1,
      value: "",
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleInputChange = (id, value, charges) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, value, charges } : row))
    );
  };

  const handleEditRowInputChange = (id, name, charges) => {
    setEditRow([{ id: id, name: name, charges: charges }]);
  };

  const handleSave = () => {
    let res_body = rows.map((row) => ({
      name: row.value,
      charges: row.charges,
    }));
    console.log("Saving:", res_body);
    addTreatments(res_body);
    setLoad((prev) => !prev);
    handleModalClose();
  };

  const handleModalOpen = () => {
    setRows([{ id: 1, value: "" }]);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setRows([{ id: 1, value: "" }]);
    setModalOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditOpen = (id, name, charges) => {
    setEditRow([{ id: id, name: name, charges: charges }]);
    setEditRowModal(true);
  };

  const handleEditModalClose = () => {
    setEditRow([{ id: 1, name: "", charges: 0 }]);
    setEditRowModal(false);
  };

  const handleEditRowSave = () => {
    let id = editRow[0].id;
    let name = { name: editRow[0].name, charges: editRow[0].charges };
    updateTreatments(id, name);
    setLoad((prev) => !prev);
    handleEditModalClose();
  };

  const handleEditMode = () => {
    setEditMode(true);
  };

  //   delete  Users

  const handleDelete = (id, name) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (isConfirmed) {
      deleteTreatments(id);
      setLoad((prev) => !prev);
    }
  };

  const handleBack = () => {
    console.log("Back button clicked");
    navigate(-1);
  };

  const filteredData = data.filter((work) =>
    work.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadData = async () => {
    setIsLoading(true);
    try {
      const params = {
        searchTerm,
      };
      const data = await fetchTreatments(params);

      setData(data.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, load]);

  // if (isLoading) {
  //   return (
  //     <Box
  //       display="flex"
  //       justifyContent="center"
  //       alignItems="center"
  //       height="100vh"
  //       flexDirection="column"
  //     >
  //       <CircularProgress />
  //       <Typography variant="h6" mt={2}>
  //         Loading, please wait...
  //       </Typography>
  //     </Box>
  //   );
  // }

  return (
    <Box className="setting-ms-main">
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#a2d8ff",
          padding: "12px 20px",
          mb: 2,
        }}
        className="setting-ms-header"
      >
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", flexGrow: 1, textAlign: "center" }}
        >
          Settings &gt; Treatments
        </Typography>
        <Box sx={{ width: 48 }}></Box> {/* Placeholder for spacing */}
      </Box>

      <Card className="setting-ms-table-card-main">
        {/* Header with Search and Add Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            px: 3,
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search by Treatments"
            value={searchTerm}
            onChange={handleSearchChange}
            className="setting-ms-table-input-search"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleModalOpen}
            sx={{ borderRadius: "20px" }}
          >
            Add Treatments
          </Button>
        </Box>

        {/* Table */}
        <Card>
          <Box className="setting-ms-table-main" sx={{ overflowX: "auto" }}>
            <Table className="setting-ms-table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#E3F2FD" }}>
                  <TableCell align="left">SI No</TableCell>
                  <TableCell align="center">Treatment</TableCell>
                  <TableCell align="center">Charges</TableCell>
                  <TableCell align="center">Action</TableCell>{" "}
                  {/* Add align="right" here */}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((work, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell align="left">{work.sno || "-"}</TableCell>
                        <TableCell align="center">{work.name || "-"}</TableCell>
                        <TableCell align="center">
                          {work.charges || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {" "}
                          {/* Add align="right" here */}
                          <div className="table-button-main">
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              onClick={() =>
                                handleEditOpen(
                                  work._id,
                                  work.name,
                                  work.charges
                                )
                              }
                              sx={{ marginRight: 1 }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleDelete(work._id, work.name)}
                            >
                              Delete
                            </Button>
                          </div>
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
        </Card>
      </Card>

      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: "600" }} align="center">
            Add Treatments
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleModalClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.error[500],
              //   backgroundColor: (theme) => theme.palette.error[100],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Treatments Name
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2, mr: "5rem" }}>
                Charges
              </Typography>
            </Box>
            {/* Dynamic Rows */}
            {rows.map((row) => (
              <Box
                key={row.id}
                sx={{
                  display: "flex",
                  gap: 1,
                  mb: 2,
                  justifyContent: "space-between",
                }}
                fullWidth
              >
                {/* Full-width input for Treatment Name */}
                <TextField
                  fullWidth
                  placeholder="Enter Name"
                  value={row.value}
                  onChange={(e) =>
                    handleInputChange(row.id, e.target.value, row.charges)
                  }
                  variant="outlined"
                  size="small"
                  className="input-enter-name"
                />

                {/* Smaller input for Charges */}
                <TextField
                  placeholder="Charges"
                  value={row.charges}
                  onChange={(e) =>
                    handleInputChange(row.id, row.value, e.target.value)
                  }
                  variant="outlined"
                  size="small"
                  className="input-enter-charges"
                />

                {/* Delete Button */}
                <IconButton
                  onClick={() => removeRow(row.id)}
                  color="error"
                  size="small"
                  sx={{ mt: 0.5 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={addRow}
              sx={{ mt: 1 }}
              color="primary"
            >
              Add Row
            </Button>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={handleModalClose} variant="outlined">
            Close
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* edit row modal */}
      <Dialog
        open={editRowModal}
        onClose={handleEditModalClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: "600" }} align="center">
            Edit Treatments
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleEditModalClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.error[500],
              //   backgroundColor: (theme) => theme.palette.error[100],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Treatments Name
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2, mr: "4rem" }}>
                Charges
              </Typography>
            </Box>
            {/* Dynamic Rows */}
            <Box
              key={editRow.id}
              sx={{
                display: "flex",
                gap: 1,
                mb: 2,
                justifyContent: "space-between",
              }}
              fullWidth
            >
              {/* Full-width input for Treatment Name */}
              <TextField
                fullWidth
                placeholder="Enter Name"
                value={editRow[0].name}
                onChange={(e) =>
                  handleEditRowInputChange(
                    editRow[0].id,
                    e.target.value,
                    editRow[0].charges
                  )
                }
                variant="outlined"
                size="small"
                className="input-enter-name"
              />

              {/* Smaller input for Charges */}
              <TextField
                placeholder="Charges"
                value={editRow[0].charges}
                onChange={(e) =>
                  handleEditRowInputChange(
                    editRow[0].id,
                    editRow[0].name,
                    e.target.value
                  )
                }
                variant="outlined"
                size="small"
                className="input-enter-charges"
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={handleEditModalClose} variant="outlined">
            Close
          </Button>
          <Button
            onClick={handleEditRowSave}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TreatmentsTable;
