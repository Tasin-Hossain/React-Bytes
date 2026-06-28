export const getUsageCode = (
  {
    numberOfCards,
    radius,
    duration,
    cardWidth,
    cardHeight,
    pauseOnHover,
    reverse,
    draggable,
    autoPlay,
    mouseWheel,
    filterOnHover,
    defaultFiltered,
    initialRotation,
    entranceAnimation,
    entranceType,
    entranceDuration,
    entranceStagger,
    entranceEase,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  return `import RotatingCards from "./RotatingCards";

const cards = [
  { id: 1, image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=70" },
  { id: 2, image: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&q=70" },
  // add more cards...
];

const App${typeAnnotation} = () => (
  <RotatingCards
    cards={cards}
    numberOfCards={${numberOfCards}}
    radius={${radius}}
    duration={${duration}}
    cardWidth={${cardWidth}}
    cardHeight={${cardHeight}}
    pauseOnHover={${pauseOnHover}}
    reverse={${reverse}}
    draggable={${draggable}}
    autoPlay={${autoPlay}}
    mouseWheel={${mouseWheel}}
    filterOnHover={${filterOnHover}}
    defaultFiltered={${defaultFiltered}}
    initialRotation={${initialRotation}}
    entranceAnimation={${entranceAnimation}}
    entranceType="${entranceType}"
    entranceDuration={${entranceDuration}}
    entranceStagger={${entranceStagger}}
    entranceEase="${entranceEase}"
  />
);

export default App;`;
};