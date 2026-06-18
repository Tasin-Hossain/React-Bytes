// pages/Backgrounds/HalfToneDemo.jsx

import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';




import PreviewSelect       from '../../components/shared/preview/PreviewSelect';
import PreviewSlider       from '../../components/shared/preview/PreviewSlider';
import PreviewColorPicker  from '../../components/shared/preview/PreviewColorPicker';
import Dependencies        from '../../components/shared/preview/Dependencies';
import useComponentProps   from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize           from '../../components/shared/preview/Customize';

import CraftedBy           from '../../components/navbers/CraftedBy';
import DemoBuilder         from '../../components/layout/DemoBuilder';
import Halftone from '../../content/Backgrounds/Halftone';
import { AUTHOR_NAME, CODE_VARIANTS, dep, DIRECTIONS, getJsrepoCmds, getShadcnCmds, HalfTonePrompt, INITIAL_PROPS, PKG_CMDS, PROPS_DATA, SHAPES } from '../../config/Backgrounds/HalfTone';
import { getUsageCode } from '../../constants/code/Backgrounds/HalfTone';

// ─────────────────────────────────────────────────────────────────────────────
const HalfToneInner = () => {
  const { animKey, props, setProps, langTab, styleTab } = useComponentProps();

  const variant    = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsRepoCmds = getJsrepoCmds(variant);
  const usageCode  = getUsageCode(props, langTab);

  const handlePropChange = key => val => setProps({ [key]: val });

  return (
    <DemoBuilder
      title="Half Tone"
      favKey="backgrounds/half-tone"
      prompt={HalfTonePrompt}
      childrenClassname="w-full"
      demoContent={props.demoContent}
      onToggleDemoContent={handlePropChange('demoContent')}
      PreviewComponent={
        <Halftone
          key={animKey}
          {...props}
          className="w-full min-h-120"
        />
      }
      customize={
        <Customize>

          {/* Row 1 – Direction + Shape */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSelect
              label="Direction"
              value={props.direction}
              onChange={handlePropChange('direction')}
              options={DIRECTIONS}
            />
            <PreviewSelect
              label="Shape"
              value={props.shape}
              onChange={handlePropChange('shape')}
              options={SHAPES}
            />
            <PreviewSlider
              label="Speed"
              value={props.speed}
              onChange={handlePropChange('speed')}
              min={0} max={3} step={0.1}
            />
          </div>

          {/* Row 2 – Speed + Scale + Wave Freq */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Scale"
              value={props.scale}
              onChange={handlePropChange('scale')}
              min={0.3} max={3} step={0.1}
            />
            <PreviewSlider
              label="Wave Freq"
              value={props.waveFreq}
              onChange={handlePropChange('waveFreq')}
              min={0.1} max={4} step={0.1}
            />
            <PreviewSlider
              label="Dot Size"
              value={props.dotSize}
              onChange={handlePropChange('dotSize')}
              min={0.1} max={1} step={0.05}
            />
          </div>

          {/* Row 3 – Dot Size + Opacity + Angle (angled only) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Opacity"
              value={props.opacity}
              onChange={handlePropChange('opacity')}
              min={0.1} max={1} step={0.05}
            />
            <PreviewSlider
              label="Angle"
              value={props.angle}
              onChange={handlePropChange('angle')}
              min={0} max={360} step={1}
              disabled={props.direction !== 'angled'}
            />
            <PreviewColorPicker
              title="Dot Color"
              value={props.color}
              onChange={handlePropChange('color')}
            />
          </div>

          {/* Row 4 – Color + Bg Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
const HalfToneDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <HalfToneInner />
  </ComponentPropsProvider>
);

export default HalfToneDemo;
