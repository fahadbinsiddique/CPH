'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, ImagePlus, Loader2 } from 'lucide-react';
import { parseImageSrc } from '@/lib/blog-utils';

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

function validateFile(file) {
  if (!file) return 'Please choose an image file.';
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Unsupported format. Please use JPG, PNG, WEBP, GIF or AVIF.';
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `Image is too large. Maximum size is ${MAX_SIZE_MB}MB.`;
  }
  return null;
}

export default function ImageUploader({
  value,
  currentUrl,
  onChange,
  uploading = false,
  label = 'Cover image',
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const existingUrl = parseImageSrc(currentUrl);

  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file) return;
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  const handleRemove = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    onChange(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const shownPreview = preview || existingUrl;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-xs text-slate-400">JPG, PNG, WEBP · max {MAX_SIZE_MB}MB</span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!uploading) handleFiles(e.dataTransfer.files);
        }}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all ${
          dragOver
            ? 'border-teal-500 bg-teal-50/60'
            : 'border-slate-200 bg-slate-50/60 hover:border-teal-300'
        }`}
      >
        {shownPreview && !uploading ? (
          <div className="relative h-56 w-full">
            <Image
              src={shownPreview}
              alt="Cover preview"
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
              >
                <ImagePlus className="h-3.5 w-3.5" /> Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-rose-500/90 px-3 py-2 text-xs font-semibold text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-rose-600"
              >
                <X className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-48 w-full cursor-pointer flex-col items-center justify-center gap-3 px-6 text-center"
          >
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                <span className="text-sm font-medium text-slate-500">Uploading image...</span>
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                  <UploadCloud className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Drag & drop an image here, or <span className="text-teal-600">browse</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-400">Click or drop to upload your cover image</p>
                </div>
              </>
            )}
          </button>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
