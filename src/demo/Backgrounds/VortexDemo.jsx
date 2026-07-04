// pages/Backgrounds/VortexDemo.jsx

import CodeBlock              from '../../components/shared/code/CodeBlock';
import { PropsTable }         from '../../components/shared/preview/PropsTable';
import PreviewSlider          from '../../components/shared/preview/PreviewSlider';
import PreviewColorPicker     from '../../components/shared/preview/PreviewColorPicker';
import Dependencies           from '../../components/shared/preview/Dependencies';
import useComponentProps      from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize              from '../../components/shared/preview/Customize';
import CraftedBy              from '../../components/navbers/CraftedBy';
import DemoBuilder            from '../../components/layout/DemoBuilder';


import {
  AUTHOR_NAME,
  CODE_VARIANTS,
  dep,
  getJsrepoCmds,
  getShadcnCmds,

  INITIAL_PROPS,
  PKG_CMDS,
  PROPS_DATA,
  VortexPrompt,
} from '../../config/Backgrounds/Vortex';
import { getUsageCode } from '../../constants/code/Backgrounds/Vortex';
import Vortex from '../../content/Backgrounds/Vortex';


// ─────────────────────────────────────────────────────────────────────────────
const VortexInner = () => {
  const { animKey, props, setProps, langTab, styleTab } = useComponentProps();

  const variant    = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsRepoCmds = getJsrepoCmds(variant);
  const usageCode  = getUsageCode(props, langTab);

  const handlePropChange = key => val => setProps({ [key]: val });

  return (
    <DemoBuilder
      title="Vortex"
      favKey="backgrounds/vortex"
      prompt={VortexPrompt}
      childrenClassname="w-full"
      demoContent={props.demoContent}
      onToggleDemoContent={handlePropChange('demoContent')}
      PreviewComponent={
        <Vortex
          key={animKey}
          {...props}
          className="w-full min-h-120"
        />
      }
      customize={
        <Customize>

          {/* Row 1 – Speed + Scale */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Speed"
              value={props.speed}
              onChange={handlePropChange('speed')}
              min={0.1} max={4} step={0.1}
            />
            <PreviewSlider
              label="Scale"
              value={props.scale}
              onChange={handlePropChange('scale')}
              min={0.5} max={6} step={0.1}
            />
            <PreviewSlider
              label="Noise Intensity"
              value={props.noiseIntensity}
              onChange={handlePropChange('noiseIntensity')}
              min={0} max={5} step={0.1}
            />
          </div>

          {/* Row 2 – Blend + Opacity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Blend"
              value={props.blend}
              onChange={handlePropChange('blend')}
              min={0} max={1} step={0.01}
            />
            <PreviewSlider
              label="Opacity"
              value={props.opacity}
              onChange={handlePropChange('opacity')}
              min={0} max={1} step={0.01}
            />
            <PreviewColorPicker
              title="Color A"
              value={props.colorA}
              onChange={handlePropChange('colorA')}
            />
          </div>

          {/* Row 3 – Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <PreviewColorPicker
              title="Color B"
              value={props.colorB}
              onChange={handlePropChange('colorB')}
            />
            <PreviewColorPicker
              title="Background Color"
              value={props.bgColor}
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
const VortexDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <VortexInner />
  </ComponentPropsProvider>
);

export default VortexDemo;
