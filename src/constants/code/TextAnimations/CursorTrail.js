// constants/code/TextAnimations/CursorTrail.js

export const getUsageCode = (
  {
    trailText,
    style,
    color,
    colors,
    spacing,
    minSize,
    maxSize,
    exitDuration,
    removalInterval,
    maxPoints,
    followMouseDirection,
    randomFloat,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';
  const colorsStr = JSON.stringify(colors);

  return `import CursorTrail from "./CursorTrail";

const App${typeAnnotation} = () => (
  <CursorTrail
    trailText="${trailText}"
    style="${style}"
    color="${color}"
    colors={${colorsStr}}
    spacing={${spacing}}
    minSize={${minSize}}
    maxSize={${maxSize}}
    exitDuration={${exitDuration}}
    removalInterval={${removalInterval}}
    maxPoints={${maxPoints}}
    followMouseDirection={${followMouseDirection}}
    randomFloat={${randomFloat}}
  >
    <div>Your content here</div>
  </CursorTrail>
);

export default App;`;
};