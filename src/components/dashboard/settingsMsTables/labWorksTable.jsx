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
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import "../../../styles/settingsMsTables/main.css";
import {
  addLabWork,
  deleteLabWork,
  fetchLabWork,
  updateLabWork,
} from "../../../lib/api/settingsMsTable/api";

const LabWorksTable = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [labWorks, setLabWorks] = useState([]);

  const [rows, setRows] = useState([{ id: 1, value: "" }]);
  const [editRow, setEditRow] = useState([{ id: 1, name: "" }]);
  const [addLabWorkModal, setAddLabWorkModal] = useState(false);
  const [editRowModal, setEditRowModal] = useState(false);

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

  const handleInputChange = (id, value) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, value } : row)));
  };

  const handleEditRowInputChange = (id, value) => {
    setEditRow([{ id: id, name: value }]);
  };

  const handleSave = () => {
    let res_body = rows.map((row) => ({ name: row.value }));
    console.log("Saving:", res_body);
    addLabWork(res_body);
    setLoad((prev) => !prev);
    handleAddLabWorkClose();
  };

  const handleAddLabWorkOpen = () => {
    setRows([{ id: 1, value: "" }]);
    setAddLabWorkModal(true);
  };

  const handleAddLabWorkClose = () => {
    setRows([{ id: 1, value: "" }]);
    setAddLabWorkModal(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddLabWork = () => {
    console.log("Add Lab Work clicked");
    handleAddLabWorkOpen();
  };

  //   delete lab work

  const handleDelete = (id, name) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (isConfirmed) {
      deleteLabWork(id);
      setLoad((prev) => !prev);
    }
  };

  //   edit  lab work

  const handleEditLabWorkOpen = (id, name) => {
    setEditRow([{ id: id, name: name }]);
    setEditRowModal(true);
  };

  const handleEditLabWorkClose = () => {
    setEditRow([{ id: 1, name: "" }]);
    setEditRowModal(false);
  };

  const handleEditRowSave = () => {
    let id = editRow[0].id;
    let name = { name: editRow[0].name };
    updateLabWork(id, name);
    setLoad((prev) => !prev);
    handleEditLabWorkClose();
  };

  const handleBack = () => {
    console.log("Back button clicked");
    navigate(-1);
  };

  const filteredLabWorks = labWorks.filter((work) =>
    work.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadLabWork = async () => {
    setIsLoading(true);
    try {
      const params = {
        searchTerm,
      };
      const data = await fetchLabWork(params);

      setLabWorks(data.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLabWork();
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
          Settings &gt; Lab Works
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
            placeholder="Search by Lab Works"
            value={searchTerm}
            onChange={handleSearchChange}
            className="setting-ms-table-input-search"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddLabWork}
            sx={{ borderRadius: "20px" }}
          >
            Add Lab Work
          </Button>
        </Box>

        {/* Table */}
        <Card>
          <Box className="setting-ms-table-main" sx={{ overflowX: "auto" }}>
            <Table className="setting-ms-table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#E3F2FD" }}>
                  <TableCell align="center">SI No</TableCell>
                  <TableCell align="center">Lab Work Name</TableCell>
                  <TableCell align="center">Action</TableCell>{" "}
                  {/* Add align="right" here */}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLabWorks.length > 0 ? (
                  filteredLabWorks.map((work, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell align="center">{work.sno}</TableCell>
                        <TableCell align="center">{work.name}</TableCell>
                        <TableCell align="center">
                          {" "}
                          {/* Add align="right" here */}
                          <div className="table-button-main">
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              onClick={() =>
                                handleEditLabWorkOpen(work._id, work.name)
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
        open={addLabWorkModal}
        onClose={handleAddLabWorkClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: "600" }} align="center">
            Add Lab Work
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleAddLabWorkClose}
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
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Lab Work Name
            </Typography>
            {rows.map((row) => (
              <Box key={row.id} sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Enter Name"
                  value={row.value}
                  onChange={(e) => handleInputChange(row.id, e.target.value)}
                  variant="outlined"
                  size="small"
                />
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
          <Button onClick={handleAddLabWorkClose} variant="outlined">
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
        onClose={handleEditLabWorkClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: "600" }} align="center">
            Edit Lab Work
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleEditLabWorkClose}
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
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Lab Work Name
            </Typography>

            <Box key={editRow[0]?.id} sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Enter Name"
                value={editRow[0]?.name}
                onChange={(e) =>
                  handleEditRowInputChange(editRow[0]?.id, e.target.value)
                }
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={handleEditLabWorkClose} variant="outlined">
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

export default LabWorksTable;
