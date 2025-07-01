"use client";

import React, { useEffect, useState } from "react";
import {
  Add,
  Cancel,
  Delete,
  ExpandLess,
  ExpandMore,
  Save,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  fetchIntraOralList,
  updateIntraOralList,
} from "../../../lib/api/intraOralApi";
import "../../../styles/intraOralStyle.css";

const ITEM_TYPE = "row";

function DraggableRow({
  index,
  item,
  onMoveRow,
  onEdit,
  onDelete,
  expandedRows,
  toggleRowExpansion,
  onAddRow,
}) {
  const [{ isDragging }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        onMoveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <TableRow
      ref={(node) => dragRef(dropRef(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>
      <TableCell>
        <Select
          value={item.type}
          onChange={(e) => onEdit(index, "type", e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
        >
          {/* Options for the Type dropdown */}
          <MenuItem value="h1_header">H1 Header</MenuItem>
          <MenuItem value="h2_header">H2 Header</MenuItem>
          <MenuItem value="h3_header">H3 Header</MenuItem>
          <MenuItem value="h4_header">H4 Header</MenuItem>
          <MenuItem value="h5_header">H5 Header</MenuItem>
          <MenuItem value="divider">Divider</MenuItem>
          <MenuItem value="input_text">Input Text</MenuItem>
          <MenuItem value="input_boolean">Input Boolean</MenuItem>
          <MenuItem value="input_switch">Input Switch</MenuItem>
          <MenuItem value="input_checkbox">Input Checkbox</MenuItem>
          <MenuItem value="input_number">Input Number</MenuItem>
          <MenuItem value="input_textarea">Input Textarea</MenuItem>
          <MenuItem value="input_textareafull">
            Input Textarea Full Width
          </MenuItem>
          <MenuItem value="input_fourquadrant_box">
            Input Fourquadrant Box
          </MenuItem>
        </Select>
      </TableCell>
      <TableCell>
        <TextField
          value={item.label}
          onChange={(e) => onEdit(index, "label", e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
        />
      </TableCell>
      <TableCell className="action-row">
        <Button
          className="row-action-button"
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={() => onDelete(index)}
        >
          Delete
        </Button>
        <Button
          className="row-action-button"
          variant="outlined"
          startIcon={<Add />}
          onClick={() => onAddRow(index, "newRow", true)}
        >
          Add Row
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function ClinicDetailIntraOral() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLoading, setEditingLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true); // Start loading
      try {
        const resData = await fetchIntraOralList();
        let type = resData?.data?.type || "PreScreening";
        localStorage.setItem("simpld-customer-type", type);
        setData(resData.data?.data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // End loading
      }
    };

    loadData();
  }, []);

  const handleEdit = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const handleAddRow = (index) => {
    const newRow = { type: "", label: "" };
    const newData = [...data];
    newData.splice(index + 1, 0, newRow);
    setData(newData);
  };

  const handleDeleteRow = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  const moveRow = (fromIndex, toIndex) => {
    const newData = [...data];
    const [movedRow] = newData.splice(fromIndex, 1);
    newData.splice(toIndex, 0, movedRow);
    setData(newData);
  };

  const toggleRowExpansion = (index) => {
    setExpandedRows((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleSave = async () => {
    try {
      await updateIntraOralList(data);
      alert("Data saved successfully");
      setIsEditMode(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleEditMode = async () => {
    if (!isEditMode) {
      // Entering edit mode
      setEditingLoading(true);
      // Simulate data loading or perform any necessary fetch
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Example: Simulate delay
      setEditingLoading(false);
    }
    setIsEditMode(!isEditMode);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="intra-oral-main">
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
        ) : editingLoading ? (
          // Edit Mode Loader
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
            }}
          >
            <CircularProgress />
            <p>Loading edit data...</p>
          </div>
        ) : (
          // Table component
          <>
            {!isEditMode ? (
              <>
                <TableContainer
                  component={Paper}
                  className="table-main"
                  style={{ maxHeight: 500, overflowY: "auto" }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: "6%" }}>SL No</TableCell>
                        <TableCell style={{ width: "45%" }}>Type</TableCell>
                        <TableCell style={{ width: "45%" }}>Label</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((item, index) => (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>
                              {String(index + 1).padStart(2, "0")}
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={item.type}
                                fullWidth
                                variant="outlined"
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <div
                                style={{ position: "relative", width: "100%" }}
                              >
                                <TextField
                                  value={item.label}
                                  fullWidth
                                  variant="outlined"
                                  size="small"
                                  InputProps={{
                                    endAdornment: (
                                      <IconButton
                                        onClick={() =>
                                          toggleRowExpansion(index)
                                        }
                                        size="small"
                                        edge="end"
                                        style={{ padding: 0 }}
                                      >
                                        {item.value ? (
                                          expandedRows[index] ? (
                                            <ExpandLess />
                                          ) : (
                                            <ExpandMore />
                                          )
                                        ) : (
                                          ""
                                        )}
                                      </IconButton>
                                    ),
                                  }}
                                />
                                {item.value ? (
                                  <Collapse
                                    in={expandedRows[index]}
                                    timeout="auto"
                                    unmountOnExit
                                  >
                                    <div
                                      style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        right: 0,
                                        backgroundColor: "#ccc",
                                        border: "1px solid #ccc",
                                        zIndex: 999,
                                        maxHeight: "150px",
                                        overflowY: "auto",
                                        padding: "10px",
                                      }}
                                    >
                                      {Object.entries(item.value).map(
                                        ([key, value]) => (
                                          <div key={key}>
                                            <strong>{key}:</strong>{" "}
                                            {value || "-"}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </Collapse>
                                ) : null}
                              </div>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "right",
                    padding: "10px",
                  }}
                >
                  <Button
                    className="edit-button"
                    onClick={toggleEditMode}
                    variant="contained"
                    color="primary"
                  >
                    Edit
                  </Button>
                </div>
              </>
            ) : (
              // Editable Table View
              <>
                <TableContainer
                  component={Paper}
                  className="table-main"
                  style={{ maxHeight: 500, overflowY: "auto" }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: "6%" }}>SL No</TableCell>
                        <TableCell style={{ width: "38%" }}>Type</TableCell>
                        <TableCell style={{ width: "39%" }}>Label</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((item, index) => (
                        <DraggableRow
                          key={index}
                          index={index}
                          item={item}
                          onMoveRow={moveRow}
                          onEdit={handleEdit}
                          onDelete={handleDeleteRow}
                          onAddRow={handleAddRow}
                          expandedRows={expandedRows}
                          toggleRowExpansion={toggleRowExpansion}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "right",
                    padding: "10px",
                  }}
                >
                  <Button
                    className="save-button"
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    style={{ marginRight: "10px" }}
                  >
                    Save
                  </Button>
                </div>
              </>
            )}
          </>
        )}
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
        )}
      </div>
    </DndProvider>
  );
}
