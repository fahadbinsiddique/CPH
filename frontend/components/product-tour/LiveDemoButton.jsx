'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const TOUR_RETURN_KEY = 'cph-tour-return';

const variants = {
  primary:
    'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-600/20 hover:from-teal-700 hover:to-emerald-700',
  outline:
    'border border-teal-300 bg-white text-teal-700 hover:bg-teal-50',
  ghost: 'text-teal-700 hover:bg-teal-50 hover:text-teal-800',
};

export default function LiveDemoButton({
  href,
  label = 'View Live',
  variant = 'primary',
  icon: Icon,
  className,
  onClick,
  size = 'md',
}) {
  const handleClick = () => {
    if (typeof window !== 'undefined') sessionStorage.setItem(TOUR_RETURN_KEY, '1');
    onClick?.();
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        'group inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2',
        size === 'sm' ? 'px-3.5 py-2 text-xs' : 'px-5 py-2.5',
        variants[variant],
        className
      )}
    >
      {Icon && <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />}
      {label}
      <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}