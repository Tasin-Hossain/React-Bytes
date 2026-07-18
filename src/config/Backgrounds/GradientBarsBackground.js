import { DOMAIN_URL } from '../../constants/site';
import GradientBarsBackgroundPrompt from '../../prompts/Backgrounds/GradientBarsBackground.txt?raw';
export { GradientBarsBackgroundPrompt };
export const AUTHOR_NAME = 'Mohammad Tasin';

export const INITIAL_PROPS = {
  numBars: 12,
  gradientFrom: '#5227FF',
  gradientTo: 'transparent',
  direction : "bottom",
  animationDuration: 3.5,
  noise : 0,
  className: '',
  backgroundColor: '',
  demoContent: false,
};

export const PROPS_DATA = [
  { name: 'numBars',           type: 'number',  def: '7',             desc: 'How many bars are drawn across the width. Odd numbers stay symmetric around the center.' },
  { name: 'gradientFrom',      type: 'string',  def: '"rgb(255, 60, 0)"', desc: 'Bar color at the anchored edge of the linear gradient (any CSS color string).' },
  { name: 'gradientTo',        type: 'string',  def: '"transparent"', desc: 'Bar color at the far edge of the gradient, fading out by default.' },
  { name: 'direction',         type: 'string',  def: '"bottom"',      desc: 'Which edge the bars grow from and anchor to: "bottom" or "top".' },
  { name: 'animationDuration', type: 'number',  def: '2',             desc: 'Seconds per pulse cycle for the scaleY breathing animation.' },
  { name: 'noise',             type: 'number',  def: '0',             desc: 'Grayscale static/grain intensity inside each bar, from 0 to 1. 0–0.5 fades in a single fine-grain layer; above 0.5 a second, coarser layer stacks on top so the grain keeps intensifying. Flickers to a new random offset roughly every 50ms and fades out together with the gradient toward gradientTo.' },
  { name: 'backgroundColor',   type: 'string',  def: '"rgb(10, 10, 10)"', desc: 'Section background rendered behind the bars.' },
  { name: 'className',         type: 'string',  def: '""',            desc: 'Extra classes applied to the bars wrapper div.' },
  { name: 'children',          type: 'ReactNode', def: 'undefined',  desc: 'Content rendered centered above the bars (headline, controls, etc.).' },
  { name: 'demoContent',       type: 'boolean', def: 'false',        desc: 'Demo-only toggle to overlay sample content on the background preview (not a real component prop).' },
];

export const dep = [];

export const PKG_CMDS = {
  pnpm: 'pnpm add react',
  npm:  'npm install react',
  yarn: 'yarn add react',
  bun:  'bun add react',
};

export const getShadcnCmds = (variant) => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/GradientBarsBackground-${variant}`,
  npm:  `npx shadcn@latest add ${DOMAIN_URL}/r/GradientBarsBackground-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/GradientBarsBackground-${variant}`,
  bun:  `bunx shadcn@latest add ${DOMAIN_URL}/r/GradientBarsBackground-${variant}`,
});
export const getJsrepoCmds = (variant) => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/GradientBarsBackground-${variant}`,
  npm:  `npx jsrepo@latest add ${DOMAIN_URL}/r/GradientBarsBackground-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/GradientBarsBackground-${variant}`,
  bun:  `bunx jsrepo@latest add ${DOMAIN_URL}/r/GradientBarsBackground-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/Backgrounds/GradientBarsBackground/GradientBarsBackground?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Backgrounds/GradientBarsBackground/GradientBarsBackground?raw';
import TS_CSS_CODE      from '../../variants/tsCss/Backgrounds/GradientBarsBackground/GradientBarsBackground?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Backgrounds/GradientBarsBackground/GradientBarsBackground?raw';

export { JS_CSS_CODE, JS_TAILWIND_CODE, TS_CSS_CODE, TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css':      JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css':      TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE,
};