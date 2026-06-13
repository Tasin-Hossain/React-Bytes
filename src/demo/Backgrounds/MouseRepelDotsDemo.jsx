// pages/Backgrounds/MouseRepelDotsDemo.jsx

import { getUsageCode } from '../../constants/code/Backgrounds/MouseRepelDots';
import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  CODE_VARIANTS,
  dep,
  PROPS_DATA,
  INITIAL_PROPS,
  SPARKLE_MODE_OPTIONS
} from '../../config/Backgrounds/MouseRepelDots';
import { PKG_CMDS, getShadcnCmds } from '../../config/Backgrounds/MouseRepelDots';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSelect from '../../components/shared/preview/PreviewSelect';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import Customize from '../../components/shared/preview/Customize';

import PreviewColorPickerCustom from '../../components/shared/preview/PreviewColorPicker';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import MouseRepelDots from '../../content/Backgrounds/MouseRepelDots';
import DemoBuilder from '../../components/layout/DemoBuilder';

// ─────────────────────────────────────────────────────────────────────────────
const MouseRepelDotsInner = () => {
  const { props, setProps, langTab, styleTab, animKey } = useComponentProps();

  const variant = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const usageCode = getUsageCode(props, langTab);

  const handlePropChange = key => val => {
    setProps({ [key]: val });
  };

  return (
    <DemoBuilder
      title="Mouse Repel Dots"
      favKey="backgrounds/mouserepel-dots"
      prompt={usageCode}
      showReplay={false}
      demoContent={props.demoContent}
      onToggleDemoContent={handlePropChange('demoContent')}
      PreviewComponent={<MouseRepelDots key={animKey} {...props} />}
      childrenClassname="absolute inset-0"
      customize={
        <Customize>
          {/* Row 0 – Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Dot Radius"
              value={props.dotRadius}
              onChange={handlePropChange('dotRadius')}
              min={0.5}
              max={5}
              step={0.1}
              display={props.dotRadius.toFixed(1)}
            />
            <PreviewSlider
              label="Dot Spacing"
              value={props.dotSpacing}
              onChange={handlePropChange('dotSpacing')}
              min={5}
              max={60}
              step={1}
            />

            <PreviewSlider
              label="Max Dot Size"
              value={props.maxDotSize}
              onChange={handlePropChange('maxDotSize')}
              min={2}
              max={20}
              step={0.5}
              display={props.maxDotSize.toFixed(1)}
            />
          </div>

          {/* Row 1 – Repel physics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Repel Radius"
              value={props.repelRadius}
              onChange={handlePropChange('repelRadius')}
              min={20}
              max={200}
              step={5}
            />
            <PreviewSlider
              label="Force"
              value={props.force}
              onChange={handlePropChange('force')}
              min={1}
              max={15}
              step={0.5}
              display={props.force.toFixed(1)}
            />
            <PreviewSelect
              label="Sparkle Mode"
              value={props.sparkleMode}
              onChange={handlePropChange('sparkleMode')}
              options={SPARKLE_MODE_OPTIONS}
            />
          </div>

          {/* Row 2 – Damping & wave/bulge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Damping"
              value={props.damping}
              onChange={handlePropChange('damping')}
              min={0.1}
              max={0.99}
              step={0.01}
              display={props.damping.toFixed(2)}
            />
            <PreviewSlider
              label="Wave Amplitude"
              value={props.waveAmplitude}
              onChange={handlePropChange('waveAmplitude')}
              min={0}
              max={20}
              step={1}
            />
            <PreviewSlider
              label="Bulge Strength"
              value={props.bulgeStrength}
              onChange={handlePropChange('bulgeStrength')}
              min={0}
              max={100}
              step={1}
            />
          </div>

          {/* Row 3 – Bulge toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSwitch label="Bulge Only" value={props.bulgeOnly} onChange={handlePropChange('bulgeOnly')} />
            <PreviewSlider
              label="Spring K"
              value={props.springK}
              onChange={handlePropChange('springK')}
              min={0.01}
              max={0.3}
              step={0.01}
              display={props.springK.toFixed(2)}
            />
            <PreviewColorPickerCustom
              title="Dot Color"
              value={props.dotColor}
              onChange={handlePropChange('dotColor')}
            />
          </div>

          {/* Row 4 – Dot colors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewColorPickerCustom
              title="Mid Color"
              value={props.dotColorMid}
              onChange={handlePropChange('dotColorMid')}
            />
            <PreviewColorPickerCustom
              title="Hot Color"
              value={props.dotColorHot}
              onChange={handlePropChange('dotColorHot')}
            />
            <PreviewColorPickerCustom
              title="Background"
              value={props.backgroundColor}
              onChange={handlePropChange('backgroundColor')}
            />
          </div>

          {/* Row 5 – Background & gradient */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewColorPickerCustom
              title="Gradient From"
              value={props.gradientFrom}
              onChange={handlePropChange('gradientFrom')}
            />
            <PreviewColorPickerCustom
              title="Gradient To"
              value={props.gradientTo}
              onChange={handlePropChange('gradientTo')}
            />
            <PreviewColorPickerCustom
              title="Sparkle Color"
              value={props.sparkleColor}
              onChange={handlePropChange('sparkleColor')}
            />
          </div>

          {/* Row 6 – Sparkle mode & color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Sparkle Size"
              value={props.sparkleSize}
              onChange={handlePropChange('sparkleSize')}
              min={0.5}
              max={5}
              step={0.1}
              display={props.sparkleSize.toFixed(1)}
            />
            <PreviewSlider
              label="Sparkle Speed"
              value={props.sparkleSpeed}
              onChange={handlePropChange('sparkleSpeed')}
              min={0.1}
              max={2}
              step={0.05}
              display={props.sparkleSpeed.toFixed(2)}
            />
            <PreviewSlider
              label="Sparkle Density"
              value={props.sparkleDensity}
              onChange={handlePropChange('sparkleDensity')}
              min={0.005}
              max={0.1}
              step={0.005}
              display={props.sparkleDensity.toFixed(3)}
            />
          </div>
        </Customize>
      }
      propsTable={<PropsTable PROPS_DATA={PROPS_DATA} />}
      dependencies={<Dependencies dependencies={dep} />}
      // CodeTab props
      pkgCmds={PKG_CMDS}
      shadcnCmds={shadcnCmds}
      usageCode={usageCode}
      codeVariants={CODE_VARIANTS}
      CodeBlock={CodeBlock}
    />
  );
};

const MouseRepelDotsDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <MouseRepelDotsInner />
  </ComponentPropsProvider>
);

export default MouseRepelDotsDemo;
