import { DOMAIN_URL } from '../../constants/site';
import RainDropTextPrompt from '../../prompts/TextAnimations/RainDropText.txt?raw';
export { RainDropTextPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const EASE_OPTIONS = [
  { label: 'Bounce out',   value: 'bounce.out' },
  { label: 'Elastic out',  value: 'elastic.out(1,0.5)' },
  { label: 'Back out',     value: 'back.out(1.7)' },
  { label: 'Power2 out',   value: 'power2.out' },
];

export const INITIAL_PROPS = {
  text:        'RAIN DROP',
  color:       '#d35af8',
  delay:       0.07,
  duration:    0.9,
  dropHeight:  100,
  ease:        'bounce.out',
  repeat:      true,
  repeatDelay: 1.2,
};

export const PROPS_DATA = [
  // TEXT
  { name: 'text',        type: 'string',  def: '"RAIN DROP"', desc: 'Display text to animate.' },
  // STAGGER
  { name: 'delay',       type: 'number',  def: '0.07',        desc: 'Stagger delay (s) between each character starting its drop.' },
  // TIMING
  { name: 'duration',    type: 'number',  def: '0.9',         desc: 'Fall + settle duration (s) for each character.' },
  { name: 'dropHeight',  type: 'number',  def: '100',         desc: 'Distance in pixels each character falls from before landing.' },
  { name: 'ease',        type: 'string',  def: '"bounce.out"', desc: 'GSAP ease string, e.g. "bounce.out", "elastic.out(1,0.5)", "back.out(1.7)".' },
  { name: 'repeat',      type: 'boolean', def: 'false',        desc: 'Loop the drop animation indefinitely.' },
  { name: 'repeatDelay', type: 'number',  def: '1.2',          desc: 'Pause (s) between loops when `repeat` is true.' },
  // STYLE
  { name: 'color',       type: 'string',  def: '"#111111"',   desc: 'CSS color value for the text, e.g. "#378ADD" or "crimson".' },
  { name: 'fontSize',    type: 'string',  def: '"3.75rem"',   desc: 'CSS font-size applied to each character.' },
  // CLASSNAMES
  { name: 'className',   type: 'string',  def: '""',           desc: 'Extra classes applied to the root wrapper div.' },
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
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/RainDropText-${variant}`,
  npm:  `npx shadcn@latest add ${DOMAIN_URL}/r/RainDropText-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/RainDropText-${variant}`,
  bun:  `bunx shadcn@latest add ${DOMAIN_URL}/r/RainDropText-${variant}`,
});

export const getJsrepoCmds = (variant) => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/RainDropText-${variant}`,
  npm:  `npx jsrepo@latest add ${DOMAIN_URL}/r/RainDropText-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/RainDropText-${variant}`,
  bun:  `bunx jsrepo@latest add ${DOMAIN_URL}/r/RainDropText-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/TextAnimations/RainDropText/RainDropText?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/TextAnimations/RainDropText/RainDropText?raw';
import TS_CSS_CODE      from '../../variants/tsCss/TextAnimations/RainDropText/RainDropText?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/TextAnimations/RainDropText/RainDropText?raw';

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