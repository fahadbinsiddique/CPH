'use client';

import { useRef, useState } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, Code,
  Heading1, Heading2, Heading3, List, ListOrdered,
  Quote, Code2, Minus, Link2, Unlink, AlignLeft,
  AlignCenter, AlignRight, ImagePlus, Loader2,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ToolbarButton = ({ active, disabled, onClick, label, children, className }) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    aria-pressed={active}
    disabled={disabled}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className={cn(
      'flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-lg px-1.5 text-slate-500 transition-colors',
      'hover:bg-slate-100 hover:text-slate-800',
      active && 'bg-teal-100 text-teal-700',
      disabled && 'pointer-events-none opacity-40',
      className
    )}
  >
    {children}
  </button>
);

const Divider = () => <span className="mx-1 hidden h-5 w-px bg-slate-200 sm:block" />;

export default function EditorToolbar({ editor, onUploadImage }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [moreOpen, setMoreOpen] = useState(false);

  if (!editor) return null;

  const toggleLink = () => {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      setLinkOpen(false);
      return;
    }
    setLinkUrl(editor.getAttributes('link').href || '');
    setLinkOpen(true);
  };

  const applyLink = () => {
    const url = linkUrl.trim();
    if (!url) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
    setLinkOpen(false);
  };

  const handleImagePick = async (file) => {
    if (!file || !onUploadImage) return;
    setUploading(true);
    try {
      const url = await onUploadImage(file);
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="relative border-b border-slate-200 bg-slate-50/70 px-2 py-1.5">
      {/* Desktop: full toolbar */}
      <div className="hidden flex-wrap items-center gap-0.5 sm:flex">
        <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} label="Bold">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} label="Italic">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} label="Underline">
          <Underline className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} label="Strikethrough">
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} label="Inline code">
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} label="Heading 1">
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} label="Heading 2">
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} label="Heading 3">
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} label="Bullet list">
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} label="Numbered list">
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} label="Blockquote">
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()} label="Code block">
          <Code2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} label="Horizontal divider">
          <Minus className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} label="Align left">
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} label="Align center">
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} label="Align right">
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton active={editor.isActive('link')} onClick={toggleLink} label="Insert or edit link">
          {editor.isActive('link') ? <Unlink className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        </ToolbarButton>
        <ToolbarButton active={false} disabled={!onUploadImage || uploading} onClick={() => fileRef.current?.click()} label="Insert image">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        </ToolbarButton>
      </div>

      {/* Mobile: essential tools + More menu */}
      <div className="flex flex-wrap items-center gap-0.5 sm:hidden">
        <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} label="Bold">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} label="Italic">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} label="Underline">
          <Underline className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} label="Heading 1">
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} label="Heading 2">
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} label="Bullet list">
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} label="Numbered list">
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton active={editor.isActive('link')} onClick={toggleLink} label="Insert or edit link">
          {editor.isActive('link') ? <Unlink className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        </ToolbarButton>
        <ToolbarButton active={false} disabled={!onUploadImage || uploading} onClick={() => fileRef.current?.click()} label="Insert image">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        </ToolbarButton>

        {/* More menu for secondary tools */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMoreOpen(!moreOpen)}
            className={cn(
              'flex h-8 cursor-pointer items-center gap-0.5 rounded-lg px-2 text-xs font-medium text-slate-500 transition-colors',
              'hover:bg-slate-100 hover:text-slate-800',
              moreOpen && 'bg-slate-100 text-slate-800'
            )}
          >
            More <ChevronDown className={cn('h-3 w-3 transition-transform', moreOpen && 'rotate-180')} />
          </button>
          {moreOpen && (
            <div className="absolute left-0 top-full z-40 mt-1 flex flex-wrap gap-0.5 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg">
              <ToolbarButton active={editor.isActive('strike')} onClick={() => { editor.chain().focus().toggleStrike().run(); setMoreOpen(false); }} label="Strikethrough">
                <Strikethrough className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton active={editor.isActive('code')} onClick={() => { editor.chain().focus().toggleCode().run(); setMoreOpen(false); }} label="Inline code">
                <Code className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton active={editor.isActive('heading', { level: 3 })} onClick={() => { editor.chain().focus().toggleHeading({ level: 3 }).run(); setMoreOpen(false); }} label="Heading 3">
                <Heading3 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton active={editor.isActive('blockquote')} onClick={() => { editor.chain().focus().toggleBlockquote().run(); setMoreOpen(false); }} label="Blockquote">
                <Quote className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton active={editor.isActive('codeBlock')} onClick={() => { editor.chain().focus().toggleCodeBlock().run(); setMoreOpen(false); }} label="Code block">
                <Code2 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => { editor.chain().focus().setHorizontalRule().run(); setMoreOpen(false); }} label="Horizontal divider">
                <Minus className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton active={editor.isActive({ textAlign: 'left' })} onClick={() => { editor.chain().focus().setTextAlign('left').run(); setMoreOpen(false); }} label="Align left">
                <AlignLeft className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton active={editor.isActive({ textAlign: 'center' })} onClick={() => { editor.chain().focus().setTextAlign('center').run(); setMoreOpen(false); }} label="Align center">
                <AlignCenter className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton active={editor.isActive({ textAlign: 'right' })} onClick={() => { editor.chain().focus().setTextAlign('right').run(); setMoreOpen(false); }} label="Align right">
                <AlignRight className="h-4 w-4" />
              </ToolbarButton>
            </div>
          )}
        </div>
      </div>

      {/* Link popover */}
      {linkOpen && (
        <div className="absolute left-0 right-0 top-full z-30 flex items-center gap-2 border border-slate-200 bg-white p-3 shadow-xl sm:left-auto sm:right-2 sm:w-96">
          <input
            autoFocus
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyLink();
              if (e.key === 'Escape') setLinkOpen(false);
            }}
            placeholder="https://example.com"
            className="h-9 flex-1 rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-500/20"
          />
          <button
            type="button"
            onClick={applyLink}
            className="cursor-pointer rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setLinkOpen(false)}
            className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => handleImagePick(e.target.files?.[0])}
      />
    </div>
  );
}
