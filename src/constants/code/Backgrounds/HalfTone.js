export const getUsageCode = (
  {
    color,
    bgColor,
    speed,
    direction,
    angle,
    scale,
    dotSize,
    shape,
    waveFreq,
    opacity,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';


  return `import HalfTone from "./HalfTone";

const App${typeAnnotation} = () => (
  <HalfTone
    color="${color}"
    bgColor="${bgColor}"
    speed={${speed}}
    direction="${direction}"
    angle="${angle}"
    scale={${scale}}
    dotSize={${dotSize}}
    shape="${shape}"
    waveFreq={${waveFreq}}
    opacity={${opacity}}
  />
);

export default App;`;
};