export const getUsageCode = (
  {
    dotRadius,
    dotSpacing,
    repelRadius,
    force,
    springK,
    damping,
    maxDotSize,
    dotColor,
    dotColorMid,
    dotColorHot,
    backgroundColor,
    gradientFrom,
    gradientTo,
    bulgeOnly,
    bulgeStrength,
    waveAmplitude,
    sparkleMode,
    sparkleColor,
    sparkleSize,
    sparkleSpeed,
    sparkleDensity,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  const gradientFromProp = gradientFrom ? `\n      gradientFrom="${gradientFrom}"` : '';
  const gradientToProp = gradientTo ? `\n      gradientTo="${gradientTo}"` : '';

  return `import MouseRepelDots from "./MouseRepelDots";

const App${typeAnnotation} = () => (
  <div style={{ width: '100%', height: '100vh', background: '#0a0a0a' }}>
    <MouseRepelDots
      dotRadius={${dotRadius}}
      dotSpacing={${dotSpacing}}
      repelRadius={${repelRadius}}
      force={${force}}
      springK={${springK}}
      damping={${damping}}
      maxDotSize={${maxDotSize}}
      dotColor="${dotColor}"
      dotColorMid="${dotColorMid}"
      dotColorHot="${dotColorHot}"
      backgroundColor="${backgroundColor}"${gradientFromProp}${gradientToProp}
      bulgeOnly={${bulgeOnly}}
      bulgeStrength={${bulgeStrength}}
      waveAmplitude={${waveAmplitude}}
      sparkleMode="${sparkleMode}"
      sparkleColor="${sparkleColor}"
      sparkleSize={${sparkleSize}}
      sparkleSpeed={${sparkleSpeed}}
      sparkleDensity={${sparkleDensity}}
    />
  </div>
);

export default App;`;
};