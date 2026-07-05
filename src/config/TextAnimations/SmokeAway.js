import { DOMAIN_URL } from '../../constants/site';
import SmokeAwayPrompt from '../../prompts/TextAnimations/SmokeAway.txt?raw';
export { SmokeAwayPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const EASE_OPTIONS = [
  'back.out(2)',
  'back.out(3)',
  'elastic.out(1,0.5)',
  'power1.out',
  'power2.out',
  'power3.out',
  'power4.out',
  'bounce.out',
  'circ.out',
  'expo.out',
  'sine.out',
];

export const INITIAL_PROPS = {
  text:        'VANISH',
  smokeY:      -20,
  smokeScale:  1.6,
  smokeBlur:   8,
  returnEase:  'sine.out',
  color:       '#d35af8',
};

export const PROPS_DATA = [
  // TEXT
  { name: 'text',        type: 'string',  def: '"VANISH"',      desc: 'Display text to animate.' },
  // MOTION
  { name: 'smokeY',      type: 'number',  def: '-20',           desc: 'Vertical offset (px) each character floats to on hover. Negative floats up, positive sinks down.' },
  { name: 'smokeScale',  type: 'number',  def: '1.6',           desc: 'Scale factor applied to a character on hover, e.g. 1.6 grows it 60%.' },
  { name: 'smokeBlur',   type: 'number',  def: '8',             desc: 'Blur intensity (px) applied on hover to create the smoke dissolve look.' },
  // TIMING
  { name: 'returnEase',  type: 'string',  def: '"back.out(2)"', desc: 'GSAP ease used when the character returns to its resting state on mouse leave.' },
  // STYLE
  { name: 'color',       type: 'string',  def: '"#d35af8"',     desc: 'CSS color value applied to each character, e.g. "#fff" or "crimson".' },
  // CLASSNAMES
  { name: 'className',   type: 'string',  def: '""',            desc: 'Extra classes applied to the root wrapper div.' },
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
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/SmokeAway-${variant}`,
  npm:  `npx shadcn@latest add ${DOMAIN_URL}/r/SmokeAway-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/SmokeAway-${variant}`,
  bun:  `bunx shadcn@latest add ${DOMAIN_URL}/r/SmokeAway-${variant}`,
});

export const getJsrepoCmds = (variant) => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/SmokeAway-${variant}`,
  npm:  `npx jsrepo@latest add ${DOMAIN_URL}/r/SmokeAway-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/SmokeAway-${variant}`,
  bun:  `bunx jsrepo@latest add ${DOMAIN_URL}/r/SmokeAway-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/TextAnimations/SmokeAway/SmokeAway?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/TextAnimations/SmokeAway/SmokeAway?raw';
import TS_CSS_CODE      from '../../variants/tsCss/TextAnimations/SmokeAway/SmokeAway?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/TextAnimations/SmokeAway/SmokeAway?raw';

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