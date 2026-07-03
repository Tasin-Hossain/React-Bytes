import { DOMAIN_URL } from '../../constants/site';
import MeltGlitchTextPrompt from '../../prompts/TextAnimations/MeltGlitchText.txt?raw';
export { MeltGlitchTextPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const FONT_WEIGHT_OPTIONS = [
  { value: 400, label: '400 (Regular)' },
  { value: 500, label: '500 (Medium)' },
  { value: 600, label: '600 (Semibold)' },
  { value: 700, label: '700 (Bold)' },
  { value: 800, label: '800 (Extrabold)' },
  { value: 900, label: '900 (Black)' }
];

export const FONT_SIZE_OPTIONS = [
  { value: 28, label: '28px' },
  { value: 32, label: '32px' },
  { value: 42, label: '42px (Default)' },
  { value: 56, label: '56px' },
  { value: 72, label: '72px' }
];

export const RADIUS_OPTIONS = [
  { value: 60, label: '60px' },
  { value: 80, label: '80px' },
  { value: 110, label: '110px (Default)' },
  { value: 150, label: '150px' },
  { value: 200, label: '200px' }
];

export const DROP_AMOUNT_OPTIONS = [
  { value: 8, label: '8px' },
  { value: 12, label: '12px' },
  { value: 16, label: '16px (Default)' },
  { value: 24, label: '24px' },
  { value: 32, label: '32px' }
];

export const INITIAL_PROPS = {
  text: 'Glitchy on hover.',
  fontSize: 42,
  fontWeight: 800,
  color: '#d35af8',
  cyanColor: '#5ce1ff',
  magentaColor: '#ff5cf0',
  radius: 110,
  dropAmount: 24
};

export const PROPS_DATA = [
  // TEXT
  { name: 'text',         type: 'string', def: '"Glitchy on hover."', desc: 'Text content to render and animate.' },
  // TYPOGRAPHY
  { name: 'fontSize',     type: 'number', def: '42',                  desc: 'Font size in px for each character.' },
  { name: 'fontWeight',   type: 'number', def: '800',                 desc: 'Font weight for the text.' },
  // COLORS
  { name: 'color',        type: 'string', def: '"#d35af8"',           desc: 'Base color of the main (top) text layer.' },
  { name: 'cyanColor',    type: 'string', def: '"#5ce1ff"',           desc: 'Color of the cyan chromatic echo layer.' },
  { name: 'magentaColor', type: 'string', def: '"#ff5cf0"',           desc: 'Color of the magenta chromatic echo layer.' },
  // ANIMATION
  { name: 'radius',       type: 'number', def: '110',                 desc: 'Cursor proximity radius (px) within which characters react.' },
  { name: 'dropAmount',   type: 'number', def: '16',                  desc: 'Max vertical sag/drop (px) applied to the base character; echo layers drop further.' },
  // CLASSNAMES
  { name: 'className',    type: 'string', def: '""',                  desc: 'Extra classes applied to the root wrapper div.' },
];

export const dep = [
  { name: 'gsap', version: '3.15.0' },
];

export const PKG_CMDS = {
  pnpm: 'pnpm add gsap',
  npm:  'npm install gsap',
  yarn: 'yarn add gsap',
  bun:  'bun add gsap',
};

export const getShadcnCmds = (variant) => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/MeltGlitchText-${variant}`,
  npm:  `npx shadcn@latest add ${DOMAIN_URL}/r/MeltGlitchText-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/MeltGlitchText-${variant}`,
  bun:  `bunx shadcn@latest add ${DOMAIN_URL}/r/MeltGlitchText-${variant}`,
});
export const getJsrepoCmds = (variant) => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/MeltGlitchText-${variant}`,
  npm:  `npx jsrepo@latest add ${DOMAIN_URL}/r/MeltGlitchText-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/MeltGlitchText-${variant}`,
  bun:  `bunx jsrepo@latest add ${DOMAIN_URL}/r/MeltGlitchText-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/TextAnimations/MeltGlitchText/MeltGlitchText?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/TextAnimations/MeltGlitchText/MeltGlitchText?raw';
import TS_CSS_CODE      from '../../variants/tsCss/TextAnimations/MeltGlitchText/MeltGlitchText?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/TextAnimations/MeltGlitchText/MeltGlitchText?raw';

export { JS_CSS_CODE };
export { JS_TAILWIND_CODE };
export { TS_CSS_CODE };
export { TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css':      JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css':      TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE,
};