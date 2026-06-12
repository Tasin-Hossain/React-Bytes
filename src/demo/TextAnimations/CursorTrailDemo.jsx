// pages/TextAnimations/CursorTrailDemo.jsx

import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  getJsrepoCmds,
  STYLE_OPTIONS,
  SPACING_OPTIONS,
  EXIT_DURATION_OPTIONS,
  REMOVAL_INTERVAL_OPTIONS,
  MAX_POINTS_OPTIONS,
  MIN_SIZE_OPTIONS,
  MAX_SIZE_OPTIONS,
  INITIAL_PROPS,
  CursorTrailPrompt,
  CODE_VARIANTS,
  AUTHOR_NAME
} from '../../config/TextAnimations/CursorTrail';

import { getUsageCode } from '../../constants/code/TextAnimations/CursorTrail';

import PreviewSelect from '../../components/shared/preview/PreviewSelect';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewInput from '../../components/shared/preview/PreviewInput';
import PreviewColorArray from '../../components/shared/preview/PreviewColorArray';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import CursorTrail from '../../content/TextAnimations/CursorTrail';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';

// ─────────────────────────────────────────────────────────────────────────────
const CursorTrailInner = () => {
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
      title="Cursor Trail"
      favKey="text-animations/cursor-trail"
      prompt={CursorTrailPrompt}
      PreviewComponent={
        <CursorTrail key={animKey} {...props} className="w-full h-full min-h-100">
          <div className="w-full h-full min-h-100 flex items-center justify-center">
            <p className="text-(--text-muted) text-7xl select-none">Hover here</p>
          </div>
        </CursorTrail>
      }
      customize={
        <Customize>

  {/* Row 1 – Trail Text + Style + Random Float */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
    <PreviewInput
      title="Trail Text"
      value={props.trailText}
      onChange={handlePropChange('trailText')}
    />
    <PreviewSelect
      label="Trail Style"
      value={props.style}
      onChange={handlePropChange('style')}
      options={STYLE_OPTIONS}
    />
    <PreviewSwitch
      label="Random Float"
      value={props.randomFloat}
      onChange={handlePropChange('randomFloat')}
    />
  </div>

  {/* Row 2 – Spacing + Min Size + Max Size */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
    <PreviewSelect
      label="Spacing"
      value={props.spacing}
      onChange={handlePropChange('spacing')}
      options={SPACING_OPTIONS}
    />
    <PreviewSelect
      label="Min Size"
      value={props.minSize}
      onChange={handlePropChange('minSize')}
      options={MIN_SIZE_OPTIONS}
    />
    <PreviewSelect
      label="Max Size"
      value={props.maxSize}
      onChange={handlePropChange('maxSize')}
      options={MAX_SIZE_OPTIONS}
    />
  </div>

  {/* Row 3 – Exit Duration + Removal Interval + Max Points */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
    <PreviewSelect
      label="Exit Duration"
      value={props.exitDuration}
      onChange={handlePropChange('exitDuration')}
      options={EXIT_DURATION_OPTIONS}
    />
    <PreviewSelect
      label="Removal Interval"
      value={props.removalInterval}
      onChange={handlePropChange('removalInterval')}
      options={REMOVAL_INTERVAL_OPTIONS}
    />
    <PreviewSelect
      label="Max Points"
      value={props.maxPoints}
      onChange={handlePropChange('maxPoints')}
      options={MAX_POINTS_OPTIONS}
    />
  </div>

  {/* Row 4 – Colors + Follow Direction */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
    <div className="sm:col-span-2">
      <PreviewColorArray
        title="Color Palette"
        colors={props.colors ?? [props.color]}
        onChange={handlePropChange('colors')}
      />
    </div>
    <PreviewSwitch
      label="Follow Direction"
      value={props.followMouseDirection}
      onChange={handlePropChange('followMouseDirection')}
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
const CursorTrailDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <CursorTrailInner />
  </ComponentPropsProvider>
);

export default CursorTrailDemo;
