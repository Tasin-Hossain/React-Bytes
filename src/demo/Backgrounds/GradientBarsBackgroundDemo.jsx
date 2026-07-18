import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  getJsrepoCmds,
  INITIAL_PROPS,
  GradientBarsBackgroundPrompt,
  CODE_VARIANTS,
  AUTHOR_NAME,
} from '../../config/Backgrounds/GradientBarsBackground';

import { getUsageCode } from '../../constants/code/Backgrounds/GradientBarsBackground';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewColorPicker from '../../components/shared/preview/PreviewColorPicker';
import PreviewSelect from '../../components/shared/preview/PreviewSelect';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import { Component as GradientBarsBackground } from '../../content/Backgrounds/GradientBarsBackground';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';

// ─────────────────────────────────────────────────────────────────────────────
const GradientBarsBackgroundInner = () => {
  const { props, setProps, langTab, styleTab } = useComponentProps();

  const variant    = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsRepoCmds = getJsrepoCmds(variant);
  const usageCode  = getUsageCode(props, langTab);

  const handlePropChange = key => val => setProps({ [key]: val });

  return (
    <DemoBuilder
      title="Gradient Bars Background"
      favKey="backgrounds/gradient-bars"
      prompt={GradientBarsBackgroundPrompt}
      demoContent={props.demoContent}
      onToggleDemoContent={handlePropChange('demoContent')}
      childrenClassname="absolute inset-0"
      PreviewComponent={
        <GradientBarsBackground
          {...props}
          className="w-full h-120!"
        >
          <div className="text-center">
            <h1 className="text-white text-5xl font-bold mb-2 tracking-tight">
              Gradient Bars
            </h1>
            <p className="text-gray-400 text-lg">Customize using the panel</p>
          </div>
        </GradientBarsBackground>
      }
      customize={
        <Customize>

          {/* Row 1 – Bars + Direction + Animation Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Bars"
              value={props.numBars}
              onChange={handlePropChange('numBars')}
              min={3} max={20} step={1}
            />
            <PreviewSelect
              label="Direction"
              value={props.direction}
              onChange={handlePropChange('direction')}
              options={[
                { label: 'Bottom', value: 'bottom' },
                { label: 'Top', value: 'top' },
              ]}
            />
            <PreviewSlider
              label="Animation Duration"
              value={props.animationDuration}
              onChange={handlePropChange('animationDuration')}
              min={0.5} max={5} step={0.1}
            />
          </div>

          {/* Row 2 – Gradient From/To + Noise */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewColorPicker
              title="Gradient From"
              value={props.gradientFrom}
              onChange={handlePropChange('gradientFrom')}
            />
            <PreviewColorPicker
              title="Gradient To"
              value={props.gradientTo === 'transparent' ? '#000000' : props.gradientTo}
              onChange={handlePropChange('gradientTo')}
            />
            <PreviewSlider
              label="Noise"
              value={props.noise}
              onChange={handlePropChange('noise')}
              min={0.1} max={1} step={0.1}
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
const GradientBarsBackgroundDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <GradientBarsBackgroundInner />
  </ComponentPropsProvider>
);

export default GradientBarsBackgroundDemo;