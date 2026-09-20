'use client';

import { useRef, useEffect } from 'react';
import useAuthStore from '@/store/authStore';

export default function StoreInitializer({ user }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !user) return;
    initialized.current = true;
    useAuthStore.setState({ user, isAuthenticated: true });
  }, [user]);

  return null;
}
