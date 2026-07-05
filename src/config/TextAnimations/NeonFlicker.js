import { DOMAIN_URL } from '../../constants/site';
import NeonFlickerPrompt from '../../prompts/TextAnimations/NeonFlicker.txt?raw';
export { NeonFlickerPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const INITIAL_PROPS = {
  text:      'NEON',
  color:     '#d35af8',
  glow:      '#d35af8',
  glowSoft:  '#d35af8',
  dim:       '#d35af8',
  minGlow:   0,
  maxGlow:   1,
  charDelay: 0.18,
  repeat:    true,
};

export const PROPS_DATA = [
  // TEXT
  { name: 'text',      type: 'string',  def: '"NEON"',     desc: 'Display text to animate.' },
  // STAGGER
  { name: 'charDelay', type: 'number',  def: '0.18',       desc: 'Stagger delay (s) between each character turning on.' },
  // STYLE
  { name: 'color',     type: 'string',  def: '"#00f5ff"',  desc: 'CSS color value for the lit-up text, e.g. "#fff" or "crimson".' },
  { name: 'glow',      type: 'string',  def: 'color',      desc: 'Peak glow color, used at full brightness. Falls back to `color` when omitted.' },
  { name: 'glowSoft',  type: 'string',  def: 'color',      desc: 'Mid-flicker glow color, used at partial brightness. Falls back to `color` when omitted.' },
  { name: 'dim',       type: 'string',  def: 'color',      desc: 'Idle/off-state color shown before the animation starts. Falls back to `color` when omitted.' },
  { name: 'minGlow',   type: 'number',  def: '0',          desc: 'Minimum glow intensity, 0-1. 0 disables glow at the dimmest point of the flicker.' },
  { name: 'maxGlow',   type: 'number',  def: '1',          desc: 'Maximum glow intensity, 0-2. 1 is the original glow strength, 2 is extra intense.' },
  // TIMING
  { name: 'repeat',    type: 'boolean', def: 'false',      desc: 'Loop the flicker animation indefinitely.' },
  // CLASSNAMES
  { name: 'className', type: 'string',  def: '""',         desc: 'Extra classes applied to the root wrapper div.' },
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
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/NeonFlicker-${variant}`,
  npm:  `npx shadcn@latest add ${DOMAIN_URL}/r/NeonFlicker-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/NeonFlicker-${variant}`,
  bun:  `bunx shadcn@latest add ${DOMAIN_URL}/r/NeonFlicker-${variant}`,
});

export const getJsrepoCmds = (variant) => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/NeonFlicker-${variant}`,
  npm:  `npx jsrepo@latest add ${DOMAIN_URL}/r/NeonFlicker-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/NeonFlicker-${variant}`,
  bun:  `bunx jsrepo@latest add ${DOMAIN_URL}/r/NeonFlicker-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/TextAnimations/NeonFlicker/NeonFlicker?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/TextAnimations/NeonFlicker/NeonFlicker?raw';
import TS_CSS_CODE      from '../../variants/tsCss/TextAnimations/NeonFlicker/NeonFlicker?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/TextAnimations/NeonFlicker/NeonFlicker?raw';

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