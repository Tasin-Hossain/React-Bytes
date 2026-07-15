import { DOMAIN_URL } from '../../constants/site';
import WavePathTextPrompt from '../../prompts/TextAnimations/WavePathText.txt?raw';
export { WavePathTextPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const INITIAL_PROPS = {
  text: '✦lorem ipsum dolor sit amet consectetur adipiscing elit sed do',
  duration: 20,
  reversed: false,
  fontSize: '50px',
  pathScale: 3,
  viewBox : '0 0 900 160',
  textClassName: 'text-6xl sm:text-6xl md:text-6xl lg:text-5xl font-bold'
};

export const PROPS_DATA = [
  // TEXT
  {
    name: 'text',
    type: 'string',
    def: '"Your text goes here"',
    desc: 'Text repeated seamlessly along the curved path.'
  },
  // PATH
  {
    name: 'path',
    type: 'string',
    def: '"M-400,90 C-350,50 ... 1250,90"',
    desc: 'SVG path data (the `d` attribute) the text flows along.'
  },
  {
    name: 'viewBox',
    type: 'string',
    def: '"0 0 700 160"',
    desc: 'SVG viewBox for the root svg element.'
  },
  {
    name: 'pathScale',
    type: 'number',
    def: '1',
    desc: 'Scale factor applied to the path/text group.'
  },
  // ANIMATION
  {
    name: 'duration',
    type: 'number',
    def: '21',
    desc: 'Seconds for one full scroll cycle along the path.'
  },
  {
    name: 'reversed',
    type: 'boolean',
    def: 'false',
    desc: 'Reverses the scroll direction of the text.'
  },
  // TYPOGRAPHY
  {
    name: 'fontSize',
    type: 'string',
    def: '"17px"',
    desc: 'Font size of the looping text.'
  },
  {
    name: 'letterSpacing',
    type: 'string',
    def: '"normal"',
    desc: 'Letter spacing applied to the text.'
  },
  // CLASSNAMES
  {
    name: 'textClassName',
    type: 'string',
    def: '""',
    desc: 'Extra textClassName applied to the root text element.'
  },
  {
    name: 'className',
    type: 'string',
    def: '""',
    desc: 'Extra classes applied to the root svg element.'
  }
];

export const dep = ['gsap'];

export const PKG_CMDS = {
  pnpm: 'pnpm add gsap',
  npm: 'npm install gsap',
  yarn: 'yarn add gsap',
  bun: 'bun add gsap'
};

export const getShadcnCmds = variant => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/WavePathText-${variant}`,
  npm: `npx shadcn@latest add ${DOMAIN_URL}/r/WavePathText-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/WavePathText-${variant}`,
  bun: `bunx shadcn@latest add ${DOMAIN_URL}/r/WavePathText-${variant}`
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/WavePathText-${variant}`,
  npm: `npx jsrepo@latest add ${DOMAIN_URL}/r/WavePathText-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/WavePathText-${variant}`,
  bun: `bunx jsrepo@latest add ${DOMAIN_URL}/r/WavePathText-${variant}`
});

import JS_CSS_CODE from '../../variants/jsCss/TextAnimations/WavePathText/WavePathText?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/TextAnimations/WavePathText/WavePathText?raw';
import TS_CSS_CODE from '../../variants/tsCss/TextAnimations/WavePathText/WavePathText?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/TextAnimations/WavePathText/WavePathText?raw';

export { JS_CSS_CODE, JS_TAILWIND_CODE, TS_CSS_CODE, TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css': JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css': TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE
};