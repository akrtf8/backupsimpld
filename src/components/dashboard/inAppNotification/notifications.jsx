"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Modal,
  Grid,
  Checkbox,
  Dialog,
  Alert,
} from "@mui/material";
import { CustomersTableDilogBox } from "../popUpNotification/clinicsListDilogBox";
import {
  addNotification,
  fetchInAppNotData,
} from "../../../lib/api/inAppNotification/api";
import dayjs from "dayjs";
import { CheckCircleOutline } from "@mui/icons-material";

export function Notifications() {
  const [isLoading, setIsLoading] = useState("false");
  const [successModal, setSuccessModal] = useState(false);
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      date: "20 Sep 2024, 10:24 AM",
      message:
        "We have released a new feature and it requires you to re-login to the application. Kindly logout and login again, to receive the latest updates.",
    },
    {
      id: 2,
      date: "18 Sep 2024, 03:00 PM",
      message:
        "We have released a new feature and it requires you to re-login to the application. Kindly logout and login again, to receive the latest updates.",
    },
    {
      id: 3,
      date: "15 Sep 2024, 09:31 AM",
      message:
        "We have released a new feature and it requires you to re-login to the application. Kindly logout and login again, to receive the latest updates.",
    },
    {
      id: 4,
      date: "14 Sep 2024, 10:24 AM",
      message:
        "We have released a new feature and it requires you to re-login to the application. Kindly logout and login again, to receive the latest updates.",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);
  const [selectAllHosp, setSelectAllHosp] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [reload, SetReload] = useState(false);

  const loadNotificationData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInAppNotData();

      setNotifications(data?.data || []);

      return data;
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAllHosp = (event) => {
    setSelectAllHosp(event.target.checked);
    if (event.target.checked) {
      setSelectedItems([]);
    }
  };

  const handleHosModalClose = () => {
    setIsHospitalModalOpen(false);
  };

  const handleHosModalOpen = () => setIsHospitalModalOpen(true);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleAddNotification = async () => {
    // Prepare hospital_list for the API
    const hospitalList = selectedItems.map((item) => ({
      hospital_id: item._id || item.hospital_id,
      name: item.name || item.company,
    }));

    let req_body = {
      description: message,
      url: url,
      hospital_list: hospitalList,
    };
    let response = await addNotification(req_body);

    console.log(response);
    // {"success": true}
    handleHosModalClose();
    setIsModalOpen(false);
    setMessage("");
    setUrl("");

    setIsModalOpen(false);
    if (response?.success) {
      setSuccessModal(true);
      SetReload((prev) => !prev);
      // Auto-hide modal after 5 seconds
      setTimeout(() => setSuccessModal(false), 5000);
    }
  };

  useEffect(() => {
    loadNotificationData();
  }, [reload]);

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f8f9fa" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "600" }}>
          In-app Notification
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={toggleModal}
          sx={{ marginBottom: 2, borderRadius: "6px" }}
        >
          Add Notification
        </Button>
      </Box>

      <Modal open={isModalOpen} onClose={toggleModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            style={{ fontWeight: "600", marginBottom: ".5rem" }}
            gutterBottom
          >
            Add Notification
          </Typography>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={5}
              placeholder="Write your notification here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ marginBottom: 1 }}
            />
          </Box>
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              URL
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter URL here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Box>
          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: 2 }}
          >
            <Grid item>
              <Typography variant="subtitle1">Display popup to</Typography>
            </Grid>
            <Grid item>
              <Button
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                fullWidth
                variant="outlined"
                className="dropDownMenu"
                onClick={handleHosModalOpen}
                disabled={selectAllHosp}
                sx={{ mr: 2 }}
              >
                Select Clinics
              </Button>
            </Grid>
            <Grid item>
              <Checkbox
                checked={selectAllHosp}
                onChange={handleSelectAllHosp}
              />
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: "pointer", display: "inline" }}
                onClick={() => {
                  setSelectAllHosp(true);
                }}
              >
                Select All Clinics
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: "right" }}>
            <Button
              variant="outlined"
              onClick={toggleModal}
              sx={{ marginRight: 1 }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleAddNotification}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      <Card
        className="notification-container-main"
        // sx={{
        //   maxHeight: "80vh",
        //   overflow: "hidden", // Prevent scrolling for the Card
        //   "&::-webkit-scrollbar": {
        //     width: "8px",
        //   },
        //   "&::-webkit-scrollbar-thumb": {
        //     backgroundColor: "#bdbdbd",
        //     borderRadius: "4px",
        //   },
        //   "&::-webkit-scrollbar-thumb:hover": {
        //     backgroundColor: "#9e9e9e",
        //   },
        // }}
      >
        <CardContent className="notification-container">
          <Typography variant="subtitle2" sx={{ marginBottom: 3 }}>
            <b>Past Notifications</b>
          </Typography>
          {/* <Table sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Notification</TableCell>
              </TableRow>
            </TableHead>
          </Table> */}
          <Box
            sx={{
              maxHeight: "65vh",
              overflowY: "auto", // Make only the body scrollable
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#bdbdbd",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#9e9e9e",
              },
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Notification</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.length > 0 ? (
                  notifications.map((notification) => {
                    return (
                      <TableRow key={notification._id}>
                        <TableCell>{notification.sno}</TableCell>
                        <TableCell>
                          {notification.updatedAt
                            ? dayjs(notification.updatedAt).format(
                                "D MMM YYYY, h:mm A"
                              )
                            : "-"}
                        </TableCell>
                        <TableCell>{notification.description}</TableCell>
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
        </CardContent>
      </Card>

      {/* Add Hospital Modal */}
      <Dialog
        open={isHospitalModalOpen}
        onClose={handleHosModalClose}
        className="dialog-box-main-table"
      >
        <CustomersTableDilogBox
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      </Dialog>
      {/* Success Modal */}
      {successModal && (
        <Alert
          style={{
            display: "flex",
            justifyContent: "center",
            position: "fixed",
            bottom: "1rem",
            right: "1rem",
          }}
          icon={<CheckCircleOutline fontSize="inherit" />}
          severity="success"
        >
          Data updated successfully!
          {/* <Button
            style={{ color: "#fff" }}
            onClick={() => setSuccessModal(false)}
          >
            Close
          </Button> */}
        </Alert>
      )}
    </Box>
  );
}
