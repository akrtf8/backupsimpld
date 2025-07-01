'use client';

import * as React from 'react';

import { GuestGuard } from '../../../components/auth/guest-guard';
import { Layout } from '../../../components/auth/layout';
import { ResetPasswordForm } from '../../../components/auth/reset-password-form';
import { config } from '../../../config';

export default function Page() {
  React.useEffect(() => {
    document.title = `Reset password | Auth | ${config.site.name}`;
  }, []);
  return (
    <Layout>
      <GuestGuard>
        <ResetPasswordForm />
      </GuestGuard>
    </Layout>
  );
}
