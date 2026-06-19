// constants/code/Backgrounds/AsciiWave.js

export const getUsageCode = (
  {
    characters,
    color,
    waveTension,
    waveTwist,
    invert,
    noiseScale,
    elementSize,
    speed,
    hasCursorInteraction,
    intensity,
    interactionIntensity,
    videoUrl,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  return `import AsciiWave from "./AsciiWave";

const App${typeAnnotation} = () => (
  <AsciiWave
    characters="${characters}"
    color="${color}"
    waveTension={${waveTension}}
    waveTwist={${waveTwist}}
    invert={${invert}}
    noiseScale={${noiseScale}}
    elementSize={${elementSize}}
    speed={${speed}}
    hasCursorInteraction={${hasCursorInteraction}}
    intensity={${intensity}}
    interactionIntensity={${interactionIntensity}}
    videoUrl="${videoUrl}"
  />
);

export default App;`;
};