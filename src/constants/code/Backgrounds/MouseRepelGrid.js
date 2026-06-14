export const getUsageCode = (
  {
    gridSpacing,
    curveStrength,
    repelRadius,
    force,
    easeSpeed,
    damping,
    springK,
    waveAmplitude,
    ambientNoise,
    ambientNoiseAmplitude,
    ambientNoiseSpeed,
    lineWidth,
    glowIntensity,
    lineColor,
    glowColor,
    backgroundColor,
    diagonals,
    colorMode,
    gradientColors,
    gradientDirection,
    rainbowSpeed,
    rainbowSaturation,
    rainbowLightness,
    vignette,
    vignetteStrength,
    animationMode,
    animationSpeed,
    animationIntensity,
    pulseOnClick,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  const gradientColorsArr = `[${gradientColors.map(c => `"${c}"`).join(', ')}]`;

  return `import MouseRepelGrid from "./MouseRepelGrid";

const App${typeAnnotation} = () => (
  <div style={{ width: '100%', height: '100vh', background: '#0a0a0a' }}>
    <MouseRepelGrid
      gridSpacing={${gridSpacing}}
      curveStrength={${curveStrength}}
      repelRadius={${repelRadius}}
      force={${force}}
      easeSpeed={${easeSpeed}}
      damping={${damping}}
      springK={${springK}}
      waveAmplitude={${waveAmplitude}}
      ambientNoise={${ambientNoise}}
      ambientNoiseAmplitude={${ambientNoiseAmplitude}}
      ambientNoiseSpeed={${ambientNoiseSpeed}}
      lineWidth={${lineWidth}}
      glowIntensity={${glowIntensity}}
      lineColor="${lineColor}"
      glowColor="${glowColor}"
      backgroundColor="${backgroundColor}"
      diagonals={${diagonals}}
      colorMode="${colorMode}"
      gradientColors={${gradientColorsArr}}
      gradientDirection="${gradientDirection}"
      rainbowSpeed={${rainbowSpeed}}
      rainbowSaturation={${rainbowSaturation}}
      rainbowLightness={${rainbowLightness}}
      vignette={${vignette}}
      vignetteStrength={${vignetteStrength}}
      animationMode="${animationMode}"
      animationSpeed={${animationSpeed}}
      animationIntensity={${animationIntensity}}
      pulseOnClick={${pulseOnClick}}
    />
  </div>
);

export default App;`;
};