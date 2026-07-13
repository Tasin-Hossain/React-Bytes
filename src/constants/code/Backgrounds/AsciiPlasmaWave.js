export const getUsageCode = (
  {
    colors,
    speed1,
    speed2,
    dir2,
    focalLength,
    bend1,
    bend2,
    rotationDeg,
    xOffset,
    yOffset,
    cellSize,
    cellFill,
    asciiChars,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  const colorsArr = `[${(colors ?? []).map(c => `"${c}"`).join(', ')}]`;
  const asciiCharsStr = JSON.stringify(asciiChars ?? ' .:-=+*#%@■');

  return `import PlasmaWave from "./PlasmaWave";

const App${typeAnnotation} = () => (
  <div style={{ width: '100%', height: '100vh', background: '#0a0a0a' }}>
    <PlasmaWave
      colors={${colorsArr}}
      speed1={${speed1}}
      speed2={${speed2}}
      dir2={${dir2}}
      focalLength={${focalLength}}
      bend1={${bend1}}
      bend2={${bend2}}
      rotationDeg={${rotationDeg}}
      xOffset={${xOffset}}
      yOffset={${yOffset}}
      cellSize={${cellSize}}
      cellFill={${cellFill}}
      asciiChars={${asciiCharsStr}}
    />
  </div>
);

export default App;`;
};