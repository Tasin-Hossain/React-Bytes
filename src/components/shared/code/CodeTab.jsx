import { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import useComponentProps from '../../../hooks/useComponentProps';
import SubTabButton from '../../ui/Button/SubTabButton';
import PkgTabs from './PkgTabs';
import VariantSwitcher from './VariantSwitcher';
import SadCdnImg from '../../../assets/icons/shadcn-favicon.ico';
import JsrepoImg from '../../../assets/icons/jsrepo-favicon.ico';

const CLI_TOOLS = [
  { value: 'shadcn', label: 'shadcn', icon: SadCdnImg },
  { value: 'jsrepo', label: 'jsrepo', icon: JsrepoImg }
];

const CliToolDropdown = ({ value, onChange, shadcnCmds, jsrepoCmds }) => {
  const containerRef = useRef(null);
  const indicatorRef = useRef(null);
  const btnRefs = useRef({});
  const [hovered, setHovered] = useState(null);

  const available = CLI_TOOLS.filter(t => (t.value === 'shadcn' ? !!shadcnCmds : !!jsrepoCmds));

  const targetTab = hovered ?? value;

  useLayoutEffect(() => {
    const btn = btnRefs.current[targetTab];
    const container = containerRef.current;
    if (!btn || !container) return;

    const btnRect = btn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    gsap.to(indicatorRef.current, {
      x: btnRect.left - containerRect.left,
      width: btnRect.width,
      duration: 0.3,
      ease: 'power3.out'
    });
  }, [targetTab, available.length]);

  if (available.length <= 1) return null;

  const handleClick = (v) => {
    onChange(v);
    gsap.fromTo(
      btnRefs.current[v],
      { scale: 0.9 },
      { scale: 1, duration: 0.3, ease: 'back.out(3)' }
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseLeave={() => setHovered(null)}
      className="relative inline-flex items-center rounded-md border border-(--border-secondary) bg-(--bg-card) p-1 mb-2"
    >
      <div
        ref={indicatorRef}
        className="absolute top-1 bottom-1 left-0 rounded bg-(--bg-button)   pointer-events-none"
      />

      {available.map(tool => (
        <button
          key={tool.value}
          ref={(el) => (btnRefs.current[tool.value] = el)}
          onClick={() => handleClick(tool.value)}
          onMouseEnter={() => setHovered(tool.value)}
          className={`relative z-10 flex items-center gap-1.5 px-3.5 py-1 rounded text-md font-medium capitalize transition-colors cursor-pointer ${
            targetTab === tool.value ? 'text-(--text-primary)' : 'text-(--text-muted)'
          }`}
        >
          <img src={tool.icon} alt={tool.label} className="w-4 h-4 object-cover rounded-sm" />
          {tool.label}
        </button>
      ))}
    </div>
  );
};

const CodeTab = ({ pkgCmds, shadcnCmds, jsrepoCmds, usageCode, codeVariants, cssCode, tailwindNote, CodeBlock }) => {
  const { langTab, setLangTab, styleTab, setStyleTab } = useComponentProps();

  const hasManual = pkgCmds && Object.keys(pkgCmds).some(k => pkgCmds[k]?.length);
  const hasCli = !!(shadcnCmds || jsrepoCmds);

  const [installTab, setInstallTab] = useState(hasManual ? 'manual' : 'cli');
  const [pkgTab, setPkgTab] = useState('npm');
  const [cliTool, setCliTool] = useState(jsrepoCmds ? 'jsrepo' : 'shadcn');

  const normalizedStyle = styleTab === 'tw' || styleTab === 'tailwind' ? 'tailwind' : 'css';
  const activeVariantKey = `${langTab}-${normalizedStyle}`;
  const activeCode = codeVariants?.[activeVariantKey] ?? '';

  return (
    <>
      {/* ── Install ── */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="title-two">Install</h2>
          <div className="flex items-center gap-1">
            <SubTabButton
              active={installTab === 'cli'}
              onClick={() => hasCli && setInstallTab('cli')}
              disabled={!hasCli}
              className={!hasCli ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}
            >
              CLI
            </SubTabButton>
            <SubTabButton
              active={installTab === 'manual'}
              onClick={() => hasManual && setInstallTab('manual')}
              disabled={!hasManual}
              className={!hasManual ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}
            >
              Manual
            </SubTabButton>
          </div>
        </div>

        <div className="flex items-center justify-between ">
          <PkgTabs active={pkgTab} onChange={setPkgTab} />
          {installTab === 'cli' && (
            <CliToolDropdown value={cliTool} onChange={setCliTool} shadcnCmds={shadcnCmds} jsrepoCmds={jsrepoCmds} />
          )}
        </div>

        <CodeBlock
          code={
            installTab === 'manual'
              ? (pkgCmds?.[pkgTab] ?? '')
              : cliTool === 'jsrepo'
                ? (jsrepoCmds?.[pkgTab] ?? '')
                : (shadcnCmds?.[pkgTab] ?? '')
          }
          language="bash"
        />
      </section>

      {/* ── Usage (live) ── */}
      <section className="mb-8">
        <h2 className="title-two mb-4">Usage</h2>
        <CodeBlock showLineNumbers code={usageCode} />
      </section>

      {/* ── Code (variant switcher) ── */}
      <section className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <h2 className="title-two">Code</h2>
          <VariantSwitcher
            langTab={langTab}
            setLangTab={setLangTab}
            styleTab={normalizedStyle}
            setStyleTab={setStyleTab}
          />
        </div>

        <CodeBlock showLineNumbers code={activeCode} />

        {normalizedStyle === 'css' && cssCode && (
          <>
            <SectionLabel>CSS</SectionLabel>
            <CodeBlock code={cssCode} language="css" />
          </>
        )}

        {normalizedStyle === 'tailwind' && tailwindNote && (
          <>
            <SectionLabel>Tailwind Usage</SectionLabel>
            <CodeBlock code={tailwindNote} language="jsx" />
          </>
        )}
      </section>
    </>
  );
};

export const CodeExample = ({ label, code, CodeBlock }) => (
  <div className="mb-6">
    {label && <SectionLabel>{label}</SectionLabel>}
    <CodeBlock code={code} />
  </div>
);

const SectionLabel = ({ children }) => (
  <p className="text-[11px] uppercase tracking-widest font-semibold mt-4 mb-2">{children}</p>
);

export default CodeTab;