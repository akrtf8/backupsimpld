"use client";

import React, { useEffect, useState } from "react";
import { Box, Chip, Stack, Tab, Tabs, Typography } from "@mui/material";

import { config } from "../../../config";
import {
  fetchClinicData,
  fetchHospitalInfo,
} from "../../../lib/api/clinic-details-handler-api";

import { ClinicDetailIntraOral } from "./clinic-details-intra-oral";
import { ClinicDetailsMain } from "./clinic-details-main";
import { ClinicDetailSettings } from "./clinic-details-settings";

export const metadata = { title: `Clinic | Dashboard | ${config.site.name}` };

export default function ClinicDetailsHeader() {
  const [value, setValue] = useState(0); // Current tab value
  const [clinicData, setClinicData] = useState(null); // Clinic data
  const [hospitalData, setHospitalData] = useState(null); // Hospital data
  const [reload, setReload] = useState(false); // Reload data

  const statusMap = {
    "": { label: "-", color: "warning" },
    active: { label: "Active", color: "success" },
    live: { label: "Live", color: "success" },
    paused: { label: "Paused", color: "error" },
    pause: { label: "Pause", color: "error" },
    intrial: { label: "Trial", color: "success" },
  };

  // Fetch clinic and hospital data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clinic = await fetchClinicData();
        const hospital = await fetchHospitalInfo();
        setClinicData(clinic.data);
        setHospitalData(hospital.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [reload]);

  // Handle tab changes
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Render tab content based on selected tab
  const renderTabContent = () => {
    switch (value) {
      case 0:
        return <ClinicDetailsMain data={clinicData} setReload={setReload}/>;
      case 1:
        return <ClinicDetailIntraOral data={clinicData} />;
      case 2:
        return <ClinicDetailSettings data={clinicData} setReload={setReload}/>;
      default:
        return <ClinicDetailsMain data={clinicData} />;
    }
  };

  return (
    <Stack spacing={3} className="clinic_details_main">
      <Box>
        <Typography variant="h5">Clinics</Typography>
      </Box>

      {/* Clinic Information Header */}
      <Box
        sx={{
          padding: "0px",
          border: "1px solid #E0E0E0",
          borderRadius: "8px",
        }}
        className="clinic_title_main"
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography
              className="title_text title_text_1"
              variant="h6"
              fontWeight="bold"
            >
              {hospitalData?.clinic_id || "-"}&nbsp;
              <Typography
                className="title_text title_text_2"
                component="span"
                variant="h6"
                sx={{ color: "#007BFF", fontWeight: "bold" }}
              >
                {hospitalData?.company || ""}
              </Typography>
            </Typography>
            <Typography
              className="title_text title_text_3"
              variant="body2"
              color="textSecondary"
            >
              {hospitalData?.phone1 || "-"} | {hospitalData?.email || "-"}{" "}
              | {hospitalData?.city || "-"}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Chip
              label={hospitalData?.status || "-"}
              sx={{ fontWeight: "bold", fontSize: "14px", padding: "4px 12px" }}
              className="chip"
              color={
                statusMap[(hospitalData?.status || "").toLowerCase()].color ??
                "default"
              }
            />
            <Typography
              className="title_text title_text_4"
              variant="body2"
              color="textSecondary"
              sx={{ marginTop: "4px" }}
            >
              Referral Code <strong>{hospitalData?.referalCode || "-"}</strong>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tabs for Details/Intra Oral/Settings */}
      <Box
        sx={{
          padding: "8px 20px",
          border: "1px solid #E0E0E0",
          borderRadius: "8px",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          className="clinic_details_button_main"
          aria-label="Clinic Tabs"
        >
          <Tab label="Details" sx={{ minWidth: "25%", fontWeight: "bold" }} />
          <Tab
            label="Intra Oral"
            sx={{ minWidth: "25%", fontWeight: "bold" }}
          />
          <Tab label="Settings" sx={{ minWidth: "25%", fontWeight: "bold" }} />
        </Tabs>
      </Box>

      {/* Render the appropriate tab content */}
      <Box className="clinic_detail_content_main">{renderTabContent()}</Box>
    </Stack>
  );
}
