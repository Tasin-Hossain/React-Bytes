// pages/Backgrounds/AsciiWaveDemo.jsx

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
} from '../../config/Backgrounds/AsciiWave';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewInput from '../../components/shared/preview/PreviewInput';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import AsciiWave from '../../content/Backgrounds/AsciiWave';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';
import PreviewColorPicker from '../../components/shared/preview/PreviewColorPicker';
import { getUsageCode } from '../../constants/code/Backgrounds/AsciiWave';
import { AsciiWavePrompt } from '../../config/Backgrounds/AsciiWave';

// ─────────────────────────────────────────────────────────────────────────────
const AsciiWaveInner = () => {
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
      title="Ascii Wave"
      favKey="backgrounds/ascii-wave"
      prompt={AsciiWavePrompt}
      demoContent={props.demoContent}
      onToggleDemoContent={handlePropChange('demoContent')}
      childrenClassname="w-full"
      PreviewComponent={<AsciiWave {...props} className="w-full min-h-120" />}
      customize={
        <Customize>
          {/* Row 1 – Characters + Speed + Element Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewInput title="Characters" value={props.characters} onChange={handlePropChange('characters')} />
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

          {/* Row 2 – Noise Scale + Intensity + Wave Tension */}
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

          {/* Row 3 – Wave Twist + Interaction Intensity */}
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

          {/* Row 4 – Invert + Cursor Interaction */}
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

// ─────────────────────────────────────────────────────────────────────────────
const AsciiWaveDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <AsciiWaveInner />
  </ComponentPropsProvider>
);

export default AsciiWaveDemo;
