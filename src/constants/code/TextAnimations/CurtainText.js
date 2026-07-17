
export const getUsageCode = (
  {
    text,
    direction,
    baseColor,
    activeColor,
    staggerMs,
    durationMs,
    easing,
    resetOnLeave,

  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  return `import CurtainText from "./CurtainText";

const App${typeAnnotation} = () => (
  <CurtainText
    text="${text}"
    direction="${direction}"
    baseColor="${baseColor}"
    activeColor="${activeColor}"
    staggerMs={${staggerMs}}
    durationMs={${durationMs}}
    easing="${easing}"
    resetOnLeave={${resetOnLeave}}

  />
);

export default App;`;
};
