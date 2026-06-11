
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
    className,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  // Only include className prop line if a value is provided
  const classNameLine = className
    ? `\n    className="${className}"`
    : '';

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
    resetOnLeave={${resetOnLeave}}${classNameLine}
    classname="{classes}"
  />
);

export default App;`;
};
