import { DOMAIN_URL } from '../../constants/site';
import EmojiWavePrompt from '../../prompts/Backgrounds/EmojiWave.txt?raw';
export { EmojiWavePrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const INITIAL_PROPS = {
  eomji: ' ❤️💛💚 ',
  color: '#d35af8',
  waveTension: 0.5,
  waveTwist: 0.1,
  invert: false,
  noiseScale: 0.3,
  elementSize: 14,
  speed: 0.7,
  hasCursorInteraction: true,
  intensity: 1.0,
  interactionIntensity: 1.0,
  bgColor: 'transparent',
};

export const PROPS_DATA = [
  {
    name: 'eomji',
    type: 'string',
    def: '" ❤️💛💚',
    desc: 'emoji gradient (calm -> excited)',
  },
  {
    name: 'color',
    type: 'string',
    def: '"#ffffff"',
    desc: 'Color of the ASCII characters.',
  },
  {
    name: 'waveTension',
    type: 'number',
    def: '0.5',
    desc: 'Tension of the wave flow (0.1-2.0).',
  },
  {
    name: 'waveTwist',
    type: 'number',
    def: '0.1',
    desc: 'Twist amount of the wave flow (0.0-1.0).',
  },
  {
    name: 'invert',
    type: 'boolean',
    def: 'false',
    desc: 'Invert the character mapping.',
  },
  {
    name: 'noiseScale',
    type: 'number',
    def: '1.0',
    desc: 'Scale of the noise/wave pattern (zoom).',
  },
  {
    name: 'elementSize',
    type: 'number',
    def: '16.0',
    desc: 'Size of individual ASCII characters/grid cells.',
  },
  {
    name: 'speed',
    type: 'number',
    def: '1.0',
    desc: 'Animation speed multiplier.',
  },
  {
    name: 'hasCursorInteraction',
    type: 'boolean',
    def: 'true',
    desc: 'Whether the waves react to mouse cursor.',
  },
  {
    name: 'intensity',
    type: 'number',
    def: '1.0',
    desc: 'Intensity of the wave effect.',
  },
  {
    name: 'interactionIntensity',
    type: 'number',
    def: '1.0',
    desc: 'Intensity of the cursor interaction.',
  },
  {
    name: 'className',
    type: 'string',
    def: '""',
    desc: 'Additional CSS classes.',
  },
  {
    name: 'bgColor',
    type: 'string',
    def: '"transparent"',
    desc: 'Background color of the canvas ("transparent" supported).',
  },
];

export const dep = [
  { name: '@react-three/fiber', version: '8.0.0' },
  { name: 'three',              version: '0.160.0' },
];

export const PKG_CMDS = {
  pnpm: 'pnpm add @react-three/fiber three',
  npm:  'npm install @react-three/fiber three',
  yarn: 'yarn add @react-three/fiber three',
  bun:  'bun add @react-three/fiber three',
};

export const getShadcnCmds = variant => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/EmojiWave-${variant}`,
  npm:  `npx shadcn@latest add ${DOMAIN_URL}/r/EmojiWave-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/EmojiWave-${variant}`,
  bun:  `bunx shadcn@latest add ${DOMAIN_URL}/r/EmojiWave-${variant}`,
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/EmojiWave-${variant}`,
  npm:  `npx jsrepo@latest add ${DOMAIN_URL}/r/EmojiWave-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/EmojiWave-${variant}`,
  bun:  `bunx jsrepo@latest add ${DOMAIN_URL}/r/EmojiWave-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/Backgrounds/EmojiWave/EmojiWave?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Backgrounds/EmojiWave/EmojiWave?raw';
import TS_CSS_CODE      from '../../variants/tsCss/Backgrounds/EmojiWave/EmojiWave?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Backgrounds/EmojiWave/EmojiWave?raw';

export { JS_CSS_CODE, JS_TAILWIND_CODE, TS_CSS_CODE, TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css':      JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css':      TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE,
};