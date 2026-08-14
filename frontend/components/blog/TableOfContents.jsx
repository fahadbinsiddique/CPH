'use client';

import { ListTree } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TableOfContents({ headings, className }) {
  if (!headings || headings.length < 2) return null;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav aria-label="Table of contents" className={cn('rounded-2xl border border-slate-100 bg-slate-50/70 p-5', className)}>
      <p className="flex items-center gap-2 text-sm font-bold text-slate-800">
        <ListTree className="h-4 w-4 text-teal-600" />
        On this page
      </p>
      <ul className="mt-3 space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <button
              type="button"
              onClick={() => scrollTo(heading.id)}
              className={cn(
                'text-left text-sm text-slate-500 transition-colors hover:text-teal-700',
                heading.level === 3 && 'pl-4'
              )}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
