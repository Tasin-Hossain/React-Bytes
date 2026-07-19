import { DOMAIN_URL } from '../../constants/site';
import SilkPrompt from '../../prompts/Backgrounds/Silk.txt?raw';
export { SilkPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const INITIAL_PROPS = {
  speed: 5,
  scale: 1,
  color: '#5227FF',
  noiseIntensity: 1.5,
  rotation: 0,

};

export const PROPS_DATA = [
  // Motion
  { name: 'speed', type: 'number', def: '5', desc: 'Controls the animation speed of the silk effect.' },
  { name: 'rotation', type: 'number', def: '0', desc: 'Controls the rotation of the silk pattern, in radians.' },

  // Pattern
  { name: 'scale', type: 'number', def: '1', desc: 'Controls the scale of the silk pattern.' },
  { name: 'noiseIntensity', type: 'number', def: '1.5', desc: 'Controls the intensity of the noise/grain effect layered over the pattern.' },

  // Visuals
  { name: 'color', type: 'string', def: '"#7B7481"', desc: 'Hex color code for the silk pattern.' },
  { name: 'className', type: 'string', def: '""', desc: 'Additional Tailwind or CSS classes applied to the outer wrapper.' },
  { name: 'showContent', type: 'boolean', def: 'true', desc: 'Toggles the built-in "silk" title and subtitle overlay. Set to false to use the canvas purely as a background behind your own content.' }
];

export const dep = [];

export const PKG_CMDS = {
  pnpm: null,
  npm: null,
  yarn: null,
  bun: null
};

export const getShadcnCmds = variant => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/Silk-${variant}`,
  npm: `npx shadcn@latest add ${DOMAIN_URL}/r/Silk-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/Silk-${variant}`,
  bun: `bunx shadcn@latest add ${DOMAIN_URL}/r/Silk-${variant}`
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/Silk-${variant}`,
  npm: `npx jsrepo@latest add ${DOMAIN_URL}/r/Silk-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/Silk-${variant}`,
  bun: `bunx jsrepo@latest add ${DOMAIN_URL}/r/Silk-${variant}`
});

import JS_CSS_CODE from '../../variants/jsCss/Backgrounds/Silk/Silk?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Backgrounds/Silk/Silk?raw';
import TS_CSS_CODE from '../../variants/tsCss/Backgrounds/Silk/Silk?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Backgrounds/Silk/Silk?raw';

export { JS_CSS_CODE };
export { JS_TAILWIND_CODE };
export { TS_CSS_CODE };
export { TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css': JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css': TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE
};