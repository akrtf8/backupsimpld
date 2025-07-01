'use client';

import * as React from 'react';

import { GuestGuard } from '../../../components/auth/guest-guard';
import { Layout } from '../../../components/auth/layout';
import { SignUpForm } from '../../../components/auth/sign-up-form';
import { config } from '../../../config';

export default function Page() {
  React.useEffect(() => {
    document.title = `Sign up | Auth | ${config.site.name}`;
  }, []);
  return (
    <Layout>
      <GuestGuard>
        <SignUpForm />
      </GuestGuard>
    </Layout>
  );
}
