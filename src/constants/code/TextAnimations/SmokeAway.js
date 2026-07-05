export const getUsageCode = (
  {
    text,
    smokeY,
    smokeScale,
    smokeBlur,
    returnEase,
    color,
    className,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  return `import SmokeAway from "./SmokeAway";

const App${typeAnnotation} = () => (
  <SmokeAway
    text="${text}"
    smokeY={${smokeY}}
    smokeScale={${smokeScale}}
    smokeBlur={${smokeBlur}}
    returnEase="${returnEase}"
    color= "${color}"
    className="${className}"
  />
);

export default App;`;
};