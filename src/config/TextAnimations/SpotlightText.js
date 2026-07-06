import { DOMAIN_URL } from '../../constants/site';
import SpotlightTextPrompt from '../../prompts/TextAnimations/SpotlightText.txt?raw';
export { SpotlightTextPrompt };

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
  text:         'SPOTLIGHT',
  charDelay:    0.09,
  duration:     0.25,
  repeat:       true,
  dimOpacity:   0.01,
  baseColor:    '#8a8a86',
  spotColor:    '#d35af8',
  ease:         'power2.out',

};

export const PROPS_DATA = [
  // TEXT
  { name: 'text',        type: 'string',  def: '"SPOTLIGHT"', desc: 'Display text to animate.' },
  // MOTION
  { name: 'charDelay',   type: 'number',  def: '0.09',        desc: 'Stagger (seconds) between each character reveal.' },
  { name: 'duration',    type: 'number',  def: '0.25',        desc: 'Full reveal duration (seconds) for each character.' },
  { name: 'repeat',      type: 'boolean', def: 'false',       desc: 'Loop the animation continuously.' },
  { name: 'dimOpacity',  type: 'number',  def: '0.08',        desc: 'Base opacity of characters before the spotlight reveals them.' },
  // TIMING
  { name: 'ease',        type: 'string',  def: '"power2.out"', desc: 'GSAP ease used for the reveal flash. See EASE_OPTIONS.' },
  // STYLE
  { name: 'baseColor',   type: 'string',  def: '"#8a8a86"',   desc: 'Character color at rest / dim state.' },
  { name: 'spotColor',   type: 'string',  def: '"#e24b4a"',   desc: 'Character color at peak spotlight brightness.' },
  // SIZING
  { name: 'minFontSize', type: 'number',  def: '16',          desc: 'Smallest font size (px) the text will shrink to on narrow containers.' },
  { name: 'maxFontSize', type: 'number',  def: '96',          desc: 'Largest font size (px), used as the natural/base size.' },
  // CLASSNAMES
  { name: 'className',   type: 'string',  def: '""',          desc: 'Extra classes applied to the root wrapper div.' },
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
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/SpotlightText-${variant}`,
  npm:  `npx shadcn@latest add ${DOMAIN_URL}/r/SpotlightText-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/SpotlightText-${variant}`,
  bun:  `bunx shadcn@latest add ${DOMAIN_URL}/r/SpotlightText-${variant}`,
});

export const getJsrepoCmds = (variant) => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/SpotlightText-${variant}`,
  npm:  `npx jsrepo@latest add ${DOMAIN_URL}/r/SpotlightText-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/SpotlightText-${variant}`,
  bun:  `bunx jsrepo@latest add ${DOMAIN_URL}/r/SpotlightText-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/TextAnimations/SpotlightText/SpotlightText?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/TextAnimations/SpotlightText/SpotlightText?raw';
import TS_CSS_CODE      from '../../variants/tsCss/TextAnimations/SpotlightText/SpotlightText?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/TextAnimations/SpotlightText/SpotlightText?raw';

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