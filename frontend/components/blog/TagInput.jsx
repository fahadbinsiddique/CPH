'use client';

import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TagInput({
  allTags = [],
  value = [],
  onChange,
  onCreateTag,
  max = 10,
  placeholder = 'Type a tag and press Enter...',
}) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [creating, setCreating] = useState(false);
  const inputRef = useRef(null);

  const selectedIds = useMemo(() => new Set(value.map((t) => t.id)), [value]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allTags.filter(
      (t) => !selectedIds.has(t.id) && (!q || t.name.toLowerCase().includes(q))
    );
  }, [allTags, selectedIds, query]);

  const canAddMore = value.length < max;

  const addTag = (tag) => {
    if (!canAddMore) {
      toast.error(`You can add up to ${max} tags.`);
      return;
    }
    if (selectedIds.has(tag.id)) return;
    onChange([...value, tag]);
    setQuery('');
    inputRef.current?.focus();
  };

  const removeTag = (id) => {
    onChange(value.filter((t) => t.id !== id));
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const q = query.trim();
      if (!q) return;

      const existing = suggestions.find((t) => t.name.toLowerCase() === q.toLowerCase());
      if (existing) {
        addTag(existing);
        return;
      }

      if (!canAddMore) {
        toast.error(`You can add up to ${max} tags.`);
        return;
      }

      // Create a brand-new tag via the admin endpoint.
      if (onCreateTag) {
        setCreating(true);
        try {
          const created = await onCreateTag(q);
          addTag(created);
        } catch {
          toast.error('Could not create that tag.');
        } finally {
          setCreating(false);
        }
      } else {
        toast.error('Tag creation is not available.');
      }
    } else if (e.key === 'Backspace' && !query && value.length > 0) {
      removeTag(value[value.length - 1].id);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <div
          className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-teal-500 focus-within:ring-3 focus-within:ring-teal-500/20"
          onClick={() => inputRef.current?.focus()}
        >
          <AnimatePresence initial={false}>
            {value.map((tag) => (
              <motion.span
                key={tag.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700"
              >
                #{tag.name}
                <button
                  type="button"
                  aria-label={`Remove tag ${tag.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag.id);
                  }}
                  className="text-teal-400 transition-colors hover:text-rose-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder={value.length === 0 ? placeholder : ''}
            disabled={creating}
            className="h-7 min-w-24 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-50"
          />
          {creating && <Loader2 className="h-4 w-4 animate-spin text-teal-600" />}
        </div>

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl"
            >
              {suggestions.map((tag) => (
                <li key={tag.id}>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addTag(tag);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-700"
                  >
                    <Plus className="h-3.5 w-3.5 text-teal-500" />
                    {tag.name}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {value.length > 0 && (
        <p className="text-xs text-slate-400">
          {value.length} of {max} tags selected
        </p>
      )}
    </div>
  );
}
