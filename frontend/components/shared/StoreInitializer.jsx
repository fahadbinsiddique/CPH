'use client';

import { useRef } from 'react';
import useAuthStore from '@/store/authStore';

export default function StoreInitializer({ user }) {
  const initialized = useRef(false);

  if (!initialized.current) {
    if (user) {
      useAuthStore.setState({ user, isAuthenticated: true });
    }
    initialized.current = true;
  }

  return null;
}
