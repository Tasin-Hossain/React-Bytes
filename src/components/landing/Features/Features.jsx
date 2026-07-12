import { useRef, useState, useEffect, useMemo, memo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

const Marquee = lazy(() => import('./Components/Marquee/Marquee'));
const BlockElements = lazy(() => import('./Components/BlockElements/BlockElements'));
const BuiltWorkflow = lazy(() => import('./Components/BuiltWorkflow/BuiltWorkflow'));
const Tools = lazy(() => import('./Components/Tools/Tools'));
const AiCoding = lazy(() => import('./Components/AiCoding/AiCoding'));

const CARDS = [
  {
    title: 'Huge Component Collection',
    desc: 'Ready-made animations, effects, layouts, and UI blocks so you can skip repetitive work and build faster.',
    span: 6,
    Visual: Marquee,
  },
  {
    title: 'Block Elements',
    desc: 'Pre-built layout blocks and flexible sections to speed up page building and design workflows.',
    span: 6,
    Visual: BlockElements,
  },
  {
    title: 'Interactive Tools',
    desc: 'Three free tools to play with components and grab the code.',
    span: 4,
    Visual: Tools,
  },
  {
    title: 'Built for Every Workflow',
    desc: 'Choose between JavaScript or TypeScript, Tailwind or CSS — whichever fits your project best.',
    span: 4,
    Visual: BuiltWorkflow,
  },
  {
    title: 'Perfect for AI Coding',
    desc: 'Use with modern AI tools like Cursor, Copilot, and v0 to generate, tweak, and ship components faster.',
    span: 4,
    Visual: AiCoding,
  },
];

const COL_CLASS = {
  6: 'col-span-12 sm:col-span-6',
  4: 'col-span-12 sm:col-span-6 lg:col-span-4',
  default: 'col-span-12 sm:col-span-6 lg:col-span-3',
};
const getColClass = (span) => COL_CLASS[span] || COL_CLASS.default;

// single shared observer instead of one per card
function useSharedInView(ref) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '100px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, inView]);

  return inView;
}

const LazyCard = memo(function LazyCard({ card, colClass, index }) {
  const ref = useRef(null);
  const inView = useSharedInView(ref);
  const Visual = card.Visual;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 350px' }}
      className={`
        bg-(--bg-card) border border-(--border-secondary) rounded-md
        flex flex-col transition-[border-color,transform] duration-300 overflow-hidden
        will-change-transform hover:border-white/15 hover:-translate-y-0.5 shadow-[0_4px_32px_rgba(0,0,0,0.1),inset_0_0.5px_0_rgba(255,255,255,0.06)]
        ${colClass}
      `}
    >
      <div className="h-45 pb-4 w-full flex items-center justify-center relative overflow-hidden">
        {inView ? (
          <Suspense fallback={null}>
            <Visual />
          </Suspense>
        ) : null}
      </div>
      <div className="pt-4.5 px-5.5 pb-5.5">
        <h3 className="text-[15px] text-(--text-primary) font-semibold mb-1.5 tracking-[-0.01em]">
          {card.title}
        </h3>
        <p className="text-sm text-(--text-muted) leading-6">{card.desc}</p>
      </div>
    </motion.div>
  );
});

const Features = () => {
  const cols = useMemo(
    () => CARDS.map((card) => ({ card, colClass: getColClass(card.span) })),
    []
  );

  return (
    <section className="app-container bg-(--bg) py-10">
      <motion.h2
        className="title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        What&apos;s inside
      </motion.h2>
      <div className="grid grid-cols-12 gap-4">
        {cols.map(({ card, colClass }, i) => (
          <LazyCard key={card.title} card={card} colClass={colClass} index={i} />
        ))}
      </div>
    </section>
  );
};

export default Features;