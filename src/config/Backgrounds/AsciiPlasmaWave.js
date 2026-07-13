import { DOMAIN_URL } from '../../constants/site';
import PlasmaWavePrompt from '../../prompts/Backgrounds/AsciiPlasmaWave.txt?raw';
export { PlasmaWavePrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const INITIAL_PROPS = {
  colors: ['#d35af8', '#00daff'],
  speed1: 0.06,
  speed2: 0.1,
  dir2: 1,
  focalLength: 1.1,
  bend1: 1.2,
  bend2: 0.4,
  rotationDeg: 24,
  xOffset: 0,
  yOffset: 0,
  cellSize: 4,
  cellFill: 1,
  asciiChars: ' .:-=+*#%@■',
};

export const PROPS_DATA = [
  // Colors
  { name: 'colors',      type: '[string, string]', def: '["#A855F7", "#06B6D4"]', desc: 'Array of two hex colors — one for each plasma wave band.' },

  // Motion
  { name: 'speed1',      type: 'number', def: '0.05', desc: 'Speed of the first plasma wave.' },
  { name: 'speed2',      type: 'number', def: '0.05', desc: 'Speed of the second plasma wave.' },
  { name: 'dir2',        type: 'number', def: '1.0',  desc: 'Direction multiplier for the second wave. Use -1 to reverse.' },

  // Camera
  { name: 'focalLength', type: 'number', def: '0.8',  desc: 'Focal length of the camera projection.' },
  { name: 'rotationDeg', type: 'number', def: '0',    desc: 'Rotation angle of the scene in degrees.' },
  { name: 'xOffset',     type: 'number', def: '0',    desc: 'Horizontal offset of the viewport.' },
  { name: 'yOffset',     type: 'number', def: '0',    desc: 'Vertical offset of the viewport.' },

  // Wave shape
  { name: 'bend1',       type: 'number', def: '1',    desc: 'Bend intensity of the first wave.' },
  { name: 'bend2',       type: 'number', def: '0.5',  desc: 'Bend intensity of the second wave.' },

  // ASCII grid
  { name: 'cellSize',    type: 'number', def: '14',   desc: 'Size of each ASCII glyph cell in pixels.' },
  { name: 'cellFill',    type: 'number', def: '0.6',  desc: 'Stroke thickness of each glyph, from thin (0) to bold/full (1).' },
  { name: 'asciiChars',  type: 'string', def: '" .:-=+*#%@■"', desc: 'Custom glyph ramp, ordered darkest/emptiest to densest. Any characters can be used.' },

  // Passthrough
  { name: 'className',   type: 'string', def: '""',   desc: 'Extra CSS classes forwarded to the wrapper div.' },
  { name: 'style',        type: 'object', def: '{}',   desc: 'Inline styles forwarded to the wrapper div.' },
];

export const dep = ['ogl'];

export const PKG_CMDS = {
  pnpm: 'pnpm add ogl',
  npm:  'npm install ogl',
  yarn: 'yarn add ogl',
  bun:  'bun add ogl',
};

export const getShadcnCmds = variant => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/AsciiPlasmaWave-${variant}`,
  npm:  `npx shadcn@latest add ${DOMAIN_URL}/r/AsciiPlasmaWave-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/AsciiPlasmaWave-${variant}`,
  bun:  `bunx shadcn@latest add ${DOMAIN_URL}/r/AsciiPlasmaWave-${variant}`,
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/AsciiPlasmaWave-${variant}`,
  npm:  `npx jsrepo@latest add ${DOMAIN_URL}/r/AsciiPlasmaWave-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/AsciiPlasmaWave-${variant}`,
  bun:  `bunx jsrepo@latest add ${DOMAIN_URL}/r/AsciiPlasmaWave-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/Backgrounds/AsciiPlasmaWave/AsciiPlasmaWave?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Backgrounds/AsciiPlasmaWave/AsciiPlasmaWave?raw';
import TS_CSS_CODE      from '../../variants/tsCss/Backgrounds/AsciiPlasmaWave/AsciiPlasmaWave?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Backgrounds/AsciiPlasmaWave/AsciiPlasmaWave?raw';

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