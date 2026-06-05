import { useState } from "react";
import { Link } from "react-router";
import Button from "../components/ui/Button/Button";
import { FaArrowRightLong } from "react-icons/fa6";

const variants = [
  { id: "js-css",      label: "JS / CSS",      langCode: "JS",  styleCode: "CSS", lang: "JavaScript", styling: "Plain CSS" },
  { id: "js-tailwind", label: "JS / Tailwind",  langCode: "JS",  styleCode: "TW",  lang: "JavaScript", styling: "Tailwind" },
  { id: "ts-css",      label: "TS / CSS",       langCode: "TS",  styleCode: "CSS", lang: "TypeScript", styling: "Plain CSS" },
  { id: "ts-tailwind", label: "TS / Tailwind",  langCode: "TS",  styleCode: "TW",  lang: "TypeScript", styling: "Tailwind" },
];

const getManualSteps = (v) => [
  {
    title: "1. Install dependencies",
    description: "Most components rely on these packages. Install them once for your project.",
    code: v.styling === "Tailwind"
      ? `npm install framer-motion gsap\nnpm install -D tailwindcss`
      : `npm install framer-motion gsap`,
    language: "bash",
  },
  {
    title: "2. Copy the component",
    description: `Browse the component you want, select the ${v.label} tab on the component page, click 'Copy Code', and paste it into your project's components folder.`,
    code: null,
  },
  {
    title: "3. Import & use",
    description: "Import the component and drop it into your page.",
    code: `import Aurora from './components/Aurora';\n\nexport default function App() {\n  return <Aurora colorStops={['#3A29FF','#FF94B4','#FF3232']} />;\n}`,
    language: v.lang === "TypeScript" ? "tsx" : "jsx",
  },
];

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-md border border-(--border-secondary) bg-(--bg-card) mt-3 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-(--border-secondary)">
        <span className="text-xs text-(--text-muted) font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-(--text-muted) hover:text-(--text-primary) transition-colors cursor-pointer"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-(--text-primary) leading-relaxed whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
};

const ExternalLink = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-(--brand) underline underline-offset-2 hover:opacity-80 transition-opacity"
  >
    {children}
  </a>
);

