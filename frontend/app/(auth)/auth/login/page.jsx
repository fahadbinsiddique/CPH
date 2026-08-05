'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect direct visits to the login route back to the home page.
    router.replace('/');
  }, [router]);

  return null;
}