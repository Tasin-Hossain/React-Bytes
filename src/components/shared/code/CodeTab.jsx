import { useState, useRef, useEffect } from 'react';
import useComponentProps from '../../../hooks/useComponentProps';
import SubTabButton from '../../ui/Button/SubTabButton';
import PkgTabs from './PkgTabs';
import VariantSwitcher from './VariantSwitcher';

const CLI_TOOLS = [
  { value: 'shadcn', label: 'shadcn', icon: '//' },
  { value: 'jsrepo', label: 'jsrepo', icon: '>js' },
];

const CliToolDropdown = ({ value, onChange, shadcnCmds, jsrepoCmds }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const available = CLI_TOOLS.filter(t =>
    t.value === 'shadcn' ? !!shadcnCmds : !!jsrepoCmds
  );

  if (available.length <= 1) return null;

  const active = CLI_TOOLS.find(t => t.value === value);

  return (
    <div ref={ref} className="relative mb-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2.5 h-9 rounded-md border border-(--border-button) bg-(--bg-button) text-sm text-(--text-muted) transition-colors cursor-pointer"
      >
        <span className="text-(--brand) text-xs ">{active?.icon}</span>
        <span>{active?.label}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="p-1 absolute right-0 top-full mt-1 z-50 min-w-30 rounded-md border border-(--border-secondary) bg-(--bg-card) overflow-hidden">
          {available.map(tool => (
            <button
              key={tool.value}
              onClick={() => { onChange(tool.value); setOpen(false); }}
              className="flex items-center justify-between rounded-md w-full px-3 py-2 text-sm hover:bg-(--bg-hover) cursor-pointer transition-colors text-(--text-muted)"
            >
              <span className="flex items-center gap-2">
                <span className="font-mono text-xs text-(--brand)">{tool.icon}</span>
                <span>{tool.label}</span>
              </span>
              {value === tool.value && (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2.5 6.5l3 3 5-5" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
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
            <CliToolDropdown
              value={cliTool}
              onChange={setCliTool}
              shadcnCmds={shadcnCmds}
              jsrepoCmds={jsrepoCmds}
            />
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
        <CodeBlock code={usageCode} language="jsx" />
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

        <CodeBlock code={activeCode} language={langTab === 'ts' ? 'tsx' : 'jsx'} />

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

export const CodeExample = ({ label, code, language = 'jsx', CodeBlock }) => (
  <div className="mb-6">
    {label && <SectionLabel>{label}</SectionLabel>}
    <CodeBlock code={code} language={language} />
  </div>
);

const SectionLabel = ({ children }) => (
  <p className="text-[11px]  uppercase tracking-widest font-semibold mt-4 mb-2">{children}</p>
);

export default CodeTab;