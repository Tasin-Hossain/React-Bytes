import { DOMAIN_URL } from '../../constants/site';
import ParticleTextPrompt from '../../prompts/TextAnimations/ParticleText.txt?raw';
export { ParticleTextPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const INITIAL_PROPS = {
  text: 'creative.',
  colors: ['#40ffaa', '#40aaff', '#ff40aa', '#aa40ff'],
  particleSize: 2,
  particleGap: 2,
  mouseControls: { enabled: true, radius: 150, strength: 5 },
  fontSize: 200,
  autoFit: true,
  backgroundColor: 'transparent',
  friction: 0.75,
  shape: 'ascii',
  asciiChars: 'mew',
  ease: 0.05
};

export const PROPS_DATA = [
  // TEXT
  { name: 'text', type: 'string', def: '"creative."', desc: 'Text rasterized to sample particle positions from.' },
  {
    name: 'colors',
    type: 'string[]',
    def: '["#40ffaa","#40aaff","#ff40aa","#aa40ff"]',
    desc: 'Palette randomly assigned to each particle.'
  },
  // SIZING
  { name: 'particleSize', type: 'number', def: '2', desc: 'Diameter of each particle in pixels.' },
  { name: 'particleGap', type: 'number', def: '2', desc: 'Spacing between sampled particle points in pixels.' },
  { name: 'fontSize', type: 'number', def: '200', desc: 'Base font size used to rasterize the text.' },
  { name: 'autoFit', type: 'boolean', def: 'true', desc: 'Automatically shrinks font size to fit the container.' },
  // MOUSE INTERACTION
  {
    name: 'mouseControls',
    type: 'object',
    def: '{ enabled: true, radius: 150, strength: 5 }',
    desc: 'Pointer repulsion settings: enabled, radius (px), strength (force multiplier).'
  },
  // PHYSICS
  { name: 'friction', type: 'number', def: '0.75', desc: 'Velocity damping applied each frame, 0-1.' },
  { name: 'ease', type: 'number', def: '0.05', desc: 'Spring pull strength back toward the sampled base position.' },
  // SHAPE
  { name: 'shape', type: 'string', def: '"ascii"', desc: 'Particle render shape: "square", "circle", or "ascii".' },
  {
    name: 'asciiChars',
    type: 'string',
    def: '"mew"',
    desc: 'Character pool each particle randomly picks from when shape is "ascii".'
  },
  // STYLE
  { name: 'backgroundColor', type: 'string', def: '"transparent"', desc: 'Canvas background color, or "transparent".' },
  // CLASSNAMES
  { name: 'className', type: 'string', def: '""', desc: 'Extra classes applied to the root wrapper.' }
];

export const dep = [];

export const PKG_CMDS = {
  pnpm: null,
  npm: null,
  yarn: null,
  bun: null
};

export const getShadcnCmds = variant => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/ParticleText-${variant}`,
  npm: `npx shadcn@latest add ${DOMAIN_URL}/r/ParticleText-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/ParticleText-${variant}`,
  bun: `bunx shadcn@latest add ${DOMAIN_URL}/r/ParticleText-${variant}`
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/ParticleText-${variant}`,
  npm: `npx jsrepo@latest add ${DOMAIN_URL}/r/ParticleText-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/ParticleText-${variant}`,
  bun: `bunx jsrepo@latest add ${DOMAIN_URL}/r/ParticleText-${variant}`
});

import JS_CSS_CODE from '../../variants/jsCss/TextAnimations/ParticleText/ParticleText?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/TextAnimations/ParticleText/ParticleText?raw';
import TS_CSS_CODE from '../../variants/tsCss/TextAnimations/ParticleText/ParticleText?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/TextAnimations/ParticleText/ParticleText?raw';

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
