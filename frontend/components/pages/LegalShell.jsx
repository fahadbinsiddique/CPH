// Shared shell for the three legal documents (privacy / terms / cookies).
// Server component on purpose: static copy that streams without client JS.
// Rendered by app/(public)/privacy|terms|cookies/page.jsx, which own metadata.

export function LegalSection({ title, children }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-heading text-xl font-semibold text-foreground">
        {title}
      </h2>
      <div className="prose prose-stone mt-3 max-w-none text-[15px] leading-relaxed prose-headings:font-heading prose-headings:text-foreground prose-p:text-stone-600 prose-li:text-stone-600 prose-a:text-violet-600 hover:prose-a:text-violet-700 prose-strong:text-stone-800 marker:text-violet-400">
        {children}
      </div>
    </section>
  )
}

export default function LegalShell({ title, updated, children }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50/40 via-white to-white font-sans">
      <div className="mx-auto w-full max-w-3xl px-6 pt-32 pb-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-600">
          Legal
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {updated}
        </p>
        <div
          className="mt-8 h-px bg-gradient-to-r from-violet-200/60 via-border to-transparent"
          aria-hidden="true"
        />
        <div className="mt-8">{children}</div>
      </div>
    </main>
  )
}