const CLIContent = ({ variant }) => {
  const shadcnCmd = `npx shadcn@latest add https://reactbits.dev/r/SplitText-${variant.langCode}-${variant.styleCode}`;
  return (
    <div className="space-y-8">
      {/* Steps header */}
      <section>
        <h2 className="title-two">Steps</h2>
        <p className="leading-relaxed text-(--text-muted)">
          Use a one-time command to pull any component directly into your project.
        </p>
        <p className="mt-3 leading-relaxed text-(--text-muted)">
          React Bits uses <ExternalLink href="https://ui.shadcn.com/">shadcn</ExternalLink> for
          CLI installation — it fetches the component source directly into your project.
        </p>
      </section>

      {/* Installation */}
      <section>
        <h2 className="title-two">Installation</h2>
        <p className="leading-relaxed text-(--text-muted) mb-5">
          Below are example commands for the <span className="text-(--text-primary) font-medium">SplitText</span> component.
          Replace placeholders to fit your stack.
        </p>

        <CodeBlock code={shadcnCmd} language="bash" />
      </section>

      {/* Combination table */}
      <section>
        <p className="text-sm text-(--text-muted) mb-3">
          <span className="text-(--text-primary) font-medium">&lt;LANGUAGE&gt;</span> +{" "}
          <span className="text-(--text-primary) font-medium">&lt;STYLE&gt;</span> combinations:
        </p>
        <ul className="space-y-2">
          {[
            { combo: "JS-CSS",  desc: "JavaScript + Plain CSS" },
            { combo: "JS-TW",   desc: "JavaScript + Tailwind" },
            { combo: "TS-CSS",  desc: "TypeScript + Plain CSS" },
            { combo: "TS-TW",   desc: "TypeScript + Tailwind" },
          ].map(({ combo, desc }) => (
            <li key={combo} className="flex items-center gap-3 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-(--brand) shrink-0" />
              <span className="font-mono font-medium text-(--brand)">{combo}</span>
              <span className="text-(--text-muted)">— {desc}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

const ManualContent = ({ variant }) => {
  const steps = getManualSteps(variant);
  return (
    <div className="space-y-8">
      {steps.map(({ title, description, code, language }) => (
        <section key={title}>
          <h2 className="title-two">{title}</h2>
          <p className="leading-relaxed text-(--text-muted)">{description}</p>
          {code && <CodeBlock code={code} language={language} />}
        </section>
      ))}
    </div>
  );
};

const Installation = () => {
  const [activeMethod, setActiveMethod] = useState("CLI");
  const [activeVariant, setActiveVariant] = useState("js-css");

  const variant = variants.find((v) => v.id === activeVariant);

  return (
    <div className="max-w-3xl mx-auto px-6 text-(--text-primary)">

      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-medium text-(--brand) leading-relaxed uppercase tracking-wider mb-3">
          Get Started
        </p>
        <h1 className="title-two">Installation</h1>
        <p className="mb-4 leading-relaxed">
          React Bits offers two ways to add components to your project — a CLI for quick automated installs, or a manual approach where you copy and paste the code directly.
        </p>
        <p className="leading-relaxed">
          Both methods give you full ownership of the code. There's no runtime dependency on React Bits — once it's in your project, it's yours to modify freely.
        </p>
      </div>

      {/* Method Cards */}
      <div className="mb-8">
        <p className="text-sm text-(--text-muted) mb-4">Click the cards below to change your preferred method.</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              id: "Manual",
              icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="8" y="8" width="13" height="13" rx="2" />
                  <path d="M3 16V5a2 2 0 0 1 2-2h11" />
                </svg>
              ),
            },
            {
              id: "CLI",
              icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="18" rx="2" />
                  <path d="M7 9l4 4-4 4" />
                  <path d="M13 17h4" />
                </svg>
              ),
            },
          ].map(({ id, icon }) => (
            <button
              key={id}
              onClick={() => setActiveMethod(id)}
              className={`flex flex-col items-center justify-center gap-3 py-8 rounded-xl border transition-all duration-200 cursor-pointer ${
                activeMethod === id
                  ? "border-(--brand) text-(--brand) bg-(--bg-card)"
                  : "border-(--border-secondary) text-(--text-muted) bg-(--bg-card) hover:border-(--border-primary) hover:text-(--text-primary)"
              }`}
            >
              {icon}
              <span className="text-sm font-medium">{id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Variant Selector */}
      <div className="mb-10">
        <p className="text-sm text-(--text-muted) mb-3">Select your preferred language and styling:</p>
        <div className="grid grid-cols-4 gap-3">
          {variants.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveVariant(id)}
              className={`py-3 px-2 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer text-center ${
                activeVariant === id
                  ? "border-(--brand) text-(--brand) bg-(--bg-card)"
                  : "border-(--border-secondary) text-(--text-muted) bg-(--bg-card) hover:border-(--border-primary) hover:text-(--text-primary)"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic content */}
      <div className="mb-10">
        {activeMethod === "CLI"
          ? <CLIContent variant={variant} />
          : <ManualContent variant={variant} />
        }
      </div>

      {/* Requirements note */}
      <section className="mb-10 rounded-md border border-(--border-secondary) bg-(--bg-card) p-5">
        <h3 className="font-semibold text-(--text-primary) mb-2 text-sm uppercase tracking-wider">
          Requirements
        </h3>
        <ul className="space-y-2">
          {[
            { label: "React", value: "18 or later" },
            { label: "Node.js", value: "16+" },
            { label: "Tailwind CSS", value: "Optional, some components use it" },
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
      <div className="rounded-md border border-(--border-secondary) bg-(--bg-card) p-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-(--text-primary) uppercase tracking-widest mb-1">Next</p>
          <p className="font-semibold text-(--text-muted)">Components</p>
        </div>
        <Link to="/components">
          <Button text="Browse Components" icon={<FaArrowRightLong />} />
        </Link>
      </div>

    </div>
  );
};

export default Installation;
