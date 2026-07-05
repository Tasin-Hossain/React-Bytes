// pages/TextAnimations/NeonFlickerDemo.jsx

import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  INITIAL_PROPS,
  NeonFlickerPrompt,
  CODE_VARIANTS,
  AUTHOR_NAME,
  getJsrepoCmds,
} from '../../config/TextAnimations/NeonFlicker';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewInput from '../../components/shared/preview/PreviewInput';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import { getUsageCode } from '../../constants/code/TextAnimations/NeonFlicker';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';
import PreviewColorPicker from '../../components/shared/preview/PreviewColorPicker';

import NeonFlicker from '../../content/TextAnimations/NeonFlicker';



// ─────────────────────────────────────────────────────────────────────────────
const NeonFlickerInner = () => {
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
      title="Neon Flicker"
      favKey="text-animations/neon-flicker"
      prompt={NeonFlickerPrompt}
      PreviewComponent={<NeonFlicker key={animKey} {...props} />}
      customize={
        <Customize>
          {/* Row 0 – Text */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewInput
              title="Text"
              value={props.text}
              onChange={handlePropChange('text')}
            />
            <PreviewSlider
              label="Char Delay (s)"
              value={props.charDelay}
              onChange={handlePropChange('charDelay')}
              min={0.05}
              max={0.5}
              step={0.01}
              display={props.charDelay.toFixed(2)}
            />
            <PreviewSwitch
              label="Repeat"
              value={props.repeat}
              onChange={handleAnimChange('repeat')}
            />
          </div>

          {/* Row 1 – Glow intensity range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <PreviewSlider
              label="Min Glow"
              value={props.minGlow}
              onChange={handleAnimChange('minGlow')}
              min={0}
              max={1}
              step={0.05}
              display={props.minGlow.toFixed(2)}
            />
            <PreviewSlider
              label="Max Glow"
              value={props.maxGlow}
              onChange={handleAnimChange('maxGlow')}
              min={0}
              max={2}
              step={0.05}
              display={props.maxGlow.toFixed(2)}
            />
          </div>

          {/* Row 2 – Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-2">
            <PreviewColorPicker
              title="Color"
              color={props.color}
              onChange={handleAnimChange('color')}
            />
            <PreviewColorPicker
              title="Glow"
              color={props.glow}
              onChange={handleAnimChange('glow')}
            />
            <PreviewColorPicker
              title="Glow Soft"
              color={props.glowSoft}
              onChange={handleAnimChange('glowSoft')}
            />
            <PreviewColorPicker
              title="Dim"
              color={props.dim}
              onChange={handleAnimChange('dim')}
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
const NeonFlickerDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <NeonFlickerInner />
  </ComponentPropsProvider>
);

export default NeonFlickerDemo;
