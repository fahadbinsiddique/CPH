'use client';

import { useState } from 'react';
import { Link2, Check } from 'lucide-react';
import { FiTwitter, FiFacebook, FiLinkedin } from 'react-icons/fi';
import { toast } from 'sonner';

const SHARE_TARGETS = [
  {
    key: 'twitter',
    label: 'Share on X',
    icon: FiTwitter,
    color: 'hover:bg-slate-900 hover:text-white',
    href: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    key: 'facebook',
    label: 'Share on Facebook',
    icon: FiFacebook,
    color: 'hover:bg-blue-600 hover:text-white',
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    key: 'linkedin',
    label: 'Share on LinkedIn',
    icon: FiLinkedin,
    color: 'hover:bg-sky-700 hover:text-white',
    href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
];

export default function ShareButtons({ title }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy the link');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy article link"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-600"
      >
        {copied ? <Check className="h-4 w-4 text-teal-600" /> : <Link2 className="h-4 w-4" />}
      </button>
      {SHARE_TARGETS.map(({ key, label, icon: Icon, color, href }) => (
        <a
          key={key}
          href={href(url, title)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all ${color}`}
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
