"use client";

import React, { useEffect, useState } from "react";
import { Add, CloseOutlined, CloseRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  IconButton,
  OutlinedInput,
  FormControl,
  InputLabel,
  TablePagination,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

import "../../../styles/popUpNotiStyles.css";
import { CustomersTableDilogBox } from "./clinicsListDilogBox";
import { fetchPopUpList } from "../../../lib/api/popUpNotification/get-pop-up-notification";
import {
  updatePopUpImage,
  updatePopUpList,
} from "../../../lib/api/popUpNotification/update-pop-up-notification";
import ImageFetcher from "../../../lib/api/popUpNotification/image-fetcher";

const baseURL = process.env.REACT_APP_API_BASE_URL;

// ImageList Component
const ImageListItem = ({ img, onDelete }) => (
  <Paper
    elevation={0}
    variant="outlined"
    sx={{
      p: 2,
      mb: 2,
      display: "flex",
      alignItems: "center",
      gap: 2,
    }}
  >
    {/* Menu and Image Section */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <IconButton size="medium" sx={{ color: "text.secondary" }}>
        <MenuIcon />
      </IconButton>

      {/* Image or Placeholder */}
      <Box
        sx={{
          width: 140,
          height: 96,
          bgcolor: "grey.300",
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed #ccc",
          padding: "2px",
        }}
      >
        {img.localImg ? (
          <img
            src={img.image}
            alt="Uploaded"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : img.image ? (
          <img
            src={ImageFetcher(img.image)}
            alt="Uploaded"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Typography sx={{ color: "text.secondary" }}>No Image</Typography>
        )}
      </Box>
    </Box>
    {/* Description Text */}
    <Box
      sx={{
        flex: 1,
        height: 96,
        padding: "1rem",
        ml: 2,
        border: "1px solid #ccc",
        borderRadius: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {img.description || "No description provided"}
      </Typography>
    </Box>

    {/* Delete Button */}
    <Button
      color="error"
      onClick={() => onDelete(img._id)}
      variant="outlined"
      sx={{
        textTransform: "none",
        minWidth: "auto",
        "&:hover": {
          backgroundColor: "error.lighter",
        },
        borderRadius: "6px",
      }}
    >
      Delete
    </Button>
  </Paper>
);

export function PopUpNotification() {
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState("Active");
  const [category, setCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [imageText, setImageText] = useState("");
  const [imagesList, setImagesList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAllHosp, setSelectAllHosp] = useState(false);
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);
  const [popUpData, setPopUpData] = useState({});
  const [popUpList, setPopUpList] = useState([]);
  const [popUpHospList, setPopUpHospList] = useState([]);
  const [popUpStartDate, setPopUpStartDate] = useState(null);
  const [popUpEndDate, setPopUpEndDate] = useState(null);
  const [buttonLabel, setButtonLabel] = useState("Publish");
  const [isNewData, setIsNewData] = useState(false);
  const [isValueChange, setIsValueChange] = useState(false);
  const [publishingCount, setPublishingCount] = useState(0);

  const handleModalOpen = () => setIsModalOpen(true);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setImage(null);
    setImageText("");
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

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleImageUpload = () => {
    if (image) {
      const newImage = {
        _id: Date.now(),
        image: URL.createObjectURL(image),
        localImg: URL.createObjectURL(image),
        description: imageText,
        file: image,
      };
      setImagesList((prevList) => [...prevList, newImage]);
      handleModalClose();
    }
  };
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    console.log(event.dataTransfer);
    const files = event.dataTransfer.files;
    if (files && files[0]) {
      event.target.files = files;
      handleImageChange(event);
    }
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
  };

  const handleDeleteImage = (_id) => {
    setImagesList((prevList) => prevList.filter((img) => img._id !== _id));
  };

  const updateClinicData = async () => {
    try {
      const updatedImagesList = await Promise.all(
        imagesList.map(async (item) => {
          if (item.localImg) {
            // Upload the file and get the API-preferred filename
            const updatedImageName = await updatePopUpImage(item.file);
            return {
              ...item,
              updateImg: updatedImageName.data[0],
            };
          }
          return item;
        })
      );
      console.log(updatedImagesList);
      // Prepare popup_data for the API
      const popupData = updatedImagesList.map((item) => ({
        image: item.updateImg ? item.updateImg : item.image,
        description: item.description,
      }));

      // Prepare hospital_list for the API
      const hospitalList = selectedItems.map((item) => ({
        hospital_id: item._id || item.hospital_id,
        name: item.name || item.company,
      }));

      // Send updated popup data and hospital list to the API
      const response = await updatePopUpList({
        name: "test",
        start: startDate ? startDate.toISOString().slice(0, 10) : null,
        end: endDate ? endDate.toISOString().slice(0, 10) : null,
        popup_data: popupData,
        hospital_list: hospitalList,
      });

      console.log("Clinic data updated successfully:", response);
    } catch (error) {
      console.error("Error updating clinic data:", error.message);
    } finally {
      setPublishingCount((prevCount) => prevCount + 1);
    }
  };

  const loadPopUpData = async (newPage) => {
    setIsLoading(true);
    try {
      const data = await fetchPopUpList();

      setSelectedItems(data?.data?.hospital_list || []);
      setImagesList(data?.data?.popup_data || []);
      setStartDate(data?.data?.start ? dayjs(data.data.start) : null);
      setEndDate(data?.data?.end ? dayjs(data.data.end) : null);
      setSelectAllHosp((data?.data?.hospital_list || []).length == 0);

      setButtonLabel(
        (data?.data?.popup_data || []).length > 0 ? "Update" : "Publish"
      );

      setPopUpStartDate(data?.data?.start ? dayjs(data.data.start) : null);
      setPopUpEndDate(data?.data?.end ? dayjs(data.data.end) : null);
      setPopUpData(data?.data || {});
      setPopUpList(data?.data?.popup_data || []);
      setPopUpHospList(data?.data?.hospital_list || []);

      return data;
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPopUpData();
  }, [publishingCount]);

  useEffect(() => {
    const isDataChanged =
      !dayjs(startDate).isSame(popUpStartDate) ||
      !dayjs(endDate).isSame(popUpEndDate) ||
      JSON.stringify(imagesList) !==
        JSON.stringify(popUpData.popup_data || []) ||
      JSON.stringify(selectedItems) !== JSON.stringify(popUpHospList);

    setStatus(isDataChanged ? "Edit" : "Active");
  }, [
    startDate,
    endDate,
    imagesList,
    selectedItems,
    popUpStartDate,
    popUpEndDate,
    popUpData.popup_data,
    popUpHospList,
  ]);

  return (
    <Box className="container-main pop-up-container-main">
      <Stack
        direction="row"
        spacing={3}
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">
          Popup Notification
        </Typography>
        <Button
          variant="outlined"
          sx={{ textTransform: "none", borderRadius: "8px" }}
          onClick={handleModalOpen}
        >
          Add Images
        </Button>
      </Stack>

      <Card variant="outlined" sx={{ padding: 2 }}>
        <Grid container className="date-pick-main">
          <Grid display="flex" justifyContent="center" alignItems="center">
            <Grid item className="flex-center item-1">
              <Typography className="date-pick-title">Start</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label=""
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  textField={(params) => (
                    <TextField {...params} fullWidth variant="outlined" />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item className="flex-center">
              <Typography className="date-pick-title">End</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label=""
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  textField={(params) => (
                    <TextField {...params} fullWidth variant="outlined" />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="success"
              disabled={status == "Edit" ? true : false}
            >
              {status == "Edit" ? "Inactive" : "Active"}
            </Button>
          </Box>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h7" sx={{ ml: 2 }} fontWeight="bold">
          Images
        </Typography>

        {imagesList.length > 0 ? (
          <Box sx={{ mt: 2 }} className="image-show-list-main">
            {imagesList.map((img) => (
              <ImageListItem
                key={img._id}
                img={img}
                onDelete={handleDeleteImage}
              />
            ))}
          </Box>
        ) : (
          <Box
            textAlign="center"
            color="text.secondary"
            py={4}
            className="no-image-section"
          >
            <div>
              <Typography variant="body2">No images added yet.</Typography>
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: "pointer" }}
                onClick={handleModalOpen}
              >
                Add image
              </Typography>
            </div>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Grid container className="bottom-container">
          <Grid item className="flex-center">
            <Grid item>
              <Typography className="main-title">Display popup to:</Typography>
            </Grid>
            <Grid item sx={{ display: "flex", alignItems: "center" }}>
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
              <Checkbox
                checked={selectAllHosp}
                onChange={handleSelectAllHosp}
                label="Select All Clinics"
              />
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: "pointer", textWrap: "nowrap" }}
                onClick={() => {
                  setSelectAllHosp(true);
                }}
              >
                Select All Clinics
              </Typography>
            </Grid>
          </Grid>
          <Box>
            <Button
              className={"button-primary"}
              disabled={status == "Edit" ? false : true}
              variant="contained"
              onClick={updateClinicData}
              sx={{
                borderRadius: "4px",
              }}
            >
              Publish
            </Button>
          </Box>
        </Grid>
      </Card>

      {/* Add Image Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleModalClose}
        className="dialog-box-main"
      >
        <Box
          sx={{
            display: "flex",
            textAlign: "center",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <DialogTitle sx={{ fontWeight: "bold", textAlign: "left" }}>
            Add Image
          </DialogTitle>
          <CloseOutlined sx={{ mr: 2 }} onClick={handleModalClose} />
        </Box>

        <DialogContent>
          <Box
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            sx={{
              border: "2px dashed #cccccc",
              borderRadius: "8px",
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              padding: "20px",
              backgroundColor: "#f9f9f9",
              marginBottom: "16px",
              height: "72%",
            }}
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                style={{
                  maxHeight: "80%",
                  maxWidth: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <>
                {" "}
                <Typography variant="body3" color="textSecondary">
                  Choose your image or
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ cursor: "pointer" }}
                >
                  Drag & Drop here
                </Typography>
              </>
            )}
            <Button
              variant="text"
              component="label"
              sx={{
                display: "block",
                marginTop: "8px",
                textTransform: "none",
                fontSize: "0.9rem",
              }}
            >
              Browse Files
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {image && (
              <Typography sx={{ marginTop: "8px" }}>{image.name}</Typography>
            )}
          </Box>
          <TextField
            placeholder="Enter text for this image (Optional)"
            fullWidth
            variant="outlined"
            value={imageText}
            onChange={(e) => setImageText(e.target.value)}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-end", mr: 2, mb: 1 }}>
          <Button
            onClick={handleModalClose}
            variant="outlined"
            sx={{ textTransform: "none", width: "100px", borderRadius: "6px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImageUpload}
            variant="contained"
            sx={{ textTransform: "none", width: "100px", borderRadius: "6px" }}
            disabled={!image}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
}
