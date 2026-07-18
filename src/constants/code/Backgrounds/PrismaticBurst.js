export const getUsageCode = (
  {
    intensity,
    speed,
    animationType,
    colors,
    distort,
    paused,
    offsetX,
    offsetY,
    hoverDampness,
    rayCount,
    mixBlendMode,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  return `import PrismaticBurst from "./PrismaticBurst";

const App${typeAnnotation} = () => (
  <div style={{ width: '100%', height: '500px', position: 'relative' }}>
    <PrismaticBurst
      intensity={${intensity}}
      speed={${speed}}
      animationType="${animationType}"
      colors={${JSON.stringify(colors)}}
      distort={${distort}}
      paused={${paused}}
      offset={{ x: ${offsetX}, y: ${offsetY} }}
      hoverDampness={${hoverDampness}}
      rayCount={${rayCount}}
      mixBlendMode="${mixBlendMode}"
    />
  </div>
);

export default App;`;
};