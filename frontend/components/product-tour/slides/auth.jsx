'use client';

import { UserPlus, LogIn, ShieldCheck, KeyRound, Fingerprint } from 'lucide-react';
import { SlideBody, SlideHeader, Item, StepFlow, DemoBar, DemoLink } from './ui';

const flow = [
  { icon: UserPlus, label: 'Create Account' },
  { icon: LogIn, label: 'Sign In Securely' },
  { icon: ShieldCheck, label: 'Verified Session' },
  { icon: KeyRound, label: 'Role-Based Access' },
];

export default function Auth({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <StepFlow steps={flow} accent="indigo" />
          <Item className="mt-6 space-y-3">
            <p className="text-sm leading-relaxed text-stone-600">
              CPH protects accounts with <span className="font-semibold text-slate-900">secure, persistent authentication</span>.
              Sessions are kept safe with modern, industry-standard techniques, and protected areas are
              only shown to the right people.
            </p>
            <ul className="space-y-2">
              {[
                'One-tap sign-in with Google where available',
                'Session based on secure HTTP-only credentials',
                'Each role sees only its own workspace and data',
              ].map((pt) => (
                <li key={pt} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  {pt}
                </li>
              ))}
            </ul>
          </Item>
        </div>

        <Item>
          <div className="flex h-full flex-col justify-center rounded-3xl border border-indigo-200/60 bg-gradient-to-b from-indigo-50/70 to-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100">
              <Fingerprint className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Why this matters for the client</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-500">
              Mental health is deeply personal. Clients should feel confident that their journey,
              their assessments and their appointments belong to them and stay private.
            </p>
          </div>
        </Item>
      </div>

      <DemoBar>
        <DemoLink href="/" label="Explore the Sign-In Flow" variant="outline" icon={LogIn} />
      </DemoBar>
    </SlideBody>
  );
}