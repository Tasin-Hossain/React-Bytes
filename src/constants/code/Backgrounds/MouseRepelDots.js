import JS_CSS_CODE      from '../../../variants/jsCss/Backgrounds/mouseRapeldots/MouseRepelDots';
import JS_TAILWIND_CODE from '../../../variants/jsTailwind/Backgrounds/mouseRapeldots/MouseRepelDots';
import TS_CSS_CODE      from '../../../variants/tsCss/Backgrounds/mouseRapeldots/MouseRepelDots';
import TS_TAILWIND_CODE from '../../../variants/tsTailwind/Backgrounds/mouseRapeldots/MouseRepelDots';

// ── Usage (live-generated from customize props) ───────────────────────────────
export const getUsageCode = (
  { dotCount, repelRadius, force, springK, damping, dotColor, dotColorMid, dotColorHot, minDotSize, maxDotSize },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';
  return `import MouseRepelDots from "./MouseRepelDots";

const App${typeAnnotation} = () => (
  <div style={{ width: '100%', height: '100vh', background: '#0a0a0a' }}>
    <MouseRepelDots
      dotCount={${dotCount}}
      repelRadius={${repelRadius}}
      force={${force}}
      springK={${springK}}
      damping={${damping}}
      dotColor="${dotColor}"
      dotColorMid="${dotColorMid}"
      dotColorHot="${dotColorHot}"
      minDotSize={${minDotSize}}
      maxDotSize={${maxDotSize}}
    />
  </div>
);

export default App;`;
};

// ── Shared CSS (used by jsCss + tsCss variants) ───────────────────────────────
export const CSS_CODE = `.mouse-repel-dots-canvas {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}`;

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
