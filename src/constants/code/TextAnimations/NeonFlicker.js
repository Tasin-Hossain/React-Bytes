export const getUsageCode = (
  {
    text,
    color,
    glow,
    glowSoft,
    dim,
    minGlow,
    maxGlow,
    charDelay,
    repeat,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  return `import NeonFlicker from "./NeonFlicker";

const App${typeAnnotation} = () => (
  <NeonFlicker
    text="${text}"
    color="${color}"
    glow="${glow}"
    glowSoft="${glowSoft}"
    dim="${dim}"
    minGlow={${minGlow}}
    maxGlow={${maxGlow}}
    charDelay={${charDelay}}
    repeat={${repeat}}
  />
);

export default App;`;
};