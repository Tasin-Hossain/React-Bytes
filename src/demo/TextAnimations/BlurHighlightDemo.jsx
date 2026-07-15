import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  INITIAL_PROPS,
  BlurHighlightPrompt,
  CODE_VARIANTS,
  AUTHOR_NAME,
  getJsrepoCmds,
  DIRECTION_OPTIONS,
} from '../../config/TextAnimations/BlurHighlight';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewInput from '../../components/shared/preview/PreviewInput';
import PreviewSelect from '../../components/shared/preview/PreviewSelect';
import PreviewColorPicker from '../../components/shared/preview/PreviewColorPicker';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import { getUsageCode } from '../../constants/code/TextAnimations/BlurHighlight';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';

import MaskReveal from '../../content/TextAnimations/BlurHighlight';


const BlurHighlight = () => {
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

  const handleHighlightedBitsChange = val => {
    const bits = val
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    setProps({ highlightedBits: bits });
    replay();
  };

  return (
    <DemoBuilder
      title="Blur Highlight"
      favKey="text-animations/blur-highlight"
      prompt={BlurHighlightPrompt}
      childrenClassname="px-2 sm:px-8 md:px-10 lg:px-10"
      PreviewComponent={<MaskReveal key={animKey} {...props}>{props.text}</MaskReveal>}
      customize={
        <Customize>
          {/* Row 0 – Text, tag */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewInput
              title="Text"
              value={props.text}
              onChange={handlePropChange('text')}
            />
            <PreviewSelect
              title="Direction"
              value={props.direction}
              options={DIRECTION_OPTIONS}
              onChange={handlePropChange('direction')}
            />
              <PreviewInput
                title="Highlighted Phrases (comma separated)"
                value={(props.highlightedBits || []).join(', ')}
                onChange={handleHighlightedBitsChange}
              />
          </div>

          {/* Row 1  */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSwitch
              label="Animate Once"
              value={props.once}
              onChange={handleAnimChange('once')}
            />
            <PreviewSlider
              label="Reveal Duration (s)"
              value={props.revealDuration}
              onChange={handlePropChange('revealDuration')}
              min={0.1}
              max={1.5}
              step={0.05}
              display={props.revealDuration.toFixed(2)}
            />
            <PreviewSlider
              label="Reveal Delay (s)"
              value={props.revealDelay}
              onChange={handlePropChange('revealDelay')}
              min={0}
              max={1}
              step={0.05}
              display={props.revealDelay.toFixed(2)}
            />
          </div>

          {/* Row 2  */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Stagger Amount (s)"
              value={props.staggerAmount}
              onChange={handleAnimChange('staggerAmount')}
              min={0}
              max={1.5}
              step={0.05}
              display={props.staggerAmount.toFixed(2)}
            />
            <PreviewSlider
              label="Viewport Amount"
              value={props.amount}
              onChange={handleAnimChange('amount')}
              min={0}
              max={1}
              step={0.05}
              display={props.amount.toFixed(2)}
            />
            <PreviewInput
              title="Root Margin"
              value={props.rootMargin}
              onChange={handleAnimChange('rootMargin')}
            />
          </div>

          {/* Row 3  */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewColorPicker
              title="Highlight Color"
              color={props.maskColor}
              onChange={handleAnimChange('maskColor')}
            />
            <PreviewColorPicker
              title="Text Color"
              color={props.textColor}
              onChange={handleAnimChange('textColor')}
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
const BlurHighlightDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <BlurHighlight />
  </ComponentPropsProvider>
);

export default BlurHighlightDemo;