'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { containerVariants, itemVariants } from '@/lib/motion';
import { ACCENTS } from '../slideDefs';
import LiveDemoButton from '../LiveDemoButton';

export function SlideBody({ children, className }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={cn('w-full', className)}
    >
      {children}
    </motion.div>
  );
}

export function Item({ children, className }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

export function SlideHeader({ slide }) {
  const accent = ACCENTS[slide.accent] || ACCENTS.teal;
  const Icon = slide.icon;
  return (
    <motion.div variants={itemVariants} className="mb-8 md:mb-10">
      <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-200/70 bg-teal-50/80 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-teal-700">
        <Icon className="h-3.5 w-3.5" />
        {String(slide.index).padStart(2, '0')} · {slide.section}
      </span>
      <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl xl:text-[2.75rem] xl:leading-[1.1]">
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-600 md:text-lg">
          {slide.subtitle}
        </p>
      )}
    </motion.div>
  );
}

export function FeatureCard({ icon: Icon, title, desc, accent = 'teal', className, children, index }) {
  const a = ACCENTS[accent] || ACCENTS.teal;
  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-card',
        className
      )}
    >
      <span className={cn(
        'absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r transition-transform duration-700 group-hover:scale-x-100',
        a.grad
      )} />
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', a.chip)}>
          <Icon className="h-5 w-5" />
        </span>
        {index != null && (
          <span className="text-[11px] font-bold tabular-nums text-slate-300">{index}</span>
        )}
      </div>
      <h3 className="text-base font-bold leading-snug text-slate-900">{title}</h3>
      {desc && <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{desc}</p>}
      {children && <div className="mt-auto pt-3">{children}</div>}
    </motion.div>
  );
}

export function Pill({ children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600',
        className
      )}
    >
      {children}
    </span>
  );
}

export function StepFlow({ steps, accent = 'teal' }) {
  const a = ACCENTS[accent] || ACCENTS.teal;
  return (
    <motion.div variants={itemVariants} className="flex w-full items-stretch gap-2 sm:gap-3">
      {steps.map((step, i) => (
        <div key={step.label} className="flex flex-1 items-center gap-2 sm:gap-3">
          <div className="flex min-w-0 flex-1 flex-col items-center rounded-2xl border border-slate-200/70 bg-white/80 p-3 text-center shadow-sm sm:p-4">
            <span className={cn('mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-sm', a.grad)}>
              <step.icon className="h-4 w-4" />
            </span>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{step.label}</p>
          </div>
          {i < steps.length - 1 && (
            <ArrowRight className="h-4 w-4 shrink-0 text-teal-400" aria-hidden="true" />
          )}
        </div>
      ))}
    </motion.div>
  );
}

export function SectionCaption({ children, className }) {
  return (
    <motion.p
      variants={itemVariants}
      className={cn('text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400', className)}
    >
      {children}
    </motion.p>
  );
}

export function DemoBar({ children, className }) {
  return (
    <motion.div
      variants={itemVariants}
      className={cn('mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-teal-200/60 bg-teal-50/50 p-4', className)}
    >
      <span className="text-sm font-semibold text-teal-800">Try it live:</span>
      <div className="flex flex-wrap gap-2.5">{children}</div>
    </motion.div>
  );
}

export function DemoLink({ href, label, variant = 'primary', icon: Icon }) {
  return <LiveDemoButton href={href} label={label} variant={variant} icon={Icon} />;
}

export function NumberBadge({ children, accent = 'teal' }) {
  const a = ACCENTS[accent] || ACCENTS.teal;
  return (
    <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white bg-gradient-to-br', a.grad)}>
      {children}
    </span>
  );
}

export function Card({ children, className }) {
  return (
    <motion.div
      variants={itemVariants}
      className={cn('rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm', className)}
    >
      {children}
    </motion.div>
  );
}