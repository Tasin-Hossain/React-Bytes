// config/Backgrounds/BlinkingSquares.js

import { DOMAIN_URL } from '../../constants/site';
import VortexPrompt from '../../prompts/Backgrounds/Vortex.txt?raw';
export { VortexPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const INITIAL_PROPS = {
  speed:     0.8,
  scale:  2.4,
  colorA:      '#FFFFFF',
  colorB: '#FF5DA2',
  noiseIntensity:     1.5,
  blend:     0.5,
  opacity:    1.0,
  bgColor:     '#000000',
  
};

export const PROPS_DATA = [
  {
    name: "speed",
    type: "number",
    def:  "0.8",
    desc: "Controls the animation speed of the vortex rotation.",
  },
  {
    name: "scale",
    type: "number",
    def:  "2.0",
    desc: "Zoom level of the vortex pattern. Higher values zoom out, showing more of the spiral.",
  },
  {
    name: "colorA",
    type: "string",
    def:  '"#1B0F33"',
    desc: "Inner or dark base color of the vortex (hex).",
  },
  {
    name: "colorB",
    type: "string",
    def:  '"#FF5DA2"',
    desc: "Outer accent and glow color of the vortex (hex).",
  },
  {
    name: "noiseIntensity",
    type: "number",
    def:  "1.5",
    desc: "Controls the intensity of the film-grain noise effect overlaid on the vortex.",
  },
  {
    name: "blend",
    type: "number",
    def:  "0.5",
    desc: "Controls the blending of the vortex effect with the background using Aurora-style smoothstep alpha.",
  },
  {
    name: "opacity",
    type: "number",
    def:  "1.0",
    desc: "Overall opacity of the canvas. Set below 1 to reveal content or background beneath.",
  },
  {
    name: "bgColor",
    type: "string",
    def:  '"#000000"',
    desc: "Background color visible through blend and opacity. Also sets the wrapper background.",
  },
  {
    name: "className",
    type: "string",
    def:  '""',
    desc: "Additional Tailwind CSS classes applied to the wrapper div.",
  },
];
export const dep = [
  { name: "@react-three/fiber", version: "^8.18.0" },
  { name: "three", version: "^0.160.0" },
];

export const PKG_CMDS = {
  pnpm: "pnpm add @react-three/fiber three",
  npm: "npm install @react-three/fiber three",
  yarn: "yarn add @react-three/fiber three",
  bun: "bun add @react-three/fiber three",
};

export const getShadcnCmds = variant => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/Vortex-${variant}`,
  npm:  `npx shadcn@latest add ${DOMAIN_URL}/r/Vortex-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/Vortex-${variant}`,
  bun:  `bunx shadcn@latest add ${DOMAIN_URL}/r/Vortex-${variant}`,
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/Vortex-${variant}`,
  npm:  `npx jsrepo@latest add ${DOMAIN_URL}/r/Vortex-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/Vortex-${variant}`,
  bun:  `bunx jsrepo@latest add ${DOMAIN_URL}/r/Vortex-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/Backgrounds/Vortex/Vortex?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Backgrounds/Vortex/Vortex?raw';
import TS_CSS_CODE      from '../../variants/tsCss/Backgrounds/Vortex/Vortex?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Backgrounds/Vortex/Vortex?raw';

export { JS_CSS_CODE, JS_TAILWIND_CODE, TS_CSS_CODE, TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css':      JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css':      TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE,
};