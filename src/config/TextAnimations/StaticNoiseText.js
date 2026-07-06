import { DOMAIN_URL } from '../../constants/site';
import StaticNoiseTextPrompt from '../../prompts/TextAnimations/StaticNoiseText.txt?raw';
export { StaticNoiseTextPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const FONT_WEIGHT_OPTIONS = [
  { label: '400', value: 400 },
  { label: '500', value: 500 },
  { label: '700', value: 700 },
  { label: '900', value: 900 },
];
export const INITIAL_PROPS = {
  text:       '404 NOT-FOUND',
  color:      '#d35af8',
  fontWeight: 900,
  intensity:  0.12,
  density:    5,
  maxShift:   100,
};

export const PROPS_DATA = [
  // TEXT
  { name: 'text',       type: 'string',  def: '"static noise"', desc: 'Display text to render with the noise effect.' },
  // STYLE
  { name: 'color',      type: 'string',  def: '"#d35af8"',      desc: 'CSS color value for the text.' },
  { name: 'fontWeight', type: 'number',  def: '900',            desc: 'Font weight used when rendering the text to canvas.' },
  // NOISE
  { name: 'intensity',  type: 'number',  def: '0.12',           desc: 'Shift magnitude, 0-1. Controls how far affected rows are displaced.' },
  { name: 'density',    type: 'number',  def: '1',              desc: 'Fraction of rows affected per frame, 0-1. Lower values leave more rows static.' },
  { name: 'maxShift',   type: 'number',  def: '45',             desc: 'Max horizontal pixel shift ceiling at intensity = 1, density = 1.' },
  // CLASSNAMES
  { name: 'className',  type: 'string',  def: '""', desc: 'Classes applied to the hidden measuring span, used to size the canvas text. Also determines responsive font size.' },
];

export const dep = [];

export const PKG_CMDS = {
  pnpm: null,
  npm:  null,
  yarn: null,
  bun:  null,
};

export const getShadcnCmds = (variant) => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/StaticNoiseText-${variant}`,
  npm:  `npx shadcn@latest add ${DOMAIN_URL}/r/StaticNoiseText-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/StaticNoiseText-${variant}`,
  bun:  `bunx shadcn@latest add ${DOMAIN_URL}/r/StaticNoiseText-${variant}`,
});

export const getJsrepoCmds = (variant) => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/StaticNoiseText-${variant}`,
  npm:  `npx jsrepo@latest add ${DOMAIN_URL}/r/StaticNoiseText-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/StaticNoiseText-${variant}`,
  bun:  `bunx jsrepo@latest add ${DOMAIN_URL}/r/StaticNoiseText-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/TextAnimations/StaticNoiseText/StaticNoiseText?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/TextAnimations/StaticNoiseText/StaticNoiseText?raw';
import TS_CSS_CODE      from '../../variants/tsCss/TextAnimations/StaticNoiseText/StaticNoiseText?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/TextAnimations/StaticNoiseText/StaticNoiseText?raw';

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