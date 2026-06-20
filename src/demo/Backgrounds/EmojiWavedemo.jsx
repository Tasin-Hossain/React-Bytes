// pages/Backgrounds/EmojiWaveDemo.jsx

import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  getJsrepoCmds,
  INITIAL_PROPS,
  CODE_VARIANTS,
  AUTHOR_NAME
} from '../../config/Backgrounds/EmojiWave';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewInput from '../../components/shared/preview/PreviewInput';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';
import PreviewColorPicker from '../../components/shared/preview/PreviewColorPicker';
import { getUsageCode } from '../../constants/code/Backgrounds/EmojiWave';
import { EmojiWavePrompt } from '../../config/Backgrounds/EmojiWave';
import EmojiWave from '../../content/Backgrounds/EmojiWave';

const EmojiWaveInner = () => {
  const { props, replay, setProps, langTab, styleTab } = useComponentProps();

  const variant = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsRepoCmds = getJsrepoCmds(variant);
  const usageCode = getUsageCode(props, langTab);

  const handlePropChange = key => val => {
    setProps({ [key]: val });
    replay();
  };

  return (
    <DemoBuilder
      title="Emoji Wave"
      favKey="backgrounds/emoji-wave"
      prompt={EmojiWavePrompt}
      demoContent={props.demoContent}
      onToggleDemoContent={handlePropChange('demoContent')}
      childrenClassname="w-full"
      PreviewComponent={<EmojiWave {...props} className="w-full min-h-120" />}
      customize={
        <Customize>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewInput title="eomji" value={props.eomji} onChange={handlePropChange('eomji')} />
            <PreviewSlider
              label="Speed"
              value={props.speed}
              onChange={handlePropChange('speed')}
              min={0}
              max={3}
              step={0.1}
            />
            <PreviewSlider
              label="Element Size"
              value={props.elementSize}
              onChange={handlePropChange('elementSize')}
              min={8}
              max={32}
              step={1}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Noise Scale"
              value={props.noiseScale}
              onChange={handlePropChange('noiseScale')}
              min={0.1}
              max={3}
              step={0.1}
            />
            <PreviewSlider
              label="Intensity"
              value={props.intensity}
              onChange={handlePropChange('intensity')}
              min={0}
              max={2}
              step={0.05}
            />
            <PreviewSlider
              label="Wave Tension"
              value={props.waveTension}
              onChange={handlePropChange('waveTension')}
              min={0.1}
              max={2}
              step={0.05}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Wave Twist"
              value={props.waveTwist}
              onChange={handlePropChange('waveTwist')}
              min={0}
              max={1}
              step={0.01}
            />
            <PreviewSlider
              label="Interaction Intensity"
              value={props.interactionIntensity}
              onChange={handlePropChange('interactionIntensity')}
              min={0}
              max={2}
              step={0.05}
            />
            <PreviewSwitch label="Invert" value={props.invert} onChange={handlePropChange('invert')} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSwitch
              label="Cursor Interaction"
              value={props.hasCursorInteraction}
              onChange={handlePropChange('hasCursorInteraction')}
            />
            <PreviewColorPicker title="Character Color" value={props.color} onChange={handlePropChange('color')} />
            <PreviewColorPicker
              title="Background Color"
              value={props.bgColor === 'transparent' ? '#000000' : props.bgColor}
              onChange={handlePropChange('bgColor')}
            />
          </div>
        </Customize>
      }
      propsTable={<PropsTable PROPS_DATA={PROPS_DATA} />}
      dependencies={<Dependencies dependencies={dep} />}
      footer={<CraftedBy name={AUTHOR_NAME} />}
      pkgCmds={PKG_CMDS}
      shadcnCmds={shadcnCmds}
      jsrepoCmds={jsRepoCmds}
      usageCode={usageCode}
      codeVariants={CODE_VARIANTS}
      CodeBlock={CodeBlock}
    />
  );
};

const EmojiWaveDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <EmojiWaveInner />
  </ComponentPropsProvider>
);

export default EmojiWaveDemo;