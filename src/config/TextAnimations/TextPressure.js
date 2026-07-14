import { DOMAIN_URL } from '../../constants/site';
import TextPressurePrompt from '../../prompts/TextAnimations/TextPressure.txt?raw';
export { TextPressurePrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const INITIAL_PROPS = {
  text: 'Hello!',
  width: true,
  weight: true,
  italic: false,
  alpha: false,
  flex: true,
  scale: false,
  textColor: '#FFFFFF'
};

export const PROPS_DATA = [
  // TEXT
  {
    name: 'text',
    type: 'string',
    def: '"Text pressure"',
    desc: 'Display text, split into individual hoverable letters.'
  },
  {
    name: 'as',
    type: 'string',
    def: '"h1"',
    desc: 'HTML tag (or component) rendered as the root text element.'
  },
  // BEHAVIOR TOGGLES
  {
    name: 'width',
    type: 'boolean',
    def: 'true',
    desc: 'Whether hovered (and neighboring) letters expand horizontally via padding.'
  },
  {
    name: 'weight',
    type: 'boolean',
    def: 'true',
    desc: 'Whether font-weight increases on hover, cascading to neighboring letters.'
  },
  { name: 'italic', type: 'boolean', def: 'true', desc: 'Whether the hovered letter tilts italic.' },
  { name: 'alpha', type: 'boolean', def: 'false', desc: 'Whether non-hovered letters dim to a lower opacity.' },
  {
    name: 'flex',
    type: 'boolean',
    def: 'true',
    desc: 'Layout mode: flex-wrap (multi-line) when true, single-line inline-flex when false.'
  },
  { name: 'scale', type: 'boolean', def: 'false', desc: 'Whether the hovered letter scales up slightly.' },
  // COLOR
  { name: 'textColor', type: 'string', def: '"#FFFFFF"', desc: 'Base color applied to the text.' },
  // CLASSNAMES / STYLE
  { name: 'className', type: 'string', def: '""', desc: 'Extra classes applied to the root Tag element.' },
  { name: 'style', type: 'object', def: '{}', desc: 'Extra inline styles merged onto the root Tag element.' }
];

export const dep = [];

export const PKG_CMDS = {
  pnpm: null,
  npm: null,
  yarn: null,
  bun: null
};

export const getShadcnCmds = variant => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/TextPressure-${variant}`,
  npm: `npx shadcn@latest add ${DOMAIN_URL}/r/TextPressure-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/TextPressure-${variant}`,
  bun: `bunx shadcn@latest add ${DOMAIN_URL}/r/TextPressure-${variant}`
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/TextPressure-${variant}`,
  npm: `npx jsrepo@latest add ${DOMAIN_URL}/r/TextPressure-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/TextPressure-${variant}`,
  bun: `bunx jsrepo@latest add ${DOMAIN_URL}/r/TextPressure-${variant}`
});

import JS_CSS_CODE from '../../variants/jsCss/TextAnimations/TextPressure/TextPressure?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/TextAnimations/TextPressure/TextPressure?raw';
import TS_CSS_CODE from '../../variants/tsCss/TextAnimations/TextPressure/TextPressure?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/TextAnimations/TextPressure/TextPressure?raw';

export { JS_CSS_CODE, JS_TAILWIND_CODE, TS_CSS_CODE, TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css': JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css': TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE
};