'use client';

import * as React from 'react';
import { Stack } from '@mui/system';

import ClinicDetailsHeader from '../../../components/dashboard/clinicDetails/clinic-details-header';
import { config } from '../../../config';

export default function Page() {
  React.useEffect(() => {
    document.title = `Clinic Details | Dashboard  | ${config.site.name}`;
  }, []);
  return (
    <Stack className="customer_main">
      <ClinicDetailsHeader />
    </Stack>
  );
}
