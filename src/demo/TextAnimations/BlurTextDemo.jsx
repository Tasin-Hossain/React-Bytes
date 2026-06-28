// pages/TextAnimations/ExplodeTextDemo.jsx

import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  FROM_OPTIONS,
  ANIMATE_BY_OPTIONS,
  INITIAL_PROPS,
  BlurTextPrompt,
  CODE_VARIANTS,
  AUTHOR_NAME,
  getJsrepoCmds,
} from '../../config/TextAnimations/BlurText';

import PreviewSelect from '../../components/shared/preview/PreviewSelect';
import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewInput from '../../components/shared/preview/PreviewInput';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import { getUsageCode } from '../../constants/code/TextAnimations/BlurText';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';
import PreviewColorPicker from '../../components/shared/preview/PreviewColorPicker';

import BlurText from '../../content/TextAnimations/BlurText';



// ─────────────────────────────────────────────────────────────────────────────
const ExplodeTextInner = () => {
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
      title="Blur Text"
      favKey="text-animations/blur-text"
      prompt={BlurTextPrompt}
      PreviewComponent={<BlurText key={animKey} {...props} />}
      customize={
        <Customize>
          {/* Row 0 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewInput
              title="Text"
              value={props.text}
              onChange={handlePropChange('text')}
            />
            <PreviewSelect
              label="Animate By"
              value={props.animateBy}
              onChange={handlePropChange('animateBy')}
              options={ANIMATE_BY_OPTIONS}
            />
            <PreviewSelect
              label="From"
              value={props.from}
              onChange={handlePropChange('from')}
              options={FROM_OPTIONS}
            />
          </div>

          {/* Row 1  */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Duration (s)"
              value={props.duration}
              onChange={handlePropChange('duration')}
              min={0.1}
              max={2}
              step={0.1}
              display={props.duration.toFixed(1)}
            />
            <PreviewSlider
              label="Char Delay (s)"
              value={props.charDelay}
              onChange={handlePropChange('charDelay')}
              min={0}
              max={0.2}
              step={0.01}
              display={props.charDelay.toFixed(2)}
            />
            <PreviewSlider
              label="Word Delay (s)"
              value={props.wordDelay}
              onChange={handlePropChange('wordDelay')}
              min={0}
              max={0.5}
              step={0.01}
              display={props.wordDelay.toFixed(2)}
            />
          </div>

          {/* Row 2*/}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Scale"
              value={props.scale}
              onChange={handleAnimChange('scale')}
              min={1}
              max={10}
              step={0.5}
              display={props.scale.toFixed(1)}
            />
            <PreviewSlider
              label="Blur (px)"
              value={props.blur}
              onChange={handleAnimChange('blur')}
              min={0}
              max={30}
              step={1}
            />
            <PreviewSlider
              label="Y Offset (px)"
              value={props.yOffset}
              onChange={handleAnimChange('yOffset')}
              min={0}
              max={100}
              step={5}
            />
          </div>

          {/* Row 4 – Color + Gradient + Font Size + Repeat */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewColorPicker
              title="Color"
              color={props.color}
              onChange={handleAnimChange('color')}
            />

            <PreviewSwitch
              label="Repeat"
              value={props.repeat}
              onChange={handleAnimChange('repeat')}
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
const ExplodeTextDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <ExplodeTextInner />
  </ComponentPropsProvider>
);

export default ExplodeTextDemo;
