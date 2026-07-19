export const getUsageCode = (
  {
    simResolution,
    dyeResolution,
    densityDissipation,
    velocityDissipation,
    pressure,
    pressureIterations,
    curl,
    splatRadius,
    splatForce,
    shading,
    colorUpdateSpeed,
    color,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  return `import SmokeyCursorEffect from "./SmokeyCursorEffect";

const App${typeAnnotation} = () => (
  <div style={{ width: "100%", height: "480px" }}>
    <SmokeyCursorEffect
      simResolution={${simResolution}}
      dyeResolution={${dyeResolution}}
      densityDissipation={${densityDissipation}}
      velocityDissipation={${velocityDissipation}}
      pressure={${pressure}}
      pressureIterations={${pressureIterations}}
      curl={${curl}}
      splatRadius={${splatRadius}}
      splatForce={${splatForce}}
      shading={${shading}}
      colorUpdateSpeed={${colorUpdateSpeed}}
      color="${color}"
    />
  </div>
);

export default App;`;
};