'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // কেউ সরাসরি এই লিংকে ঢুকলে তাকে হোমপেজে পাঠিয়ে দিন
    // এবং কুয়েরি প্যারামিটার হিসেবে ?login=true পাস করুন
    router.push('/?login=true');
  }, [router]);

  return null;
}