// pages/TextAnimations/RainDropTextDemo.jsx

import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  INITIAL_PROPS,
  RainDropTextPrompt,
  CODE_VARIANTS,
  AUTHOR_NAME,
  getJsrepoCmds,
  EASE_OPTIONS,
} from '../../config/TextAnimations/RainDropText';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewInput from '../../components/shared/preview/PreviewInput';
import PreviewSelect from '../../components/shared/preview/PreviewSelect';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import { getUsageCode } from '../../constants/code/TextAnimations/RainDropText';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';
import PreviewColorPicker from '../../components/shared/preview/PreviewColorPicker';

import RainDropText from '../../content/TextAnimations/RainDropText';



// ─────────────────────────────────────────────────────────────────────────────
const RainDropTextInner = () => {
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
      title="Rain Drop Text"
      favKey="text-animations/rain-drop-text"
      prompt={RainDropTextPrompt}
      PreviewComponent={<RainDropText key={animKey} {...props} />}
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
              label="Stagger Delay (s)"
              value={props.delay}
              onChange={handlePropChange('delay')}
              min={0.01}
              max={0.2}
              step={0.01}
              display={props.delay.toFixed(2)}
            />
            <PreviewSwitch
              label="Repeat"
              value={props.repeat}
              onChange={handleAnimChange('repeat')}
            />
          </div>

          {/* Row 1 – Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Duration (s)"
              value={props.duration}
              onChange={handlePropChange('duration')}
              min={0.3}
              max={2}
              step={0.1}
              display={props.duration.toFixed(1)}
            />
            <PreviewSlider
              label="Drop Height (px)"
              value={props.dropHeight}
              onChange={handlePropChange('dropHeight')}
              min={20}
              max={200}
              step={10}
              display={props.dropHeight}
            />
            <PreviewSlider
              label="Repeat Delay (s)"
              value={props.repeatDelay}
              onChange={handleAnimChange('repeatDelay')}
              min={0}
              max={3}
              step={0.1}
              display={props.repeatDelay.toFixed(1)}
            />
          </div>

          {/* Row 2 – Ease + Font size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSelect
              title="Ease"
              value={props.ease}
              options={EASE_OPTIONS}
              onChange={handleAnimChange('ease')}
            />

            <PreviewColorPicker
              title="Color"
              color={props.color}
              onChange={handleAnimChange('color')}
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
const RainDropTextDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <RainDropTextInner />
  </ComponentPropsProvider>
);

export default RainDropTextDemo;