'use client';

import { useState, useMemo } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/roles';

function hashStringToHue(str) {
  if (!str) return 200;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

const SIZE_CLASSES = {
  sm: 'h-8 w-8 text-xs',
  default: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
  '2xl': 'h-20 w-20 text-xl',
  '3xl': 'h-24 w-24 text-2xl',
};

const FALLBACK_SIZE_CLASSES = {
  sm: 'text-xs',
  default: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
  '2xl': 'text-xl',
  '3xl': 'text-2xl font-bold',
};

export default function UserAvatar({
  src,
  alt,
  name,
  title,
  size = 'default',
  className,
  fallbackClassName,
  ...props
}) {
  const [imgError, setImgError] = useState(false);

  const initials = useMemo(() => getInitials(name || title), [name, title]);

  const colorStyle = useMemo(() => {
    const hue = hashStringToHue(name || title || 'User');
    return {
      backgroundColor: `hsl(${hue}, 55%, 42%)`,
      color: 'white',
    };
  }, [name, title]);

  const showImage = src && !imgError;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.default;
  const fallbackSizeClass = FALLBACK_SIZE_CLASSES[size] || FALLBACK_SIZE_CLASSES.default;

  return (
    <Avatar
      className={cn(sizeClass, className)}
      {...props}
    >
      {showImage && (
        <AvatarImage
          src={src}
          alt={alt || name || title || 'User avatar'}
          onError={() => setImgError(true)}
        />
      )}
      <AvatarFallback
        style={colorStyle}
        className={cn(
          'select-none font-semibold',
          fallbackSizeClass,
          fallbackClassName,
        )}
        delayMs={showImage ? 600 : 0}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
