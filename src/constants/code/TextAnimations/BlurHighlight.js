export const getUsageCode = (
  {
    text,
    mode,
    direction,
    method,
    highlightedBits,
    maskColor,
    textColor,
    ease,
    revealDuration,
    revealDelay,
    staggerAmount,
    once,
    amount,
    as,
    className,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';
  const bitsLiteral = JSON.stringify(highlightedBits ?? []);
  const staggerLine =
    staggerAmount === undefined || staggerAmount === null
      ? ''
      : `\n    staggerAmount={${staggerAmount}}`;

  return `import BlurHighlight from "./BlurHighlight";

const App${typeAnnotation} = () => (
  <BlurHighlight
    as="${as}"
    mode="${mode}"
    direction="${direction}"
    method="${method}"
    highlightedBits={${bitsLiteral}}
    maskColor="${maskColor}"
    textColor="${textColor}"
    ease="${ease}"
    revealDuration={${revealDuration}}
    revealDelay={${revealDelay}}${staggerLine}
    viewportOptions={{ once: ${once}, amount: ${amount} }}
    className="${className}"
  >
    ${text}
  </BlurHighlight>
);

export default App;`;
};