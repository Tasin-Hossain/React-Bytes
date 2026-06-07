export const PROPS_DATA = [
  // TEXT
  { name: 'text',             type: 'string',   def: '"ATTRACT"',                                 desc: 'Main display text.' },
  { name: 'subtitle',         type: 'string',   def: '"PULL · PUSH · REPEL"',                     desc: 'Sub text rendered below the main text.' },
  // TYPOGRAPHY
  { name: 'fontSize',         type: 'string',   def: '"clamp(40px, 13vw, 85px)"',                 desc: 'Font size for the main text (supports clamp).' },
  { name: 'subtitleSize',     type: 'string',   def: '"22px"',                                    desc: 'Font size for the subtitle.' },
  { name: 'letterSpacing',    type: 'string',   def: '"0.05em"',                                  desc: 'Letter-spacing for the main text.' },
  // COLORS
  { name: 'textColor',        type: 'string',   def: '"#a757f7"',                     desc: 'Base color of the main text.' },
  { name: 'subtitleColor',    type: 'string',   def: '"#a757f7"',                       desc: 'Color of the subtitle text.' },
  { name: 'hoverColors',      type: 'string[]', def: '["#ff6b6b","#f7c948","#4ecdc4","#a78bfa"]', desc: 'Color array interpolated across characters on hover.' },
  // ANIMATION
  { name: 'magnetRadius',     type: 'number',   def: '120',                                       desc: 'Radius in px within which characters are attracted.' },
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
];

export const dep = ['gsap'];

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