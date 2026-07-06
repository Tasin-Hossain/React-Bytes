export const getUsageCode = (
  {
    text,
    color,
    fontWeight,
    intensity,
    density,
    maxShift,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  return `import StaticNoiseText from "./StaticNoiseText";

const App${typeAnnotation} = () => (
  <StaticNoiseText
    text="${text}"
    color="${color}"
    fontWeight={${fontWeight}}
    intensity={${intensity}}
    density={${density}}
    maxShift={${maxShift}}
  />
);

export default App;`;
};