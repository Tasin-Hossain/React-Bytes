export const PROPS_DATA = [
  { name: 'dotCount',     type: 'number', def: '500',        desc: 'Total number of dots rendered on the canvas.' },
  { name: 'repelRadius',  type: 'number', def: '80',         desc: 'Radius (px) around the cursor within which dots are repelled.' },
  { name: 'force',        type: 'number', def: '5.5',        desc: 'Strength of the repulsion force applied to dots.' },
  { name: 'springK',      type: 'number', def: '0.07',       desc: 'Spring constant — how strongly dots return to their origin.' },
  { name: 'damping',      type: 'number', def: '0.72',       desc: 'Velocity damping factor applied each frame (0–1).' },
  { name: 'dotColor',     type: 'string', def: '"#7a5af8"',  desc: 'Base dot color (low energy / resting state).' },
  { name: 'dotColorMid',  type: 'string', def: '"#d35af8"',  desc: 'Mid-energy dot color.' },
  { name: 'dotColorHot',  type: 'string', def: '"#ffffff"',  desc: 'High-energy dot color (closest to cursor).' },
  { name: 'minDotSize',   type: 'number', def: '1.4',        desc: 'Minimum dot radius in pixels (resting state).' },
  { name: 'maxDotSize',   type: 'number', def: '6',          desc: 'Maximum dot radius in pixels (fully displaced).' },
  { name: 'className',    type: 'string', def: '""',         desc: 'Additional class names applied to the canvas element.' },
];

export const dep = [];

export const PKG_CMDS = null;

export const getShadcnCmds = (variant) => ({
  pnpm: `pnpm dlx shadcn@latest add https://reactbytes.dev/r/MouseRepelDots-${variant}`,
  npm:  `npx shadcn@latest add https://reactbytes.dev/r/MouseRepelDots-${variant}`,
  yarn: `yarn shadcn@latest add https://reactbytes.dev/r/MouseRepelDots-${variant}`,
  bun:  `bunx shadcn@latest add https://reactbytes.dev/r/MouseRepelDots-${variant}`,
});
