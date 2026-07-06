// pages/TextAnimations/StaticNoiseTextDemo.jsx

import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  FONT_WEIGHT_OPTIONS,
  INITIAL_PROPS,
  StaticNoiseTextPrompt,
  CODE_VARIANTS,
  AUTHOR_NAME,
  getJsrepoCmds,
} from '../../config/TextAnimations/StaticNoiseText';

import PreviewSelect from '../../components/shared/preview/PreviewSelect';
import PreviewInput from '../../components/shared/preview/PreviewInput';
import PreviewColorPicker from '../../components/shared/preview/PreviewColorPicker';
import PreviewSlider from '../../components/shared/preview/PreviewSlider';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import StaticNoiseText from '../../content/TextAnimations/StaticNoiseText';
import { getUsageCode } from '../../constants/code/TextAnimations/StaticNoiseText';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';



// ─────────────────────────────────────────────────────────────────────────────
const StaticNoiseTextInner = () => {
  const { props, setProps, replay, animKey, langTab, styleTab } = useComponentProps();

  const variant = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsRepoCmds = getJsrepoCmds(variant);
  const usageCode = getUsageCode(props, langTab);

  const handlePropChange = key => val => {
    setProps({ [key]: val });
    replay();
  };

  const handleNoiseChange = key => val => {
    setProps({ [key]: val });
  };

  return (
    <DemoBuilder
      title="Static Noise Text"
      favKey="text-animations/static-noise-text"
      prompt={StaticNoiseTextPrompt}
      PreviewComponent={<StaticNoiseText key={animKey} {...props} />}
      customize={
        <Customize>
          {/* Row 0 – Text input */}
          <div className="grid grid-cols-1 gap-2 mb-2">
            <PreviewInput title="Text" value={props.text} onChange={handlePropChange('text')} />
          </div>

          {/* Row 1 – Typography */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <PreviewSelect
              label="Font Weight"
              value={props.fontWeight}
              onChange={handleNoiseChange('fontWeight')}
              options={FONT_WEIGHT_OPTIONS}
            />
            <PreviewColorPicker
              title="Text Color"
              value={props.color}
              onChange={handleNoiseChange('color')}
            />
          </div>

          {/* Row 2 – Noise controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Intensity"
              min={0}
              max={1}
              step={0.01}
              value={props.intensity}
              onChange={handleNoiseChange('intensity')}
            />
            <PreviewSlider
              label="Density"
              min={0}
              max={1}
              step={0.01}
              value={props.density}
              onChange={handleNoiseChange('density')}
            />
            <PreviewSlider
              label="Max Shift (px)"
              min={5}
              max={100}
              step={1}
              value={props.maxShift}
              onChange={handleNoiseChange('maxShift')}
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
const StaticNoiseTextDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <StaticNoiseTextInner />
  </ComponentPropsProvider>
);

export default StaticNoiseTextDemo;