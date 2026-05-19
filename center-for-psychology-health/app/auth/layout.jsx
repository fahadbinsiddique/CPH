
export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* বাম পাশ: ব্র্যান্ডিং এবং শান্ত ভিজ্যুয়াল (বড় স্ক্রিনের জন্য) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-slate-900/90 z-0" />
        
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight">Center for Psychology</h1>
        </div>

        <div className="relative z-10 space-y-4">
          <blockquote className="text-lg italic text-slate-300">
            Your mental health is a priority. Your happiness is an essential. Your self-care is a necessity.
          </blockquote>
          <p className="text-sm text-slate-400">— Take the first step towards healing with our certified consultants.</p>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © 2026 Center for Psychology. All rights reserved.
        </div>
      </div>

      {/* ডান পাশ: মূল ফর্ম (লগইন বা রেজিস্টার পেজ এখানে রেন্ডার হবে) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          {children}
        </div>
      </div>
    </div>
  );
}