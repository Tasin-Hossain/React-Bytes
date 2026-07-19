// pages/Backgrounds/SmokeyCursorEffectDemo.jsx

import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  getJsrepoCmds,
  INITIAL_PROPS,
  SmokeyCursorEffectPrompt,
  CODE_VARIANTS,
  AUTHOR_NAME,
} from '../../config/Cursors/SmokeyCursorEffect';

import { getUsageCode } from '../../constants/code/Cursors/SmokeyCursorEffect';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewColorPicker from '../../components/shared/preview/PreviewColorPicker';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import SmokeyCursorEffect from '../../content/Cursors/SmokeyCursorEffect';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';

// ─────────────────────────────────────────────────────────────────────────────
const SmokeyCursorEffectInner = () => {
  const { props, setProps, langTab, styleTab } = useComponentProps();

  const variant    = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsRepoCmds = getJsrepoCmds(variant);
  const usageCode  = getUsageCode(props, langTab);

  const handlePropChange = key => val => setProps({ [key]: val });

  return (
    <DemoBuilder
      title="Smokey Cursor Effect"
      favKey="backgrounds/smokey-cursor-effect"
      prompt={SmokeyCursorEffectPrompt}
      demoContent={props.demoContent}

      childrenClassname="w-full"
      PreviewComponent={
        <SmokeyCursorEffect
          {...props}
          className="w-full min-h-120"
        />
      }
      customize={
        <Customize>

          {/* Row 1 – Resolution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <PreviewSlider
              label="Sim Resolution"
              value={props.simResolution}
              onChange={handlePropChange('simResolution')}
              min={32} max={256} step={8}
            />
            <PreviewSlider
              label="Dye Resolution"
              value={props.dyeResolution}
              onChange={handlePropChange('dyeResolution')}
              min={256} max={2048} step={32}
            />
          </div>

          {/* Row 2 – Dissipation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <PreviewSlider
              label="Density Dissipation"
              value={props.densityDissipation}
              onChange={handlePropChange('densityDissipation')}
              min={0} max={10} step={0.1}
            />
            <PreviewSlider
              label="Velocity Dissipation"
              value={props.velocityDissipation}
              onChange={handlePropChange('velocityDissipation')}
              min={0} max={10} step={0.1}
            />
          </div>

          {/* Row 3 – Pressure + Iterations + Curl */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Pressure"
              value={props.pressure}
              onChange={handlePropChange('pressure')}
              min={0} max={1} step={0.01}
            />
            <PreviewSlider
              label="Pressure Iterations"
              value={props.pressureIterations}
              onChange={handlePropChange('pressureIterations')}
              min={1} max={40} step={1}
            />
            <PreviewSlider
              label="Curl"
              value={props.curl}
              onChange={handlePropChange('curl')}
              min={0} max={50} step={1}
            />
          </div>

          {/* Row 4 – Splat Radius + Splat Force + Color Update Speed */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Splat Radius"
              value={props.splatRadius}
              onChange={handlePropChange('splatRadius')}
              min={0.01} max={1} step={0.01}
            />
            <PreviewSlider
              label="Splat Force"
              value={props.splatForce}
              onChange={handlePropChange('splatForce')}
              min={1000} max={12000} step={100}
            />
            <PreviewSlider
              label="Color Update Speed"
              value={props.colorUpdateSpeed}
              onChange={handlePropChange('colorUpdateSpeed')}
              min={0} max={30} step={1}
            />
          </div>

          {/* Row 5 – Shading + Back Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <PreviewSwitch
              label="Shading"
              value={props.shading}
              onChange={handlePropChange('shading')}
            />
            <PreviewColorPicker
              title="Color"
              value={props.color}
              onChange={handlePropChange('color')}
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
const SmokeyCursorEffectDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <SmokeyCursorEffectInner />
  </ComponentPropsProvider>
);

export default SmokeyCursorEffectDemo;