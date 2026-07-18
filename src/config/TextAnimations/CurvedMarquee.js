import { DOMAIN_URL } from '../../constants/site';
import CurvedMarqueePrompt from '../../prompts/TextAnimations/CurvedMarquee.txt?raw';
export { CurvedMarqueePrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const DIRECTION_OPTIONS = [
  { label: 'Left',  value: 'left' },
  { label: 'Right', value: 'right' },
];

export const INITIAL_PROPS = {
  text:            'Be ✦ Creative ✦ With ✦ React ✦ Bytes ✦',
  color:           '#d35af8',
  direction:       'right',
  baseVelocity:    18,
  curveAmount:     350,
  gap:             0,
  draggable:       true,
  dragIntensity:   8,
  fade:            true,
  fadePercent:     20,
  className:       '',
};

export const PROPS_DATA = [
  // TEXT
  { name: 'text',          type: 'string',                  def: '"React Bytes"', desc: 'Text content that repeats along the curved path. Re-measured whenever it changes.' },
  { name: 'font',          type: 'object',                   def: '{ fontFamily: "Inter", fontWeight: 400, fontSize: 64, lineHeight: "1.5em", letterSpacing: "1px", textAlign: "left" }', desc: 'Font settings applied to the SVG text (family, weight, size, spacing). No dedicated Customize control — wire manually if you expose it.' },
  { name: 'color',         type: 'string',                  def: '"#d35af8"',   desc: 'Fill color of the marquee text.' },
  // MOTION
  { name: 'direction',     type: '"left" | "right"',        def: '"right"',     desc: 'Scroll direction of the loop.' },
  { name: 'baseVelocity',  type: 'number',                  def: '35',          desc: 'Base auto-scroll speed, expressed as a percentage of the internal max speed (800px/s).' },
  { name: 'curveAmount',   type: 'number',                  def: '-400',        desc: 'Vertical bend of the path — negative arcs the text upward, positive arcs it downward.' },
  { name: 'gap',           type: 'number',                  def: '12',          desc: 'Extra spacing between each repeated copy of the text.' },
  // DRAG
  { name: 'draggable',     type: 'boolean',                 def: 'true',        desc: 'Whether the marquee can be grabbed and flung with pointer input.' },
  { name: 'dragIntensity', type: 'number',                  def: '10',          desc: 'How strongly a drag gesture accelerates the scroll velocity.' },
  // FADE
  { name: 'fade',          type: 'boolean',                 def: 'true',        desc: 'Whether the left/right edges fade out via a mask gradient.' },
  { name: 'fadePercent',   type: 'number',                  def: '12',          desc: 'Width of each edge fade, as a percentage of the SVG width.' },
  // STYLE
  { name: 'style',         type: 'object',                  def: '{}',          desc: 'Inline styles merged onto the root wrapper div. No dedicated control.' },
  // CLASSNAMES
  { name: 'className',     type: 'string',                  def: '""',          desc: 'Extra classes applied to the root wrapper element.' },
];

export const dep = [];

export const PKG_CMDS = {
  pnpm: '',
  npm:  '',
  yarn: '',
  bun:  '',
};

export const getShadcnCmds = (variant) => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/CurvedMarquee-${variant}`,
  npm:  `npx shadcn@latest add ${DOMAIN_URL}/r/CurvedMarquee-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/CurvedMarquee-${variant}`,
  bun:  `bunx shadcn@latest add ${DOMAIN_URL}/r/CurvedMarquee-${variant}`,
});

export const getJsrepoCmds = (variant) => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/CurvedMarquee-${variant}`,
  npm:  `npx jsrepo@latest add ${DOMAIN_URL}/r/CurvedMarquee-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/CurvedMarquee-${variant}`,
  bun:  `bunx jsrepo@latest add ${DOMAIN_URL}/r/CurvedMarquee-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/TextAnimations/CurvedMarquee/CurvedMarquee?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/TextAnimations/CurvedMarquee/CurvedMarquee?raw';
import TS_CSS_CODE      from '../../variants/tsCss/TextAnimations/CurvedMarquee/CurvedMarquee?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/TextAnimations/CurvedMarquee/CurvedMarquee?raw';

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