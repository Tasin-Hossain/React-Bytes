// pages/TextAnimations/ShatterTextDemo.jsx

import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  INITIAL_PROPS,
  ShatterTextPrompt,
  CODE_VARIANTS,
  AUTHOR_NAME,
  getJsrepoCmds,
  TRIGGER_OPTIONS,
  FALL_EASE_OPTIONS,
  REASSEMBLE_EASE_OPTIONS,
} from '../../config/TextAnimations/ShatterText';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewInput from '../../components/shared/preview/PreviewInput';
import PreviewSelect from '../../components/shared/preview/PreviewSelect';
import PreviewColorPicker from '../../components/shared/preview/PreviewColorPicker';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import { getUsageCode } from '../../constants/code/TextAnimations/ShatterText';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';

import ShatterText from '../../content/TextAnimations/ShatterText';



// ─────────────────────────────────────────────────────────────────────────────
const ShatterTextInner = () => {
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
      title="Shatter Text"
      favKey="text-animations/shatter-text"
      prompt={ShatterTextPrompt}
      PreviewComponent={<ShatterText key={animKey} {...props} />}
      customize={
        <Customize>
          {/* Row 0 – Text, trigger, disabled */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewInput
              title="Text"
              value={props.text}
              onChange={handlePropChange('text')}
            />
            <PreviewSelect
              title="Trigger"
              value={props.trigger}
              options={TRIGGER_OPTIONS}
              onChange={handleAnimChange('trigger')}
            />
            <PreviewSwitch
              label="Disabled"
              value={props.disabled}
              onChange={handleAnimChange('disabled')}
            />
          </div>

          {/* Row 1 – Fall physics: drop range */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Min Drop Y (px)"
              value={props.minY}
              onChange={handleAnimChange('minY')}
              min={0}
              max={100}
              step={5}
              display={props.minY}
            />
            <PreviewSlider
              label="Max Drop Y (px)"
              value={props.maxY}
              onChange={handleAnimChange('maxY')}
              min={10}
              max={150}
              step={5}
              display={props.maxY}
            />
            <PreviewSlider
              label="Min Drift X (px)"
              value={props.minX}
              onChange={handleAnimChange('minX')}
              min={-60}
              max={0}
              step={5}
              display={props.minX}
            />
          </div>

          {/* Row 2 – Fall physics: drift + rotation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Max Drift X (px)"
              value={props.maxX}
              onChange={handleAnimChange('maxX')}
              min={0}
              max={60}
              step={5}
              display={props.maxX}
            />
            <PreviewSlider
              label="Max Rotation (deg)"
              value={props.maxRotation}
              onChange={handleAnimChange('maxRotation')}
              min={0}
              max={180}
              step={10}
              display={props.maxRotation}
            />
            <PreviewSlider
              label="Fall Duration (s)"
              value={props.fallDuration}
              onChange={handlePropChange('fallDuration')}
              min={0.1}
              max={1}
              step={0.05}
              display={props.fallDuration.toFixed(2)}
            />
          </div>

          {/* Row 3 – Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Reassemble Duration (s)"
              value={props.reassembleDuration}
              onChange={handlePropChange('reassembleDuration')}
              min={0.1}
              max={1.5}
              step={0.05}
              display={props.reassembleDuration.toFixed(2)}
            />
            <PreviewSlider
              label="Stagger (s)"
              value={props.stagger}
              onChange={handleAnimChange('stagger')}
              min={0}
              max={0.05}
              step={0.002}
              display={props.stagger.toFixed(3)}
            />
            <PreviewSlider
              label="Reassemble Gap (s)"
              value={props.reassembleGap}
              onChange={handleAnimChange('reassembleGap')}
              min={0}
              max={0.3}
              step={0.01}
              display={props.reassembleGap.toFixed(2)}
            />
          </div>

          {/* Row 4 – Ease */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSelect
              title="Fall Ease"
              value={props.fallEase}
              options={FALL_EASE_OPTIONS}
              onChange={handleAnimChange('fallEase')}
            />
            <PreviewSelect
              title="Reassemble Ease"
              value={props.reassembleEase}
              options={REASSEMBLE_EASE_OPTIONS}
              onChange={handleAnimChange('reassembleEase')}
            />
            <PreviewSlider
              label="Shatter Opacity"
              value={props.shatterOpacity}
              onChange={handleAnimChange('shatterOpacity')}
              min={0}
              max={1}
              step={0.05}
              display={props.shatterOpacity.toFixed(2)}
            />
          </div>

          {/* Row 5 – Opacity + colors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewColorPicker
              title="Shatter Color"
              color={props.shatterColor}
              onChange={handleAnimChange('shatterColor')}
            />
            <PreviewColorPicker
              title="Reset Color"
              color={props.resetColor}
              onChange={handleAnimChange('resetColor')}
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
const ShatterTextDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <ShatterTextInner />
  </ComponentPropsProvider>
);

export default ShatterTextDemo;