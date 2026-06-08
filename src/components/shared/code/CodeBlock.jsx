import { useState, useRef, useEffect } from 'react';
import { Highlight } from 'prism-react-renderer';
import { LuCopy } from "react-icons/lu";
import { FaCheck } from 'react-icons/fa6';

const COLLAPSED_LINES = 20;

const reactBytesTheme = {
  plain: { color: 'var(--text-muted)', backgroundColor: 'transparent' },
  styles: [
    { types: ['keyword', 'operator'],            style: { color: '#c678dd' } },
    { types: ['function'],                        style: { color: '#61afef' } },
    { types: ['string', 'attr-value'],            style: { color: '#98c379' } },
    { types: ['number', 'boolean'],               style: { color: '#d19a66' } },
    { types: ['comment'],                         style: { color: '#4a4a60', fontStyle: 'italic' } },
    { types: ['class-name', 'maybe-class-name'],  style: { color: '#e5c07b' } },
    { types: ['tag'],                             style: { color: '#e06c75' } },
    { types: ['attr-name'],                       style: { color: '#d19a66' } },
    { types: ['punctuation'],                     style: { color: '#5a5a7a' } },
    { types: ['parameter'],                       style: { color: '#e06c75' } },
    { types: ['property'],                        style: { color: '#8b8ba0' } },
    { types: ['constant', 'symbol'],              style: { color: '#56b6c2' } },
  ],
};

const CopyButton = ({ text = '', scrollRef }) => {
  const [copied, setCopied] = useState(false);
  const btnRef = useRef(null);

  useEffect(() => {
    const el = scrollRef?.current;
    if (!el || !btnRef.current) return;
    const onScroll = () => {
      btnRef.current.style.transform = `translateX(${el.scrollLeft}px)`;
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollRef]);

  const fallbackCopy = (str) => {
    const textarea = document.createElement('textarea');
    textarea.value = str;
    textarea.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Copy failed', e);
    }
    document.body.removeChild(textarea);
  };

  const handleCopy = () => {
    const str = typeof text === 'string' ? text : String(text ?? '');
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(str).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => fallbackCopy(str));
    } else {
      fallbackCopy(str);
    }
  };

  return (
    <button
      ref={btnRef}
      onClick={handleCopy}
      className="absolute top-3 right-3 z-10 h-8 flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md
        border border-(--border-button) bg-(--bg-button)
        text-(--text-muted) hover:text-(--text-primary)
        transition-all duration-150 cursor-pointer"
    >
      {copied ? <FaCheck size={15} /> : <LuCopy size={15} />}
    </button>
  );
};

const CodeBlock = ({ code, language = 'jsx' }) => {
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef(null);

  const safeCode = typeof code === 'string' ? code : JSON.stringify(code, null, 2) ?? '';

  const lines      = safeCode.split('\n');
  const needsClamp = lines.length > COLLAPSED_LINES;
  const visible    = (!needsClamp || expanded) ? safeCode : lines.slice(0, COLLAPSED_LINES).join('\n');

  return (
    <div className="relative rounded-md border border-(--border-secondary) bg-(--bg-white)/3 overflow-hidden">

      {/* ── top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-(--border-secondary) bg-(--bg-elevated)">
        <span className="text-xs font-semibold uppercase tracking-widest text-(--text-muted)">
          {language}
        </span>
      </div>

      {/* ── highlighted code */}
      <div ref={scrollRef} className="relative overflow-x-auto">

        <CopyButton text={safeCode} scrollRef={scrollRef} />

        <Highlight theme={reactBytesTheme} code={visible} language={language}>
          {({ className, tokens, getLineProps, getTokenProps }) => (
            <pre className={`${className} p-5 pr-14 text-sm leading-relaxed m-0 bg-transparent`}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })} className="table-row">
                  <span
                    className="table-cell pr-5 text-right select-none text-[12px] w-8"
                    style={{ color: 'var(--text-muted)', opacity: 0.4 }}
                  >
                    {i + 1}
                  </span>
                  <span className="table-cell">
                    {line.map((token, j) => (
                      <span key={j} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>

      {/* ── fade + Expand button */}
      {needsClamp && !expanded && (
        <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none bg-[linear-gradient(to_top,var(--bg)_30%,transparent_100%)]">
          <div className="absolute bottom-4 right-4 pointer-events-auto">
            <button
              onClick={() => setExpanded(true)}
              className="text-sm px-3 h-9 rounded-md
                border border-(--border-button)
                bg-(--bg-button)
                text-(--text-muted) hover:text-(--text-primary)
                transition-all duration-150 cursor-pointer"
            >
              Expand Snippet
            </button>
          </div>
        </div>
      )}

      {/* ── Collapse button */}
      {needsClamp && expanded && (
        <button
          onClick={() => setExpanded(false)}
          className="w-full flex items-center justify-center gap-2 py-3
            border-t border-(--border-button) bg-(--bg-button) 
            text-sm text-(--text-muted) hover:text-(--text-primary)
            transition-all duration-150 cursor-pointer"
        >
          Collapse
        </button>
      )}
    </div>
  );
};

export default CodeBlock;
