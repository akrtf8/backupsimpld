"use client";

import * as React from "react";
import { useEffect, useState } from "react";
// import Box from '@mui/material/Box';
import Card from "@mui/material/Card";
// import CardContent from '@mui/material/CardContent';
// import Divider from '@mui/material/Divider';
// import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";

// import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
// import dayjs from 'dayjs';
import "../../../styles/clientDetailsStyle.css";

import {
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import {
  fetchClinicData,
  fetchHospitalInfo,
  fetchSettingsCount,
  updateClinicData,
} from "../../../lib/api/clinic-details-handler-api";
import { deleteClinic } from "../../../lib/api/settingsPage/api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Initialize plugins
dayjs.extend(utc);
dayjs.extend(timezone);

function formatDate(dateString) {
  if (!dateString) return "-"; // Return "-" if the date is empty

  const date = new Date(dateString);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
}

export function ClinicDetailsMain({ setReload }) {
  const [clinicData, setClinicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hospitalData, setHospitalData] = useState(null);
  const [settingsData, setSettingsData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    ownerFirstName: "",
    ownerLastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    variant: "",
    status: "",
    plan_name: "",
    demo_start_at: "",
    demo_end_at: "",
    subscription_started_at: "",
    subscription_expires_at: "",
    conversationReminingCount: "",
    messageRemainingCount: "",
    notes: "",
    clinic_id: "",
    company: "",
    company1: "",
    phone1: "",
    referalCode: "",
    email1: "",
  });
  const [formDetailData, setFormDetailData] = useState({
    totalPatients: 0,
    appointments: {
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
    },
  });

  const statusMap = {
    "": { label: "-", color: "warning" },
    active: { label: "Active", color: "success" },
    live: { label: "Live", color: "success" },
    paused: { label: "Paused", color: "error" },
    pause: { label: "Pause", color: "error" },
    intrial: { label: "Trial", color: "success" },
  };

  const [deleteClinicModal, handleDeleteClinicModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tempStatus, setTempStatus] = useState(hospitalData?.status || "");
  const [tempPlanName, setTempPlanName] = useState(
    hospitalData?.plan_name || ""
  );
  const [tempVariant, setTempVariant] = useState(hospitalData?.variant || "");

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showStartSubPicker, setShowSubStartPicker] = useState(false);
  const [showEndSubPicker, setShowSubEndPicker] = useState(false);
  const [dataReload, setDataReload] = useState(false);

  const [subscription_startedAt, setSubscription_startedAt] = useState(null);
  const [subscription_expiresAt, setSubscription_expiresAt] = useState(null);
  const [demo_startedAt, setDemo_startedAt] = useState(null);
  const [demo_expiresAt, setDemo_expiresAt] = useState(null);

  const [startDate, setStartDate] = useState(
    clinicData?.subscription_started_at || new Date()
  );
  const [endDate, setEndDate] = useState(
    clinicData?.subscription_expires_at || new Date()
  );

  const handleDateChange = (field, date) => {
    if (field === "end") {
      setEndDate(date);
      handleInputChange("demo_end_at", date); // Update your data
      setShowEndPicker(false); // Close date picker after selection
    }
  };

  const handleDeleteClinic = () => {};

  // Fetch clinic and hospital data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const clinic = await fetchClinicData();
        const hospital = await fetchHospitalInfo();
        const settings = await fetchSettingsCount();
        setClinicData(clinic.data);
        setHospitalData(hospital.data);
        setSettingsData(settings);

        setTempStatus(hospital.data?.status || "");
        setTempPlanName(hospital.data?.plan_name || "");
        setTempVariant(hospital.data?.variant || "");

        const startDateString = clinic.data?.subscription_started_at;
        const endDateString = clinic.data?.subscription_expires_at;
        const startDateObject = startDateString ? dayjs(startDateString) : null;
        const endDateObject = endDateString ? dayjs(endDateString) : null;

        const startDemoDateString = clinic.data?.demo_start_at;
        const endDemoDateString = clinic.data?.demo_end_at;
        const startDemoDateObject = startDemoDateString
          ? dayjs(startDemoDateString)
          : null;
        const endDemoDateObject = endDemoDateString
          ? dayjs(endDemoDateString)
          : null;

        // Validate dates
        if (startDateObject && !startDateObject.isValid()) {
          console.error("Invalid start date string:", startDateString);
          setSubscription_startedAt(null); // Fallback to null
        } else {
          setSubscription_startedAt(startDateObject); // Set valid Dayjs object
        }

        if (endDateObject && !endDateObject.isValid()) {
          console.error("Invalid end date string:", endDateString);
          setSubscription_expiresAt(null); // Fallback to null
        } else {
          setSubscription_expiresAt(endDateObject); // Set valid Dayjs object
        }

        // Validate demo dates
        if (startDemoDateObject && !startDemoDateObject.isValid()) {
          console.error("Invalid start date string:", startDemoDateString);
          setDemo_startedAt(null); // Fallback to null
        } else {
          setDemo_startedAt(startDemoDateObject); // Set valid Dayjs object
        }

        if (endDemoDateObject && !endDemoDateObject.isValid()) {
          console.error("Invalid end date string:", endDemoDateString);
          setDemo_expiresAt(null); // Fallback to null
        } else {
          setDemo_expiresAt(endDemoDateObject); // Set valid Dayjs object
        }

        setFormData({
          ownerFirstName: clinic.data.ownerFirstName || "",
          ownerLastName: clinic.data.ownerLastName || "",
          address1: clinic.data.address1 || "",
          address2: clinic.data.address2 || "",
          city: clinic.data.city || "",
          state: clinic.data.state || "",
          country: clinic.data.country || "",
          pincode: clinic.data.pincode || "",
          variant: hospital.data?.variant || "",
          status: hospital.data?.status || "",
          plan_name: hospital.data?.plan_name || "",
          demo_start_at: clinic.data?.demo_start_at || "",
          demo_end_at: clinic.data?.demo_end_at || "",
          subscription_started_at: clinic.data?.subscription_started_at || "",
          subscription_expires_at: clinic.data?.subscription_expires_at || "",
          conversationReminingCount:
            parseInt(clinic.data?.conversationReminingCount || 0),
          messageRemainingCount: parseInt(clinic.data?.messageRemainingCount || 0),
          notes: clinic.data.notes || "",
          clinic_id: clinic.data.clinic_id || "",
          phone1: hospital.data?.phone1 || "",
          referalCode: hospital.data?.referalCode || "",
          email1: hospital.data?.email1 || "",
          company1: hospital.data?.company1 || "",
          company: hospital.data?.company || "",
        });
        setFormDetailData({
          totalPatients: clinic.data1?.totalPatients || 0,
          appointments: {
            today: clinic.data1?.appointments?.today || 0,
            thisWeek: clinic.data1?.appointments?.thisWeek || 0,
            thisMonth: clinic.data1?.appointments?.thisMonth || 0,
          },
        });

        setLoading(false); // Start loading
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [dataReload]);

  const handleEditToggle = () => {
    setEditMode((prev) => !prev);
  };

  const handleDeleteModalToggle = () => {
    setPassword("");
    setError("");
    handleDeleteClinicModal((prev) => !prev);
  };

  const handleDeleteModalClose = () => {
    setPassword("");
    setError("");
    handleDeleteClinicModal(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => {
      // Format the date as YYYY-MM-DDT00:00 in IST
      let formattedValue = value;
      if (value && (field.includes("demo") || field.includes("subscription"))) {
        formattedValue = dayjs(value)
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD");
      }

      return {
        ...prevData,
        [field]: formattedValue,
      };
    });

    const processDate = (dateValue, setter) => {
      if (!dateValue) {
        setter(null);
        return;
      }

      // Create date object at midnight IST
      const dateObject = dayjs.tz(
        dayjs(dateValue).format("YYYY-MM-DD"),
        "YYYY-MM-DD",
        "Asia/Kolkata"
      );

      if (!dateObject.isValid()) {
        console.error("Invalid date string:", dateValue);
        setter(null);
        return;
      }

      setter(dateObject);
    };

    switch (field) {
      case "demo_start_at":
        processDate(value, setDemo_startedAt);
        break;
      case "demo_end_at":
        processDate(value, setDemo_expiresAt);
        break;
      case "subscription_started_at":
        processDate(value, setSubscription_startedAt);
        break;
      case "subscription_expires_at":
        processDate(value, setSubscription_expiresAt);
        break;
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  const handlePasswordConfirm = async () => {
    if (!password) {
      setError("Password is required");
      return;
    }

    let res = await deleteClinic({ password: password });

    if (res.success !== true) {
      setError(res.message || "Password is wrong");
      return;
    }

    // You can add further validation or API integration here
    setPassword("");
    handleDeleteModalClose();
    window.location.pathname = "/";
  };

  const handleRedirect = async (path) => {
    window.location.pathname = path;
  };

  const handleSave = async () => {
    try {
      await updateClinicData(formData);
      setClinicData(formData); // Update displayed data after save
      setEditMode(false);
      setReload((prev) => !prev);
      setDataReload((prev) => !prev);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    {loading ? (
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
        ) : (
      <div className="admin-panel-container">
        {/* Clinic Details Section */}
        <Card className="clinic-section">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography className="section-title">Billing Details</Typography>
            {editMode ? (
              <Button
                variant="text"
                className="save-button"
                onClick={handleSave}
              >
                Save
              </Button>
            ) : (
              <Button
                variant="text"
                className="edit-button"
                onClick={handleEditToggle}
              >
                Edit
              </Button>
            )}
          </Box>
          <Divider style={{ margin: "1rem 0 2rem 0" }} />
          <Grid container spacing={4} className="clinic-details-grid">
            <Grid item xs={12} sm={6} className="clinic-detail-item">
              <Typography className="clinic-section-label">
                Clinic ID
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={formData.clinic_id}
                onChange={(e) => {
                  if (editMode) {
                    handleInputChange("clinic_id", e.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} className="clinic-detail-item">
              <Typography className="clinic-section-label">
                Clinic Name
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={formData.company}
                onChange={(e) => {
                  if (editMode) {
                    handleInputChange("company", e.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} className="clinic-detail-item">
              <Typography className="clinic-section-label">
                Phone Number
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={formData.phone1}
                onChange={(e) => {
                  if (editMode) {
                    handleInputChange("phone1", e.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} className="clinic-detail-item">
              <Typography className="clinic-section-label">
                Referal Code
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={formData.referalCode}
                onChange={(e) => {
                  if (editMode) {
                    handleInputChange("referalCode", e.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} className="clinic-detail-item">
              <Typography className="clinic-section-label">Email ID</Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={formData.email1}
                onChange={(e) => {
                  if (editMode) {
                    handleInputChange("email1", e.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} className="clinic-detail-item">
              <Typography className="clinic-section-label">
                Clinic Short Name
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={formData.company1}
                onChange={(e) => {
                  if (editMode) {
                    handleInputChange("company1", e.target.value);
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} className="clinic-detail-item">
              <Typography className="clinic-section-label">
                Owner First Name
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={formData.ownerFirstName}
                onChange={(e) => {
                  if (editMode) {
                    handleInputChange("ownerFirstName", e.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} className="clinic-detail-item">
              <Typography className="clinic-section-label">
                Owner Last Name
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={formData.ownerLastName}
                onChange={(e) => {
                  if (editMode) {
                    handleInputChange("ownerLastName", e.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} className="clinic-detail-item">
              <Typography className="clinic-section-label">
                Address Line 1
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={formData.address1}
                onChange={(e) => {
                  if (editMode) {
                    handleInputChange("address1", e.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} className="clinic-detail-item">
              <Typography className="clinic-section-label">
                Address Line 2
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={formData.address2}
                onChange={(e) => {
                  if (editMode) {
                    handleInputChange("address2", e.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} className="clinic-detail-item">
              <Typography className="clinic-section-label">City</Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={formData.city}
                onChange={(e) => {
                  if (editMode) {
                    handleInputChange("city", e.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} className="clinic-detail-item">
              <Typography className="clinic-section-label">State</Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={formData.state}
                onChange={(e) => {
                  if (editMode) {
                    handleInputChange("state", e.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} className="clinic-detail-item">
              <Typography className="clinic-section-label">Country</Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={formData.country}
                onChange={(e) => {
                  if (editMode) {
                    handleInputChange("country", e.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} className="clinic-detail-item">
              <Typography className="clinic-section-label">Pincode</Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={formData.pincode}
                onChange={(e) => {
                  if (editMode) {
                    handleInputChange("pincode", e.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} className="clinic-detail-item">
              <Typography className="clinic-section-label">Notes</Typography>
              <TextField
                fullWidth
                multiline
                rows={5}
                placeholder="Write your note here"
                variant="outlined"
                size="small"
                value={formData.notes}
                onChange={(e) => {
                  if (editMode) {
                    handleInputChange("notes", e.target.value);
                  }
                }}
              />
            </Grid>
          </Grid>
        </Card>

        {/* Subscription Details Section */}
        <Card className="subscription-section">
          <div className="subscription-details-main">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography className="subscription-details-title section-title">
                Subscription Details
              </Typography>

              {editMode ? (
                <Button
                  variant="contained"
                  color="error"
                  className="delete-clinic-button"
                  onClick={handleDeleteModalToggle}
                >
                  Delete Clinic
                </Button>
              ) : null}
            </Box>
            <Divider style={{ margin: "1.5rem 0" }} />
            <Grid container className="subscription-details">
              <Grid item sm={4} xs={12} className="subscription-item">
                <Typography className="subscription-label">Variant</Typography>
                <TextField
                  className="subscription-value"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={tempVariant}
                  onChange={(e) => {
                    if (editMode) {
                      setTempVariant(e.target.value);
                      handleInputChange("variant", e.target.value);
                    }
                  }}
                />
                <FormControl
                  fullWidth
                  variant="outlined"
                  size="small"
                  className="subscription-value"
                >
                  <Select
                    value={tempVariant}
                    onChange={(e) => {
                      if (editMode) {
                        setTempVariant(e.target.value);
                        handleInputChange("variant", e.target.value);
                      }
                    }}
                  >
                    <MenuItem key={tempVariant} value={tempVariant} selected>
                      {tempVariant}
                    </MenuItem>
                    {["Essentials", "Pro"]
                      .filter((option) => option !== tempVariant)
                      .map((option, index) => (
                        <MenuItem key={index} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12} className="subscription-item">
                <Typography className="subscription-label">
                  Plan Name
                </Typography>
                <FormControl
                  fullWidth
                  variant="outlined"
                  size="small"
                  className="subscription-value"
                >
                  {/* <InputLabel>Period</InputLabel> */}
                  <Select
                    value={tempPlanName}
                    onChange={(e) => {
                      if (editMode) {
                        setTempPlanName(e.target.value);
                        handleInputChange("plan_name", e.target.value);
                      }
                    }}
                    // label="Period"
                  >
                    <MenuItem key={tempPlanName} value={tempPlanName} selected>
                      {tempPlanName}
                    </MenuItem>
                    {["Freetrial", "Yearly", "3-Years"]
                      .filter((option) => option !== tempPlanName)
                      .map((option, index) => (
                        <MenuItem key={index} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12} className="subscription-item">
                <Typography className="subscription-label">Status</Typography>
                <TextField
                  className="subscription-value subscription-value-status"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={tempStatus}
                  // onChange={(e) => {
                  //   if (editMode) {
                  //     setTempStatus(e.target.value);
                  //     handleInputChange("status", e.target.value);
                  //   }
                  // }}
                  inputProps={{ readOnly: true }}
                />
                {/* <FormControl
                  fullWidth
                  variant="outlined"
                  size="small"
                  className="subscription-value"
                >
                  <Select
                    value={tempStatus}
                    onChange={(e) => {
                      if (editMode) {
                        setTempStatus(e.target.value);
                        handleInputChange("status", e.target.value);
                      }
                    }}
                  >
                    <MenuItem key={tempStatus} value={tempStatus} selected>
                      {tempStatus}
                    </MenuItem>
                    {["Active", "inTrial", "Paused"]
                      .filter((option) => option !== tempStatus)
                      .map((option, index) => (
                        <MenuItem key={index} value={option}>
                          {option == "inTrial" ? "Trial" : option}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl> */}
              </Grid>
            </Grid>
          </div>

          {/* Demo, Subscription, and Credits Section */}
          <Grid container spacing={2} className="subscription-dates">
            {/* Demo Section */}
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" className="section-label">
                Demo
              </Typography>
              <Box className="demo-box">
                <Grid container spacing={1}>
                  <Grid item xs={12} className="date-item">
                    <Typography className="subscription-date-label">
                      Start Date
                    </Typography>
                    <div
                      className="subscription-input-container"
                      onClick={() => {
                        if (editMode) {
                          setShowStartPicker(true);
                        }
                      }}
                    >
                      <Typography className="subscription-date-value">
                        {formatDate(formData.demo_start_at)}
                      </Typography>
                      <span className="calendar-icon">
                        <Box
                          component="img"
                          alt="📅"
                          src="/assets/calender_1.svg"
                        />
                      </span>
                    </div>
                    {showStartPicker ? (
                      <DatePicker
                        value={demo_startedAt}
                        className="hidden-date-picker"
                        open={showStartPicker}
                        views={["year", "month", "day"]}
                        onAccept={() => setShowStartPicker(false)}
                        onChange={(date) => handleInputChange("demo_start_at", date)}
                        onClose={() => setShowStartPicker(false)}
                        onClickOutside={() => setShowStartPicker(false)}
                        slotProps={{
                          actionBar: {
                            // Show "Clear" action in the DatePicker's action bar
                            actions: ['clear'],
                          },
                        }}
                        inline
                      />
                    ) : null}
                  </Grid>

                  <Grid item xs={12} className="date-item">
                    <Typography className="subscription-date-label">
                      End Date
                    </Typography>
                    <div
                      className="subscription-input-container"
                      onClick={() => {
                        if (editMode) {
                          setShowEndPicker(true);
                        }
                      }}
                    >
                      <Typography className="subscription-date-value">
                        {formatDate(formData.demo_end_at)}
                      </Typography>
                      <span className="calendar-icon">
                        <Box
                          component="img"
                          alt="📅"
                          src="/assets/calender_1.svg"
                        />
                      </span>
                    </div>
                    {showEndPicker ? (
                      <DatePicker
                        value={demo_expiresAt}
                        className="hidden-date-picker"
                        open={showEndPicker}
                        views={["year", "month", "day"]}
                        onAccept={() => {
                          setShowEndPicker(false);
                        }}
                        onChange={(date) => {
                          handleInputChange("demo_end_at", date);
                        }}
                        onClose={() => {
                          setShowEndPicker(false);
                        }}
                        onClickOutside={() => {
                          setShowEndPicker(false);
                        }}
                        slotProps={{
                          actionBar: {
                            // Show "Clear" action in the DatePicker's action bar
                            actions: ['clear'],
                          },
                        }}
                        inline
                      />
                    ) : null}
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Subscription Section */}
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" className="section-label">
                Subscription
              </Typography>
              <Box className="subscription-box">
                <Grid container spacing={1}>
                  <Grid item xs={12} className="date-item">
                    <Typography className="subscription-date-label">
                      Start Date
                    </Typography>
                    <div
                      className="subscription-input-container"
                      onClick={() => {
                        if (editMode) {
                          setShowSubStartPicker(true);
                        }
                      }}
                    >
                      <Typography className="subscription-date-value">
                        {formatDate(formData?.subscription_started_at)}
                      </Typography>
                      <span className="calendar-icon">
                        <Box
                          component="img"
                          alt="📅"
                          src="/assets/calender_1.svg"
                        />
                      </span>
                    </div>
                    {showStartSubPicker ? (
                      <DatePicker
                        value={subscription_startedAt}
                        className="hidden-date-picker"
                        open={showStartSubPicker}
                        views={["year", "month", "day"]}
                        onAccept={() => {
                          setShowSubStartPicker(false);
                        }}
                        onChange={(date) => {
                          handleInputChange("subscription_started_at", date);
                        }}
                        onClose={() => {
                          setShowSubStartPicker(false);
                        }}
                        onClickOutside={() => {
                          setShowSubStartPicker(false);
                        }}
                        slotProps={{
                          actionBar: {
                            // Show "Clear" action in the DatePicker's action bar
                            actions: ['clear'],
                          },
                        }}
                        inline
                      />
                    ) : null}
                  </Grid>
                  <Grid item xs={12} className="date-item">
                    <Typography className="subscription-date-label">
                      End Date
                    </Typography>
                    <div
                      className="subscription-input-container"
                      onClick={() => {
                        if (editMode) {
                          setShowSubEndPicker(true);
                        }
                      }}
                    >
                      <Typography className="subscription-date-value">
                        {formatDate(formData?.subscription_expires_at)}
                      </Typography>
                      <span className="calendar-icon">
                        <Box
                          component="img"
                          alt="📅"
                          src="/assets/calender_1.svg"
                        />
                      </span>
                    </div>
                    {showEndSubPicker ? (
                      <DatePicker
                        value={subscription_expiresAt}
                        className="hidden-date-picker"
                        open={showEndSubPicker}
                        views={["year", "month", "day"]}
                        onAccept={() => {
                          setShowSubEndPicker(false);
                        }}
                        onChange={(date) => {
                          handleInputChange("subscription_expires_at", date);
                        }}
                        onClose={() => {
                          setShowSubEndPicker(false);
                        }}
                        onClickOutside={() => {
                          setShowSubEndPicker(false);
                        }}
                        slotProps={{
                          actionBar: {
                            // Show "Clear" action in the DatePicker's action bar
                            actions: ['clear'],
                          },
                        }}
                        inline
                      />
                    ) : null}
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Credits Section */}
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" className="section-label">
                Credits
              </Typography>
              <Box className="credits-box">
                <Grid container spacing={0}>
                  <Grid item xs={12} className="credit-item credit-item-1">
                    <Typography className="credits-label">WhatsApp</Typography>
                    <div className="subscription-input-container">
                      {/* <Typography className="credits-value">{clinicData?.conversationReminingCount || 0}</Typography> */}
                      <TextField
                        fullWidth
                        variant="outlined"
                        className="credits-value"
                        size="small"
                        value={formData.conversationReminingCount || 0}
                        type="number"
                        onChange={(e) => {
                          if (editMode) {
                            handleInputChange(
                              "conversationReminingCount",
                              e.target.value
                            );
                          }
                        }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} className="credit-item">
                    <Typography className="credits-label">SMS</Typography>
                    <div className="subscription-input-container">
                      <TextField
                        fullWidth
                        variant="outlined"
                        className="credits-value"
                        size="small"
                        value={formData.messageRemainingCount || 0}
                        type="number"
                        onChange={(e) => {
                          if (editMode) {
                            handleInputChange(
                              "messageRemainingCount",
                              e.target.value
                            );
                          }
                        }}
                      />
                    </div>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Analytics Section */}
        <Card className="analytics-section">
          <div className="section-title section-title-1">Analytics</div>
          <Divider style={{ margin: "1rem 0 1.5rem 0" }} />
          <Grid container spacing={2}>
            <Grid
              container
              sm={12}
              xs={12}
              spacing={2}
              className="analytics-top-container"
            >
              <Grid item xs={12} sm={12 / 3} className="analytics-top-main">
                <Box className="analytics-card analytics-card-total-pat">
                  <Typography className="analytics-label">
                    Total Patients
                  </Typography>
                  <Typography className="analytics-value">
                    {formDetailData.totalPatients}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12 / 3}>
                <Box className="analytics-card analytics-card-total-appo">
                  <Typography className="analytics-label">
                    Total Appointments
                  </Typography>
                  <Typography className="analytics-value">
                    {formDetailData.appointments.today},{" "}
                    {formDetailData.appointments.thisWeek},{" "}
                    {formDetailData.appointments.thisMonth}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider style={{ margin: "0.5rem 0" }} />
            </Grid>

            <Grid item xs={12} sm={4} className="analytics-card-master-db">
              <Box
                className="analytics-card"
                onClick={() => {
                  handleRedirect("/dashboard/settings/admin-users");
                }}
              >
                <Typography className="analytics-label">Admin Users</Typography>
                <div>
                  <span className="analytics-value">
                    {settingsData?.counts?.users || 0}
                  </span>
                  <span className="arrow-icon">
                    <Box
                      component="img"
                      alt="➔"
                      src="/assets/arrow-right-1.svg"
                    />
                  </span>
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} className="analytics-card-master-db">
              <Box
                className="analytics-card"
                onClick={() => {
                  handleRedirect("/dashboard/settings/doctors");
                }}
              >
                <Typography className="analytics-label">Doctors</Typography>
                <div>
                  <span className="analytics-value">
                    {settingsData?.counts?.doctors || 0}
                  </span>
                  <span className="arrow-icon">
                    <Box
                      component="img"
                      alt="➔"
                      src="/assets/arrow-right-1.svg"
                    />
                  </span>
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} className="analytics-card-master-db">
              <Box
                className="analytics-card"
                onClick={() => {
                  handleRedirect("/dashboard/settings/treatments");
                }}
              >
                <Typography className="analytics-label">Treatments</Typography>
                <div>
                  <span className="analytics-value">
                    {settingsData?.counts?.treatments || 0}
                  </span>
                  <span className="arrow-icon">
                    <Box
                      component="img"
                      alt="➔"
                      src="/assets/arrow-right-1.svg"
                    />
                  </span>
                </div>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4} className="analytics-card-master-db">
              <Box
                className="analytics-card"
                onClick={() => {
                  handleRedirect("/dashboard/settings/medicines");
                }}
              >
                <Typography className="analytics-label">Medicines</Typography>
                <div>
                  <span className="analytics-value">
                    {settingsData?.counts?.medicines || 0}
                  </span>
                  <span className="arrow-icon">
                    <Box
                      component="img"
                      alt="➔"
                      src="/assets/arrow-right-1.svg"
                    />
                  </span>
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} className="analytics-card-master-db">
              <Box
                className="analytics-card"
                onClick={() => {
                  handleRedirect("/dashboard/settings/labs");
                }}
              >
                <Typography className="analytics-label">Labs</Typography>
                <div>
                  <span className="analytics-value">
                    {settingsData?.counts?.labs || 0}
                  </span>
                  <span className="arrow-icon">
                    <Box
                      component="img"
                      alt="➔"
                      src="/assets/arrow-right-1.svg"
                    />
                  </span>
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} className="analytics-card-master-db">
              <Box
                className="analytics-card"
                onClick={() => {
                  handleRedirect("/dashboard/settings/lab-works");
                }}
              >
                <Typography className="analytics-label">Lab Works</Typography>
                <div>
                  <span className="analytics-value">
                    {settingsData?.counts?.labWorks || 0}
                  </span>
                  <span className="arrow-icon">
                    <Box
                      component="img"
                      alt="➔"
                      src="/assets/arrow-right-1.svg"
                    />
                  </span>
                </div>
              </Box>
            </Grid>
          </Grid>
        </Card>
        <Modal open={deleteClinicModal} onClose={handleDeleteModalClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Confirm Deletion
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Please enter your password to confirm the deletion of the clinic.
            </Typography>
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={handlePasswordChange}
              error={!!error}
              helperText={error}
              sx={{ mt: 2, mb: 2 }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button variant="outlined" onClick={handleDeleteModalClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handlePasswordConfirm}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>)}
    </LocalizationProvider>
  );
}
