import { DOMAIN_URL } from '../../constants/site';
import Letter3DSwapPrompt from '../../prompts/TextAnimations/Letter3DSwap.txt?raw';
export { Letter3DSwapPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const DIRECTION_OPTIONS = [
  { label: 'Top',    value: 'top' },
  { label: 'Right',  value: 'right' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Left',   value: 'left' },
];

export const STAGGER_FROM_OPTIONS = [
  { label: 'First',  value: 'first' },
  { label: 'Last',   value: 'last' },
  { label: 'Center', value: 'center' },
  { label: 'Random', value: 'random' },
];

export const TRIGGER_OPTIONS = [
  { label: 'Hover',  value: 'hover' },
  { label: 'Mount',  value: 'mount' },
  { label: 'Manual', value: 'manual' },
];

export const INITIAL_PROPS = {
  text:            '3D SWAP HOVER',
  direction:       'top',
  staggerFrom:     'first',
  staggerDuration: 50,
  flipDuration:    0.45,
  trigger:         'hover',
  className:       'text-4xl md:text-6xl font-bold text-[#d35af8]',
  charClassName:   '',
};

export const PROPS_DATA = [
  // TEXT
  { name: 'text',            type: 'string',                                 def: '"DEPARTURES"', desc: 'Display text to split into characters and flip. Re-splits into a fresh set of characters whenever it changes.' },
  // STAGGER
  { name: 'direction',       type: '"top" | "right" | "bottom" | "left"',    def: '"right"',       desc: 'Flip axis — which edge each character rotates around.' },
  { name: 'staggerFrom',     type: 'string | number',                        def: '"first"',       desc: 'Stagger origin: "first", "last", "center", "random", or an index.' },
  { name: 'staggerDuration', type: 'number',                                 def: '50',            desc: 'Delay (ms) between each character\u2019s flip start.' },
  // TIMING
  { name: 'flipDuration',    type: 'number',                                 def: '0.45',          desc: 'Duration (s) of each character\u2019s flip tween. Ease is fixed to "back.out(1.6)".' },
  { name: 'trigger',         type: '"hover" | "mount" | "manual"',           def: '"hover"',       desc: 'What starts the flip: hovering the board, once on mount, or an imperative call via ref.flip().' },
  { name: 'onFlipComplete',  type: '() => void',                             def: 'undefined',     desc: 'Called once the full staggered flip timeline finishes.' },
  // STYLE
  { name: 'charClassName',   type: 'string',                                 def: '""',            desc: 'Extra classes applied to each character\u2019s flip container.' },
  // CLASSNAMES
  { name: 'className',       type: 'string',                                 def: '""',            desc: 'Extra classes applied to the root wrapper element.' },
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
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/Letter3DSwap-${variant}`,
  npm:  `npx shadcn@latest add ${DOMAIN_URL}/r/Letter3DSwap-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/Letter3DSwap-${variant}`,
  bun:  `bunx shadcn@latest add ${DOMAIN_URL}/r/Letter3DSwap-${variant}`,
});

export const getJsrepoCmds = (variant) => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/Letter3DSwap-${variant}`,
  npm:  `npx jsrepo@latest add ${DOMAIN_URL}/r/Letter3DSwap-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/Letter3DSwap-${variant}`,
  bun:  `bunx jsrepo@latest add ${DOMAIN_URL}/r/Letter3DSwap-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/TextAnimations/Letter3DSwap/Letter3DSwap?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/TextAnimations/Letter3DSwap/Letter3DSwap?raw';
import TS_CSS_CODE      from '../../variants/tsCss/TextAnimations/Letter3DSwap/Letter3DSwap?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/TextAnimations/Letter3DSwap/Letter3DSwap?raw';

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