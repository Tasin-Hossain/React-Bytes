import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { label: 'Animations', items: ['Fade In', 'Slide Up', 'Bounce', 'Parallax', 'Spring'] },
  { label: 'Text Effects', items: ['Typewriter', 'Blur Text', 'Scramble', 'Word Swap'] },
  { label: 'Backgrounds', items: ['Aurora', 'Dot Field', 'Magic Rings', 'Mesh BG'] },
  { label: 'Layouts', items: ['Bento Grid', 'Masonry', 'Holy Grail', 'Sidebar'] },
  { label: 'Inputs', items: ['Magic Input', 'OTP Field', 'Search Bar', 'Tag Input'] },
];

const tagVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut', delay: i * 0.06 },
  }),
  exit: { opacity: 0, x: -6, transition: { duration: 0.15 } },
};

const Explore = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % CATEGORIES.length);
      setAnimKey(k => k + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const switchCategory = i => {
    setActiveIdx(i);
    setAnimKey(k => k + 1);
  };

  return (
    <div className="w-full h-full flex gap-0 p-4">
      {/* Left — Category sidebar */}
      <div className="flex flex-col gap-0.5 shrink-0 w-28">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.label}
            onClick={() => switchCategory(i)}
            className={`flex items-center gap-1.5 px-2 py-1.25 rounded-md text-[11.5px] font-mono transition-all duration-200 text-left ${
              i === activeIdx ? 'bg-white/10 text-white' : 'text-white/40'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200 ${
                i === activeIdx ? 'bg-white' : 'bg-transparent'
              }`}
            />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px bg-white/10 mx-2.5 shrink-0" />

      {/* Right — Component tags */}
      <AnimatePresence mode="wait">
        <motion.div
          key={animKey}
          className="flex flex-wrap gap-2 content-start flex-1"
        >
          {CATEGORIES[activeIdx].items.map((item, i) => (
            <motion.span
              key={item}
              custom={i}
              variants={tagVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="px-2.5 py-1 rounded-md border border-white/10 bg-white/4 text-white/40 text-[11px] font-mono whitespace-nowrap"
            >
              {item}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Explore;
