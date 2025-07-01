"use client";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import "../../../styles/clinicSettingsStyles.css";

import { CustomSwitch } from "../../../utils/buttons";
import {
  fetchHospitalData,
  fetchLogoPic,
  FetchPreview1,
  fetchSignPic,
  fetchStartingNumber,
  updatePatientRegData,
  updateStartNumber,
  uploadLogoPic,
  uploadSignPic,
} from "../../../lib/api/settingsPage/api";
import { CheckCircleOutline } from "@mui/icons-material";

export function ClinicDetailSettings({setReload}) {
  const [successModal, setSuccessModal] = useState(false);

  const [clinicLogo, setClinicLogo] = useState(null);
  const [sealSign, setSealSign] = useState(null);
  const [hospitalData, setHospitalData] = useState({});

  //  patient reg num sec
  const [patRegEdit, setPatRegEdit] = useState(false);
  const [patientIdPrefix, setPatientIdPrefix] = useState(null);
  const [startingNumber, setStartingNumber] = useState(0);
  const [treatmentQty, setTreatmentQty] = useState(null);
  const [showPendingBalance, setShowPendingBalance] = useState(null);

  // Detailed on Invoice sec
  const [detailsOnInvEdit, setDetailsOnInvEdit] = useState(false);
  const [clinicName, setClinicName] = useState(null);
  const [contactNum, setContactNum] = useState(null);
  const [clinicEmail, setClinicEmail] = useState(null);
  const [googleReview, setGoogleReview] = useState(null);
  const [addressOne, setAddressOne] = useState(null);
  const [addressTwo, setAddressTwo] = useState(null);
  const [addressThree, setAddressThree] = useState(null);
  const [addressFour, setAddressFour] = useState(null);
  const [birthdayWish, setBirthdayWish] = useState(false);
  const [showFinanceAbst, setShowFinanceAbst] = useState(false);
  const [labOrderUpdate, setLabOrderUpdate] = useState(false);

  const patRegEditHandler = () => {
    setPatRegEdit((prev) => !prev);
  };

  const editHandler = (func) => {
    func((prev) => !prev);
  };

  const handleInputChange = (func, value) => {
    func(value);
  };

  const openPreview = async () => {
    try {
      // Fetch the preview URL
      const pdfUrl = await FetchPreview1();

      // Open the PDF in a new tab
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Failed to load PDF preview:", error);
      alert(error.message || "Failed to load the preview.");
    }
  };

  const handleImageUpload = async (event, setImage, name) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("file", file);

      if (name == "clinic-sign") {
        let res = await uploadSignPic(formData);
        if (res?.success) {
          setSuccessModal(true);
          // Auto-hide modal after 5 seconds
          setTimeout(() => setSuccessModal(false), 5000);
        }
      }
      if (name == "clinic-logo") {
        let res = await uploadLogoPic(formData);
        if (res?.success) {
          setSuccessModal(true);
          // Auto-hide modal after 5 seconds
          setTimeout(() => setSuccessModal(false), 5000);
        }
      }
    }
  };

  const savePatientRegData = async () => {
    let req_body = {
      patientId_prefix: patientIdPrefix,
      treatment_qty: treatmentQty,
      showPendingBalance: showPendingBalance,
    };
    let response = await updatePatientRegData(req_body);
    await updateStartNumber({
      value: startingNumber,
    });
    console.log(response);
    // {"success": true}
    if (response?.success) {
      setSuccessModal(true);
      setPatRegEdit(false);

      // Auto-hide modal after 5 seconds
      setTimeout(() => setSuccessModal(false), 5000);
    }
  };

  const saveInvoiceDataData = async () => {
    let req_body = {
      company: clinicName,
      phoneNumber1: contactNum,
      email: clinicEmail,
      addressLine1: addressOne,
      addressLine2: addressTwo,
      addressLine3: addressThree,
      addressLine4: addressFour,
      reviewLink: googleReview,
      financeAbstract: showFinanceAbst,
      birthdayWish: birthdayWish,
      labOrderArrivalUpdate: labOrderUpdate,
    };
    let response = await updatePatientRegData(req_body);
    await updateStartNumber({
      value: startingNumber,
    });
    console.log(response);
    // {"success": true}
    if (response?.success) {
      setSuccessModal(true);
      setDetailsOnInvEdit(false);
      setReload((prev) => !prev)

      // Auto-hide modal after 5 seconds
      setTimeout(() => setSuccessModal(false), 5000);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hospital_data = await fetchHospitalData();
        const ptStNo = await fetchStartingNumber();
        const logoPic = await fetchLogoPic();
        const signPic = await fetchSignPic();

        setHospitalData(hospital_data.data);
        setClinicLogo(logoPic);
        setSealSign(signPic);

        //  patient reg num segtion
        setPatientIdPrefix(hospital_data?.data?.patientId_prefix || "");
        setStartingNumber(ptStNo?.data?.patient_id || 0);
        setTreatmentQty(hospital_data?.data?.treatment_qty);
        setShowPendingBalance(hospital_data?.data?.showPendingBalance);

        // Detailed on Invoice sec
        setClinicName(hospital_data?.data?.company || "");
        setContactNum(hospital_data?.data?.phoneNumber1 || "");
        setClinicEmail(hospital_data?.data?.email || "");
        setGoogleReview(hospital_data?.data?.reviewLink || "");
        setAddressOne(hospital_data?.data?.addressLine1 || "");
        setAddressTwo(hospital_data?.data?.addressLine2 || "");
        setAddressThree(hospital_data?.data?.addressLine3 || "");
        setAddressFour(hospital_data?.data?.addressLine4 || "");
        setBirthdayWish(hospital_data?.data?.birthdayWish);
        setShowFinanceAbst(hospital_data?.data?.financeAbstract);
        setLabOrderUpdate(hospital_data?.data?.labOrderArrivalUpdate);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Card className="clinic-settings-container">
      <Grid container spacing={3}>
        {/* patient reg num segtion */}
        <Grid item xs={12} md={6} className="patient-reg-num-main">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography className="section-title section-title-margin">
              Patient Registration Number
            </Typography>
            <Button
              className={`edit-button-patient-reg ${patRegEdit ? "hidden" : ""}`}
              color="primary"
              onClick={() => {
                editHandler(setPatRegEdit);
              }}
            >
              Edit
            </Button>
          </div>
          <Card variant="outlined" className="settings-card">
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <Typography>Prefix</Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={patientIdPrefix}
                    onChange={(e) => {
                      if (patRegEdit) {
                        handleInputChange(setPatientIdPrefix, e.target.value);
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Typography>Starting Number</Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={startingNumber}
                    onChange={(e) => {
                      if (patRegEdit) {
                        handleInputChange(setStartingNumber, e.target.value);
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={9}>
                  <Typography>Show quantity in Invoices</Typography>
                </Grid>
                <Grid item xs={3}>
                  <CustomSwitch
                    checked={treatmentQty}
                    onChange={(e) => {
                      if (patRegEdit) {
                        handleInputChange(setTreatmentQty, e.target.checked);
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={9}>
                  <Typography>Show pending balance on Invoices</Typography>
                </Grid>
                <Grid item xs={3}>
                  <CustomSwitch
                    checked={showPendingBalance}
                    onChange={(e) => {
                      if (patRegEdit) {
                        handleInputChange(
                          setShowPendingBalance,
                          e.target.checked
                        );
                      }
                    }}
                  />
                </Grid>
                <div
                  item
                  xs={8}
                  className={`patient_reg_num_button_main ${patRegEdit ? "" : "hidden"}`}
                >
                  <Button
                    variant="outlined"
                    component="span"
                    className="patient_reg_num_button_cancel"
                    onClick={patRegEditHandler}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outlined"
                    component="span"
                    className="patient_reg_num_button_save"
                    onClick={savePatientRegData}
                  >
                    Save
                  </Button>
                </div>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* prit setting sect */}
        <Grid item xs={12} md={6} className="print-section-main">
          <Typography className="section-title print-section-title section-title-margin">
            Print Settings
          </Typography>
          <Card variant="outlined" className="settings-card main-card">
            <CardContent>
              <Grid container spacing={2}>
                {/* Clinic Logo Section */}
                <Grid item xs={4}>
                  <Typography>Clinic Logo</Typography>
                  <div className="preview-box">
                    {clinicLogo ? (
                      <img
                        src={clinicLogo}
                        alt="Clinic Logo"
                        className="preview-image"
                      />
                    ) : (
                      <div className="empty-preview"></div>
                    )}
                  </div>
                  <div className="upload-section">
                    <Button
                      variant="outlined"
                      color="success"
                      className="upload-button print-section-button"
                      onClick={openPreview}
                    >
                      Preview
                    </Button>
                    <input
                      accept="image/*"
                      id="clinic-logo-upload"
                      type="file"
                      style={{ display: "none" }}
                      onChange={(event) =>
                        handleImageUpload(event, setClinicLogo, "clinic-logo")
                      }
                    />
                    <label htmlFor="clinic-logo-upload">
                      <Button
                        variant="outlined"
                        color="error"
                        component="span"
                        className="upload-button print-section-button"
                      >
                        Upload
                      </Button>
                    </label>
                  </div>
                </Grid>

                {/* Seal/Sign Section */}
                <Grid item xs={4}>
                  <Typography>Seal/Sign</Typography>
                  <div className="preview-box">
                    {sealSign ? (
                      <img
                        src={sealSign}
                        alt="Seal/Sign"
                        className="preview-image"
                      />
                    ) : (
                      <div className="empty-preview"></div>
                    )}
                  </div>
                  <div className="upload-section">
                    <Button
                      variant="outlined"
                      color="success"
                      className="upload-button print-section-button"
                      onClick={openPreview}
                    >
                      Preview
                    </Button>
                    <input
                      accept="image/*"
                      id="seal-sign-upload"
                      type="file"
                      style={{ display: "none" }}
                      onChange={(event) =>
                        handleImageUpload(event, setSealSign, "clinic-sign")
                      }
                    />
                    <label htmlFor="seal-sign-upload">
                      <Button
                        variant="outlined"
                        color="error"
                        component="span"
                        className="upload-button print-section-button"
                      >
                        Upload
                      </Button>
                    </label>
                  </div>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed on Invoice sec */}
      <Grid className="clinic-details-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            component="div"
            className="section-title section-title-margin"
          >
            Details on Invoice
          </Typography>
          <Button
            className={`edit-button-patient-reg ${detailsOnInvEdit ? "hidden" : ""}`}
            color="primary"
            onClick={() => {
              editHandler(setDetailsOnInvEdit);
            }}
          >
            Edit
          </Button>
        </div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card variant="outlined" className="settings-card main-card">
              <CardContent>
                <Grid container>
                  <Grid
                    xs={12}
                    style={{ display: "flex", alignItems: "flex-start" }}
                    className="details-container"
                  >
                    {/* Left Section */}
                    <Grid xs={6} style={{ paddingRight: "16px" }}>
                      <Grid item xs={12}>
                        <Typography className="settings-card-input-text">
                          Clinic Name
                        </Typography>
                        <TextField
                          label=""
                          variant="outlined"
                          fullWidth
                          value={clinicName}
                          onChange={(e) => {
                            if (detailsOnInvEdit) {
                              handleInputChange(setClinicName, e.target.value);
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography className="settings-card-input-text">
                          Contact Number of Appointments
                        </Typography>
                        <TextField
                          label=""
                          variant="outlined"
                          fullWidth
                          value={contactNum}
                          onChange={(e) => {
                            if (detailsOnInvEdit) {
                              handleInputChange(setContactNum, e.target.value);
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography className="settings-card-input-text">
                          Clinic Email Address
                        </Typography>
                        <TextField
                          label=""
                          variant="outlined"
                          fullWidth
                          value={clinicEmail}
                          onChange={(e) => {
                            if (detailsOnInvEdit) {
                              handleInputChange(setClinicEmail, e.target.value);
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography className="settings-card-input-text">
                          Google Review Link
                        </Typography>
                        <TextField
                          label=""
                          variant="outlined"
                          fullWidth
                          value={googleReview}
                          onChange={(e) => {
                            if (detailsOnInvEdit) {
                              handleInputChange(
                                setGoogleReview,
                                e.target.value
                              );
                            }
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* Vertical Divider */}
                    <div
                      style={{
                        borderLeft: "1px solid #ccc",
                        height: "100%",
                        margin: "0 16px",
                      }}
                    ></div>

                    {/* Right Section */}
                    <Grid xs={6} style={{ paddingLeft: "16px" }}>
                      <Grid item xs={12}>
                        <Typography className="settings-card-input-text">
                          Clinic Address Line 1
                        </Typography>
                        <TextField
                          label=""
                          variant="outlined"
                          fullWidth
                          value={addressOne}
                          onChange={(e) => {
                            if (detailsOnInvEdit) {
                              handleInputChange(setAddressOne, e.target.value);
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography className="settings-card-input-text">
                          Clinic Address Line 2
                        </Typography>
                        <TextField
                          label=""
                          variant="outlined"
                          fullWidth
                          value={addressTwo}
                          onChange={(e) => {
                            if (detailsOnInvEdit) {
                              handleInputChange(setAddressTwo, e.target.value);
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography className="settings-card-input-text">
                          Clinic Address Line 3
                        </Typography>
                        <TextField
                          label=""
                          variant="outlined"
                          fullWidth
                          value={addressThree}
                          onChange={(e) => {
                            if (detailsOnInvEdit) {
                              handleInputChange(
                                setAddressThree,
                                e.target.value
                              );
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography className="settings-card-input-text">
                          Clinic Address Line 4
                        </Typography>
                        <TextField
                          label=""
                          variant="outlined"
                          fullWidth
                          value={addressFour}
                          onChange={(e) => {
                            if (detailsOnInvEdit) {
                              handleInputChange(setAddressFour, e.target.value);
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <div
                    item
                    xs={8}
                    className={`button_main ${detailsOnInvEdit ? "" : "hidden"}`}
                  >
                    <Button
                      variant="outlined"
                      component="span"
                      className="button_cancel"
                      onClick={() => {
                        editHandler(setDetailsOnInvEdit);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outlined"
                      component="span"
                      className="button_save"
                      onClick={saveInvoiceDataData}
                    >
                      Save
                    </Button>
                  </div>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Grid style={{ margin: "1.5rem 0 0 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            component="div"
            className="section-title section-title-margin section-notifi-title"
          >
            Notification Settings
          </Typography>
          {/* <Button className="edit-button-patient-reg" color="primary">
            Edit
          </Button> */}
        </div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card variant="outlined" className="settings-card main-card">
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid
                    item
                    xs={6}
                    md={6}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography mr={1}>Birthday Wishes</Typography>
                    <Grid item xs={3}>
                      <CustomSwitch
                        checked={birthdayWish}
                        onChange={(e) => {
                          if (detailsOnInvEdit) {
                            handleInputChange(
                              setBirthdayWish,
                              e.target.checked
                            );
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    md={6}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography mr={1}>
                      Lab Order Updates to Patients
                    </Typography>
                    <Grid item xs={3}>
                      <CustomSwitch
                        checked={labOrderUpdate}
                        onChange={(e) => {
                          if (detailsOnInvEdit) {
                            handleInputChange(
                              setLabOrderUpdate,
                              e.target.checked
                            );
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    md={6}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography mr={1}>Show Finance Abstract</Typography>
                    <Grid item xs={3}>
                      <CustomSwitch
                        checked={showFinanceAbst}
                        onChange={(e) => {
                          if (detailsOnInvEdit) {
                            handleInputChange(
                              setShowFinanceAbst,
                              e.target.checked
                            );
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
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
    </Card>
  );
}
