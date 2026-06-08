/**
 * Run this ONCE in your project root:
 *   node convertToStringExport.js
 *
 * What it does:
 *   Reads each content variant file, wraps the entire source
 *   in a template-literal string, and re-exports it as default.
 *
 * Before:
 *   import { useRef } from 'react';
 *   ...
 *   export default SplitText;
 *
 * After:
 *   const code = `import { useRef } from 'react';
 *   ...
 *   export default SplitText;`;
 *   export default code;
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const FILES = [
  'src/variants/jsCss/TextAnimations/MagneticText/MagneticText.jsx',
  'src/variants/jsTailwind/TextAnimations/MagneticText/MagneticText.jsx',
  'src/variants/tsCss/TextAnimations/MagneticText/MagneticText.tsx',
  'src/variants/tsTailwind/TextAnimations/MagneticText/MagneticText.tsx',
];

FILES.forEach((relPath) => {
  // eslint-disable-next-line no-undef
  const fullPath = resolve(process.cwd(), relPath);

  let source;
  try {
    source = readFileSync(fullPath, 'utf-8');
  } catch {
    console.warn(`⚠️  Skipped (not found): ${relPath}`);
    return;
  }

  // Already converted — skip
  if (source.trimStart().startsWith('const code = `')) {
    console.log(`✓  Already converted: ${relPath}`);
    return;
  }

  // Escape backticks and ${} inside the source so they don't break the template literal
  const escaped = source
    .replace(/\\/g, '\\\\')   // escape existing backslashes first
    .replace(/`/g, '\\`')     // escape backticks
    .replace(/\$\{/g, '\\${'); // escape template expressions

  const output = `const code = \`${escaped}\`;\nexport default code;\n`;

  writeFileSync(fullPath, output, 'utf-8');
  console.log(`✅  Converted: ${relPath}`);
});
