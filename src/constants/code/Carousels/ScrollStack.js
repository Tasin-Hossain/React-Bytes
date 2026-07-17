export const getUsageCode = (
  {
    count,
    itemDistance,
    itemStackDistance,
    stackPosition,
    baseScale,
    itemScale,
    rotationAmount,
    blurAmount,
    corner,
    shadow,
    imageRatio,
    cardMaxWidth
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  return `import ScrollStack from "./ScrollStack";

const cards = [
  { id: 1, date: "Published 2 days ago", title: "Ribbons of warm light", description: "Tubular forms sweeping diagonally across a near-black frame.", tag: "light", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=70" },
  { id: 2, date: "Published 6 days ago", title: "Molten colour swirls", description: "Reds and greens fold into one another with no hard edge in sight.", tag: "colour", image: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&q=70" },
  // add more cards...
];

const App${typeAnnotation} = () => (
  <ScrollStack
    cards={cards}
    count={${count}}
    itemDistance={${itemDistance}}
    itemStackDistance={${itemStackDistance}}
    stackPosition={${stackPosition}}
    baseScale={${baseScale}}
    itemScale={${itemScale}}
    rotationAmount={${rotationAmount}}
    blurAmount={${blurAmount}}
    corner={${corner}}
    shadow={${shadow}}
    imageRatio={${imageRatio}}
    cardMaxWidth={${cardMaxWidth}}
  />
);

export default App;`;
};