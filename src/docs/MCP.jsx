import { useState } from 'react';
import { Link } from 'react-router';
import Button from '../components/ui/Button/Button';
import { FaArrowRightLong } from 'react-icons/fa6';
import CodeBlock from '../components/shared/code/CodeBlock';
import { BsClaude, BsFillCursorFill } from 'react-icons/bs';
import { VscVscode } from 'react-icons/vsc';

const COMPONENTS_JSON = `{
  "registries": {
    "@react-bytes": "https://reactbytes.online/r/{name}.json"
  }
}`;

const EDITORS = [
  {
    id: 'claudeCode',
    label: 'Claude Code',
    cmd: 'npx shadcn@latest mcp init --client claude',
    prompts: [
      'List every background component available in the React Bytes registry',
      'Pull the Dither background from React Bytes and tint it purple',
      'Wrap my hero text with a FadeContent scroll animation from React Bytes'
    ],
    tip: 'Type /mcp inside Claude Code to inspect or restart the MCP server.',
    icon: <BsClaude size={30} />
  },
  {
    id: 'cursor',
    label: 'Cursor',
    cmd: 'npx shadcn@latest mcp init --client cursor',
    prompts: [
      'What background components does the React Bytes registry have?',
      'Install the Aurora background from React Bytes into my landing page',
      'Animate my hero heading with BlurText from the React Bytes registry'
    ],
    tip: 'Switch to Agent mode in Cursor before running MCP commands.',
    icon: <BsFillCursorFill size={30} />
  },
  {
    id: 'vscode',
    label: 'VS Code',
    cmd: 'npx shadcn@latest mcp init --client vscode',
    prompts: [
      'Browse all text animation components in the React Bytes registry',
      'Scaffold a Particles background from React Bytes on my homepage',
      'Add a CountUp counter from React Bytes to the metrics section'
    ],
    tip: 'Install the GitHub Copilot extension and enable Agent mode first.',
    icon: <VscVscode size={30} />
  }
];

/* ---------------------------------------------------------
   Shared
--------------------------------------------------------- */
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

const InlineCode = ({ children }) => (
  <span className="font-mono text-xs bg-(--bg-card) border border-(--border-secondary) px-1.5 py-0.5 rounded text-(--text-primary)">
    {children}
  </span>
);

/* ---------------------------------------------------------
   Page
--------------------------------------------------------- */
const MCP = () => {
  const [activeEditor, setActiveEditor] = useState('claudeCode');
  const editor = EDITORS.find((e) => e.id === activeEditor);

  return (
    <div className="max-w-3xl mx-auto px-6 text-(--text-primary)">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-medium text-(--brand) leading-relaxed uppercase tracking-wider mb-3">
          Get Started
        </p>
        <h1 className="title-two">MCP Server</h1>
        <p className="mt-4 mb-4 leading-relaxed">
          <ExternalLink href="https://modelcontextprotocol.io/">Model Context Protocol (MCP)</ExternalLink> is an open
          standard that lets AI editors talk directly to external registries and tools — no manual browsing needed.
        </p>
        <p className="leading-relaxed">
          Wire up the React Bytes registry once, and your editor can find, fetch, and drop in any component on demand.
        </p>
      </div>

      {/* Step 1 — register the registry */}
      <section className="mb-10">
        <h2 className="title-two mb-2">1. Register the registry</h2>
        <p className="leading-relaxed text-(--text-muted) mb-3">
          Open your project's <InlineCode>components.json</InlineCode> and add the{' '}
          <ExternalLink href="https://reactbytes.online">@react-bytes</ExternalLink> registry:
        </p>
        <CodeBlock code={COMPONENTS_JSON} language="json" />
      </section>

      {/* Step 2 — pick an editor */}
      <section className="mb-10">
        <h2 className="title-two mb-2">2. Pick your editor</h2>
        <p className="leading-relaxed text-(--text-muted) mb-4">
          Choose the client you're using, then run the one-time setup command inside your project.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {EDITORS.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveEditor(id)}
              className={`flex flex-col items-center justify-center gap-3 py-8 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                activeEditor === id
                  ? 'border-(--brand)/60 bg-(--brand)/5 text-(--brand)'
                  : 'border-(--border-secondary) bg-(--bg-card) text-(--text-muted) hover:border-(--border-primary) hover:text-(--text-primary)'
              }`}
            >
              {icon}
              <span
                className={`text-sm font-mono font-medium ${
                  activeEditor === id ? 'text-(--brand)' : 'text-(--text-muted)'
                }`}
              >
                {label}
              </span>
            </button>
          ))}
        </div>

        <p className="text-sm font-medium text-(--text-primary) mb-3">Run once inside your project root:</p>
        <CodeBlock code={editor.cmd} language="bash" />
      </section>

      {/* Step 3 — try it out */}
      <section className="mb-10">
        <h2 className="title-two mb-2">3. Try it out</h2>
        <p className="leading-relaxed text-(--text-muted) mb-3">
          After restarting {editor.label}, try asking things like:
        </p>
        <ul className="space-y-2 mb-4">
          {editor.prompts.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm rounded-md border border-(--border-secondary) bg-(--bg-card) px-3 py-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-(--brand) shrink-0 mt-1.5" />
              <span className="text-(--text-muted)">{p}</span>
            </li>
          ))}
        </ul>

        <p className="text-sm text-(--text-muted)">
          <span className="text-(--text-primary) font-medium">Tip:</span> {editor.tip}
        </p>
      </section>

      {/* Learn more */}
      <section className="mb-10 rounded-lg border border-(--border-secondary) bg-(--bg-card) p-5">
        <h3 className="font-semibold text-(--text-primary) mb-2 text-sm uppercase tracking-wider">Learn more</h3>
        <p className="leading-relaxed text-(--text-muted) mb-2">
          For a deeper dive into manual client configuration and advanced MCP usage, check the official shadcn docs.
        </p>
        <ExternalLink href="https://ui.shadcn.com/docs/mcp">ui.shadcn.com/docs/mcp</ExternalLink>
      </section>

      {/* Next step */}
      <div className="rounded-lg border border-(--border-secondary) bg-(--bg-card) p-6 flex items-center justify-between gap-4">
        <p className="text-xs text-(--text-primary) uppercase tracking-widest">Next up</p>
        <Link to="/get-started/all-components">
          <Button text="All Components" icon={<FaArrowRightLong />} />
        </Link>
      </div>
    </div>
  );
};

export default MCP;