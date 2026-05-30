import { useRef, useState, useEffect } from 'react';
import AiCoding from './Components/AiCoding/AiCoding';
import BlockElements from './Components/BlockElements/BlockElements';
import BuiltWorkflow from './Components/BuiltWorkflow/BuiltWorkflow';
import Marquee from './Components/Marquee/Marquee';
import Tools from './Components/Tools/Tools';
import { motion } from 'framer-motion';

function LazyCard({ card, colClass, index }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Visual = card.Visual;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`
        bg-(--bg-card) backdrop-blur-[32px] backdrop-saturate-[1.3]
        border border-(--border-secondary) rounded-md
        flex flex-col transition-all duration-300 overflow-hidden
        hover:border-white/15 hover:-translate-y-0.5
        ${colClass}
      `}
    >
      <div className="h-45 pb-4 w-full flex items-center justify-center relative overflow-hidden">
        {inView ? <Visual /> : null}
      </div>
      <div className="pt-4.5 px-5.5 pb-5.5">
        <h3 className="text-[15px] text-(--text-primary) font-semibold mb-1.5 tracking-[-0.01em]">
          {card.title}
        </h3>
        <p className="text-sm text-(--text-muted) leading-6">{card.desc}</p>
      </div>
    </motion.div>
  );
}

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

// span=6 → 50/50 (col-span-12 mobile, col-span-6 tablet+)
// span=4 → 3 equal columns (col-span-12 mobile, col-span-6 tablet, col-span-4 desktop)
const getColClass = span => {
  if (span === 6) return 'col-span-12 sm:col-span-6';
  if (span === 4) return 'col-span-12 sm:col-span-6 lg:col-span-4';
  return 'col-span-12 sm:col-span-6 lg:col-span-3';
};

const Features = () => (
  <section className="app-container bg-(--bg) py-10">
    <h2 className="title">What&apos;s inside</h2>
    <div className="grid grid-cols-12 gap-4">
      {CARDS.map((card, i) => (
        <LazyCard
          key={card.title}
          card={card}
          colClass={getColClass(card.span)}
          index={i}
        />
      ))}
    </div>
  </section>
);

export default Features;