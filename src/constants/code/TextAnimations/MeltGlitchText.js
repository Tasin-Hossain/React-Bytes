export const getUsageCode = (
  {
    text,
    fontSize,
    fontWeight,
    color,
    cyanColor,
    magentaColor,
    radius,
    dropAmount,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  return `import MeltGlitchText from "./MeltGlitchText";

const App${typeAnnotation} = () => (
  <MeltGlitchText
    text="${text}"
    fontSize={${fontSize}}
    fontWeight={${fontWeight}}
    color="${color}"
    cyanColor="${cyanColor}"
    magentaColor="${magentaColor}"
    radius={${radius}}
    dropAmount={${dropAmount}}
  />
);

export default App;`;
};