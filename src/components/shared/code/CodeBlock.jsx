import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Highlight } from 'prism-react-renderer';
import { LuCopy } from "react-icons/lu";
import { FaCheck } from 'react-icons/fa6';
import gsap from 'gsap';

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

// ── Copy button with GSAP bump/feedback animation ──────────────────────────
const CopyButton = ({ text = '', scrollRef }) => {
  const [copied, setCopied] = useState(false);
  const btnRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    const el = scrollRef?.current;
    if (!el || !btnRef.current) return;
    const onScroll = () => {
      btnRef.current.style.transform = `translateX(${el.scrollLeft}px)`;
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollRef]);

  // feedback bump animation on the icon (kept separate from btnRef so it
  // never fights with the scroll-driven translateX transform above)
  useEffect(() => {
    if (!iconRef.current) return;
    gsap.fromTo(
      iconRef.current,
      { scale: 0.35, rotate: copied ? -100 : 100, opacity: 0 },
      { scale: 1, rotate: 0, opacity: 1, duration: 0.45, ease: 'back.out(3)' }
    );
  }, [copied]);

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
        border border-(--border-button) bg-(--bg-button)/60 backdrop-blur-md
        text-(--text-muted) hover:text-(--text-primary)
        transition-all duration-150 cursor-pointer"
    >
      <span ref={iconRef} style={{ display: 'inline-flex' }}>
        {copied ? <FaCheck size={15} /> : <LuCopy size={15} />}
      </span>
    </button>
  );
};

const CodeBlock = ({ code, language = 'jsx', showLineNumbers = false }) => {
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef(null);   // horizontal scroll container (unchanged)
  const wrapperRef = useRef(null);  // outer block -> mount fade-in
  const preWrapRef = useRef(null);  // wraps <pre> -> expand/collapse height anim
  const firstRun = useRef(true);

  const safeCode = typeof code === 'string' ? code : JSON.stringify(code, null, 2) ?? '';
  const lines = safeCode.split('\n');
  const needsClamp = lines.length > COLLAPSED_LINES;

  // ── 1) Code block fade-in on mount ──────────────────────────────────────
  useEffect(() => {
    if (!wrapperRef.current) return;
    gsap.fromTo(
      wrapperRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

  // ── 2) Expand/Collapse smooth height animation ──────────────────────────
  useLayoutEffect(() => {
    const el = preWrapRef.current;
    if (!el || !needsClamp) return;

    const prevHeight = el.style.height;
    el.style.height = 'auto';
    const full = el.scrollHeight;
    el.style.height = prevHeight;

    const collapsedHeight = (full / lines.length) * COLLAPSED_LINES;

    if (firstRun.current) {
      gsap.set(el, { height: collapsedHeight, overflowY: 'hidden', overflowX: 'visible' });
      firstRun.current = false;
      return;
    }

    el.style.overflowY = 'hidden';
    gsap.to(el, {
      height: expanded ? full : collapsedHeight,
      duration: expanded ? 0.5 : 0.45,
      ease: 'power3.inOut',
      onComplete: () => {
        if (expanded) el.style.overflowY = 'visible';
      },
    });
  }, [expanded, safeCode, needsClamp, lines.length]);

  const toggleExpand = () => setExpanded((v) => !v);

  // ── 3) Fade overlay + expand button entrance (fires whenever the
  //        overlay mounts: first render AND every time we re-collapse) ────
  const overlayEntranceRef = (el) => {
    if (el) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      );
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative rounded-md border border-(--border-secondary) bg-(--bg-white)/3 overflow-hidden"
    >
      {/* ── horizontal scroll + highlighted code */}
      <div ref={scrollRef} className="relative overflow-x-auto">

        <CopyButton text={safeCode} scrollRef={scrollRef} />

        <div ref={preWrapRef}>
          <Highlight theme={reactBytesTheme} code={safeCode} language={language}>
            {({ className, tokens, getLineProps, getTokenProps }) => (
              <pre className={`${className} p-4 pr-14 text-sm font-bold leading-relaxed m-0 bg-transparent`}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })} className="table-row">
                    {showLineNumbers && (
                      <span
                        className="table-cell select-none text-right pr-4"
                        style={{ color: 'var(--text-muted)', opacity: 0.4, minWidth: '2em' }}
                      >
                        {i + 1}
                      </span>
                    )}
                    <span className={`table-cell${showLineNumbers ? ' pl-4' : ''}`}>
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
      </div>

      {/* ── fade + Expand button */}
      {needsClamp && !expanded && (
        <div
          ref={overlayEntranceRef}
          className="absolute bottom-0 inset-x-0 h-32 pointer-events-none bg-[linear-gradient(to_top,var(--bg)_30%,transparent_100%)]"
        >
          <div className="absolute bottom-4 right-4 pointer-events-auto">
            <button
              onClick={toggleExpand}
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
          onClick={toggleExpand}
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
