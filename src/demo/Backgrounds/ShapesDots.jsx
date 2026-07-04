import { getUsageCode } from '../../constants/code/Backgrounds/ShapesDots';
import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  CODE_VARIANTS,
  dep,
  PROPS_DATA,
  INITIAL_PROPS,

  PKG_CMDS,
  getShadcnCmds,
  getJsrepoCmds,
  AUTHOR_NAME,
  ANIMATION_MODES,
} from '../../config/Backgrounds/ShapesDots';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSelect from '../../components/shared/preview/PreviewSelect';

import PreviewColorPickerCustom from '../../components/shared/preview/PreviewColorPicker';
import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import Customize from '../../components/shared/preview/Customize';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import DemoBuilder from '../../components/layout/DemoBuilder';
import CraftedBy from '../../components/navbers/CraftedBy';
import ShapesDots from '../../content/Backgrounds/ShapesDots';

// ─────────────────────────────────────────────────────────────────────────────
const MouseRepelGridInner = () => {
  const { props, setProps, langTab, styleTab, animKey } = useComponentProps();

  const variant    = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsrepoCmds = getJsrepoCmds(variant);
  const usageCode  = getUsageCode(props, langTab);

  const handlePropChange = key => val => setProps({ [key]: val });

  const handleMinPeakScaleChange = val => {
    const clamped = Math.min(val, props.maxPeakScale);
    setProps({ minPeakScale: clamped });
  };
  const handleMaxPeakScaleChange = val => {
    const clamped = Math.max(val, props.minPeakScale);
    setProps({ maxPeakScale: clamped });
  };

  return (
    <DemoBuilder
      title="Shapes Dots"
      favKey="backgrounds/shapes-dots"
      prompt={usageCode}
      showReplay={false}
      demoContent={props.demoContent}
      onToggleDemoContent={handlePropChange('demoContent')}
      PreviewComponent={<ShapesDots key={animKey} {...props}  className="min-h-120"/>}
      childrenClassname="w-full"
      customize={
        <Customize>
          {/* Row 0 – Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Cell Size"
              value={props.cellSize}
              onChange={handlePropChange('cellSize')}
              min={20} max={80} step={1}
            />
            <PreviewSlider
              label="Influence Radius"
              value={props.influenceRadiusVmin}
              onChange={handlePropChange('influenceRadiusVmin')}
              min={5} max={80} step={1}
            />
            <PreviewSlider
              label="Opacity"
              value={props.opacity}
              onChange={handlePropChange('opacity')}
              min={0} max={1} step={0.01}
              display={(props.opacity ?? 1).toFixed(2)}
            />
          </div>

          {/* Row 1 – Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Attack Time"
              value={props.attackTime}
              onChange={handlePropChange('attackTime')}
              min={0.05} max={1} step={0.01}
              display={(props.attackTime ?? 0.5).toFixed(2)}
            />
            <PreviewSlider
              label="Release Time"
              value={props.releaseTime}
              onChange={handlePropChange('releaseTime')}
              min={0.05} max={1} step={0.01}
              display={(props.releaseTime ?? 0.6).toFixed(2)}
            />
            <PreviewSlider
              label="Idle Scale"
              value={props.idleScale}
              onChange={handlePropChange('idleScale')}
              min={0} max={1.5} step={0.01}
              display={(props.idleScale ?? 0.09).toFixed(2)}
            />
          </div>

          {/* Row 2 – Peak scale */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Min Peak Scale"
              value={props.minPeakScale}
              onChange={handleMinPeakScaleChange}
              min={0.5} max={6} step={0.1}
              display={(props.minPeakScale ?? 1).toFixed(1)}
            />
            <PreviewSlider
              label="Max Peak Scale"
              value={props.maxPeakScale}
              onChange={handleMaxPeakScaleChange}
              min={0.5} max={6} step={0.1}
              display={(props.maxPeakScale ?? 3).toFixed(1)}
            />
            <PreviewSlider
              label="Overlap Guard"
              value={props.overlapGuard}
              onChange={handlePropChange('overlapGuard')}
              min={0.5} max={1} step={0.01}
              display={(props.overlapGuard ?? 0.86).toFixed(2)}
            />
          </div>

          {/* Row 3 – Burst */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Burst Speed"
              value={props.burstSpeed}
              onChange={handlePropChange('burstSpeed')}
              min={100} max={3000} step={50}
            />
            <PreviewSlider
              label="Burst Thickness"
              value={props.burstThickness}
              onChange={handlePropChange('burstThickness')}
              min={20} max={400} step={10}
            />
            <PreviewSlider
              label="DPR"
              value={props.dpr}
              onChange={handlePropChange('dpr')}
              min={1} max={3} step={0.5}
              display={(props.dpr ?? 2).toFixed(1)}
            />
          </div>

          {/* Row 4 – Colors & background */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewColorPickerCustom
              title="Background"
              value={props.backgroundColor}
              onChange={handlePropChange('backgroundColor')}
            />
            <PreviewSelect
              label="Animation Mode"
              value={props.animationMode}
              onChange={handlePropChange('animationMode')}
              options={ANIMATION_MODES}
            />
            <PreviewSlider
              label="Animation Speed"
              value={props.animationSpeed}
              onChange={handlePropChange('animationSpeed')}
              min={0.1} max={5} step={0.1}
              display={(props.animationSpeed ?? 1).toFixed(1)}
            />
          </div>

        </Customize>
      }
      propsTable={<PropsTable PROPS_DATA={PROPS_DATA} />}
      dependencies={<Dependencies dependencies={dep} />}
      footer={<CraftedBy name={AUTHOR_NAME} />}
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
