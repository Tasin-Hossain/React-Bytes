import { DOMAIN_URL } from '../../constants/site';
import MouseRepelDotsPrompt from '../../prompts/Backgrounds/MouseRepelDots.txt?raw';
export { MouseRepelDotsPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const SPARKLE_MODE_OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'random', label: 'Random' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'ripple', label: 'Ripple' },
  { value: 'left-to-right', label: 'Left → Right' },
  { value: 'right-to-left', label: 'Right → Left' },
  { value: 'top-to-bottom', label: 'Top → Bottom' },
  { value: 'bottom-to-top', label: 'Bottom → Top' },
  { value: 'wave-horizontal', label: 'Wave Horizontal' },
  { value: 'wave-vertical', label: 'Wave Vertical' },
  { value: 'diagonal-tl-br', label: 'Diagonal ↘' },
  { value: 'diagonal-br-tl', label: 'Diagonal ↖' },
  { value: 'line-right', label: 'Line Right' },
  { value: 'line-left', label: 'Line Left' }
];

export const INITIAL_PROPS = {
  dotRadius: 1.6,
  dotSpacing: 15,
  repelRadius: 80,
  force: 5.5,
  springK: 0.07,
  damping: 0.72,
  maxDotSize: 6,
  dotColor: '#7a5af8',
  dotColorMid: '#d35af8',
  dotColorHot: '#ffffff',
  backgroundColor: 'transparent',
  gradientFrom: null,
  gradientTo: null,
  bulgeOnly: false,
  bulgeStrength: 30,
  waveAmplitude: 4,
  sparkleMode: 'ripple',
  sparkleColor: '#d35af8',
  sparkleSize: 1.6,
  sparkleSpeed: 0.4,
  sparkleDensity: 0.015
};

export const PROPS_DATA = [
  { name: 'dotRadius', type: 'number', def: '1.6', desc: 'Base radius (px) of each dot in its resting state.' },
  { name: 'dotSpacing', type: 'number', def: '22', desc: 'Gap in px between adjacent dots in the grid.' },
  {
    name: 'repelRadius',
    type: 'number',
    def: '80',
    desc: 'Radius (px) around the cursor within which dots are repelled.'
  },
  {
    name: 'force',
    type: 'number',
    def: '5.5',
    desc: 'Strength of the repulsion force applied to dots near the cursor.'
  },
  {
    name: 'springK',
    type: 'number',
    def: '0.07',
    desc: 'Spring constant — how strongly each dot snaps back to its origin.'
  },
  {
    name: 'damping',
    type: 'number',
    def: '0.72',
    desc: 'Velocity damping factor applied each frame (0–1). Lower = bouncier.'
  },
  { name: 'maxDotSize', type: 'number', def: '6', desc: 'Maximum dot radius (px) when fully displaced by the cursor.' },
  {
    name: 'dotColor',
    type: 'string',
    def: '"#7a5af8"',
    desc: 'Base dot color used in the resting / low-energy state.'
  },
  { name: 'dotColorMid', type: 'string', def: '"#d35af8"', desc: 'Mid-energy dot color shown at medium displacement.' },
  {
    name: 'dotColorHot',
    type: 'string',
    def: '"#ffffff"',
    desc: 'High-energy dot color for dots closest to the cursor.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    def: '"transparent"',
    desc: 'Canvas background fill. Use "transparent" to inherit the parent background.'
  },
  {
    name: 'gradientFrom',
    type: 'string',
    def: 'null',
    desc: 'Start color of a diagonal linear gradient that overrides dotColor/dotColorMid/dotColorHot.'
  },
  {
    name: 'gradientTo',
    type: 'string',
    def: 'null',
    desc: 'End color of the diagonal linear gradient. Both gradientFrom and gradientTo must be set.'
  },
  {
    name: 'bulgeOnly',
    type: 'boolean',
    def: 'false',
    desc: 'When true, dots push outward smoothly instead of flying with spring physics.'
  },
  {
    name: 'bulgeStrength',
    type: 'number',
    def: '30',
    desc: 'Outward push distance (px) used when bulgeOnly is enabled.'
  },
  {
    name: 'waveAmplitude',
    type: 'number',
    def: '0',
    desc: 'Amplitude (px) of a continuous ambient sine-wave ripple across the grid. 0 disables it.'
  },
  {
    name: 'sparkleMode',
    type: '"off" | "random" | "pulse" | "ripple" others..',
    def: '"off"',
    desc: 'Pattern used to light up sparkle dots across the grid.'
  },
  { name: 'sparkleColor', type: 'string', def: '"#d35af8"', desc: 'Color applied to dots when they sparkle.' },
  {
    name: 'sparkleSize',
    type: 'number',
    def: '1.6',
    desc: 'Size multiplier applied to a dot at peak sparkle intensity.'
  },
  {
    name: 'sparkleSpeed',
    type: 'number',
    def: '0.4',
    desc: 'Playback speed of sparkle animations. Higher = faster sweep/pulse.'
  },
  {
    name: 'sparkleDensity',
    type: 'number',
    def: '0.015',
    desc: 'Fraction of dots that sparkle simultaneously in random mode (0–1).'
  },
  { name: 'className', type: 'string', def: '""', desc: 'Extra CSS classes forwarded to the wrapper div.' }
];

export const dep = [];

export const PKG_CMDS = {
  pnpm: null,
  npm: null,
  yarn: null,
  bun: null
};

export const getShadcnCmds = variant => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/MouserepelDots-${variant}`,
  npm: `npx shadcn@latest add ${DOMAIN_URL}/r/MouserepelDots-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/MouserepelDots-${variant}`,
  bun: `bunx shadcn@latest add ${DOMAIN_URL}/r/MouserepelDots-${variant}`
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/MouserepelDots-${variant}`,
  npm: `npx jsrepo@latest add ${DOMAIN_URL}/r/MouserepelDots-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/MouserepelDots-${variant}`,
  bun: `bunx jsrepo@latest add ${DOMAIN_URL}/r/MouserepelDots-${variant}`
});

import JS_CSS_CODE from '../../variants/jsCss/Backgrounds/MouseRepelDots/MouseRepelDots';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Backgrounds/MouseRepelDots/MouseRepelDots';
import TS_CSS_CODE from '../../variants/tsCss/Backgrounds/MouseRepelDots/MouseRepelDots';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Backgrounds/MouseRepelDots/MouseRepelDots';

export { JS_CSS_CODE };
export { JS_TAILWIND_CODE };
export { TS_CSS_CODE };
export { TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css': JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css': TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE
};
