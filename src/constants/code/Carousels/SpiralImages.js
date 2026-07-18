export const getUsageCode = (
  {
    turns,
    speed,
    spacing,
    spread,
    sizeAttenuation,
    imageSize,
    fadeIn,
    fadeOut,
    cornerRadius,
    className,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  return `import SpiralImages from "./SpiralImages";

const images = [
  { src: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&q=70" },
  { src: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=500&q=70" },
  // add more images...
];

const App${typeAnnotation} = () => (
  <SpiralImages
    images={images}
    turns={${turns}}
    speed={${speed}}
    spacing={${spacing}}
    spread={${spread}}
    sizeAttenuation={${sizeAttenuation}}
    imageSize={${imageSize}}
    fadeIn={${fadeIn}}
    fadeOut={${fadeOut}}
    cornerRadius={${cornerRadius}}
    className="${className}"
  />
);

export default App;`;
};