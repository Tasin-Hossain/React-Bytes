export const getUsageCode = (
  {
    text,
    colors,
    particleSize,
    particleGap,
    mouseControls,
    fontSize,
    autoFit,
    backgroundColor,
    friction,
    ease,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  return `import ParticleText from "./ParticleText";

const App${typeAnnotation} = () => (
  <div style={{ width: "600px", height: "300px" }}>
    <ParticleText
      text="${text}"
      colors={${JSON.stringify(colors)}}
      particleSize={${particleSize}}
      particleGap={${particleGap}}
      mouseControls={${JSON.stringify(mouseControls)}}
      fontSize={${fontSize}}
      autoFit={${autoFit}}
      backgroundColor="${backgroundColor}"
      friction={${friction}}
      ease={${ease}}
    />
  </div>
);

export default App;`;
};