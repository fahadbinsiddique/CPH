'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import EditorToolbar from './EditorToolbar';

export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Write your article content here...',
  uploadImage,
  minHeight = 380,
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      TextAlign.configure({ types: ['heading', 'paragraph', 'blockquote'] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate: ({ editor: current }) => {
      onChange?.(current.getHTML());
    },
  });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-teal-500 focus-within:ring-3 focus-within:ring-teal-500/20">
      <EditorToolbar editor={editor} onUploadImage={uploadImage} />
      <EditorContent
        editor={editor}
        style={{ minHeight }}
        className="cph-editor prose prose-slate max-w-none px-5 py-4 prose-headings:font-semibold prose-headings:text-slate-900 prose-a:text-teal-600 prose-img:rounded-xl"
      />
    </div>
  );
}
