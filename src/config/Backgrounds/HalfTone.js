import HalfTonePrompt from '../../prompts/Backgrounds/HalfTone.txt?raw';
export { HalfTonePrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const DIRECTIONS = [
  { value: 'diagonal',   label: 'Diagonal'   },
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical',   label: 'Vertical'   },
  { value: 'radial',     label: 'Radial'     },
  { value: 'angled',     label: 'Angled'     },
  { value: 'spiral',     label: 'Spiral'     },
  { value: 'checker',    label: 'Checker'    },
  { value: 'ripple',     label: 'Ripple'     },
];

export const SHAPES = [
  { value: 'circle',   label: 'Circle'   },
  { value: 'square',   label: 'Square'   },
  { value: 'diamond',  label: 'Diamond'  },
  { value: 'triangle', label: 'Triangle' },
  { value: 'star',     label: 'Star'     },
  { value: 'cross',    label: 'Cross'    },
  { value: 'ring',     label: 'Ring'     },
  { value: 'hexagon',  label: 'Hexagon'  },
];

export const INITIAL_PROPS = {
  color:     '#d35af8',
  bgColor:   'transparent',
  speed:     0.7,
  direction: 'angled',
  angle:     45,
  scale:     1.3,
  dotSize:   0.45,
  shape:     'cross',
  waveFreq:  1.0,
  opacity:   1.0,
  
};

export const PROPS_DATA = [
  {
    name: 'color',
    type: 'string',
    def:  '"#d35af8"',
    desc: 'Hex color of the dots.',
  },
  {
    name: 'bgColor',
    type: 'string',
    def:  '"transparent"',
    desc: 'Background color. Pass "transparent" to render dots only (useful for overlays).',
  },
  {
    name: 'speed',
    type: 'number',
    def:  '0.7',
    desc: 'Animation speed multiplier. 0 = frozen, 3 = very fast.',
  },
  {
    name: 'direction',
    type: '"diagonal" | "horizontal" | "vertical" | "radial" | "angled" | "spiral" | "checker" | "ripple"',
    def:  '"angled"',
    desc: 'Wave propagation direction. "angled" uses the angle prop for a custom degree.',
  },
  {
    name: 'angle',
    type: 'number',
    def:  '45',
    desc: 'Rotation in degrees. Only takes effect when direction="angled".',
  },
  {
    name: 'scale',
    type: 'number',
    def:  '1.0',
    desc: 'Grid density. Higher values = more, smaller dots. Range: 0.3–3.',
  },
  {
    name: 'dotSize',
    type: 'number',
    def:  '0.5',
    desc: 'Maximum dot size at wave peak. Range: 0.1–1.0.',
  },
  {
    name: 'shape',
    type: '"circle" | "square" | "diamond" | "triangle" | "star" | "cross" | "ring" | "hexagon"',
    def:  '"cross"',
    desc: 'Shape rendered at each grid cell.',
  },
  {
    name: 'waveFreq',
    type: 'number',
    def:  '1.0',
    desc: 'Wave spatial frequency. Higher = tighter wave pattern. Range: 0.1–4.',
  },
  {
    name: 'opacity',
    type: 'number',
    def:  '1.0',
    desc: 'Overall opacity of the effect. Range: 0.1–1.0.',
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
  pnpm: `pnpm dlx shadcn@latest add https://reactbytes.dev/r/HalfTone-${variant}`,
  npm:  `npx shadcn@latest add https://reactbytes.dev/r/HalfTone-${variant}`,
  yarn: `yarn shadcn@latest add https://reactbytes.dev/r/HalfTone-${variant}`,
  bun:  `bunx shadcn@latest add https://reactbytes.dev/r/HalfTone-${variant}`,
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add https://reactbytes.dev/r/HalfTone-${variant}`,
  npm:  `npx jsrepo@latest add https://reactbytes.dev/r/HalfTone-${variant}`,
  yarn: `yarn jsrepo@latest add https://reactbytes.dev/r/HalfTone-${variant}`,
  bun:  `bunx jsrepo@latest add https://reactbytes.dev/r/HalfTone-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/Backgrounds/HalfTone/HalfTone?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Backgrounds/HalfTone/HalfTone?raw';
import TS_CSS_CODE      from '../../variants/tsCss/Backgrounds/HalfTone/HalfTone?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Backgrounds/HalfTone/HalfTone?raw';

export { JS_CSS_CODE, JS_TAILWIND_CODE, TS_CSS_CODE, TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css':      JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css':      TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE,
};