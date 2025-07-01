import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { fetchTableLocation } from "../../../lib/api/dashboardHome/fetchApi";

export function LocationWiseCount({ sx, onViewAll }) {
  const [cityData, setCityData] = useState([]);
  const [stateData, setStateData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTableLocation();
        if (response.data.success) {
          setCityData(response.data.data.cityWiseCounts);
          setStateData(response.data.data.stateWiseCounts);
        }
      } catch (error) {
        console.error("Error fetching location data:", error.message);
        // Handle error (e.g., show a notification to the user)
      }
    };

    fetchData();
  }, []);

  // Handle city click
  const handleCityClick = (city) => {
    window.location.href = `/dashboard/clinics?city=${city}`;
  };

  // Handle state click
  const handleStateClick = (state) => {
    window.location.href = `/dashboard/clinics?state=${state}`;
  };

  return (
    <Box sx={{ display: "flex", gap: 2, ...sx }}>
      {/* City-wise Count Table */}
      <Card sx={{ flex: 1, pb: 5, px: 2 }}>
        <CardHeader title="City-wise Count" />
        <Divider />
        <List
          sx={{
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: "435px",
          }}
        >
          {cityData.map((city, index) => (
            <ListItem
              divider={index < cityData.length - 1}
              key={index}
              sx={{
                justifyContent: "space-between",
                display: "flex",
                marginLeft: ".5rem",
                cursor: "pointer", // Add pointer cursor to indicate clickable
                "&:hover": {
                  backgroundColor: "#f5f5f5", // Add hover effect
                },
              }}
              onClick={() => handleCityClick(city.city)} // Handle city click
            >
              <ListItemText
                primary={city.city}
                primaryTypographyProps={{ variant: "subtitle1" }}
                sx={{ width: "100%" }}
              />
              <ListItemText
                primary={city.count}
                primaryTypographyProps={{ variant: "subtitle1" }}
                sx={{ width: "100%", textAlign: "right" }}
              />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Card>

      {/* State-wise Count Table */}
      <Card sx={{ flex: 1, pb: 5, px: 2 }}>
        <CardHeader title="State-wise Count" />
        <Divider />
        <List
          sx={{
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: "435px",
          }}
        >
          {stateData.map((state, index) => (
            <ListItem
              divider={index < stateData.length - 1}
              key={index}
              sx={{
                justifyContent: "space-between",
                display: "flex",
                marginLeft: ".5rem",
                cursor: "pointer", // Add pointer cursor to indicate clickable
                "&:hover": {
                  backgroundColor: "#f5f5f5", // Add hover effect
                },
              }}
              onClick={() => handleStateClick(state.state)} // Handle state click
            >
              <ListItemText
                primary={state.state}
                primaryTypographyProps={{ variant: "subtitle1" }}
                sx={{ width: "100%" }}
              />
              <ListItemText
                primary={state.count}
                primaryTypographyProps={{ variant: "subtitle1" }}
                sx={{ width: "100%", textAlign: "right" }}
              />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Card>
    </Box>
  );
}