export const getUsageCode = (
  {
    x,
    y,
    radius,
    speed,
    thickness,
    roundness,
    blur,
    opacity,
    color,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  return `import RotatingStars from "./RotatingStars";

const App${typeAnnotation} = () => (
  <RotatingStars
    x={${x}}
    y={${y}}
    radius={${radius}}
    speed={${speed}}
    thickness={${thickness}}
    roundness={${roundness}}
    blur={${blur}}
    opacity={${opacity}}
    color="${color}"
  />
);

export default App;`;
};