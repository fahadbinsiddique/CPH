'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export const TOUR_RETURN_KEY = 'cph-tour-return';
const TOUR_PATH = '/dashboard/product-tour';

export default function ProductTourReturn() {
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!pathname.startsWith(TOUR_PATH) && sessionStorage.getItem(TOUR_RETURN_KEY) === '1') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [pathname]);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => {
        sessionStorage.removeItem(TOUR_RETURN_KEY);
        router.push(TOUR_PATH);
      }}
      aria-label="Back to product tour"
      className="fixed bottom-5 right-5 z-[70] inline-flex cursor-pointer items-center gap-2 rounded-full border border-teal-300/60 bg-gradient-to-r from-teal-600 to-emerald-600 py-2.5 pl-3 pr-4 text-sm font-semibold text-white shadow-xl shadow-teal-900/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Product Tour
    </button>
  );
}