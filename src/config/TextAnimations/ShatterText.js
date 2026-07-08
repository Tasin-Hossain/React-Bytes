import { DOMAIN_URL } from '../../constants/site';
import ShatterTextPrompt from '../../prompts/TextAnimations/ShatterText.txt?raw';
export { ShatterTextPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const TRIGGER_OPTIONS = [
  { label: 'Hover', value: 'hover' },
  { label: 'Click',  value: 'click' },
];

export const FALL_EASE_OPTIONS = [
  { label: 'Power2 in', value: 'power2.in' },
  { label: 'Power4 in', value: 'power4.in' },
  { label: 'Circ in',   value: 'circ.in' },
  { label: 'Linear',    value: 'none' },
];

export const REASSEMBLE_EASE_OPTIONS = [
  { label: 'Bounce out',  value: 'bounce.out' },
  { label: 'Elastic out', value: 'elastic.out(1,0.5)' },
  { label: 'Back out',    value: 'back.out(1.7)' },
  { label: 'Power2 out',  value: 'power2.out' },
];


export const INITIAL_PROPS = {
  text:               'SHATTER',
  trigger:            'hover',
  minY:               100,
  maxY:               150,
  minX:               -15,
  maxX:               15,
  minRotation:        -90,
  maxRotation:        90,
  shatterOpacity:     0.3,
  shatterColor:       '#ff2d78',
  color:              '#d35af8',
  fallDuration:       0.35,
  reassembleDuration: 0.6,
  fallEase:           'power2.in',
  reassembleEase:     'bounce.out',
  stagger:            0.012,
  reassembleGap:      0.05,
  disabled:           false,
  textClassName : "text-6xl sm:text-6xl md:text-6xl lg:text-8xl font-bold",
};

export const PROPS_DATA = [
  // TEXT
  { name: 'text',               type: 'string',  def: '"SHATTER PHYSICS"', desc: 'Display text to animate.' },
  // TRIGGER
  { name: 'trigger',            type: 'string',  def: '"hover"',           desc: 'What starts the shatter, "hover" or "click".' },
  { name: 'disabled',           type: 'boolean', def: 'false',             desc: 'Disables the shatter interaction entirely.' },
  // FALL PHYSICS
  { name: 'minY',                type: 'number',  def: '30',                desc: 'Minimum vertical drop distance in pixels.' },
  { name: 'maxY',                type: 'number',  def: '55',                desc: 'Maximum vertical drop distance in pixels.' },
  { name: 'minX',                type: 'number',  def: '-15',               desc: 'Minimum horizontal drift in pixels.' },
  { name: 'maxX',                type: 'number',  def: '15',                desc: 'Maximum horizontal drift in pixels.' },
  { name: 'minRotation',         type: 'number',  def: '-90',               desc: 'Minimum rotation in degrees while falling apart.' },
  { name: 'maxRotation',         type: 'number',  def: '90',                desc: 'Maximum rotation in degrees while falling apart.' },
  // TIMING
  { name: 'fallDuration',        type: 'number',  def: '0.35',              desc: 'Duration (s) of the fall-apart phase per character.' },
  { name: 'reassembleDuration',  type: 'number',  def: '0.6',               desc: 'Duration (s) of the reassemble phase per character.' },
  { name: 'fallEase',            type: 'string',  def: '"power2.in"',       desc: 'GSAP ease used while characters fall apart.' },
  { name: 'reassembleEase',      type: 'string',  def: '"bounce.out"',      desc: 'GSAP ease used while characters bounce back into place.' },
  { name: 'stagger',             type: 'number',  def: '0.012',             desc: 'Delay (s) between each character starting its fall.' },
  { name: 'reassembleGap',       type: 'number',  def: '0.05',              desc: 'Pause (s) between the fall finishing and reassembly starting.' },
  // STYLE
  { name: 'shatterOpacity',      type: 'number',  def: '0.3',               desc: 'Opacity of each character at the moment of shatter, 0-1.' },
  { name: 'shatterColor',        type: 'string',  def: '"#ff2d78"',         desc: 'Color characters flash to while shattered.' },
  { name: 'resetColor',          type: 'string',  def: '"currentColor"',    desc: 'Color characters return to once reassembled.' },
  { name: 'textClassName',       type: 'string',  def: '"text-4xl md:text-5xl font-bold text-white"', desc: 'Classes controlling font size, weight, and color.' },
  // CLASSNAMES
  { name: 'className',           type: 'string',  def: '""',                desc: 'Extra classes applied to the root wrapper.' },
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
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/ShatterText-${variant}`,
  npm:  `npx shadcn@latest add ${DOMAIN_URL}/r/ShatterText-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/ShatterText-${variant}`,
  bun:  `bunx shadcn@latest add ${DOMAIN_URL}/r/ShatterText-${variant}`,
});

export const getJsrepoCmds = (variant) => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/ShatterText-${variant}`,
  npm:  `npx jsrepo@latest add ${DOMAIN_URL}/r/ShatterText-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/ShatterText-${variant}`,
  bun:  `bunx jsrepo@latest add ${DOMAIN_URL}/r/ShatterText-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/TextAnimations/ShatterText/ShatterText?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/TextAnimations/ShatterText/ShatterText?raw';
import TS_CSS_CODE      from '../../variants/tsCss/TextAnimations/ShatterText/ShatterText?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/TextAnimations/ShatterText/ShatterText?raw';

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