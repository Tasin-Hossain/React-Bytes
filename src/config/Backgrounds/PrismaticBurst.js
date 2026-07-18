import { DOMAIN_URL } from '../../constants/site';
import PrismaticBurstPrompt from '../../prompts/Backgrounds/PrismaticBurst.txt?raw';
export { PrismaticBurstPrompt };
export const AUTHOR_NAME = 'Mohammad Tasin';

export const ANIMATION_TYPES = ['rotate', 'rotate3d', 'hover'];
export const MIX_BLEND_MODES = ['lighten', 'screen', 'normal', 'none'];

export const INITIAL_PROPS = {
  intensity: 2,
  speed: 0.5,
  animationType: 'hover',
  colors: ['#000000', '#5227FF', '#00FFF0'],
  distort: 0,
  paused: false,
  offsetX: 0,
  offsetY: 0,
  hoverDampness: 0.5,
  rayCount: 0,
  mixBlendMode: 'lighten',
  className: '',
  demoContent: false,
};


export const PROPS_DATA = [
  { name: 'intensity',      type: 'number',                          def: '2',            desc: 'Overall brightness multiplier applied after accumulation.' },
  { name: 'speed',          type: 'number',                          def: '0.5',          desc: 'Global time multiplier controlling ray motion & distortion.' },
  { name: 'animationType',  type: '"rotate" | "rotate3d" | "hover"', def: '"rotate3d"',   desc: 'Core motion style: planar rotation, full 3D rotation, or pointer hover orbit.' },
  { name: 'colors',         type: 'string[]',                        def: '[]',           desc: 'Optional array of hex colors used as a gradient (otherwise spectral).' },
  { name: 'distort',        type: 'number',                          def: '0',            desc: 'Amount of bend/distortion applied to marching space (adds organic wobble).' },
  { name: 'paused',         type: 'boolean',                         def: 'false',         desc: 'Freeze time progression when true (animation stops).' },
  { name: 'offset',         type: '{ x?: number|string; y?: number|string }', def: '{ x: 0, y: 0 }', desc: 'Pixel (or CSS length) offset of focal origin from center.' },
  { name: 'hoverDampness',  type: 'number',                          def: '0',            desc: "Smoothing factor (0-1) for pointer tracking when animationType='hover'." },
  { name: 'rayCount',       type: 'number',                          def: 'undefined',    desc: 'If > 0 applies an angular comb filter to produce discrete ray spokes.' },
  { name: 'mixBlendMode',   type: "CSSProperties['mixBlendMode'] | 'none'", def: '"lighten"', desc: "Canvas CSS mix-blend-mode (e.g. lighten, screen) or 'none' for normal." },
  { name: 'className',      type: 'string',                          def: '""',           desc: 'Extra classes applied to the root wrapper div.' },
  { name: 'demoContent',    type: 'boolean',                         def: 'false',        desc: 'Demo-only toggle to overlay sample content on the background preview (not a real component prop).' },
];


export const dep = [
  { name: 'three', version: '0.180.0' },
  { name: '@react-three/fiber', version: '8.17.10' },
];

export const PKG_CMDS = {
  pnpm: 'pnpm add three @react-three/fiber',
  npm:  'npm install three @react-three/fiber',
  yarn: 'yarn add three @react-three/fiber',
  bun:  'bun add three @react-three/fiber',
};

export const getShadcnCmds = (variant) => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/PrismaticBurst-${variant}`,
  npm:  `npx shadcn@latest add ${DOMAIN_URL}/r/PrismaticBurst-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/PrismaticBurst-${variant}`,
  bun:  `bunx shadcn@latest add ${DOMAIN_URL}/r/PrismaticBurst-${variant}`,
});
export const getJsrepoCmds = (variant) => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/PrismaticBurst-${variant}`,
  npm:  `npx jsrepo@latest add ${DOMAIN_URL}/r/PrismaticBurst-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/PrismaticBurst-${variant}`,
  bun:  `bunx jsrepo@latest add ${DOMAIN_URL}/r/PrismaticBurst-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/Backgrounds/PrismaticBurst/PrismaticBurst?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Backgrounds/PrismaticBurst/PrismaticBurst?raw';
import TS_CSS_CODE      from '../../variants/tsCss/Backgrounds/PrismaticBurst/PrismaticBurst?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Backgrounds/PrismaticBurst/PrismaticBurst?raw';

export { JS_CSS_CODE, JS_TAILWIND_CODE, TS_CSS_CODE, TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css':      JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css':      TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE,
};