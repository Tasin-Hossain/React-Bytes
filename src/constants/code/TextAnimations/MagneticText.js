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

