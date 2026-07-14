export const getUsageCode = (
  {
    text,
    as,
    width,
    weight,
    italic,
    alpha,
    flex,
    scale,
    textColor,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';
  const asProp = as && as !== 'h1' ? `\n    as="${as}"` : '';
  return `import TextPressure from "./TextPressure";

const App${typeAnnotation} = () => (
  <TextPressure
    text="${text}"${asProp}
    width={${width}}
    weight={${weight}}
    italic={${italic}}
    alpha={${alpha}}
    flex={${flex}}
    scale={${scale}}
    textColor="${textColor}"
  />
);

export default App;`;
};