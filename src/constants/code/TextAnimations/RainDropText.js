export const getUsageCode = (
  {
    text,
    color,
    delay,
    duration,
    dropHeight,
    ease,
    repeat,
    repeatDelay,
    fontSize,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  return `import RainDropText from "./RainDropText";

const App${typeAnnotation} = () => (
  <RainDropText
    text="${text}"
    color="${color}"
    delay={${delay}}
    duration={${duration}}
    dropHeight={${dropHeight}}
    ease="${ease}"
    repeat={${repeat}}
    repeatDelay={${repeatDelay}}
    fontSize="${fontSize}"
  />
);

export default App;`;
};