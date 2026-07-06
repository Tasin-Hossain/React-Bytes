export const getUsageCode = (
  {
    text,
    charDelay,
    duration,
    repeat,
    dimOpacity,
    baseColor,
    spotColor,
    ease,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';
 
  return `import SpotlightText from "./SpotlightText";
 
const App${typeAnnotation} = () => (
  <SpotlightText
    text="${text}"
    charDelay={${charDelay}}
    duration={${duration}}
    repeat={${repeat}}
    dimOpacity={${dimOpacity}}
    baseColor="${baseColor}"
    spotColor="${spotColor}"
    ease="${ease}"

  />
);
 
export default App;`;
};
 