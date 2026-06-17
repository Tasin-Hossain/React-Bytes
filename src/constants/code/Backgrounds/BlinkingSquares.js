// constants/code/Backgrounds/BlinkingSquares.js

export const getUsageCode = (
  {
    direction,
    gridSize,
    squareSize,
    fadeStart,
    fadeEnd,
    falloff,
    minBrightness,
    twinkleSpeed,
    twinkleStrength,
    intensity,
    opacity,
    squareColor,
    backgroundColor,
    dpr,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  return `import BlinkingSquares from "./BlinkingSquares";

const App${typeAnnotation} = () => (
  <BlinkingSquares
    direction="${direction}"
    gridSize={${gridSize}}
    squareSize={${squareSize}}
    fadeStart={${fadeStart}}
    fadeEnd={${fadeEnd}}
    falloff={${falloff}}
    minBrightness={${minBrightness}}
    twinkleSpeed={${twinkleSpeed}}
    twinkleStrength={${twinkleStrength}}
    intensity={${intensity}}
    opacity={${opacity}}
    squareColor="${squareColor}"
    backgroundColor="${backgroundColor}"
    dpr={${dpr}}
  />
);

export default App;`;
};