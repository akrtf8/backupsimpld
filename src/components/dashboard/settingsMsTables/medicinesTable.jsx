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
  addMedicines,
  deleteMedicines,
  fetchMedicines,
  updateMedicines,
} from "../../../lib/api/settingsMsTable/api";

const MedicinesTable = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    medicine: "",
    medicine_type: "",
    before_after_food: "",
    morning: "",
    afternoon: "",
    evening: "",
    night: "",
    days: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setFormData({
      medicine: "",
      medicine_type: "",
      before_after_food: "",
      morning: "",
      afternoon: "",
      evening: "",
      night: "",
      days: "",
    });
    setModalOpen(false);
    setEditMode(false);
  };

  const handleEditMode = (id) => {
    let idData = data.find((value) => value._id === id);

    setFormData({
      medicine: idData.medicine || "",
      medicine_type: idData.medicine_type || "",
      before_after_food: idData.before_after_food || "",
      morning: idData.morning || "",
      afternoon: idData.afternoon || "",
      evening: idData.evening || "",
      night: idData.night || "",
      days: idData.days || "",
    });

    setEditMode(id);
    setModalOpen(true);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  //   delete  Users

  const handleDelete = (id, name) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (isConfirmed) {
      deleteMedicines(id);
      setLoad((prev) => !prev);
    }
  };

  const handleSave = async () => {
    if (editMode) {
      let id = editMode;
      let data = formData;

      let res = await updateMedicines(id, data);
      if (res.success !== true) {
        alert(res?.error || "Something went wrong");
        return;
      }
      setLoad((prev) => !prev);
      handleModalClose();
      setEditMode(false);
      return;
    }

    let res = await addMedicines(formData);

    if (res.success !== true) {
      alert(res?.error || "Something went wrong");
      return;
    }
    setLoad((prev) => !prev);
    handleModalClose();
    setEditMode(false);
  };

  const handleBack = () => {
    console.log("Back button clicked");
    navigate(-1);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const params = {
        searchTerm,
      };
      const data = await fetchMedicines(params);

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
          Settings &gt; Medicines
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
            placeholder="Search by Medicines"
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
            Add Medicines
          </Button>
        </Box>

        {/* Table */}
        <Card sx={{ maxWidth: "100%", overflow: "hidden" }}>
          <Box className="setting-ms-table-main" sx={{ overflowX: "auto" }}>
            <Table className="setting-ms-table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#E3F2FD" }}>
                  <TableCell align="left">SI No</TableCell>
                  <TableCell align="center">Type</TableCell>
                  <TableCell align="center">Medicine</TableCell>
                  <TableCell align="center">BF / AF </TableCell>
                  <TableCell align="center">Morning</TableCell>
                  <TableCell align="center">Afternoon</TableCell>
                  <TableCell align="center">Evening</TableCell>
                  <TableCell align="center">Night</TableCell>
                  <TableCell align="center">Days</TableCell>
                  <TableCell align="center">Action</TableCell>{" "}
                  {/* Add align="right" here */}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length > 0 ? (
                  data.map((work, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell align="left">{work.sno || "-"}</TableCell>
                        <TableCell align="center">
                          {work.medicine_type || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {work.medicine || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {work.before_after_food || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {work.morning || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {work.afternoon || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {work.evening || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {work.night || "-"}
                        </TableCell>
                        <TableCell align="center">{work.days || "-"}</TableCell>
                        <TableCell align="center">
                          {" "}
                          {/* Add align="right" here */}
                          <div className="table-button-main">
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              onClick={() => handleEditMode(work._id)}
                              sx={{ marginRight: 1 }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleDelete(work._id, work.medicine)}
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

      {/* pop up */}
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600, my: 1 }}>
            { editMode ? "Edit Medicines" : "Add Medicines"}
          </Typography>

          <IconButton
            aria-label="close"
            onClick={handleModalClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.error[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              mt: 1,
            }}
          >
            <Box sx={{ mb: 3 }}>
              <FormControl sx={{ width: "48%", mr: 1 }}>
                <InputLabel id="role-select-label">Medicine Type</InputLabel>
                <Select
                  labelId="role-select-label"
                  name="medicine_type"
                  value={formData.medicine_type}
                  onChange={handleInputChange}
                  placeholder="Choose Medicine type"
                  label="Medicine Type"
                >
                  <MenuItem value="Tablet">Tablet</MenuItem>
                  <MenuItem value="Capsule">Capsule</MenuItem>
                  <MenuItem value="Ointment">Ointment</MenuItem>
                  <MenuItem value="Injection">Injection</MenuItem>
                  <MenuItem value="Toothpaste">Toothpaste</MenuItem>
                </Select>
              </FormControl>
              <TextField
                sx={{ width: "50%" }}
                label="Medicine Name"
                name="medicine"
                value={formData.medicine}
                onChange={handleInputChange}
                placeholder="Enter Medicine Name"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControl sx={{ width: "48%", mr: 1 }}>
                <InputLabel id="before_after_food">BF / AF</InputLabel>
                <Select
                  labelId="before_after_food"
                  name="before_after_food"
                  value={formData.before_after_food}
                  onChange={handleInputChange}
                  placeholder="BF / AF"
                  label="BF / AF"
                >
                  <MenuItem value="">-</MenuItem>
                  <MenuItem value="Before Food">Before Food</MenuItem>
                  <MenuItem value="After Food">After Food</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ width: "50%", mr: 1 }}>
                <InputLabel id="morning"> Morning </InputLabel>
                <Select
                  labelId="morning"
                  name="morning"
                  value={formData.morning}
                  onChange={handleInputChange}
                  placeholder="Morning"
                  label="Morning"
                >
                  <MenuItem value="">-</MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="0.5">1/2</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControl sx={{ width: "48%", mr: 1 }}>
                <InputLabel id="afternoon">Afternoon</InputLabel>
                <Select
                  labelId="afternoon"
                  name="afternoon"
                  value={formData.afternoon}
                  onChange={handleInputChange}
                  placeholder="Afternoon"
                  label="Afternoon"
                >
                  <MenuItem value="">-</MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="0.5">1/2</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ width: "50%", mr: 1 }}>
                <InputLabel id="evening">Evening</InputLabel>
                <Select
                  labelId="evening"
                  name="evening"
                  value={formData.evening}
                  onChange={handleInputChange}
                  placeholder="Evening"
                  label="Evening"
                >
                  <MenuItem value="">-</MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="0.5">1/2</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControl sx={{ width: "48%", mr: 1 }}>
                <InputLabel id="night">Night</InputLabel>
                <Select
                  labelId="night"
                  name="night"
                  value={formData.night}
                  onChange={handleInputChange}
                  placeholder="Night"
                  label="Night"
                >
                  <MenuItem value="">-</MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="0.5">1/2</MenuItem>
                </Select>
              </FormControl>
              <TextField
                sx={{ width: "50%" }}
                label="Days"
                name="days"
                value={formData.days}
                onChange={handleInputChange}
                placeholder="Enter Days"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleModalClose}
            variant="outlined"
            sx={{ borderColor: "#ccc", color: "#555" }}
          >
            Close
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ background: "linear-gradient(to right, #3b82f6, #0ea5e9)" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicinesTable;
