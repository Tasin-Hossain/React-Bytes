export const getUsageCode = (
  {
    speed,
    scale,
    color,
    noiseIntensity,
    rotation,
    className,

  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';
 
  return `import Silk from "./Silk";
 
const App${typeAnnotation} = () => (
  <div style={{ width: '100%', height: '100vh' }}>
    <Silk
      speed={${speed}}
      scale={${scale}}
      color="${color}"
      noiseIntensity={${noiseIntensity}}
      rotation={${rotation}}
      className="${className}"
    />
  </div>
);
 
export default App;`;
};