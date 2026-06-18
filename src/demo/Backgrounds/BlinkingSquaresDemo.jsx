// pages/Backgrounds/BlinkingSquaresDemo.jsx

import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  getJsrepoCmds,
  DIRECTIONS,
  INITIAL_PROPS,
  BlinkingSquares as BlinkingSquaresPrompt,
  CODE_VARIANTS,
  AUTHOR_NAME,
} from '../../config/Backgrounds/BlinkingSquares';

import { getUsageCode } from '../../constants/code/Backgrounds/BlinkingSquares';

import PreviewSelect  from '../../components/shared/preview/PreviewSelect';
import PreviewSlider  from '../../components/shared/preview/PreviewSlider';


import Dependencies          from '../../components/shared/preview/Dependencies';
import useComponentProps     from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize             from '../../components/shared/preview/Customize';
import BlinkingSquares       from '../../content/Backgrounds/BlinkingSquares';
import CraftedBy             from '../../components/navbers/CraftedBy';
import DemoBuilder           from '../../components/layout/DemoBuilder';
import PreviewColorPicker from '../../components/shared/preview/PreviewColorPicker';

// ─────────────────────────────────────────────────────────────────────────────
const BlinkingSquaresInner = () => {
  const { props, setProps, langTab, styleTab } = useComponentProps();

  const variant    = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsRepoCmds = getJsrepoCmds(variant);
  const usageCode  = getUsageCode(props, langTab);

  const handlePropChange = key => val => setProps({ [key]: val });

  return (
    <DemoBuilder
      title="Blinking Squares"
      favKey="backgrounds/blinking-squares"
      prompt={BlinkingSquaresPrompt}
      demoContent={props.demoContent}
      onToggleDemoContent={handlePropChange('demoContent')}
      childrenClassname="w-full"
      PreviewComponent={
        <BlinkingSquares
          {...props}
          className="w-full min-h-120"
        />
      }
      customize={
        <Customize>

          {/* Row 1 – Direction + Grid Size + Square Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSelect
              label="Direction"
              value={props.direction}
              onChange={handlePropChange('direction')}
              options={DIRECTIONS}
            />
            <PreviewSlider
              label="Grid Size"
              value={props.gridSize}
              onChange={handlePropChange('gridSize')}
              min={5} max={50} step={1}
            />
            <PreviewSlider
              label="Square Size"
              value={props.squareSize}
              onChange={handlePropChange('squareSize')}
              min={0.05} max={0.98} step={0.01}
            />
          </div>

          {/* Row 2 – Fade Start + Fade End + Falloff */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Fade Start"
              value={props.fadeStart}
              onChange={handlePropChange('fadeStart')}
              min={0} max={1} step={0.01}
            />
            <PreviewSlider
              label="Fade End"
              value={props.fadeEnd}
              onChange={handlePropChange('fadeEnd')}
              min={0} max={1} step={0.01}
            />
            <PreviewSlider
              label="Falloff"
              value={props.falloff}
              onChange={handlePropChange('falloff')}
              min={0.3} max={6} step={0.05}
            />
          </div>

          {/* Row 3 – Min Brightness + Twinkle Speed + Twinkle Strength */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Min Brightness"
              value={props.minBrightness}
              onChange={handlePropChange('minBrightness')}
              min={0} max={1} step={0.01}
            />
            <PreviewSlider
              label="Twinkle Speed"
              value={props.twinkleSpeed}
              onChange={handlePropChange('twinkleSpeed')}
              min={0} max={4} step={0.05}
            />
            <PreviewSlider
              label="Twinkle Strength"
              value={props.twinkleStrength}
              onChange={handlePropChange('twinkleStrength')}
              min={0} max={1} step={0.01}
            />
          </div>

          {/* Row 4 – Intensity + Opacity + DPR */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Intensity"
              value={props.intensity}
              onChange={handlePropChange('intensity')}
              min={0} max={2} step={0.05}
            />
            <PreviewSlider
              label="Opacity"
              value={props.opacity}
              onChange={handlePropChange('opacity')}
              min={0} max={1} step={0.01}
            />
            <PreviewSlider
              label="DPR Cap"
              value={props.dpr}
              onChange={handlePropChange('dpr')}
              min={1} max={3} step={0.1}
            />
          </div>

          {/* Row 5 – Square Color + Background Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <PreviewColorPicker
              title="Square Color"
              value={props.squareColor}
              onChange={handlePropChange('squareColor')}
            />
            <PreviewColorPicker
              title="Background Color"
              value={props.backgroundColor === 'transparent' ? '#000000' : props.backgroundColor}
              onChange={handlePropChange('backgroundColor')}
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
const BlinkingSquaresDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <BlinkingSquaresInner />
  </ComponentPropsProvider>
);

export default BlinkingSquaresDemo;