import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { componentMetadata } from '../constants/Information.js';
import { GITHUB_URL, DOMAIN_URL } from '../constants/site.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// "TextAnimations" -> "Text Animations"
const toDisplayName = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1 $2');

function groupByCategory(metadata) {
  const groups = new Map();

  Object.values(metadata).forEach((component) => {
    const list = groups.get(component.category) ?? [];
    list.push(component);
    groups.set(component.category, list);
  });

  return groups;
}

function generateLlmsText() {
  const groups = groupByCategory(componentMetadata);
  const totalComponents = Object.keys(componentMetadata).length;

  // Grab any component to use as the CLI example
  const exampleComponent = Object.values(componentMetadata)[0];

  const categorySections = [...groups.entries()]
    .map(([category, components]) => {
      const items = components
        .map((c) => `- [${c.name}](${c.docsUrl}): ${c.description}`)
        .join('\n');
      return `## ${toDisplayName(category)}\n${items}`;
    })
    .join('\n\n');

  const content = `# React Bytes

> React Bytes is an open source showcase of creative React components - ${[...groups.keys()]
    .map(toDisplayName)
    .join(', ')} - provided in four implementation variants: JavaScript + CSS, JavaScript + Tailwind, TypeScript + CSS, and TypeScript + Tailwind. Components are copy-friendly and installable via CLI (jsrepo or shadcn).

Important notes for agents:
- Components are organized by semantics first: ${[...groups.keys()].map(toDisplayName).join(', ')}.
- Each component has 4 variants. All variants are kept in sync when updated.
- Dependencies vary by component (e.g., gsap, motion). Always check and install dependencies before usage.
- This file is auto-generated from src/constants/Information.js. Do not edit it by hand — run \`npm run llms\` instead.

## Docs
- [Homepage](${DOMAIN_URL}): Landing page, quick presentation of the library.
- [Introduction](${DOMAIN_URL}/get-started/introduction): Project mission and principles.
- [Installation](${DOMAIN_URL}/get-started/installation): Manual copy and CLI commands (jsrepo, shadcn).
- [MCP Setup](${DOMAIN_URL}/get-started/mcp): Set up a MCP server to help you with development.
- [All Components](${DOMAIN_URL}/get-started/all-components): Full browsable list of every component.

## CLI
- shadcn: \`npx shadcn@latest add ${DOMAIN_URL}/r/<Component>-<LANG>-<STYLE>\`
  - <LANG>: JS | TS; <STYLE>: CSS | TW
  - Example: npx shadcn@latest add ${DOMAIN_URL}/r/${exampleComponent.name}-JS-CSS
- jsrepo: \`npx jsrepo@latest add shadcn:${DOMAIN_URL}/r/<Component>-<LANG>-<STYLE>\`
  - <LANG>: JS | TS; <STYLE>: CSS | TW
  - Example: npx jsrepo@latest add shadcn:${DOMAIN_URL}/r/${exampleComponent.name}-JS-CSS

Notes:
- Component page URLs use kebab-case paths like ${exampleComponent.docsUrl.replace(DOMAIN_URL, '')}.
- CLI component identifiers use PascalCase, e.g. ${exampleComponent.name}.

${categorySections}

## Optional
- [GitHub Repository](${GITHUB_URL}): Source code, issues, and contribution guide.
- [Sitemap](${DOMAIN_URL}/sitemap.xml): Full site sitemap.
`;

  const outputPath = path.join(__dirname, '../../public/llms.txt');
  fs.writeFileSync(outputPath, content, 'utf-8');

  console.log(`✓ llms.txt generated with ${totalComponents} components across ${groups.size} categories`);
  console.log(`  Output: ${outputPath}`);
}

generateLlmsText();