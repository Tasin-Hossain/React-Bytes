export const getUsageCode = (
  {
    text,
    direction,
    staggerFrom,
    staggerDuration,
    flipDuration,
    trigger,
    className,
    charClassName,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  return `import TextFlipBoard from "./TextFlipBoard";

const App${typeAnnotation} = () => (
  <TextFlipBoard
    text="${text}"
    direction="${direction}"
    staggerFrom="${staggerFrom}"
    staggerDuration={${staggerDuration}}
    flipDuration={${flipDuration}}
    trigger="${trigger}"
    className="${className}"
    charClassName="${charClassName}"
  />
);

export default App;`;
};