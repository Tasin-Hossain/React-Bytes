export const getUsageCode = (
  {
    numberOfCards,
    cardWidth,
    cardHeight,
    gap,
    perspective,
    maxRotation,
    scaleStep,
    opacityStep,
    brightnessStep,
    draggable,
    snap,
    initialIndex,
    autoPlay,
    duration,
    direction,
    curveIntensity,
    reverse,
    pauseOnHover,
    mouseWheel,
    wheelSmoothness,
    wheelSensitivity,
    filterOnHover,
    defaultFiltered,
    entranceAnimation,
    entranceDuration,
    entranceStagger,
    entranceEase,
    entranceType,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  return `import SpectraSlider from "./SpectraSlider";

const cards = [
  { id: 1, image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&q=70" },
  { id: 2, image: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=500&q=70" },
  // add more cards...
];

const App${typeAnnotation} = () => (
  <SpectraSlider
    cards={cards}
    numberOfCards={${numberOfCards}}
    cardWidth={${cardWidth}}
    cardHeight={${cardHeight}}
    gap={${gap}}
    perspective={${perspective}}
    maxRotation={${maxRotation}}
    scaleStep={${scaleStep}}
    opacityStep={${opacityStep}}
    brightnessStep={${brightnessStep}}
    draggable={${draggable}}
    snap={${snap}}
    initialIndex={${initialIndex}}
    autoPlay={${autoPlay}}
    duration={${duration}}
    direction={${direction}}
    curveIntensity={${curveIntensity}}
    reverse={${reverse}}
    pauseOnHover={${pauseOnHover}}
    mouseWheel={${mouseWheel}}
    wheelSmoothness={${wheelSmoothness}}
    wheelSensitivity={${wheelSensitivity}}
    filterOnHover={${filterOnHover}}
    defaultFiltered={${defaultFiltered}}
    entranceAnimation={${entranceAnimation}}
    entranceDuration={${entranceDuration}}
    entranceStagger={${entranceStagger}}
    entranceEase="${entranceEase}"
    entranceType="${entranceType}"
  />
);

export default App;`;
};