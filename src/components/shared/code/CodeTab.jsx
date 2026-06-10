import { useState } from 'react';
import useComponentProps from '../../../hooks/useComponentProps';
import SubTabButton from '../../ui/Button/SubTabButton';
import PkgTabs from './PkgTabs';
import VariantSwitcher from './VariantSwitcher';

const CodeTab = ({ pkgCmds, shadcnCmds, usageCode, codeVariants, cssCode, tailwindNote, CodeBlock }) => {
  const { langTab, setLangTab, styleTab, setStyleTab } = useComponentProps();

  const hasManual = pkgCmds && Object.keys(pkgCmds).some(k => pkgCmds[k]?.length);
  const hasCli = shadcnCmds && Object.keys(shadcnCmds).some(k => shadcnCmds[k]?.length);

  const [installTab, setInstallTab] = useState(hasManual ? 'manual' : 'cli');
  const [pkgTab, setPkgTab] = useState('npm');

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
        <PkgTabs active={pkgTab} onChange={setPkgTab} />
        <CodeBlock
          code={installTab === 'manual' ? (pkgCmds?.[pkgTab] ?? '') : (shadcnCmds?.[pkgTab] ?? '')}
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
  <p className="text-[11px] text-[#8a8a9a] uppercase tracking-widest font-semibold mt-4 mb-2">{children}</p>
);

export default CodeTab;