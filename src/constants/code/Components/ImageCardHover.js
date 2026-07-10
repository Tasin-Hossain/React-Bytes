export const getUsageCode = (
  {
    layerCount,
    defaultShape,
    width,
    height,
    initialRotation,
    initialBlur,
    initialColor,
    initialOpacity,
    initialParallax,
    initial3D,
    tiltMax,
    panMax,
    depthStep,
    scale3D,
    opacityFalloff,
    moveAmplify,
    tiltBoost,
    panBoost,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';
 
  return `import ImageCardHover from "./ImageCardHover";
 
const layerImages = [
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&q=70",
  "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=600&q=70",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=70",
  // add more layer images...
];
 
const App${typeAnnotation} = () => (
  <ImageCardHover
    image={layerImages[0]}
    layerImages={layerImages}
    layerCount={${layerCount}}
    defaultShape="${defaultShape}"
    width={${width}}
    height={${height}}
    initialRotation={${initialRotation}}
    initialBlur={${initialBlur}}
    initialColor={${initialColor}}
    initialOpacity={${initialOpacity}}
    initialParallax={${initialParallax}}
    initial3D={${initial3D}}
    tiltMax={${tiltMax}}
    panMax={${panMax}}
    depthStep={${depthStep}}
    scale3D={${scale3D}}
    opacityFalloff={${opacityFalloff}}
    moveAmplify={${moveAmplify}}
    tiltBoost={${tiltBoost}}
    panBoost={${panBoost}}
  />
);
 
export default App;`;
};