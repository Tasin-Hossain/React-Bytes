import { useState, useEffect, useRef } from 'react';

const CYCLES = [
  {
    prompt: 'add a glowing card',
    lines: [
      {
        ln: 1,
        tokens: [
          { t: 'import ', c: 'text-(--text-muted)' },
          { t: 'BorderGlow', c: 'text-(--text-muted)' },
          { t: ' from ', c: 'text-(--text-muted)' },
          { t: '"./BorderGlow"', c: 'text-(--text-muted)' }
        ]
      },
      { ln: 2, tokens: [] },
      {
        ln: 3,
        tokens: [
          { t: '<', c: 'text-(--text-muted)' },
          { t: 'BorderGlow', c: 'text-(--text-muted)' },
          { t: ' glowIntensity', c: 'text-(--text-muted)' },
          { t: '={', c: 'text-(--text-muted)' },
          { t: '0.8', c: 'text-(--text-muted)' },
          { t: '} />', c: 'text-(--text-muted)' }
        ]
      }
    ]
  },
  {
    prompt: 'create animated button',
    lines: [
      {
        ln: 1,
        tokens: [
          { t: 'import ', c: 'text-(--text-muted)' },
          { t: 'PulseBtn', c: 'text-(--text-muted)' },
          { t: ' from ', c: 'text-(--text-muted)' },
          { t: '"./PulseBtn"', c: 'text-(--text-muted)' }
        ]
      },
      { ln: 2, tokens: [] },
      {
        ln: 3,
        tokens: [
          { t: '<', c: 'text-(--text-muted)' },
          { t: 'PulseBtn', c: 'text-(--text-muted)' },
          { t: ' color', c: 'text-(--text-muted)' },
          { t: '="violet"', c: 'text-(--text-muted)' },
          { t: ' size', c: 'text-(--text-muted)' },
          { t: '="md"', c: 'text-(--text-muted)' },
          { t: ' />', c: 'text-(--text-muted)' }
        ]
      }
    ]
  },
  {
    prompt: 'add a gradient text effect',
    lines: [
      {
        ln: 1,
        tokens: [
          { t: 'import ', c: 'text-(--text-muted)' },
          { t: 'GradText', c: 'text-(--text-muted)' },
          { t: ' from ', c: 'text-(--text-muted)' },
          { t: '"./GradText"', c: 'text-(--text-muted)' }
        ]
      },
      { ln: 2, tokens: [] },
      {
        ln: 3,
        tokens: [
          { t: '<', c: 'text-(--text-muted)' },
          { t: 'GradText', c: 'text-(--text-muted)' },
          { t: ' from', c: 'text-(--text-muted)' },
          { t: '="#6366f1"', c: 'text-(--text-muted)' }
        ]
      },
      {
        ln: 4,
        tokens: [
          { t: '  to="#ec4899"', c: 'text-(--text-muted)' },
          { t: ' />', c: 'text-(--text-muted)' }
        ]
      }
    ]
  },
  {
    prompt: 'generate a blur backdrop modal',
    lines: [
      {
        ln: 1,
        tokens: [
          { t: 'import ', c: 'text-(--text-muted)' },
          { t: 'BlurModal', c: 'text-(--text-muted)' },
          { t: ' from ', c: 'text-(--text-muted)' },
          { t: '"./BlurModal"', c: 'text-(--text-muted)' }
        ]
      },
      { ln: 2, tokens: [] },
      {
        ln: 3,
        tokens: [
          { t: '<', c: 'text-(--text-muted)' },
          { t: 'BlurModal', c: 'text-(--text-muted)' },
          { t: ' blur', c: 'text-(--text-muted)' },
          { t: '={', c: 'text-(--text-muted)' },
          { t: 'true', c: 'text-(--text-muted)' },
          { t: '}', c: 'text-(--text-muted)' }
        ]
      },
      {
        ln: 4,
        tokens: [
          { t: '  open', c: 'text-(--text-muted)' },
          { t: '={', c: 'text-(--text-muted)' },
          { t: 'isOpen', c: 'text-(--text-muted)' },
          { t: '} />', c: 'text-(--text-muted)' }
        ]
      }
    ]
  }
];

const AiCoding = () => {
  const [promptText, setPromptText] = useState('');
  const [lines, setLines] = useState([]);
  const [codeKey, setCodeKey] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
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
    setCodeKey(k => k + 1);
    typePrompt(c.prompt, () => {
      setLines(c.lines);
      setCodeKey(k => k + 1);
    });
  };

  useEffect(() => {
    const startId = setTimeout(() => {
      runCycle();
    }, 0);

    const id = setInterval(runCycle, 4000);

    return () => {
      clearTimeout(startId);
      clearInterval(id);
      clearInterval(typingRef.current);
    };
  }, []);

  return (
    <div
      className=" w-full h-full flex flex-col overflow-hidden rounded-xl"
      style={{
        fontFamily: "ui-monospace,'Fira Code',monospace"
      }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-(--border-secondary)">
        <span className="w-2.5 h-2.5 rounded-full bg-(--bg-button) opacity-70" />
        <span className="w-2.5 h-2.5 rounded-full bg-(--bg-button)" />
        <span className="w-2.5 h-2.5 rounded-full bg-(--bg-button) opacity-70" />
        <span className="ml-1.5 text-[11px] tracking-wide text-(--text-muted)" >
          Editor
        </span>
      </div>

      {/* Prompt */}
      <div className="px-4 pt-3.5 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-(--text-muted)">
            $
          </span>
          <span className="text-[11.5px] text-(--text-muted)" >
            {promptText}
          </span>
          {showCursor && <span className="ai-cursor-block" />}
        </div>
      </div>

      {/* Code */}
      <div className="flex-1 px-4 pb-4 min-h-0 overflow-hidden">
        <div key={codeKey}>
          {lines.map((row, i) => (
            <div key={i} className="ai-code-ln flex items-baseline" style={{ animationDelay: `${i * 90 + 150}ms` }}>
              <span
                className="min-w-8 text-[10.5px] select-none shrink-0 text-right mr-3.5"
              >
                {row.tokens.length ? row.ln : ''}
              </span>
              <span className="text-[11px] leading-[1.75]">
                {row.tokens.map((tok, j) => (
                  <span key={j} className={`${tok.c}`}>
                    {tok.t}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiCoding;
