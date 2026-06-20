// constants/code/Backgrounds/AsciiWave.js

export const getUsageCode = (
  {
    eomji,
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

  return `import EmojiWave from "./EmojiWave";

const App${typeAnnotation} = () => (
  <EmojiWave
    eomji="${eomji}"
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