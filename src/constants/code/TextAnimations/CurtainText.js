
export const getUsageCode = (
  {
    text,
    direction,
    baseColor,
    activeColor,
    fontClass,
    textSize,
    tracking,
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
    fontClass="${fontClass}"
    textSize="${textSize}"
    tracking="${tracking}"
    staggerMs={${staggerMs}}
    durationMs={${durationMs}}
    easing="${easing}"
    resetOnLeave={${resetOnLeave}}

  />
);

export default App;`;
};
