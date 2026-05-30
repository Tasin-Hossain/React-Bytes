import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CYCLES = [
  {
    prompt: 'add a glowing card',
    lines: [
      {
        ln: 1,
        tokens: [
          { t: 'import ' },
          { t: 'BorderGlow' },
          { t: ' from ' },
          { t: '"./BorderGlow"' },
        ],
      },
      { ln: 2, tokens: [] },
      {
        ln: 3,
        tokens: [
          { t: '<' },
          { t: 'BorderGlow' },
          { t: ' glowIntensity' },
          { t: '={' },
          { t: '0.8' },
          { t: '} />' },
        ],
      },
    ],
  },
  {
    prompt: 'create animated button',
    lines: [
      {
        ln: 1,
        tokens: [
          { t: 'import ' },
          { t: 'PulseBtn' },
          { t: ' from ' },
          { t: '"./PulseBtn"' },
        ],
      },
      { ln: 2, tokens: [] },
      {
        ln: 3,
        tokens: [
          { t: '<' },
          { t: 'PulseBtn' },
          { t: ' color' },
          { t: '="violet"' },
          { t: ' size' },
          { t: '="md"' },
          { t: ' />' },
        ],
      },
    ],
  },
  {
    prompt: 'add a gradient text effect',
    lines: [
      {
        ln: 1,
        tokens: [
          { t: 'import ' },
          { t: 'GradText' },
          { t: ' from ' },
          { t: '"./GradText"' },
        ],
      },
      { ln: 2, tokens: [] },
      {
        ln: 3,
        tokens: [
          { t: '<' },
          { t: 'GradText' },
          { t: ' from' },
          { t: '="#6366f1"' },
        ],
      },
      {
        ln: 4,
        tokens: [{ t: '  to="#ec4899"' }, { t: ' />' }],
      },
    ],
  },
];

const cursorVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const lineVariants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0 },
};

const AiCoding = () => {
  const [promptText, setPromptText] = useState('');
  const [lines, setLines] = useState([]);
  const [showCursor, setShowCursor] = useState(true);
  const [linesKey, setLinesKey] = useState(0);
  const cycleRef = useRef(0);
  const typingRef = useRef(null);

  const typePrompt = (text, cb) => {
    clearInterval(typingRef.current);
    setPromptText('');
    setShowCursor(true);
    let i = 0;
    typingRef.current = setInterval(() => {
      setPromptText(text.slice(0, ++i));
      if (i >= text.length) {
        clearInterval(typingRef.current);
        setShowCursor(false);
        setTimeout(cb, 250);
      }
    }, 38);
  };

  const runCycle = () => {
    const c = CYCLES[cycleRef.current % CYCLES.length];
    cycleRef.current++;
    setLines([]);
    setLinesKey((k) => k + 1);
    typePrompt(c.prompt, () => {
      setLines(c.lines);
      setLinesKey((k) => k + 1);
    });
  };

  useEffect(() => {
    const startId = setTimeout(runCycle, 0);
    const id = setInterval(runCycle, 4000);
    return () => {
      clearTimeout(startId);
      clearInterval(id);
      clearInterval(typingRef.current);
    };
  }, []);

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden rounded-xl"
      style={{ fontFamily: "ui-monospace,'Fira Code',monospace" }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-(--border-secondary)">
        <span className="w-2.5 h-2.5 rounded-full bg-(--bg-white)/20" />
        <span className="w-2.5 h-2.5 rounded-full bg-(--bg-white)/30" />
        <span className="w-2.5 h-2.5 rounded-full bg-(--bg-white)/20" />
        <span className="ml-1.5 text-[11px] tracking-wide text-(--text-white)/40">
          Editor
        </span>
      </div>

      {/* Prompt */}
      <div className="px-4 pt-3.5 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-(--text-white)/40">$</span>
          <span className="text-[11.5px] text-(--text-white)/50">{promptText}</span>
          <AnimatePresence>
            {showCursor && (
              <motion.span
                className="inline-block w-1.5 h-3 rounded-sm bg-(--bg-white)/60 align-middle ml-px"
                variants={cursorVariants}
                initial="visible"
                animate="visible"
                exit="hidden"
                transition={{
                  duration: 0.65,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Code lines */}
      <div className="flex-1 px-4 pb-4 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={linesKey}>
            {lines.map((row, i) => (
              <motion.div
                key={i}
                className="flex items-baseline"
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                transition={{
                  duration: 0.22,
                  ease: 'easeOut',
                  delay: i * 0.09 + 0.15,
                }}
              >
                <span className="min-w-8 text-[10.5px] select-none shrink-0 text-right mr-3.5 text-(--text-white)/20">
                  {row.tokens.length ? row.ln : ''}
                </span>
                <span className="text-[11px] leading-[1.75] text-(--text-white)/50">
                  {row.tokens.map((tok, j) => (
                    <span key={j}>{tok.t}</span>
                  ))}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AiCoding;