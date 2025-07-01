'use client';

import * as React from 'react';

import { GuestGuard } from '../../../components/auth/guest-guard';
import { Layout } from '../../../components/auth/layout';
import { ResetPasswordConfirm } from '../../../components/auth/reset-password-confirm';
import { config } from '../../../config';

export default function Page() {
  React.useEffect(() => {
    document.title = `Confirm reset password | Auth | ${config.site.name}`;
  }, []);
  return (
    <Layout>
      <GuestGuard>
        <ResetPasswordConfirm />
      </GuestGuard>
    </Layout>
  );
}
