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
  FormControlLabel,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import "../../../styles/settingsMsTables/main.css";
import {
  addLabs,
  deleteLabs,
  fetchLabs,
  updateLabs,
} from "../../../lib/api/settingsMsTable/api";
import CustomSwitch from "./yesSwitch";
import { Stack } from "@mui/system";

const LabsTable = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    lab_name: "",
    contact_number: "",
    contact_person: "",
    whatsappOrderUpdate: true,
  });

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: event.target.type === "checkbox" ? checked : value,
    }));
  };

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setFormData({
      lab_name: "",
      contact_number: "",
      contact_person: "",
      whatsappOrderUpdate: true,
    });
    setModalOpen(false);
    setEditMode(false);
  };

  const handleEditMode = (id) => {
    let idData = data.find((value) => value._id === id);

    setFormData({
      lab_name: idData.lab_name || "",
      contact_number: idData.contact_number || "",
      contact_person: idData.contact_person || "",
      whatsappOrderUpdate: idData.whatsappOrderUpdate || false,
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
      deleteLabs(id);
      setLoad((prev) => !prev);
    }
  };

  const handleSave = async () => {
    let data = {
      lab_name: formData.lab_name || "",
      contact_number: formData.contact_number || "",
      contact_person: formData.contact_person || "",
      whatsappOrderUpdate: formData.whatsappOrderUpdate || false,
    };

    if (editMode) {
      let id = editMode;
      let res = await updateLabs(id, data);
      if (res.success !== true) {
        alert(res?.error || "Something went wrong");
        return;
      }
      setLoad((prev) => !prev);
      handleModalClose();
      setEditMode(false);
      return;
    }

    let res = await addLabs(data);

    if (res.success !== true) {
      alert(res?.error || "Something went wrong");
      return;
    }
    setLoad((prev) => !prev);
    handleModalClose();
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
      const data = await fetchLabs(params);

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
          Settings &gt; Labs
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
            placeholder="Search by Labs"
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
            Add Labs
          </Button>
        </Box>

        {/* Table */}
        <Card sx={{ maxWidth: "100%", overflow: "hidden" }}>
          <Box className="setting-ms-table-main" sx={{ overflowX: "auto" }}>
            <Table className="setting-ms-table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#E3F2FD" }}>
                  <TableCell align="left">SI No</TableCell>
                  <TableCell align="center">Lab Name</TableCell>
                  <TableCell align="center">Contact Person</TableCell>
                  <TableCell align="center">Mobile Number</TableCell>
                  <TableCell align="center">Whatsapp</TableCell>
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
                          {work.lab_name || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {work.contact_person || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {work.contact_number || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {work.whatsappOrderUpdate ? "YES" : "NO" || "-"}
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
                                handleEditMode(work._id, work.name)
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

      {/* pop up */}
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, my: 1 }}>
            {editMode ? "Edit Lab" : "Add Lab"}
          </Typography>

          <IconButton
            onClick={handleModalClose}
            size="small"
            sx={{
              color: (theme) => theme.palette.error[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Lab Name"
              name="lab_name"
              value={formData.lab_name}
              onChange={handleChange}
              placeholder="Enter Lab Name"
            />

            <TextField
              fullWidth
              label="Lab Contact Person"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              placeholder="Enter Lab Contact Person"
            />

            <TextField
              fullWidth
              label="Mobile Number"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              placeholder="Enter Mobile Number"
            />

            <FormControlLabel
              label="WhatsApp Order Updates"
              labelPlacement="start"
              control={
                <CustomSwitch
                  size="medium"
                  checked={formData.whatsappOrderUpdate}
                  onChange={handleChange}
                  name="whatsappOrderUpdate"
                />
              }
              sx={{
                marginLeft: 0,
                justifyContent: "space-between",
                width: "100%",
              }}
            />

            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 2,
              }}
            >
              <Button variant="outlined" onClick={handleModalClose}>
                Close
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{ bgcolor: "#0098DA" }}
              >
                Save
              </Button>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LabsTable;
