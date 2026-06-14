// pages/Backgrounds/MouseRepelGridDemo.jsx

import { getUsageCode } from '../../constants/code/Backgrounds/MouseRepelGrid';
import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  CODE_VARIANTS,
  dep,
  PROPS_DATA,
  INITIAL_PROPS,
  COLOR_MODE_OPTIONS,
  GRADIENT_DIRECTION_OPTIONS,
  ANIMATION_MODE_OPTIONS,
  PKG_CMDS,
  getShadcnCmds,
  getJsrepoCmds,
  AUTHOR_NAME
} from '../../config/Backgrounds/MouseRepelGrid';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSelect from '../../components/shared/preview/PreviewSelect';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import Customize from '../../components/shared/preview/Customize';

import PreviewColorPickerCustom from '../../components/shared/preview/PreviewColorPicker';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import MouseRepelGrid from '../../content/Backgrounds/MouseRepelGrid';
import DemoBuilder from '../../components/layout/DemoBuilder';
import CraftedBy from '../../components/navbers/CraftedBy';

// ─────────────────────────────────────────────────────────────────────────────
const MouseRepelGridInner = () => {
  const { props, setProps, langTab, styleTab, animKey } = useComponentProps();

  const variant = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsrepoCmds = getJsrepoCmds(variant);
  const usageCode = getUsageCode(props, langTab);

  const handlePropChange = key => val => {
    setProps({ [key]: val });
  };

  const handleGradientColorChange = index => val => {
    const updated = [...props.gradientColors];
    updated[index] = val;
    setProps({ gradientColors: updated });
  };

  return (
    <DemoBuilder
      title="Mouse Repel Grid"
      favKey="backgrounds/mouserepel-grid"
      prompt={usageCode}
      showReplay={false}
      demoContent={props.demoContent}
      onToggleDemoContent={handlePropChange('demoContent')}
      PreviewComponent={<MouseRepelGrid key={animKey} {...props} />}
      childrenClassname="absolute inset-0"
      customize={
        <Customize>
          {/* Row 0 – Grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Grid Spacing"
              value={props.gridSpacing}
              onChange={handlePropChange('gridSpacing')}
              min={10}
              max={80}
              step={1}
            />
            <PreviewSlider
              label="Curve Strength"
              value={props.curveStrength}
              onChange={handlePropChange('curveStrength')}
              min={0}
              max={100}
              step={1}
            />
            <PreviewSlider
              label="Line Width"
              value={props.lineWidth}
              onChange={handlePropChange('lineWidth')}
              min={0.5}
              max={5}
              step={0.1}
              display={props.lineWidth.toFixed(1)}
            />
          </div>

          {/* Row 1 – Repel physics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Repel Radius"
              value={props.repelRadius}
              onChange={handlePropChange('repelRadius')}
              min={20}
              max={250}
              step={5}
            />
            <PreviewSlider
              label="Force"
              value={props.force}
              onChange={handlePropChange('force')}
              min={1}
              max={40}
              step={1}
            />
            <PreviewSlider
              label="Ease Speed"
              value={props.easeSpeed}
              onChange={handlePropChange('easeSpeed')}
              min={0.01}
              max={1}
              step={0.01}
              display={props.easeSpeed.toFixed(2)}
            />
          </div>

          {/* Row 2 – Spring & damping */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Spring K"
              value={props.springK}
              onChange={handlePropChange('springK')}
              min={0.01}
              max={0.5}
              step={0.01}
              display={props.springK.toFixed(2)}
            />
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
              max={30}
              step={1}
            />
          </div>

          {/* Row 3 – Ambient noise */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSwitch
              label="Ambient Noise"
              value={props.ambientNoise}
              onChange={handlePropChange('ambientNoise')}
            />
            <PreviewSlider
              label="Ambient Amplitude"
              value={props.ambientNoiseAmplitude}
              onChange={handlePropChange('ambientNoiseAmplitude')}
              min={0}
              max={20}
              step={1}
            />
            <PreviewSlider
              label="Ambient Speed"
              value={props.ambientNoiseSpeed}
              onChange={handlePropChange('ambientNoiseSpeed')}
              min={0.05}
              max={2}
              step={0.05}
              display={props.ambientNoiseSpeed.toFixed(2)}
            />
          </div>

          {/* Row 4 – Diagonals & glow */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSwitch label="Diagonals" value={props.diagonals} onChange={handlePropChange('diagonals')} />
            <PreviewSlider
              label="Glow Intensity"
              value={props.glowIntensity}
              onChange={handlePropChange('glowIntensity')}
              min={0}
              max={2}
              step={0.05}
              display={props.glowIntensity.toFixed(2)}
            />
            <PreviewSwitch
              label="Pulse On Click"
              value={props.pulseOnClick}
              onChange={handlePropChange('pulseOnClick')}
            />
          </div>

          {/* Row 5 – Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewColorPickerCustom
              title="Line Color"
              value={props.lineColor}
              onChange={handlePropChange('lineColor')}
            />
            <PreviewColorPickerCustom
              title="Glow Color"
              value={props.glowColor}
              onChange={handlePropChange('glowColor')}
            />
            <PreviewColorPickerCustom
              title="Background"
              value={props.backgroundColor}
              onChange={handlePropChange('backgroundColor')}
            />
          </div>

          {/* Row 6 – Color mode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSelect
              label="Color Mode"
              value={props.colorMode}
              onChange={handlePropChange('colorMode')}
              options={COLOR_MODE_OPTIONS}
            />
            <PreviewSelect
              label="Gradient Direction"
              value={props.gradientDirection}
              onChange={handlePropChange('gradientDirection')}
              options={GRADIENT_DIRECTION_OPTIONS}
            />
            <PreviewSwitch label="Vignette" value={props.vignette} onChange={handlePropChange('vignette')} />
          </div>

          {/* Row 7 – Gradient colors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewColorPickerCustom
              title="Gradient Start"
              value={props.gradientColors[0]}
              onChange={handleGradientColorChange(0)}
            />
            <PreviewColorPickerCustom
              title="Gradient End"
              value={props.gradientColors[1]}
              onChange={handleGradientColorChange(1)}
            />
            <PreviewSlider
              label="Vignette Strength"
              value={props.vignetteStrength}
              onChange={handlePropChange('vignetteStrength')}
              min={0}
              max={1}
              step={0.05}
              display={props.vignetteStrength.toFixed(2)}
            />
          </div>

          {/* Row 8 – Rainbow */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Rainbow Speed"
              value={props.rainbowSpeed}
              onChange={handlePropChange('rainbowSpeed')}
              min={0}
              max={1}
              step={0.05}
              display={props.rainbowSpeed.toFixed(2)}
            />
            <PreviewSlider
              label="Rainbow Saturation"
              value={props.rainbowSaturation}
              onChange={handlePropChange('rainbowSaturation')}
              min={0}
              max={1}
              step={0.05}
              display={props.rainbowSaturation.toFixed(2)}
            />
            <PreviewSlider
              label="Rainbow Lightness"
              value={props.rainbowLightness}
              onChange={handlePropChange('rainbowLightness')}
              min={0}
              max={1}
              step={0.05}
              display={props.rainbowLightness.toFixed(2)}
            />
          </div>

          {/* Row 9 – Animation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSelect
              label="Animation Mode"
              value={props.animationMode}
              onChange={handlePropChange('animationMode')}
              options={ANIMATION_MODE_OPTIONS}
            />
            <PreviewSlider
              label="Animation Speed"
              value={props.animationSpeed}
              onChange={handlePropChange('animationSpeed')}
              min={0.1}
              max={3}
              step={0.1}
              display={props.animationSpeed.toFixed(1)}
            />
            <PreviewSlider
              label="Animation Intensity"
              value={props.animationIntensity}
              onChange={handlePropChange('animationIntensity')}
              min={0}
              max={3}
              step={0.1}
              display={props.animationIntensity.toFixed(1)}
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
      jsrepoCmds={jsrepoCmds}
      usageCode={usageCode}
      codeVariants={CODE_VARIANTS}
      CodeBlock={CodeBlock}

    />
  );
};

const MouseRepelGridDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <MouseRepelGridInner />
  </ComponentPropsProvider>
);

export default MouseRepelGridDemo;
