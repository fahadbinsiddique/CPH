'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import SlideControls from './SlideControls';
import SlideProgress from './SlideProgress';
import SlideNavigation from './SlideNavigation';
import SlideOverview from './SlideOverview';
import { SLIDES, ACCENTS } from './slideDefs';
import { TOUR_RETURN_KEY } from './ProductTourReturn';

const transition = { duration: 0.38, ease: [0.16, 1, 0.3, 1] };

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 64 : -64, scale: 0.992 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -64 : 64, scale: 0.992 }),
};

export default function ProductTour() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef(null);
  const scrollerRef = useRef(null);
  const indexRef = useRef(0);
  const total = SLIDES.length;

  const goTo = useCallback(
    (target, dir) => {
      const cur = indexRef.current;
      const t = Math.max(0, Math.min(total - 1, target));
      if (t === cur) return;
      setDirection(dir ?? (t > cur ? 1 : -1));
      indexRef.current = t;
      setIndex(t);
    },
    [total]
  );

  const next = useCallback(() => goTo(indexRef.current + 1, 1), [goTo]);
  const prev = useCallback(() => goTo(indexRef.current - 1, -1), [goTo]);

  const toggleFullscreen = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      return;
    }
    const req =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;
    if (req) req.call(el).catch(() => {});
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
  }, []);

  const exitTour = useCallback(() => {
    sessionStorage.removeItem(TOUR_RETURN_KEY);
    if (document.fullscreenElement) exitFullscreen();
    router.push('/dashboard');
  }, [router, exitFullscreen]);

  const keyHandlersRef = useRef({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    keyHandlersRef.current = {
      goTo,
      toggleFullscreen,
      exitFullscreen,
      overviewOpen,
      setOverviewOpen,
      isFullscreen,
      indexRef,
      total: SLIDES.length,
    };
  });

  useEffect(() => {
    const onKey = (e) => {
      const h = keyHandlersRef.current;
      const t = e.target;
      const editable =
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.tagName === 'SELECT' ||
          t.isContentEditable);
      if (editable) return;
      if (e.key === ' ' && t && (t.tagName === 'BUTTON' || t.tagName === 'A')) return;

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          h.goTo(h.indexRef.current + 1, 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          h.goTo(h.indexRef.current - 1, -1);
          break;
        case 'Home':
          e.preventDefault();
          h.goTo(0, -1);
          break;
        case 'End':
          e.preventDefault();
          h.goTo(SLIDES.length - 1, 1);
          break;
        case 'Escape':
          if (h.overviewOpen) h.setOverviewOpen(false);
          else if (h.isFullscreen) h.exitFullscreen();
          break;
        case 'f':
        case 'F':
          h.toggleFullscreen();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 0 });
  }, [index]);

  const active = SLIDES[index];
  const accent = ACCENTS[active.accent] || ACCENTS.teal;

  return (
    <div
      ref={stageRef}
      className="fixed inset-0 z-[80] flex flex-col overflow-hidden bg-gradient-to-br from-stone-50 via-white to-orange-50/40"
    >
      {/* Decorative tonal background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className={`absolute -top-32 -left-28 h-96 w-96 rounded-full blur-3xl transition-colors duration-700 ${accent.blob}`} />
        <div className={`absolute -bottom-40 -right-24 h-[26rem] w-[26rem] rounded-full blur-3xl transition-colors duration-700 ${accent.blob}`} />
        <div className="absolute top-[20%] right-[30%] hidden h-64 w-64 rounded-full bg-accent-lavender/60 blur-3xl md:block" />
        <div className="absolute bottom-[12%] left-[8%] hidden h-56 w-56 rounded-full bg-accent-sky/50 blur-3xl lg:block" />
      </div>

      <SlideControls
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onOpenOverview={() => setOverviewOpen(true)}
        onExit={exitTour}
      />

      <main ref={scrollerRef} className="cph-scroll relative z-10 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center px-4 py-10 sm:px-8 sm:py-12">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="w-full"
            >
              <active.Content slide={active} onNext={next} onGoTo={goTo} total={total} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <SlideProgress index={index} total={total} accent={active.accent} />
      <SlideNavigation index={index} total={total} onPrev={prev} onNext={next} />

      <SlideOverview
        open={overviewOpen}
        onClose={() => setOverviewOpen(false)}
        slides={SLIDES}
        current={index}
        onSelect={(i) => {
          setOverviewOpen(false);
          goTo(i);
        }}
      />
    </div>
  );
}