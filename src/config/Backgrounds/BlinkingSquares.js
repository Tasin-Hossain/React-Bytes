// config/Backgrounds/BlinkingSquares.js

import { DOMAIN_URL } from '../../constants/site';
import BlinkingSquaresPrompt from '../../prompts/Backgrounds/BlinkingSquares.txt?raw';
export { BlinkingSquaresPrompt as BlinkingSquares };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const DIRECTIONS = [
  { value: 'right',  label: 'Right'  },
  { value: 'left',   label: 'Left'   },
  { value: 'top',    label: 'Top'    },
  { value: 'bottom', label: 'Bottom' },
];

export const INITIAL_PROPS = {
  direction:       "right",
  gridSize:        10,
  squareSize:      0.57,
  fadeStart:       0.33,
  fadeEnd:         1.0,
  falloff:         1.25,
  minBrightness:   0.55,
  twinkleSpeed:    0.2,
  twinkleStrength: 1,
  intensity:       1.65,
  opacity:         1.0,
  squareColor:     "#d35af8",
  backgroundColor: "transparent",
  dpr:             1.5,
};

export const PROPS_DATA = [
  {
    name: "direction",
    type: '"right" | "left" | "top" | "bottom"',
    def:  '"right"',
    desc: "Edge the dense squares are anchored to. The grid fades to empty in the opposite direction.",
  },
  {
    name: "gridSize",
    type: "number",
    def:  "10",
    desc: "Number of grid cells along the long axis (5–100). Higher = finer grain.",
  },
  {
    name: "squareSize",
    type: "number",
    def:  "0.57",
    desc: "Constant square fill % within each cell (0.05–0.98). All squares are uniform size; density is what varies.",
  },
  {
    name: "fadeStart",
    type: "number",
    def:  "0.33",
    desc: "Where the field first becomes non-empty along direction (0–1). Anything before this is pure background.",
  },
  {
    name: "fadeEnd",
    type: "number",
    def:  "1",
    desc: "Where the field reaches full density along direction (0–1). Must be greater than fadeStart.",
  },
  {
    name: "falloff",
    type: "number",
    def:  "1.25",
    desc: "Curve sharpness between fadeStart and fadeEnd. 1 = linear, higher = stays empty longer then ramps fast (0.3–6).",
  },
  {
    name: "minBrightness",
    type: "number",
    def:  "0.55",
    desc: "Minimum brightness of a lit cell (0–1). Lit cells get a random brightness between this and 1.0.",
  },
  {
    name: "twinkleSpeed",
    type: "number",
    def:  "0.2",
    desc: "Per-cell twinkle rate in cycles per second (0–4). 0 freezes the field.",
  },
  {
    name: "twinkleStrength",
    type: "number",
    def:  "0.94",
    desc: "Strength of the per-cell brightness oscillation (0–1). 0 = no blinking.",
  },
  {
    name: "intensity",
    type: "number",
    def:  "1.65",
    desc: "Master brightness multiplier (0–2).",
  },
  {
    name: "opacity",
    type: "number",
    def:  "1",
    desc: "Master alpha (0–1).",
  },
  {
    name: "squareColor",
    type: "string",
    def:  '"#d35af8"',
    desc: "Square color in hex.",
  },
  {
    name: "backgroundColor",
    type: "string",
    def:  '"transparent"',
    desc: "Background fill color. Defaults to transparent so any parent background shows through.",
  },
  {
    name: "dpr",
    type: "number",
    def:  "1.5",
    desc: "Maximum device pixel ratio cap (1–3). Higher = sharper on retina screens, heavier on GPU.",
  },
  {
    name: "className",
    type: "string",
    def:  '""',
    desc: "Additional Tailwind or CSS class names applied to the wrapper div.",
  },
  {
    name: "style",
    type: "React.CSSProperties",
    def:  "{}",
    desc: "Inline styles applied to the wrapper div.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    def:  "undefined",
    desc: "Content rendered on top of the canvas inside a relative z-10 div.",
  },
];

export const dep = [];

export const PKG_CMDS = {
  pnpm: null,
  npm:  null,
  yarn: null,
  bun:  null,
};

export const getShadcnCmds = variant => ({
  pnpm: `pnpm dlx shadcn@latest add ${DOMAIN_URL}/r/BlinkingSquares-${variant}`,
  npm:  `npx shadcn@latest add ${DOMAIN_URL}/r/BlinkingSquares-${variant}`,
  yarn: `yarn shadcn@latest add ${DOMAIN_URL}/r/BlinkingSquares-${variant}`,
  bun:  `bunx shadcn@latest add ${DOMAIN_URL}/r/BlinkingSquares-${variant}`,
});

export const getJsrepoCmds = variant => ({
  pnpm: `pnpm dlx jsrepo@latest add ${DOMAIN_URL}/r/BlinkingSquares-${variant}`,
  npm:  `npx jsrepo@latest add ${DOMAIN_URL}/r/BlinkingSquares-${variant}`,
  yarn: `yarn jsrepo@latest add ${DOMAIN_URL}/r/BlinkingSquares-${variant}`,
  bun:  `bunx jsrepo@latest add ${DOMAIN_URL}/r/BlinkingSquares-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/Backgrounds/BlinkingSquares/BlinkingSquares?raw';
import JS_TAILWIND_CODE from '../../variants/jsTailwind/Backgrounds/BlinkingSquares/BlinkingSquares?raw';
import TS_CSS_CODE      from '../../variants/tsCss/Backgrounds/BlinkingSquares/BlinkingSquares?raw';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/Backgrounds/BlinkingSquares/BlinkingSquares?raw';

export { JS_CSS_CODE, JS_TAILWIND_CODE, TS_CSS_CODE, TS_TAILWIND_CODE };

export const CODE_VARIANTS = {
  'js-css':      JS_CSS_CODE,
  'js-tailwind': JS_TAILWIND_CODE,
  'ts-css':      TS_CSS_CODE,
  'ts-tailwind': TS_TAILWIND_CODE,
};