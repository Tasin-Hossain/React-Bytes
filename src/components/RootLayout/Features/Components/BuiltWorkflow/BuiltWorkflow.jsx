import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STATES = [
  {
    lang: 'JS',
    sty: 'Tailwind',
    lines: [
      [{ t: 'const ' }, { t: 'Button' }, { t: ' = () => {' }],
      [{ t: 'return ' }, { t: '(' }],
      [{ t: '\t<button' }, { t: ' className="px-4 py-2 bg-blue-500 rounded-xl' }],
      [{ t: '\t\tClick me' }],
      [{ t: '\t</button>' }],
      [{ t: ')}' }],
    ],
  },
  {
    lang: 'TS',
    sty: 'Tailwind',
    lines: [
      [{ t: 'const ' }, { t: 'Button' }, { t: ': React.FC = () => {' }],
      [{ t: 'return ' }, { t: '(' }],
      [{ t: '\t<button' }, { t: ' className="px-4 py-2 bg-blue-500 rounded-xl' }],
      [{ t: '\t\tClick me' }],
      [{ t: '\t</button>' }],
      [{ t: '}' }],
    ],
  },
  {
    lang: 'TS',
    sty: 'CSS',
    lines: [
      [{ t: 'const ' }, { t: 'Button' }, { t: ': React.FC = () => {' }],
      [{ t: 'return ' }, { t: '(' }],
      [{ t: '\t<button' }, { t: ' style={styles.btn}' }],
      [{ t: '\t\tClick me' }],
      [{ t: '\t</button>' }],
      [{ t: '}' }],
    ],
  },
  {
    lang: 'JS',
    sty: 'CSS',
    lines: [
      [{ t: 'const ' }, { t: 'Button' }, { t: ' = () => {' }],
      [{ t: 'return ' }, { t: '(' }],
      [{ t: '\t<button' }, { t: ' style={styles.btn}' }],
      [{ t: '\t\tClick me' }],
      [{ t: '\t</button>' }],
      [{ t: ')}' }],
    ],
  },
];

const ORDER = [
  ['JS', 'Tailwind'],
  ['TS', 'Tailwind'],
  ['TS', 'CSS'],
  ['JS', 'CSS'],
];

const lineVariants = {
  hidden: { opacity: 0, y: 3 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: 'easeOut', delay: i * 0.038 },
  }),
  exit: { opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
};

const ToggleBtn = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-2.5 py-0.5 rounded-md text-[10.5px] border transition-all duration-200 ${
      active
        ? 'border-white/20 bg-white/10 text-white'
        : 'border-white/10 bg-transparent text-white/40'
    }`}
  >
    {label}
  </button>
);

const BuiltWorkflow = () => {
  const [lang, setLang] = useState('JS');
  const [sty, setSty] = useState('Tailwind');
  const [stateKey, setStateKey] = useState(0);
  const [, setOrderIdx] = useState(0);

  const state = STATES.find(s => s.lang === lang && s.sty === sty) || STATES[0];

  const switchState = (newLang, newSty) => {
    setLang(newLang);
    setSty(newSty);
    setStateKey(k => k + 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setOrderIdx(prev => {
        const next = (prev + 1) % ORDER.length;
        switchState(ORDER[next][0], ORDER[next][1]);
        return next;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ fontFamily: "ui-monospace,'Fira Code',monospace" }}
    >
      {/* Toggles */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 shrink-0">
        <div className="flex gap-1">
          <ToggleBtn label="JS" active={lang === 'JS'} onClick={() => switchState('JS', sty)} />
          <ToggleBtn label="TS" active={lang === 'TS'} onClick={() => switchState('TS', sty)} />
        </div>
        <div className="flex gap-1">
          <ToggleBtn label="Tailwind" active={sty === 'Tailwind'} onClick={() => switchState(lang, 'Tailwind')} />
          <ToggleBtn label="CSS" active={sty === 'CSS'} onClick={() => switchState(lang, 'CSS')} />
        </div>
      </div>

      {/* Code area */}
      <div className="relative flex-1 overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={stateKey}
            className="px-4 py-3 text-[10.5px] leading-[1.65]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
          >
            {state.lines.map((tokens, i) => (
              <motion.span
                key={i}
                className="block whitespace-pre"
                custom={i}
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {tokens.map((tok, j) => (
                  <span key={j} className="text-white/50">
                    {tok.t}
                  </span>
                ))}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none" />
      </div>
    </div>
  );
};

export default BuiltWorkflow;
