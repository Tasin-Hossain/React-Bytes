export const getUsageCode = (
  {
    speed         = 0.8,
    scale         = 2.0,
    colorA        = '#1B0F33',
    colorB        = '#FF5DA2',
    noiseIntensity= 1.5,
    blend         = 0.5,
    opacity       = 1.0,
    bgColor       = '#000000',
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  return `import Vortex from "./Vortex";

const App${typeAnnotation} = () => (
  <Vortex
    speed={${speed}}
    scale={${scale}}
    colorA="${colorA}"
    colorB="${colorB}"
    noiseIntensity={${noiseIntensity}}
    blend={${blend}}
    opacity={${opacity}}
    bgColor="${bgColor}"
  />
);

export default App;`;
};