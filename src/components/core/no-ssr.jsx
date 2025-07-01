'use client';

import React, { useEffect, useState } from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';

// A simplified NoSsr component without prop-types
export function NoSsr({ children, defer = false, fallback = null }) {
  const [mountedState, setMountedState] = useState(false);

  useEnhancedEffect(() => {
    if (!defer) {
      setMountedState(true);
    }
  }, [defer]);

  useEffect(() => {
    if (defer) {
      setMountedState(true);
    }
  }, [defer]);

  return <>{mountedState ? children : fallback}</>;
}
