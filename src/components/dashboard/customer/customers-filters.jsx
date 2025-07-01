'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Import DatePicker from MUI X

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

export function CustomersFilters() {
  const [plan, setPlan] = React.useState('');
  const [date, setDate] = React.useState(null);

  const handlePlanChange = (event) => {
    setPlan(event.target.value);
  };

  return (
    <Card sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* Clinics Title */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginRight: '2rem' }}>
        Clinics
      </Typography>

      {/* Search Input */}
      <OutlinedInput
        defaultValue=""
        placeholder="Search by Clinic Name"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ flexGrow: 1, marginRight: 2 }} // Allow search input to grow
      />

      {/* Options Container */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Filter by Plan */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Plan</InputLabel>
          <Select value={plan} onChange={handlePlanChange} label="Filter by Plan">
            <MenuItem value="Basic">Basic Plan</MenuItem>
            <MenuItem value="Premium">Premium Plan</MenuItem>
            <MenuItem value="Enterprise">Enterprise Plan</MenuItem>
          </Select>
        </FormControl>

        {/* Filter by Date (Date Picker) */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Filter by Date"
            value={date}
            onChange={(newDate) => {
              setDate(newDate);
            }}
            renderInput={(params) => <OutlinedInput {...params} />}
          />
        </LocalizationProvider>
      </Box>
    </Card>
  );
}
