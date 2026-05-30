import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slide1Illustration } from './components/Slide1Illustration';
import { Slide3Illustration } from './components/Slide3Illustration';
import { Slide4Illustration } from './components/Slide4Illustration';
import { useInView } from '../../../hooks/useInView';

const SLIDES = [
  {
    number: '1',
    heading: 'Ship without the stress',
    desc: 'Typed, accessible, and dark-mode aware out of the box. Drop it in and go live — no cleanup needed.',
    Illustration: Slide1Illustration,
  },
  {
    number: '3',
    heading: "A week's work before lunch",
    desc: 'Grab from 100+ ready-made pieces, snap together full layouts, and walk away with a finished product.',
    Illustration: Slide3Illustration,
  },
  {
    number: '4',
    heading: 'Every screen, every pixel',
    desc: 'From a small phone to a wide monitor, each component holds its shape. Tested where your users actually are.',
    Illustration: Slide4Illustration,
  },
];

const slideVariants = {
  enter:  { opacity: 0, y: 18 },
  center: { opacity: 1, y: 0,   transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, y: -12, transition: { duration: 0.28, ease: [0.4, 0, 1, 1]     } },
};

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (d) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: d },
  }),
};

function BuildFastInner() {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const timerRef = useRef(null);
  const hoveredRef = useRef(false);
  const isAnimating = useRef(false);

  const advance = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setCurrent(p => (p + 1) % SLIDES.length);
    setAnimKey(k => k + 1);
    setTimeout(() => { isAnimating.current = false; }, 420);
  };

  const goTo = i => {
    if (i === current || isAnimating.current) return;
    isAnimating.current = true;
    setCurrent(i);
    setAnimKey(k => k + 1);
    setTimeout(() => { isAnimating.current = false; }, 420);
    clearInterval(timerRef.current);
    startTimer();
  };

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!hoveredRef.current) advance();
    }, 4500);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const { number, heading, desc, Illustration } = SLIDES[current];

  return (
    <div className="flex flex-col items-center justify-center overflow-visible">
      <div
        className="relative w-full max-w-5xl"
        onMouseEnter={() => { hoveredRef.current = true;  }}
        onMouseLeave={() => { hoveredRef.current = false; }}
      >
        {/* Ghost cards — desktop only */}
        <div className="hidden md:block absolute inset-0 bg-(--bg-card) rounded-[22px] border border-(--border-secondary) -translate-y-8 scale-[0.93] z-0" />
        <div className="hidden md:block absolute inset-0 bg-(--bg-card) rounded-[22px] border border-(--border-secondary) -translate-y-4 scale-[0.965] z-1" />

        {/* Active card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={animKey}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            /* mobile: stacked column | md+: side-by-side, fixed height */
            className="relative z-10 bg-(--bg-button) rounded-[22px] border border-(--border-secondary) overflow-hidden
                       grid grid-cols-1 md:grid-cols-2 md:h-105"
          >
            {/* Illustration — top on mobile, right on desktop */}
            <div className="bg-(--bg-card) order-1 md:order-2 border-b md:border-b-0 md:border-l border-(--border-secondary)
                            h-52 sm:h-60 md:h-full">
              <Illustration animKey={animKey} />
            </div>

            {/* Text — bottom on mobile, left on desktop */}
            <div className="relative flex flex-col justify-end p-6 sm:p-8 md:p-10 order-2 md:order-1">
              <span className="font-syne absolute top-5 right-5 md:top-8 md:left-10 text-[2.2rem] sm:text-[2.8rem] md:text-[3.5rem] font-extrabold text-(--text-white)/10 tracking-tight leading-none select-none">
                {number}
              </span>
              <div className="flex flex-col gap-2.5">
                <motion.h3
                  custom={0.05}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="font-syne text-[18px] sm:text-[22px] md:text-[26px]
                             font-bold text-(--text-primary) leading-tight tracking-tight"
                >
                  {heading}
                </motion.h3>
                <motion.p
                  custom={0.13}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-[13px] md:text-[14px] text-(--text-muted) leading-[1.7] max-w-xs md:max-w-65"
                >
                  {desc}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center gap-2 mt-6 md:mt-10">
        {SLIDES.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            animate={{
              width: i === current ? 32 : 6,
              background: i === current
                ? 'var(--text-muted)'
                : 'color-mix(in srgb, var(--text-muted) 50%, transparent)',
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-1.5 rounded-full border-none outline-none cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
}

// BuildFast function ta ei rokom hobe
export default function NeedLaunch() {
  const { ref, inView } = useInView(0.2);

  return (
    <section className="app-container px-4 sm:px-5 py-10" ref={ref}>
      <motion.h2
        className="title pb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        Build faster, design better
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        {inView && <BuildFastInner />}
      </motion.div>
    </section>
  );
}