'use client';

import * as React from 'react';

import { GuestGuard } from '../../../components/auth/guest-guard';
import { Layout } from '../../../components/auth/layout';
import { SignInForm } from '../../../components/auth/sign-in-form';
import { config } from '../../../config';

function Page() {
  React.useEffect(() => {
    document.title = `Sign in | Auth | ${config.site.name}`;
  }, []);
  return (
    <Layout>
      <GuestGuard>
        <SignInForm />
      </GuestGuard>
    </Layout>
  );
}

export default Page;
