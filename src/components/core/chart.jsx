import React, { Suspense } from 'react';
import { styled } from '@mui/material/styles';

const ApexChart = React.lazy(() => import('react-apexcharts'));

const StyledApexChart = styled(ApexChart)``;

export function Chart(props) {
  return (
    <Suspense fallback={null}>
      <StyledApexChart {...props} />
    </Suspense>
  );
}
