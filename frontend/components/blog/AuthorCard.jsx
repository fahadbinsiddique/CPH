export default function AuthorCard({ author }) {
  if (!author) return null;
  const initials = (author.full_name || 'A')
    .split(' ')
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="mt-10 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-lg font-bold text-white">
        {initials}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Written by</p>
        <p className="truncate font-bold text-slate-800">{author.full_name}</p>
        <p className="text-sm text-slate-400">
          {author.role === 'admin' ? 'Team Member' : 'Author'}
        </p>
      </div>
    </div>
  );
}
