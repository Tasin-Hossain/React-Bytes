import JS_CSS_CODE      from '../../../content/jsCss/TextAnimations/MagneticText/MagneticText';
import CSS_CODE         from '../../../content/jsCss/TextAnimations/MagneticText/MagneticText.css?raw';
import JS_TAILWIND_CODE from '../../../content/jsTailwind/TextAnimations/MagneticText/MagneticText';
import TS_CSS_CODE      from '../../../content/tsCss/TextAnimations/MagneticText/MagneticText';
import TS_TAILWIND_CODE from '../../../content/tsTailwind/TextAnimations/MagneticText/MagneticText';

export const getUsageCode = (
  {
    text,
    subtitle,
    fontSize,
    subtitleSize,
    letterSpacing,
    textColor,
    subtitleColor,
    hoverColors,
    magnetRadius,
    magnetStrength,
    attractDuration,
    returnDuration,
    entranceAnim,
    entranceStagger,
    entranceDuration,
    entranceDelay,
    showCursor,
    showSubtitle,
    align,
    gap,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';
  const colorsStr = JSON.stringify(hoverColors);

  return `import MagneticText from "./MagneticText";

const App${typeAnnotation} = () => (
  <MagneticText
    text="${text}"
    subtitle="${subtitle}"
    fontSize="${fontSize}"
    subtitleSize="${subtitleSize}"
    letterSpacing="${letterSpacing}"
    textColor="${textColor}"
    subtitleColor="${subtitleColor}"
    hoverColors={${colorsStr}}
    magnetRadius={${magnetRadius}}
    magnetStrength={${magnetStrength}}
    attractDuration={${attractDuration}}
    returnDuration={${returnDuration}}
    entranceAnim="${entranceAnim}"
    entranceStagger={${entranceStagger}}
    entranceDuration={${entranceDuration}}
    entranceDelay={${entranceDelay}}
    showCursor={${showCursor}}
    showSubtitle={${showSubtitle}}
    align="${align}"
    gap="${gap}"
  />
);

export default App;`;
};

export { CSS_CODE };
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