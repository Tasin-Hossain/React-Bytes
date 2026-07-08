export const getUsageCode = (
  {
    text,
    trigger,
    minY,
    maxY,
    minX,
    maxX,
    minRotation,
    maxRotation,
    shatterOpacity,
    shatterColor,
    color,
    fallDuration,
    reassembleDuration,
    fallEase,
    reassembleEase,
    stagger,
    reassembleGap,
    textClassName,
    disabled,
  },
  lang = 'js'
) => {
  const typeAnnotation = lang === 'ts' ? ': React.FC' : '';

  return `import ShatterText from "./ShatterText";

const App${typeAnnotation} = () => (
  <ShatterText
    text="${text}"
    trigger="${trigger}"
    minY={${minY}}
    maxY={${maxY}}
    minX={${minX}}
    maxX={${maxX}}
    minRotation={${minRotation}}
    maxRotation={${maxRotation}}
    shatterOpacity={${shatterOpacity}}
    shatterColor="${shatterColor}"
    resetColor="${color}"
    fallDuration={${fallDuration}}
    reassembleDuration={${reassembleDuration}}
    fallEase="${fallEase}"
    reassembleEase="${reassembleEase}"
    stagger={${stagger}}
    reassembleGap={${reassembleGap}}
    textClassName="${textClassName}"
    disabled={${disabled}}
  />
);

export default App;`;
};