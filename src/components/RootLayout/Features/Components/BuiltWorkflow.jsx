import { useState, useEffect } from 'react';

const STATES = [
  {
    lang: 'JS',
    sty: 'Tailwind',
    lines: [
      [
        { t: 'const ', c: 'text-(--text-muted)' },
        { t: 'Button', c: 'text-(--text-muted)' },
        { t: ' = () => {', c: 'text-(--text-muted)' }
      ],

      [
        { t: 'return ', c: 'text-(--text-muted)' },
        { t: '(', c: 'text-(--text-muted)' }
      ],

      [
        { t: '\t<button', c: 'text-(--text-muted)' },
        { t: ' className="px-4 py-2 bg-blue-500 rounded-xl', c: 'text-(--text-muted)' }
      ],

      [{ t: '\t\tClick me', c: 'text-(--text-muted)' }],

      [{ t: '\t</button>', c: 'text-(--text-muted)' }],

      [{ t: ')}', c: 'text-(--text-muted)' }]
    ]
  },

  {
    lang: 'TS',
    sty: 'Tailwind',
    lines: [
      [
        { t: 'const ', c: 'text-(--text-muted)' },
        { t: 'Button', c: 'text-(--text-muted)' },
        { t: ': React.FC = () => {', c: 'text-(--text-muted)' }
      ],
      [
        { t: 'return ', c: 'text-(--text-muted)' },
        { t: '(', c: 'text-(--text-muted)' }
      ],

      [
        { t: '\t<button', c: 'text-(--text-muted)' },
        { t: ' className="px-4 py-2 bg-blue-500 rounded-xl', c: 'text-(--text-muted)' }
      ],

      [{ t: '\t\tClick me', c: 'text-(--text-muted)' }],

      [{ t: '\t</button>', c: 'text-(--text-muted)' }],

      [{ t: '}', c: 'text-(--text-muted)' }]
    ]
  },

  {
    lang: 'TS',
    sty: 'CSS',
    lines: [
      [
        { t: 'const ', c: 'text-(--text-muted)' },
        { t: 'Button', c: 'text-(--text-muted)' },
        { t: ': React.FC = () => {', c: 'text-(--text-muted)' }
      ],
      [
        { t: 'return ', c: 'text-(--text-muted)' },
        { t: '(', c: 'text-(--text-muted)' }
      ],

      [
        { t: '\t<button', c: 'text-(--text-muted)' },
        { t: ' style={styles.btn}', c: 'text-(--text-muted)' }
      ],

      [{ t: '\t\tClick me', c: 'text-(--text-muted)' }],

      [{ t: '\t</button>', c: 'text-(--text-muted)' }],

      [{ t: '}', c: 'text-(--text-muted)' }]
    ]
  },

  {
    lang: 'JS',
    sty: 'CSS',
    lines: [
      [
        { t: 'const ', c: 'text-(--text-muted)' },
        { t: 'Button', c: 'text-(--text-muted)' },
        { t: ' = () => {', c: 'text-(--text-muted)' }
      ],

      [
        { t: 'return ', c: 'text-(--text-muted)' },
        { t: '(', c: 'text-(--text-muted)' }
      ],

      [
        { t: '\t<button', c: 'text-(--text-muted)' },
        { t: ' style={styles.btn}', c: 'text-(--text-muted)' }
      ],

      [{ t: '\t\tClick me', c: 'text-(--text-muted)' }],

      [{ t: '\t</button>', c: 'text-(--text-muted)' }],

      [{ t: ')}', c: 'text-(--text-muted)' }]
    ]
  }
];
const ORDER = [
  ['JS', 'Tailwind'],
  ['TS', 'Tailwind'],
  ['TS', 'CSS'],
  ['JS', 'CSS']
];

const ToggleBtn = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-2.5 py-0.5 rounded-md text-[10.5px]  border transition-all duration-200 ${
      active
        ? 'border-(--border-button) bg-(--bg-button) text-(--text-primary)'
        : 'border-(--border-button)/50  bg-transparent text-(--text-muted)'
    }`}
  >
    {label}
  </button>
);
const BuiltWorkflow = () => {
  const [lang, setLang] = useState('JS');
  const [sty, setSty] = useState('Tailwind');
  const [visible, setVisible] = useState(true);
  const [, setOrderIdx] = useState(0);

  const state = STATES.find(s => s.lang === lang && s.sty === sty) || STATES[0];

  const switchState = (newLang, newSty) => {
    setVisible(false);
    setTimeout(() => {
      setLang(newLang);
      setSty(newSty);
      setVisible(true);
    }, 160);
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
      className="w-full h-full flex flex-col overflow-hidden "
      style={{
        fontFamily: "ui-monospace, 'Fira Code', monospace"
      }}
    >


      {/* Toggles */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-(--border-secondary) shrink-0">
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
        <div
          className="px-4 py-3 text-[10.5px] leading-[1.65]"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.15s ease'
          }}
        >
          {visible &&
            state.lines.map((tokens, i) =>
              tokens[0].t === '' ? (
                <span key={i} className="wf-line" style={{ animationDelay: `${i * 38}ms` }}>
                  {' '}
                </span>
              ) : (
                <span key={i} className="wf-line" style={{ animationDelay: `${i * 38}ms` }}>
                  {tokens.map((tok, j) => (
                     <span key={j} className={`${tok.c}`}>
                      {tok.t}
                    </span>
                  ))}
                </span>
              )
            )}
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none" />
      </div>
    </div>
  );
};

export default BuiltWorkflow;
