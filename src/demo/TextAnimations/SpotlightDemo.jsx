// pages/TextAnimations/SpotlightTextDemo.jsx

import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  EASE_OPTIONS,
  INITIAL_PROPS,
  SpotlightTextPrompt,
  CODE_VARIANTS,
  AUTHOR_NAME,
  getJsrepoCmds,
} from '../../config/TextAnimations/SpotlightText';

import PreviewSelect from '../../components/shared/preview/PreviewSelect';
import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewInput from '../../components/shared/preview/PreviewInput';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewColorPicker from '../../components/shared/preview/PreviewColorPicker';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import { getUsageCode } from '../../constants/code/TextAnimations/SpotlightText';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';

import SpotlightText from '../../content/TextAnimations/SpotlightText';



// ─────────────────────────────────────────────────────────────────────────────
const SpotlightTextInner = () => {
  const { props, setProps, replay, animKey, langTab, styleTab } = useComponentProps();

  const variant = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsRepoCmds = getJsrepoCmds(variant);
  const usageCode = getUsageCode(props, langTab);

  const handlePropChange = key => val => {
    setProps({ [key]: val });
    replay();
  };

  return (
    <DemoBuilder
      title="Spotlight Text"
      favKey="text-animations/spotlight-text"
      prompt={SpotlightTextPrompt}
      PreviewComponent={<SpotlightText key={animKey} {...props} />}
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
              label="Ease"
              value={props.ease}
              onChange={handlePropChange('ease')}
              options={EASE_OPTIONS}
            />
            <PreviewSwitch
              label="Repeat"
              value={props.repeat}
              onChange={handlePropChange('repeat')}
            />
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Char Delay (s)"
              value={props.charDelay}
              onChange={handlePropChange('charDelay')}
              min={0.02}
              max={0.3}
              step={0.01}
              display={props.charDelay.toFixed(2)}
            />
            <PreviewSlider
              label="Duration (s)"
              value={props.duration}
              onChange={handlePropChange('duration')}
              min={0.05}
              max={0.6}
              step={0.01}
              display={props.duration.toFixed(2)}
            />
            <PreviewSlider
              label="Dim Opacity"
              value={props.dimOpacity}
              onChange={handlePropChange('dimOpacity')}
              min={0}
              max={0.5}
              step={0.01}
              display={props.dimOpacity.toFixed(2)}
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewColorPicker
              label="Base Color"
              value={props.baseColor}
              onChange={handlePropChange('baseColor')}
            />
            <PreviewColorPicker
              label="Spot Color"
              value={props.spotColor}
              onChange={handlePropChange('spotColor')}
            />
            <PreviewSlider
              label="Min Font Size (px)"
              value={props.minFontSize}
              onChange={handlePropChange('minFontSize')}
              min={8}
              max={64}
              step={1}
            />
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Max Font Size (px)"
              value={props.maxFontSize}
              onChange={handlePropChange('maxFontSize')}
              min={32}
              max={160}
              step={1}
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
const SpotlightTextDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <SpotlightTextInner />
  </ComponentPropsProvider>
);

export default SpotlightTextDemo;
