export const getUsageCode = (
  {
    gridSpacing,
    curveStrength,
    diagonals,
    repelRadius,
    force,
    easeSpeed,
    damping,
    springK,
    waveAmplitude,
    waveSpeed,
    ambientNoise,
    ambientNoiseAmplitude,
    ambientNoiseSpeed,
    animationMode,
    animationSpeed,
    animationIntensity,
    lineWidth,
    glowIntensity,
    glowBlur,
    lineColor,
    glowColor,
    backgroundColor,
    colorMode,
    gradientColors,
    gradientDirection,
    rainbowSpeed,
    rainbowSaturation,
    rainbowLightness,
    vignette,
    vignetteStrength,
    pulseOnClick
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  // only render non-default optional props
  const diagonalsProp = diagonals ? `\n      diagonals` : '';
  const ambientNoiseProp = ambientNoise ? `\n      ambientNoise` : '';
  const vignetteProp = vignette ? `\n      vignette` : '';
  const pulseOnClickProp = pulseOnClick ? `\n      pulseOnClick` : '';

  const curveStrengthProp = curveStrength !== 0 ? `\n      curveStrength={${curveStrength}}` : '';
  const waveAmplitudeProp = waveAmplitude !== 0 ? `\n      waveAmplitude={${waveAmplitude}}` : '';
  const waveSpeedProp = waveAmplitude !== 0 ? `\n      waveSpeed={${waveSpeed}}` : '';
  const ambientNAmpProp = ambientNoise ? `\n      ambientNoiseAmplitude={${ambientNoiseAmplitude}}` : '';
  const ambientNSpdProp = ambientNoise ? `\n      ambientNoiseSpeed={${ambientNoiseSpeed}}` : '';
  const animSpeedProp = animationMode !== 'none' ? `\n      animationSpeed={${animationSpeed}}` : '';
  const animIntensityProp = animationMode !== 'none' ? `\n      animationIntensity={${animationIntensity}}` : '';
  const glowBlurProp = glowBlur !== 0 ? `\n      glowBlur={${glowBlur}}` : '';
  const vigStrengthProp = vignette ? `\n      vignetteStrength={${vignetteStrength}}` : '';

  const gradientColorsProp =
    colorMode === 'gradient' ? `\n      gradientColors={${JSON.stringify(gradientColors)}}` : '';
  const gradientDirProp =
    colorMode !== 'solid' && gradientDirection !== 'horizontal'
      ? `\n      gradientDirection="${gradientDirection}"`
      : '';
  const rainbowSpeedProp = colorMode === 'rainbow' ? `\n      rainbowSpeed={${rainbowSpeed}}` : '';
  const rainbowSatProp = colorMode === 'rainbow' ? `\n      rainbowSaturation={${rainbowSaturation}}` : '';
  const rainbowLitProp = colorMode === 'rainbow' ? `\n      rainbowLightness={${rainbowLightness}}` : '';

  return `import MouseRepelGrid from "./MouseRepelGrid";

const App${typeAnnotation} = () => (
  <div style={{ width: '100%', height: '100vh' }}>
    <MouseRepelGrid
      gridSpacing={${gridSpacing}}${curveStrengthProp}${diagonalsProp}$
      repelRadius={${repelRadius}}
      force={${force}}
      easeSpeed={${easeSpeed}}
      damping={${damping}}
      springK={${springK}}${waveAmplitudeProp}${waveSpeedProp}${ambientNoiseProp}${ambientNAmpProp}${ambientNSpdProp}
      animationMode="${animationMode}"${animSpeedProp}${animIntensityProp}
      lineWidth={${lineWidth}}
      glowIntensity={${glowIntensity}}${glowBlurProp}
      lineColor="${lineColor}"
      glowColor="${glowColor}"
      backgroundColor="${backgroundColor}"
      colorMode="${colorMode}"${gradientColorsProp}${gradientDirProp}${rainbowSpeedProp}${rainbowSatProp}${rainbowLitProp}${vignetteProp}${vigStrengthProp}${pulseOnClickProp}
    />
  </div>
);

export default App;`;
};
