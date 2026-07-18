export const getUsageCode = (
  {
    numBars,
    gradientFrom,
    gradientTo,
    direction,
    animationDuration,
    noise,
    backgroundColor,
    className,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';
 
  return `import { Component as GradientBarsBackground } from "./GradientBarsBackground";
 
const App${typeAnnotation} = () => (
  <GradientBarsBackground
    numBars={${numBars}}
    gradientFrom="${gradientFrom}"
    gradientTo="${gradientTo}"
    direction="${direction}"
    animationDuration={${animationDuration}}
    noise={${noise}}
    backgroundColor="${backgroundColor}"
    className="${className}"
  >
    <h1 style={{ color: 'white' }}>Your content</h1>
  </GradientBarsBackground>
);
 
export default App;`;
};