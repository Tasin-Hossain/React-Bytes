export const getUsageCode = (
  {
    text,
    font,
    color,
    direction,
    baseVelocity,
    curveAmount,
    gap,
    draggable,
    dragIntensity,
    fade,
    fadePercent,
    style,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';
  const fontStr = JSON.stringify(font);
  const styleStr = JSON.stringify(style);

  return `import CurvedMarquee from "./CurvedMarquee";

const App${typeAnnotation} = () => (
  <CurvedMarquee
    text="${text}"
    font={${fontStr}}
    color="${color}"
    direction="${direction}"
    baseVelocity={${baseVelocity}}
    curveAmount={${curveAmount}}
    gap={${gap}}
    draggable={${draggable}}
    dragIntensity={${dragIntensity}}
    fade={${fade}}
    fadePercent={${fadePercent}}
    style={${styleStr}}
  />
);

export default App;`;
};