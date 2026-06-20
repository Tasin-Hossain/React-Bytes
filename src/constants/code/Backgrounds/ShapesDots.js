export const getUsageCode = (
  {
    cellSize,
    influenceRadiusVmin,
    attackTime,
    releaseTime,
    idleScale,
    minPeakScale,
    maxPeakScale,
    burstSpeed,
    burstThickness,
    backgroundColor,
    shapes,

    dpr,
    opacity,
    animationMode,
    animationSpeed,
    overlapGuard,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';
  const shapesArr = JSON.stringify(shapes);


  return `import ShapesDots from "./ShapesDots";

const App${typeAnnotation} = () => (
  <div style={{ width: '100%', height: '100vh' }}>
    <ShapesDots
      cellSize={${cellSize}}
      influenceRadiusVmin={${influenceRadiusVmin}}
      attackTime={${attackTime}}
      releaseTime={${releaseTime}}
      idleScale={${idleScale}}
      minPeakScale={${minPeakScale}}
      maxPeakScale={${maxPeakScale}}
      burstSpeed={${burstSpeed}}
      burstThickness={${burstThickness}}
      backgroundColor="${backgroundColor}"
      shapes={${shapesArr}}
      dpr={${dpr}}
      opacity={${opacity}}
      animationMode="${animationMode}"
      animationSpeed={${animationSpeed}}
      overlapGuard={${overlapGuard}}
    />
  </div>
);

export default App;`;
};