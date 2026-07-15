export const getUsageCode = (
  {
    text,
    path,
    viewBox,
    pathScale,
    duration,
    reversed,
    fontSize,
    letterSpacing,
    textClassName,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  const pathProp = path ? `\n    path="${path}"` : '';
  return `import WavePathText from "./WavePathText";

const App${typeAnnotation} = () => (
  <WavePathText
    text="${text}"${pathProp}
    viewBox="${viewBox}"
    pathScale={${pathScale}}
    duration={${duration}}
    reversed={${reversed}}
    fontSize="${fontSize}"
    letterSpacing="${letterSpacing}"
    textClassName= "${textClassName}"
  />
);

export default App;`;
};