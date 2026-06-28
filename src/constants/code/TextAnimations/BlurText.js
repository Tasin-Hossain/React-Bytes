export const getUsageCode = (
  {
    text,
    animateBy,
    from,
    scale,
    blur,
    yOffset,
    duration,
    charDelay,
    wordDelay,
    repeat,
    color,
    fontSize,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';


  return `import ExplodeText from "./ExplodeText";

const App${typeAnnotation} = () => (
  <ExplodeText
    text="${text}"
    animateBy="${animateBy}"
    from="${from}"
    scale={${scale}}
    blur={${blur}}
    yOffset={${yOffset}}
    duration={${duration}}
    charDelay={${charDelay}}
    wordDelay={${wordDelay}}
    repeat=${repeat}
    color="${color}"
    fontSize="${fontSize}"
  />
);

export default App;`;
};