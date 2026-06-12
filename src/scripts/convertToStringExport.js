import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

function findFiles(dir, exts = ['.jsx', '.tsx']) {
  let results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      results = results.concat(findFiles(fullPath, exts));
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

const FILES = findFiles('src/variants');

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

  if (source.trimStart().startsWith('const code = `')) {
    console.log(`✓  Already converted: ${relPath}`);
    return;
  }

  const escaped = source
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');

  const output = `const code = \`${escaped}\`;\nexport default code;\n`;

  writeFileSync(fullPath, output, 'utf-8');
  console.log(`✅  Converted: ${relPath}`);
});