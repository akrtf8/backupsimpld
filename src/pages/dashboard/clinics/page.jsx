'use client';

import React from 'react';
import Stack from '@mui/material/Stack';

import { CustomersTable } from '../../../components/dashboard/clinics/clinics-table';

export default function Page(){
  return (
    <Stack spacing={3} className="customer_main">
      <CustomersTable />
    </Stack>
  );
}
