export const getUsageCode = (
  {
    faceCount,
    faceWidth,
    faceHeight,
    dragSensitivity,
    shadeIntensity,
    shadeBase,
    autoRotate,
    autoRotateSpeed,
    autoRotateDirection,
    smoothness,
    inertia,
    inertiaResistance,
    pauseAutoRotateOnHover,
    initialRotation,
    faceFit,
    entranceAnimation,
    entranceType,
    entranceDuration,
    entranceStagger,
    entranceEase,
    filterOnHover,
    defaultFiltered,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  return `import RotatingCarousel from "./RotatingCarousel";

const images = [
  "https://picsum.photos/id/37/300/300",
  "https://picsum.photos/id/38/300/300",
  "https://picsum.photos/id/39/300/300",
  // add more images...
];

const App${typeAnnotation} = () => (
  <RotatingCarousel
    images={images}
    faceCount={${faceCount}}
    faceWidth={${faceWidth}}
    faceHeight={${faceHeight}}
    dragSensitivity={${dragSensitivity}}
    shadeIntensity={${shadeIntensity}}
    shadeBase={${shadeBase}}
    autoRotate={${autoRotate}}
    autoRotateSpeed={${autoRotateSpeed}}
    autoRotateDirection={${autoRotateDirection}}
    smoothness={${smoothness}}
    inertia={${inertia}}
    inertiaResistance={${inertiaResistance}}
    pauseAutoRotateOnHover={${pauseAutoRotateOnHover}}
    initialRotation={${initialRotation}}
    faceFit="${faceFit}"
    entranceAnimation={${entranceAnimation}}
    entranceType="${entranceType}"
    entranceDuration={${entranceDuration}}
    entranceStagger={${entranceStagger}}
    entranceEase="${entranceEase}"
    filterOnHover={${filterOnHover}}
    defaultFiltered={${defaultFiltered}}
  />
);

export default App;`;
};