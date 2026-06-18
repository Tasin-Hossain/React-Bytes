import MagneticTextPrompt from '../../prompts/TextAnimations/MagneticText.txt?raw';
export { MagneticTextPrompt };

export const AUTHOR_NAME = 'Mohammad Tasin';

export const ENTRANCE_OPTIONS = [
  { value: 'fadeUp', label: 'Fade Up' },
  { value: 'scaleIn', label: 'Scale In' },
  { value: 'slideLeft', label: 'Slide Left' },
  { value: 'blur', label: 'Blur' },
  { value: 'none', label: 'None' }
];

export const ALIGN_OPTIONS = [
  { value: 'center', label: 'Center' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
];

export const FONT_SIZE_OPTIONS = [
  { value: 'clamp(40px, 13vw, 85px)', label: 'Default (clamp)' },
  { value: '64px', label: '64px' },
  { value: '80px', label: '80px' },
  { value: '96px', label: '96px' },
  { value: '112px', label: '112px' }
];

export const SUBTITLE_SIZE_OPTIONS = [
  { value: '14px', label: '14px' },
  { value: '16px', label: '16px' },
  { value: '18px', label: '18px' },
  { value: '20px', label: '20px' },
  { value: '22px', label: '22px' },
  { value: '26px', label: '26px' },
  { value: '30px', label: '30px' }
];

export const LETTER_SPACING_OPTIONS = [
  { value: '0em', label: '0em' },
  { value: '0.05em', label: '0.05em' },
  { value: '0.1em', label: '0.1em' },
  { value: '0.15em', label: '0.15em' },
  { value: '-0.03em', label: '-0.03em' }
];

export const GAP_OPTIONS = [
  { value: '0px', label: '0px' },
  { value: '2px', label: '2px' },
  { value: '4px', label: '4px' },
  { value: '6px', label: '6px' },
  { value: '8px', label: '8px' }
];

export const INITIAL_PROPS = {
  text: 'ATTRACT',
  subtitle: 'PULL · PUSH · REPEL',
  fontSize: 'clamp(40px, 13vw, 85px)',
  subtitleSize: '22px',
  letterSpacing: '0.05em',
  textColor: '#a757f7',
  subtitleColor: '#a757f7',
  hoverColors: ['#ff6b6b', '#f7c948', '#4ecdc4', '#a78bfa'],
  magnetRadius: 120,
  magnetStrength: 0.55,
  attractDuration: 0.25,
  returnDuration: 0.6,
  entranceAnim: 'fadeUp',
  entranceStagger: 0.04,
  entranceDuration: 0.7,
  entranceDelay: 0.1,
  showCursor: false,
  showSubtitle: true,
  align: 'center',
  gap: '0px'
};


export const PROPS_DATA = [
  // TEXT
  { name: 'text',             type: 'string',   def: '"ATTRACT"',                                 desc: 'Main display text.' },
  { name: 'subtitle',         type: 'string',   def: '"PULL · PUSH · REPEL"',                     desc: 'Sub text rendered below the main text.' },
  // TYPOGRAPHY
  { name: 'fontSize',         type: 'string',   def: 'undefined (responsive)',                    desc: 'Font size for the main text (supports clamp). Defaults to responsive value based on container width.' },
  { name: 'subtitleSize',     type: 'string',   def: 'undefined (responsive)',                    desc: 'Font size for the subtitle. Defaults to responsive value based on container width.' },
  { name: 'letterSpacing',    type: 'string',   def: '"0.05em"',                                  desc: 'Letter-spacing for the main text.' },
  // COLORS
  { name: 'textColor',        type: 'string',   def: '"#ffffff"',                                 desc: 'Base color of the main text.' },
  { name: 'subtitleColor',    type: 'string',   def: '"#ffffff"',                                 desc: 'Color of the subtitle text.' },
  { name: 'hoverColors',      type: 'string[]', def: '["#ff6b6b","#f7c948","#4ecdc4","#a78bfa"]', desc: 'Color array interpolated across characters on hover.' },
  // ANIMATION
  { name: 'magnetRadius',     type: 'number',   def: 'undefined (responsive)',                    desc: 'Radius in px within which characters are attracted. Defaults to responsive value based on container width.' },
  { name: 'magnetStrength',   type: 'number',   def: '0.55',                                      desc: 'How far characters move toward the cursor (0–1).' },
  { name: 'attractDuration',  type: 'number',   def: '0.25',                                      desc: 'Duration (s) of the attract tween.' },
  { name: 'returnDuration',   type: 'number',   def: '0.6',                                       desc: 'Duration (s) of the return tween.' },
  { name: 'entranceAnim',     type: 'string',   def: '"fadeUp"',                                  desc: '"fadeUp" | "scaleIn" | "slideLeft" | "blur" | "none".' },
  { name: 'entranceStagger',  type: 'number',   def: '0.04',                                      desc: 'Stagger delay (s) between each character entrance.' },
  { name: 'entranceDuration', type: 'number',   def: '0.7',                                       desc: 'Duration (s) of the entrance animation per character.' },
  { name: 'entranceDelay',    type: 'number',   def: '0.1',                                       desc: 'Initial delay (s) before entrance animation starts.' },
  // VISIBILITY
  { name: 'showCursor',       type: 'boolean',  def: 'true',                                      desc: 'Show a custom cursor dot and ring.' },
  { name: 'showSubtitle',     type: 'boolean',  def: 'true',                                      desc: 'Show the subtitle line.' },
  // LAYOUT
  { name: 'align',            type: 'string',   def: '"center"',                                  desc: 'Text alignment: "left" | "center" | "right".' },
  { name: 'gap',              type: 'string',   def: '"0px"',                                     desc: 'Gap (marginRight) between individual characters.' },
  // CLASSNAMES
  { name: 'textClassName',     type: 'string',  def: '""',                                        desc: 'Extra Tailwind/CSS classes applied to each main text character span.' },
  { name: 'subtitleClassName', type: 'string',  def: '""',                                        desc: 'Extra Tailwind/CSS classes applied to each subtitle character span.' },
  { name: 'className',         type: 'string',  def: '""',                                        desc: 'Extra classes applied to the root container div.' },
];


export const dep = [
  { name: 'gsap', version: '3.15.0' },
];


export const PKG_CMDS = {
  pnpm: 'pnpm add gsap',
  npm:  'npm install gsap',
  yarn: 'yarn add gsap',
  bun:  'bun add gsap',
};

export const getShadcnCmds = (variant) => ({
  pnpm: `pnpm dlx shadcn@latest add https://reactbits.dev/r/MagneticText-${variant}`,
  npm:  `npx shadcn@latest add https://reactbits.dev/r/MagneticText-${variant}`,
  yarn: `yarn shadcn@latest add https://reactbits.dev/r/MagneticText-${variant}`,
  bun:  `bunx shadcn@latest add https://reactbits.dev/r/MagneticText-${variant}`,
});
export const getJsrepoCmds = (variant) => ({
  pnpm: `pnpm dlx jsrepo@latest add https://reactbits.dev/r/MagneticText-${variant}`,
  npm:  `npx jsrepo@latest add https://reactbits.dev/r/MagneticText-${variant}`,
  yarn: `yarn jsrepo@latest add https://reactbits.dev/r/MagneticText-${variant}`,
  bun:  `bunx jsrepo@latest add https://reactbits.dev/r/MagneticText-${variant}`,
});

import JS_CSS_CODE      from '../../variants/jsCss/TextAnimations/MagneticText/MagneticText';

import JS_TAILWIND_CODE from '../../variants/jsTailwind/TextAnimations/MagneticText/MagneticText';
import TS_CSS_CODE      from '../../variants/tsCss/TextAnimations/MagneticText/MagneticText';
import TS_TAILWIND_CODE from '../../variants/tsTailwind/TextAnimations/MagneticText/MagneticText';



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