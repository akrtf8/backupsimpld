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
  addAdminUsers,
  deleteAdminUsers,
  fetchAdminUsers,
  updateAdminUsers,
} from "../../../lib/api/settingsMsTable/api";

const AdminUsersTable = () => {
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
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setFormData({
      name: "",
      mobile: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: "",
    });
    setModalOpen(false);
    setEditMode(false);
  };

  const handleEditMode = (id) => {
    let idData = data.find((value) => value._id === id);
    console.log(idData);
    setFormData({
      name: idData.name || "",
      mobile: idData.phoneNumber || "",
      email: idData.emailId || "",
      role: idData.role1 || "",
    });

    setEditMode(id);
    setModalOpen(false);
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
      deleteAdminUsers(id);
      setLoad((prev) => !prev);
    }
  };

  const handleSave = async () => {
    if (editMode) {
      let id = editMode;
      let req_data = {
        name: formData.name,
        phoneNumber: formData.mobile,
        emailId: formData.email,
        role1: formData.role,
      };
      let res = await updateAdminUsers(id, req_data);
      if (res.success !== true) {
        alert(res?.error || "Something went wrong");
        return;
      }
      setLoad((prev) => !prev);
      handleModalClose();
      setEditMode(false);
      return;
    }

    const newErrors = {};

    // Name validation
    if (!formData.name) {
      newErrors.name = "Name is required.";
    }

    // Mobile number validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits.";
    }

    // Email validation
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!formData.email) {
    //   newErrors.email = "Email is required.";
    // } else if (!emailRegex.test(formData.email)) {
    //   newErrors.email = "Invalid email format.";
    // }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Role is required.";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    // Confirm password validation
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // If there are errors, set them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let res = await addAdminUsers(formData);

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
      const data = await fetchAdminUsers(params);

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
          Settings &gt; Admin Users
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
            placeholder="Search by Admin Userss"
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
            Add Admin Users
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
                  <TableCell align="center">Mobile Number </TableCell>
                  <TableCell align="center">Role</TableCell>
                  <TableCell align="center">Username</TableCell>
                  <TableCell align="center">Action</TableCell>{" "}
                  {/* Add align="right" here */}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((work, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell align="left">{work.sno}</TableCell>
                        <TableCell align="center">{work.name}</TableCell>
                        <TableCell align="center">{work.phoneNumber}</TableCell>
                        <TableCell align="center">{work.role1}</TableCell>
                        <TableCell align="center">
                          {work.username || "-"}
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
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600, my: 1 }}>
            Add Admin User
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
              gap: 2,
              mt: 1,
            }}
          >
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter Name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              label="Mobile Number"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Enter Mobile Number"
              fullWidth
              error={!!errors.mobile}
              helperText={errors.mobile}
            />
            <TextField
              label="Email ID"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Email ID"
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
            />
            <FormControl fullWidth error={!!errors.role}>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Select Role"
                label="Role"
              >
                <MenuItem value="Owner">Owner</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Doctor">Doctor</MenuItem>
              </Select>
              {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
            </FormControl>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter Password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
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

      {/* pop up Edit */}
      <Dialog
        open={editMode}
        onClose={handleModalClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600, my: 1 }}>
            Edit Admin User
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
              gap: 2,
              mt: 1,
            }}
          >
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter Name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              label="Mobile Number"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Enter Mobile Number"
              fullWidth
              error={!!errors.mobile}
              helperText={errors.mobile}
            />
            <TextField
              label="Email ID"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Email ID"
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
            />
            <FormControl fullWidth error={!!errors.role}>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Select Role"
                label="Role"
              >
                <MenuItem value="Owner">Owner</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Doctor">Doctor</MenuItem>
              </Select>
              {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
            </FormControl>
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

export default AdminUsersTable;
