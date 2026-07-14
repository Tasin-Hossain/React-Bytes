import { DOMAIN_URL } from '../../constants/site';
import RotatingStarsPrompt from '../../prompts/Backgrounds/RotatingStars.txt?raw';
export { RotatingStarsPrompt };
export const AUTHOR_NAME = 'Mohammad Tasin';

export const INITIAL_PROPS = {
  x: 0,
  y: 0,
  radius: 80,
  speed: 0.45,
  thickness: 0.005,
  roundness: 0,
  blur: 0,
  opacity: 1,
  color: '#8b5cf6',
  className: '',
  demoContent: false,
};
 

export const PROPS_DATA = [
  { name: 'x',           type: 'number',  def: '0',        desc: 'Horizontal offset of the trail field center, in normalized (-1 to 1) space.' },
  { name: 'y',           type: 'number',  def: '0',        desc: 'Vertical offset of the trail field center, in normalized (-1 to 1) space.' },
  { name: 'radius',      type: 'number',  def: '15',       desc: 'Controls ring spacing/density — higher values pack more concentric trails into view.' },
  { name: 'speed',       type: 'number',  def: '1.5',      desc: 'Angular rotation speed of the star trails.' },
  { name: 'thickness',   type: 'number',  def: '0.01',     desc: 'Solid core width of each trail line.' },
  { name: 'roundness',   type: 'number',  def: '1',        desc: 'Softness of the arc end caps — higher values round the trail tips more.' },
  { name: 'blur',        type: 'number',  def: '0',        desc: 'CSS blur radius (px) applied to the whole canvas for a true soft-glow look.' },
  { name: 'opacity',     type: 'number',  def: '1',        desc: 'Overall opacity of the star trails, from 0 (invisible) to 1 (fully opaque).' },
  { name: 'color',       type: 'string',  def: '"#8b5cf6"', desc: 'Base tint color for the star trails.' },
  { name: 'className',   type: 'string',  def: '""',       desc: 'Extra classes applied to the root wrapper div.' },
  { name: 'demoContent', type: 'boolean', def: 'false',    desc: 'Demo-only toggle to overlay sample content on the background preview (not a real component prop).' },
];
 

export const dep = [];

export const PKG_CMDS = {
  pnpm: null,
  npm:  null,
  yarn: null,
  bun:  null,
};

export const getShadcnCmds = (variant) => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/RotatingStars-${variant}`,
  npm:  `npx shadcn@latest add ${DOMAIN_URL}/r/RotatingStars-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/RotatingStars-${variant}`,
  bun:  `bunx shadcn@latest add ${DOMAIN_URL}/r/RotatingStars-${variant}`,
});
export const getJsrepoCmds = (variant) => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/RotatingStars-${variant}`,
  npm:  `npx jsrepo@latest add ${DOMAIN_URL}/r/RotatingStars-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/RotatingStars-${variant}`,
  bun:  `bunx jsrepo@latest add ${DOMAIN_URL}/r/RotatingStars-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/Backgrounds/RotatingStars/RotatingStars?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Backgrounds/RotatingStars/RotatingStars?raw';
import TS_CSS_CODE      from '../../variants/tsCss/Backgrounds/RotatingStars/RotatingStars?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Backgrounds/RotatingStars/RotatingStars?raw';

export { JS_CSS_CODE, JS_TAILWIND_CODE, TS_CSS_CODE, TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css':      JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css':      TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE,
};