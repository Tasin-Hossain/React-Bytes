import { useState } from 'react';
import { Link } from 'react-router';
import Button from '../components/ui/Button/Button';
import { FaArrowRightLong } from 'react-icons/fa6';
import CodeBlock from '../components/shared/code/CodeBlock';
import shadcnLogo from '../assets/icons/shadcn-favicon.ico';
import jsrepoLogo from '../assets/icons/jsrepo-favicon.ico';

/* ---------------------------------------------------------
   Package manager commands (npm / pnpm / yarn / bun)
--------------------------------------------------------- */
const PACKAGE_MANAGERS = [
  { id: 'npm', label: 'npm', run: 'npm install', dlx: 'npx' },
  { id: 'pnpm', label: 'pnpm', run: 'pnpm add', dlx: 'pnpm dlx' },
  { id: 'yarn', label: 'yarn', run: 'yarn add', dlx: 'yarn dlx' },
  { id: 'bun', label: 'bun', run: 'bun add', dlx: 'bunx' }
];

const ExternalLink = ({ href, children }) => (
  <Link
    to={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-(--brand) underline underline-offset-2 hover:opacity-80 transition-opacity"
  >
    {children}
  </Link>
);

/* ---------------------------------------------------------
   Generic "manual" icon (copy/paste glyph)
--------------------------------------------------------- */
const ManualIcon = (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="8" width="13" height="13" rx="2" />
    <path d="M3 16V5a2 2 0 0 1 2-2h11" />
  </svg>
);

/* ---------------------------------------------------------
   CLI tools — each has a real brand logo image
--------------------------------------------------------- */
const CLI_TOOLS = {
  shadcn: {
    id: 'shadcn',
    label: 'shadcn',
    logo: shadcnLogo,
    href: 'https://ui.shadcn.com/',
    buildCommand: (dlx) => `${dlx} shadcn@latest add https://reactbytes.online/r/<COMPONENT>-<LANGUAGE>-<STYLE>`,
    blurb: (
      <>
        Runs on the <ExternalLink href="https://ui.shadcn.com/">shadcn</ExternalLink> registry protocol — it pulls the
        component straight from React Bytes into your own codebase, no extra config needed.
      </>
    )
  },
  jsrepo: {
    id: 'jsrepo',
    label: 'jsrepo',
    logo: jsrepoLogo,
    href: 'https://jsrepo.dev/',
    buildCommand: (dlx) => `${dlx} jsrepo@latest add shadcn:https://reactbytes.online/r/<COMPONENT>-<LANGUAGE>-<STYLE>`,
    blurb: (
      <>
        A lighter alternative — <ExternalLink href="https://jsrepo.dev/">jsrepo</ExternalLink> reads the same
        shadcn-compatible registry, so every component here works with it out of the box.
      </>
    )
  }
};

/* ---------------------------------------------------------
   The three top-level install options — matches the flat
   "Manual / jsrepo / shadcn" card row.
--------------------------------------------------------- */
const INSTALL_OPTIONS = [
  { id: 'manual', label: 'manual', icon: ManualIcon },
  { id: 'jsrepo', label: 'jsrepo', logo: jsrepoLogo },
  { id: 'shadcn', label: 'shadcn', logo: shadcnLogo }
];

const MANUAL_STEPS = (pm) => [
  {
    title: 'Install the peer packages',
    description: 'A handful of components lean on these two libraries for their animations — grab them once per project.',
    code: `${pm.run} framer-motion gsap`,
    language: 'bash'
  },
  {
    title: 'Grab the component source',
    description: "Open any component page, hit “Copy Code”, and drop the file straight into your components folder.",
    code: null
  },
  {
    title: 'Wire it up',
    description: 'Import it like any other component and pass in your own props.',
    code: `import Aurora from './components/Aurora';\n\nexport default function App() {\n  return <Aurora colorStops={['#3A29FF', '#FF94B4', '#FF3232']} />;\n}`,
    language: 'jsx'
  }
];

/* ---------------------------------------------------------
   Shared bits
--------------------------------------------------------- */
const PackageManagerTabs = ({ active, onChange }) => (
  <div className="inline-flex rounded-md border border-(--border-secondary) bg-(--bg-card) p-1 mb-4">
    {PACKAGE_MANAGERS.map(({ id, label }) => (
      <button
        key={id}
        onClick={() => onChange(id)}
        className={`px-3.5 py-1 rounded text-xs border font-medium transition-colors cursor-pointer ${
          active === id
            ? 'bg-(--brand)/10 border-(--brand)/20 text-(--brand)'
            : 'text-(--text-muted) border-transparent hover:text-(--text-primary)'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

const LanguageStyleList = () => (
  <div className="grid grid-cols-2 gap-2.5">
    {[
      { combo: 'JS-CSS', desc: 'JavaScript + Plain CSS' },
      { combo: 'JS-TW', desc: 'JavaScript + Tailwind' },
      { combo: 'TS-CSS', desc: 'TypeScript + Plain CSS' },
      { combo: 'TS-TW', desc: 'TypeScript + Tailwind' }
    ].map(({ combo, desc }) => (
      <div
        key={combo}
        className="flex items-center gap-2.5 text-sm rounded-md border border-(--border-secondary) bg-(--bg-card) px-3 py-2"
      >
        <span className="font-mono font-semibold text-(--brand) shrink-0">{combo}</span>
        <span className="text-(--text-muted) text-xs">{desc}</span>
      </div>
    ))}
  </div>
);

/* ---------------------------------------------------------
   CLI content — tool is now chosen at the top-level card row,
   so this just renders the command + info for that one tool.
--------------------------------------------------------- */
const CLIContent = ({ toolId }) => {
  const [pm, setPm] = useState('npm');

  const tool = CLI_TOOLS[toolId];
  const dlx = PACKAGE_MANAGERS.find((p) => p.id === pm).dlx;

  return (
    <div className="space-y-8">
      <section>
        <p className="leading-relaxed text-(--text-muted)">{tool.blurb}</p>
      </section>

      <section>
        <h2 className="title-two mb-3">Run the command</h2>
        <PackageManagerTabs active={pm} onChange={setPm} />
        <p className="leading-relaxed text-(--text-muted) mb-1 text-sm">
          Swap <span className="text-(--text-primary) font-medium">&lt;COMPONENT&gt;</span>,{' '}
          <span className="text-(--text-primary) font-medium">&lt;LANGUAGE&gt;</span> and{' '}
          <span className="text-(--text-primary) font-medium">&lt;STYLE&gt;</span> for the component you picked.
        </p>
        <CodeBlock code={tool.buildCommand(dlx)} language="bash" />
      </section>

      <section>
        <p className="text-sm text-(--text-muted) mb-3">Available language / style combinations:</p>
        <LanguageStyleList />
      </section>
    </div>
  );
};

/* ---------------------------------------------------------
   Manual content — numbered steps with a connecting line
--------------------------------------------------------- */
const ManualContent = () => {
  const [pm, setPm] = useState('npm');
  const steps = MANUAL_STEPS(PACKAGE_MANAGERS.find((p) => p.id === pm));

  return (
    <div className="relative">
      {steps.map(({ title, description, code, language }, i) => (
        <div key={title} className="relative pl-12 pb-10 last:pb-0">
          {/* Connecting line */}
          {i !== steps.length - 1 && (
            <span className="absolute left-3.75 top-8 bottom-0 w-px bg-(--brand)/10" />
          )}
          {/* Step badge */}
          <span className="absolute left-0 top-0 w-8 h-8 rounded-full border border-(--brand)/20 text-(--brand) text-sm font-semibold flex items-center justify-center bg-(--bg-card)">
            {i + 1}
          </span>

          <h2 className="title-two">{title}</h2>
          <p className="mb-2 text-(--text-muted)">{description}</p>

          {i === 0 && <PackageManagerTabs active={pm} onChange={setPm} />}
          {code && <CodeBlock code={code} language={language} />}
        </div>
      ))}
    </div>
  );
};

const Installation = () => {
  const [activeOption, setActiveOption] = useState('jsrepo');

  const activeContent =
    activeOption === 'manual' ? <ManualContent /> : <CLIContent toolId={activeOption} />;

  return (
    <div className="max-w-3xl mx-auto px-6 text-(--text-primary)">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-medium text-(--brand) leading-relaxed uppercase tracking-wider mb-3">
          Get Started
        </p>
        <h1 className="title-two">Installation</h1>
        <p className="mt-4 mb-4 leading-relaxed">
          Every component in React Bytes ships as source, not a package — pick a CLI to fetch it in one line, or copy
          the code by hand. Either way, once it lands in your project it's completely yours.
        </p>
        <p className="leading-relaxed">There's no runtime dependency on React Bytes itself, so there's nothing to keep in sync later.</p>
      </div>

      {/* Flat option row: Manual / jsrepo / shadcn */}
      <div className="mb-10">
        <p className="text-sm text-(--text-muted) mb-4">Click the cards below to change your preferred method:</p>
        <div className="grid grid-cols-3 gap-4">
          {INSTALL_OPTIONS.map(({ id, label, icon, logo }) => (
            <button
              key={id}
              onClick={() => setActiveOption(id)}
              className={`flex flex-col items-center justify-center gap-3 py-8 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                activeOption === id
                  ? 'border-(--brand)/60 bg-(--brand)/5'
                  : 'border-(--border-secondary) bg-(--bg-card) hover:border-(--border-primary)'
              }`}
            >
              {logo ? (
                <img src={logo} alt={`${label} logo`} className="w-10 h-10 rounded-lg shrink-0" />
              ) : (
                <span className="text-(--text-muted)">{icon}</span>
              )}
              <span
                className={`text-sm font-mono font-medium ${
                  activeOption === id ? 'text-(--brand)' : 'text-(--text-muted)'
                }`}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic content */}
      <div className="mb-10">{activeContent}</div>

      {/* Requirements */}
      <section className="mb-10 rounded-lg border border-(--border-secondary) bg-(--bg-card) p-5">
        <h3 className="font-semibold text-(--text-primary) mb-3 text-sm uppercase tracking-wider">Requirements</h3>
        <ul className="space-y-2">
          {[
            { label: 'React', value: '18 or later' },
            { label: 'Node.js', value: '16+' },
            { label: 'Tailwind CSS', value: 'Optional — a few components rely on it' }
          ].map(({ label, value }) => (
            <li key={label} className="flex items-center gap-3 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-(--brand) shrink-0" />
              <span className="font-medium text-(--brand)">{label}</span>
              <span className="text-(--text-muted)">{value}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Next step */}
      <div className="rounded-lg border border-(--border-secondary) bg-(--bg-card) p-6 flex items-center justify-between gap-4">
        <p className="text-xs text-(--text-primary) uppercase tracking-widest">Next up</p>
        <Link to="/get-started/mcp">
          <Button text="MCP" icon={<FaArrowRightLong />} />
        </Link>
      </div>
    </div>
  );
};

export default Installation;
