'use client';

import * as React from 'react';

import { PopUpNotification } from '../../../components/dashboard/popUpNotification/popUpNotification-card';
import { config } from '../../../config';

export default function Page() {
  React.useEffect(() => {
    document.title = `Pop-up Notification | Dashboard | ${config.site.name}`;
  }, []);
  return (
    <div className="popUPMain">
      <PopUpNotification />
    </div>
  );
}
