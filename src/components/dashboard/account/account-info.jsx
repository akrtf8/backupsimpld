import * as React from 'react';
import { CardHeader } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

const user = {
  name: 'Simpld admin',
  avatar: '/assets/avatar.png',
  jobTitle: 'Senior Developer',
  country: 'India',
  city: 'Tamilnadu',
  timezone: 'GTM-5',
};

const states = [
  { value: 'alabama', label: 'Alabama' },
  { value: 'new-york', label: 'New York' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'los-angeles', label: 'Los Angeles' },
];

export function AccountInfo() {
  return (
    <>
      <Card>
        <CardContent>
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <div>
              <Avatar src={user.avatar} sx={{ height: '80px', width: '80px' }} />
            </div>
            <Stack spacing={1} sx={{ textAlign: 'center' }}>
              <Typography variant="h5">{user.name}</Typography>
              <Typography color="text.secondary" variant="body2">
                {user.city} {user.country}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {user.timezone}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions>
          <Button fullWidth variant="text">
            Upload picture
          </Button>
        </CardActions>
      </Card>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <Card>
          <CardHeader subheader="The information can be edited" title="Profile" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>First name</InputLabel>
                  <OutlinedInput defaultValue="Simpled" label="First name" name="firstName" />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Last name</InputLabel>
                  <OutlinedInput defaultValue="Admin" label="Last name" name="lastName" />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput defaultValue="admin@simpld.in" label="Email address" name="email" />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Phone number</InputLabel>
                  <OutlinedInput label="Phone number" name="phone" type="tel" />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select defaultValue="New York" label="State" name="state" variant="outlined">
                    {states.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>City</InputLabel>
                  <OutlinedInput label="City" />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button variant="contained">Save details</Button>
          </CardActions>
        </Card>
      </form>
    </>
  );
}
