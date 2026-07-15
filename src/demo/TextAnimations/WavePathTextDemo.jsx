// pages/TextAnimations/WavePathTextDemo.jsx

import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  INITIAL_PROPS,
  WavePathTextPrompt,
  CODE_VARIANTS,
  AUTHOR_NAME,
  getJsrepoCmds,
} from '../../config/TextAnimations/WavePathText';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewInput from '../../components/shared/preview/PreviewInput';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import { getUsageCode } from '../../constants/code/TextAnimations/WavePathText';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';

import WavePathText from '../../content/TextAnimations/WavePathText';



// ─────────────────────────────────────────────────────────────────────────────
const WavePathTextInner = () => {
  const { props, setProps, replay, animKey, langTab, styleTab } = useComponentProps();

  const variant = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsRepoCmds = getJsrepoCmds(variant);
  const usageCode = getUsageCode(props, langTab);

  const handlePropChange = key => val => {
    setProps({ [key]: val });
    replay();
  };

  const handleAnimChange = key => val => {
    setProps({ [key]: val });
  };

  return (
    <DemoBuilder
      title="Wave Path Text"
      favKey="text-animations/wave-path-text"
      prompt={WavePathTextPrompt}
      PreviewComponent={<WavePathText key={animKey} {...props} />}
      customize={
        <Customize>
          {/* Row 0 – Text, reversed */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewInput
              title="Text"
              value={props.text}
              onChange={handlePropChange('text')}
            />
            <PreviewSwitch
              label="Reversed"
              value={props.reversed}
              onChange={handleAnimChange('reversed')}
            />
            <PreviewSlider
              label="Duration (s)"
              value={props.duration}
              onChange={handleAnimChange('duration')}
              min={4}
              max={60}
              step={1}
              display={props.duration}
            />
          </div>

          {/* Row 1 – Animation timing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Path Scale"
              value={props.pathScale}
              onChange={handleAnimChange('pathScale')}
              min={0.5}
              max={4}
              step={0.1}
              display={props.pathScale.toFixed(1)}
            />
            <PreviewInput
              title="Font Size"
              value={props.fontSize}
              onChange={handleAnimChange('fontSize')}
            />
            <PreviewSlider
              title="Letter Spacing"
              value={props.letterSpacing}
              onChange={handleAnimChange('letterSpacing')}
            />
          </div>

        </Customize>
      }
      propsTable={<PropsTable PROPS_DATA={PROPS_DATA} />}
      dependencies={<Dependencies dependencies={dep} />}
      footer={<CraftedBy name={AUTHOR_NAME} />}
      // CodeTab props
      pkgCmds={PKG_CMDS}
      shadcnCmds={shadcnCmds}
      jsrepoCmds={jsRepoCmds}
      usageCode={usageCode}
      codeVariants={CODE_VARIANTS}
      CodeBlock={CodeBlock}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const WavePathTextDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <WavePathTextInner />
  </ComponentPropsProvider>
);

export default WavePathTextDemo;