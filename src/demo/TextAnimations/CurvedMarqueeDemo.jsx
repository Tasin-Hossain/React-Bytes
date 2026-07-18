// pages/TextAnimations/CurvedMarqueeDemo.jsx

import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  DIRECTION_OPTIONS,
  INITIAL_PROPS,
  CurvedMarqueePrompt,
  CODE_VARIANTS,
  AUTHOR_NAME,
  getJsrepoCmds,
} from '../../config/TextAnimations/CurvedMarquee';

import PreviewSelect from '../../components/shared/preview/PreviewSelect';
import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewInput from '../../components/shared/preview/PreviewInput';
import PreviewColorPicker from '../../components/shared/preview/PreviewColorPicker';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import CurvedMarquee from '../../content/TextAnimations/CurvedMarquee';
import { getUsageCode } from '../../constants/code/TextAnimations/CurvedMarquee';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';

// ─────────────────────────────────────────────────────────────────────────────
const CurvedMarqueeInner = () => {
  const { props, setProps, replay, animKey, langTab, styleTab } = useComponentProps();

  const variant = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsRepoCmds = getJsrepoCmds(variant);
  const usageCode = getUsageCode(props, langTab);

  const handlePropChange = key => val => {
    setProps({ [key]: val });
    replay();
  };

  const handleCurvedMarqueeChange = key => val => {
    setProps({ [key]: val });
  };

  return (
    <DemoBuilder
      title="Curved Marquee"
      favKey="text-animations/curved-marquee"
      prompt={CurvedMarqueePrompt}
      PreviewComponent={<CurvedMarquee key={animKey} {...props} />}
      customize={
        <Customize>
          {/* Row 0 – */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewInput title="Text" value={props.text} onChange={handlePropChange('text')} />
            <PreviewSelect
              label="Direction"
              value={props.direction}
              onChange={handleCurvedMarqueeChange('direction')}
              options={DIRECTION_OPTIONS}
            />
            <PreviewSlider
              label="Speed"
              value={props.baseVelocity}
              onChange={handleCurvedMarqueeChange('baseVelocity')}
              min={0}
              max={100}
              step={1}
            />
          </div>

          {/* Row 1*/}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Curve"
              value={props.curveAmount}
              onChange={handlePropChange('curveAmount')}
              min={-800}
              max={800}
              step={10}
            />
            <PreviewSlider
              label="Gap"
              value={props.gap}
              onChange={handlePropChange('gap')}
              min={0}
              max={20}
              step={1}
            />
            <PreviewSlider
              label="Drag Intensity"
              value={props.dragIntensity}
              onChange={handleCurvedMarqueeChange('dragIntensity')}
              min={0}
              max={20}
              step={1}
            />
          </div>

          {/* Row 2 – */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Fade (%)"
              value={props.fadePercent}
              onChange={handleCurvedMarqueeChange('fadePercent')}
              min={0}
              max={50}
              step={1}
            />
            <PreviewColorPicker
              title="Text Color"
              value={props.color}
              onChange={handleCurvedMarqueeChange('color')}
            />
            <PreviewSwitch
              label="Draggable"
              value={props.draggable}
              onChange={handleCurvedMarqueeChange('draggable')}
            />
          </div>

          {/* Row 3 –  */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
            <PreviewSwitch
              label="Fade Edges"
              value={props.fade}
              onChange={handleCurvedMarqueeChange('fade')}
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
const CurvedMarqueeDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <CurvedMarqueeInner />
  </ComponentPropsProvider>
);

export default CurvedMarqueeDemo;
