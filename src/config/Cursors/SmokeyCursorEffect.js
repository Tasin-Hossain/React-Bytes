import { DOMAIN_URL } from '../../constants/site';
import SmokeyCursorEffectPrompt from '../../prompts/Cursors/SmokeyCursorEffect.txt?raw';
export { SmokeyCursorEffectPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const INITIAL_PROPS = {
  simResolution: 128,
  dyeResolution: 1440,
  densityDissipation: 3.5,
  velocityDissipation: 2,
  pressure: 1,
  pressureIterations: 20,
  curl: 3,
  splatRadius: 0.2,
  splatForce: 6000,
  shading: true,
  colorUpdateSpeed: 10,
  color: '#d35af8',
  className: '',
};

export const PROPS_DATA = [
  {
    name: 'simResolution',
    type: 'number',
    def: '128',
    desc: 'Grid resolution of the velocity/pressure simulation. Lower values are cheaper but blockier; the sim is reinitialized only on mount.'
  },
  {
    name: 'dyeResolution',
    type: 'number',
    def: '1440',
    desc: 'Grid resolution of the visible dye/color texture. Auto-clamped to 256 when the browser lacks linear-filtering support for float textures.'
  },
  {
    name: 'densityDissipation',
    type: 'number',
    def: '3.5',
    desc: 'How quickly the smoke/dye fades over time. Higher values dissipate faster; live-tunable without reinitializing WebGL.'
  },
  {
    name: 'velocityDissipation',
    type: 'number',
    def: '2',
    desc: 'How quickly fluid motion slows down. Higher values make the flow feel more viscous/damped; live-tunable.'
  },
  {
    name: 'pressure',
    type: 'number',
    def: '0.1',
    desc: 'Pressure-clear coefficient used each step before the Jacobi pressure solve; live-tunable.'
  },
  {
    name: 'pressureIterations',
    type: 'number',
    def: '20',
    desc: 'Number of Jacobi iterations used to solve the pressure field per frame. Higher values are more accurate but costlier. Requires remount to change.'
  },
  {
    name: 'curl',
    type: 'number',
    def: '3',
    desc: 'Vorticity confinement strength, controlling how swirly/curly the smoke motion looks; live-tunable.'
  },
  {
    name: 'splatRadius',
    type: 'number',
    def: '0.2',
    desc: 'Radius (relative to canvas) of the color/velocity splat injected on pointer move and click; live-tunable.'
  },
  {
    name: 'splatForce',
    type: 'number',
    def: '6000',
    desc: 'Force multiplier applied to pointer-movement deltas when injecting velocity into the field; live-tunable.'
  },
  {
    name: 'shading',
    type: 'boolean',
    def: 'true',
    desc: 'Enables the normal-based lighting term in the display shader for a more 3D, glossy smoke look. Toggling re-selects the shader keyword variant without a full reinit.'
  },
  {
    name: 'colorUpdateSpeed',
    type: 'number',
    def: '10',
    desc: 'How quickly the pointer color cycles through the HSV wheel while moving. Only applies when `color` is not set; live-tunable.'
  },
  {
    name: 'color',
    type: 'string | null',
    def: 'null',
    desc: 'Fixed hex color (e.g. "#ff6b00") used for every splat instead of the random HSV cycle. Leave as null to keep the default rainbow cycling; live-tunable.'
  },
  {
    name: 'className',
    type: 'string',
    def: '""',
    desc: 'Custom class name applied to the outer wrapper div, useful for setting size/rounding from the parent. The canvas background is always transparent.'
  },
];

export const dep = [];

export const PKG_CMDS = {
  pnpm: '',
  npm: '',
  yarn: '',
  bun: ''
};

export const getShadcnCmds = variant => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/SmokeyCursorEffect-${variant}`,
  npm: `npx shadcn@latest add ${DOMAIN_URL}/r/SmokeyCursorEffect-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/SmokeyCursorEffect-${variant}`,
  bun: `bunx shadcn@latest add ${DOMAIN_URL}/r/SmokeyCursorEffect-${variant}`
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/SmokeyCursorEffect-${variant}`,
  npm: `npx jsrepo@latest add ${DOMAIN_URL}/r/SmokeyCursorEffect-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/SmokeyCursorEffect-${variant}`,
  bun: `bunx jsrepo@latest add ${DOMAIN_URL}/r/SmokeyCursorEffect-${variant}`
});

import JS_CSS_CODE from '../../variants/jsCss/Cursors/SmokeyCursorEffect/SmokeyCursorEffect?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Cursors/SmokeyCursorEffect/SmokeyCursorEffect?raw';
import TS_CSS_CODE from '../../variants/tsCss/Cursors/SmokeyCursorEffect/SmokeyCursorEffect?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Cursors/SmokeyCursorEffect/SmokeyCursorEffect?raw';
export { JS_CSS_CODE, JS_TAILWIND_CODE, TS_CSS_CODE, TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css': JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css': TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE
};