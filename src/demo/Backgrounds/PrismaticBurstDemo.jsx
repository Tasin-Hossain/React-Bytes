
import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  getJsrepoCmds,
  ANIMATION_TYPES,
  MIX_BLEND_MODES,
  INITIAL_PROPS,
  PrismaticBurstPrompt,
  CODE_VARIANTS,
  AUTHOR_NAME,
} from '../../config/Backgrounds/PrismaticBurst';

import { getUsageCode } from '../../constants/code/Backgrounds/PrismaticBurst';

import PreviewSelect  from '../../components/shared/preview/PreviewSelect';
import PreviewSlider  from '../../components/shared/preview/PreviewSlider';

import Dependencies          from '../../components/shared/preview/Dependencies';
import useComponentProps     from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize             from '../../components/shared/preview/Customize';
import PrismaticBurst        from '../../content/Backgrounds/PrismaticBurst';
import CraftedBy             from '../../components/navbers/CraftedBy';
import DemoBuilder           from '../../components/layout/DemoBuilder';
import PreviewColorPicker from '../../components/shared/preview/PreviewColorPicker';

// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_COLOR_SLOTS = ['#FF9FFC', '#5227FF', '#00FFF0'];

const PrismaticBurstInner = () => {
  const { props, setProps, langTab, styleTab } = useComponentProps();

  const variant    = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsRepoCmds = getJsrepoCmds(variant);
  const usageCode  = getUsageCode(props, langTab);

  const handlePropChange = key => val => setProps({ [key]: val });

  const handleColorChange = index => val => {
    const next = [...(props.colors || [])];
    while (next.length <= index) next.push(DEFAULT_COLOR_SLOTS[next.length] || '#ffffff');
    next[index] = val;
    setProps({ colors: next });
  };


  return (
    <DemoBuilder
      title="Prismatic Burst"
      favKey="backgrounds/prismatic-burst"
      prompt={PrismaticBurstPrompt}
      demoContent={props.demoContent}
      onToggleDemoContent={handlePropChange('demoContent')}
      childrenClassname="absolute inset-0"
      PreviewComponent={
        <PrismaticBurst
          {...props}
          offset={{ x: props.offsetX, y: props.offsetY }}
          className="w-full h-120!"
        />
      }
      customize={
        <Customize>

          {/* Row 1 – Animation Type + Intensity + Speed */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSelect
              label="Animation Type"
              value={props.animationType}
              onChange={handlePropChange('animationType')}
              options={ANIMATION_TYPES}
            />
            <PreviewSlider
              label="Intensity"
              value={props.intensity}
              onChange={handlePropChange('intensity')}
              min={0.5} max={4} step={0.05}
            />
            <PreviewSlider
              label="Speed"
              value={props.speed}
              onChange={handlePropChange('speed')}
              min={0} max={2} step={0.05}
            />
          </div>

          {/* Row 2 – Distort + Ray Count + Hover Dampness */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Distort"
              value={props.distort}
              onChange={handlePropChange('distort')}
              min={0} max={1} step={0.02}
            />
            <PreviewSlider
              label="Ray Count"
              value={props.rayCount}
              onChange={handlePropChange('rayCount')}
              min={0} max={60} step={1}
            />
            <PreviewSlider
              label="Hover Dampness"
              value={props.hoverDampness}
              onChange={handlePropChange('hoverDampness')}
              min={0} max={1} step={0.02}
              disabled={props.animationType !== 'hover'}
            />
          </div>

          {/* Row 3 – Offset X + Offset Y + Mix Blend Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Offset X"
              value={props.offsetX}
              onChange={handlePropChange('offsetX')}
              min={-200} max={200} step={5}
            />
            <PreviewSlider
              label="Offset Y"
              value={props.offsetY}
              onChange={handlePropChange('offsetY')}
              min={-200} max={200} step={5}
            />
            <PreviewSelect
              label="Mix Blend Mode"
              value={props.mixBlendMode}
              onChange={handlePropChange('mixBlendMode')}
              options={MIX_BLEND_MODES}
            />
          </div>

          {/* Row 3 – Paused + Gradient Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSelect
              label="Playback"
              value={props.paused ? 'paused' : 'playing'}
              onChange={val => handlePropChange('paused')(val === 'paused')}
              options={['playing', 'paused']}
            />

              <PreviewColorPicker
                title="Color 1"
                value={props.colors?.[0] || DEFAULT_COLOR_SLOTS[0]}
                onChange={handleColorChange(0)}
              />
              <PreviewColorPicker
                title="Color 2"
                value={props.colors?.[1] || DEFAULT_COLOR_SLOTS[1]}
                onChange={handleColorChange(1)}
              />
              <PreviewColorPicker
                title="Color 3"
                value={props.colors?.[2] || DEFAULT_COLOR_SLOTS[2]}
                onChange={handleColorChange(2)}
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
const PrismaticBurstDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <PrismaticBurstInner />
  </ComponentPropsProvider>
);

export default PrismaticBurstDemo;