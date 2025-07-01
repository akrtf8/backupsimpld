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
  Switch,
  Checkbox,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import "../../../styles/settingsMsTables/main.css";
import {
  addDoctor,
  deleteDoctor,
  fetchDoctor,
  updateDoctor,
} from "../../../lib/api/settingsMsTable/api";
import { Stack } from "@mui/system";
import CustomSwitch from "./yesSwitch";

const DoctorsTable = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    specialty: "",
    sendNotification: false,
    appointmentType: "",
    frequency: "",
    duration: "",
    immediate: false,
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
      name: "",
      mobile: "",
      specialty: "",
      sendNotification: false,
      appointmentType: "",
      frequency: "",
      duration: "",
      immediate: false,
    });
    setModalOpen(false);
    setEditMode(false);
  };

  const handleEditMode = (id) => {
    let idData = data.find((value) => value._id === id);

    setFormData({
      name: idData.name || "",
      mobile: idData.phone || "",
      specialty: idData.speciality || "",
      sendNotification: idData.appointmentWhatsapp || false,
      appointmentType: idData.appointmentWhatsappType || "",
      frequency: idData.sendAppointmentWhatsapp || "",
      duration: idData.duration || "",
      immediate: idData.immediateWhatsapp || false,
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
      deleteDoctor(id);
      setLoad((prev) => !prev);
    }
  };

  const handleSave = async () => {
    let data = {
      name: formData.name || "",
      phone: formData.mobile || "",
      speciality: formData.specialty || "",
      appointmentWhatsapp: formData.sendNotification || false,
      appointmentWhatsappType: formData.appointmentType || "",
      sendAppointmentWhatsapp: formData.frequency || "",
      duration: formData.duration || "",
      immediateWhatsapp: formData.immediate || false,
    };

    if (editMode) {
      let id = editMode;
      let res = await updateDoctor(id, data);
      if (res.success !== true) {
        alert(res?.error || "Something went wrong");
        return;
      }
      setLoad((prev) => !prev);
      handleModalClose();
      setEditMode(false);
      return;
    }

    let res = await addDoctor(data);

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

  const filteredData = data.filter((work) =>
    work.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadData = async () => {
    setIsLoading(true);
    try {
      const params = {
        searchTerm,
      };
      const data = await fetchDoctor(params);

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
          Settings &gt; Doctors
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
            placeholder="Search by Doctors"
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
            Add Doctor
          </Button>
        </Box>

        {/* Table */}
        <Card>
          <Box className="setting-ms-table-main" sx={{ overflowX: "auto" }}>
            <Table className="setting-ms-table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#E3F2FD" }}>
                  <TableCell align="left">SI No</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Mobile Number</TableCell>
                  <TableCell align="center">Specialty</TableCell>
                  <TableCell align="center">Whatsapp / Sms</TableCell>
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
                          {work.phone || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {work.speciality || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {work.appointmentWhatsapp ? "YES" : "NO"}
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
            {editMode ? "Edit Doctor" : "Add Doctor"}
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
              label="Doctor's Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Doctor's Name"
            />

            <TextField
              fullWidth
              label="Mobile Number"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter Mobile Number"
            />

            <TextField
              fullWidth
              label="Specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              placeholder="Enter Specialty"
            />

            <FormControlLabel
              label="Send appointment schedule via WhatsApp/SMS"
              labelPlacement="start"
              control={
                <CustomSwitch
                  size="medium"
                  checked={formData.sendNotification}
                  onChange={handleChange}
                  name="sendNotification"
                />
              }
              sx={{
                marginLeft: 0,
                justifyContent: "space-between",
                width: "100%",
              }}
            />

            {formData.sendNotification && (
              <>
                <FormControl fullWidth>
                  <InputLabel>Appointment Type</InputLabel>
                  <Select
                    value={formData.appointmentType}
                    label="Appointment Type"
                    name="appointmentType"
                    onChange={handleChange}
                  >
                    <MenuItem value="Own Appointments">
                      Own Appointments
                    </MenuItem>
                    <MenuItem value="All Appointments">
                      All Appointments
                    </MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <FormControl fullWidth>
                    <InputLabel>Frequency</InputLabel>
                    <Select
                      value={formData.frequency}
                      label="Frequency"
                      name="frequency"
                      onChange={handleChange}
                    >
                      <MenuItem value="Every Day">Every Day</MenuItem>
                      <MenuItem value="Only Appointment Days">
                        Only Appointment Days
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.immediate}
                        onChange={handleChange}
                        name="immediate"
                        size="medium"
                        color="primary"
                      />
                    }
                    label="Immediate"
                  />
                </Box>

                <FormControl fullWidth>
                  <InputLabel>Customise Duration : (Optional)</InputLabel>
                  <Select
                    value={formData.duration}
                    label="Customise Duration : (Optional)"
                    name="duration"
                    onChange={handleChange}
                  >
                    <MenuItem value="One Week">1-Week Prior</MenuItem>
                    <MenuItem value="Three Days">3-Days Prior</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

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

export default DoctorsTable;
