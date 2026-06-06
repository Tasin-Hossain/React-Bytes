import { getUsageCode, CODE_VARIANTS, CSS_CODE } from '../../constants/code/Backgrounds/MouseRepelDots';
import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import { dep, PROPS_DATA } from '../../config/Backgrounds/MouseRepelDots';
import { PKG_CMDS, getShadcnCmds } from '../../config/Backgrounds/MouseRepelDots';

import FavoriteButton from '../../components/ui/Button/FavoriteButton';
import CopyPromptButton from '../../components/ui/Button/CopyPromptButton';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import TabsLayout from '../../components/shared/TabsLayout';
import PreviewTab from '../../components/shared/preview/PreviewTab';
import Customize from '../../components/shared/preview/Customize';
import CodeTab from '../../components/shared/code/CodeTab';


import PreviewColorPickerCustom from '../../components/shared/preview/PreviewColorPicker';
import MouseRepelDotsPreview from '../../components/previews/Backgrounds/MouseRepelDotspreview';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';



// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_PROPS = {
  dotCount: 550,
  repelRadius: 80,
  force: 5.5,
  springK: 0.07,
  damping: 0.72,
  dotColor: '#7a5af8',
  dotColorMid: '#d35af8',
  dotColorHot: '#ffffff',
  minDotSize: 1.4,
  maxDotSize: 6
};

// ─────────────────────────────────────────────────────────────────────────────
const MouseRepelDotsInner = () => {
  const { props, setProps, langTab, styleTab } = useComponentProps();

  const variant = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'Tailwind'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const usageCode = getUsageCode(props, langTab);

  const handlePropChange = key => val => {
    setProps({ [key]: val });
  };

  return (
    <div className="max-w-3xl mx-auto text-(--text-primary) relative">
      {/* Title row */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <h1 className="title mb-0">Mouse Repel Dots</h1>
        <div className="flex items-center gap-2">
          <FavoriteButton />
          <CopyPromptButton text={usageCode} />
        </div>
      </div>

      {/* Tabs */}
      <TabsLayout
        preview={
          <>
            <PreviewTab>
              <MouseRepelDotsPreview />
            </PreviewTab>

            <Customize>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                <PreviewSlider
                  label="Dot Count"
                  value={props.dotCount}
                  onChange={handlePropChange('dotCount')}
                  min={50}
                  max={1000}
                  step={50}
                />
                <PreviewSlider
                  label="Repel Radius"
                  value={props.repelRadius}
                  onChange={handlePropChange('repelRadius')}
                  min={20}
                  max={200}
                  step={5}
                />
                <PreviewSlider
                  label="Force"
                  value={props.force}
                  onChange={handlePropChange('force')}
                  min={1}
                  max={15}
                  step={0.5}
                  display={props.force.toFixed(1)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                <PreviewSlider
                  label="Spring K"
                  value={props.springK}
                  onChange={handlePropChange('springK')}
                  min={0.01}
                  max={0.3}
                  step={0.01}
                  display={props.springK.toFixed(2)}
                />
                <PreviewSlider
                  label="Damping"
                  value={props.damping}
                  onChange={handlePropChange('damping')}
                  min={0.1}
                  max={0.99}
                  step={0.01}
                  display={props.damping.toFixed(2)}
                />
                <PreviewSlider
                  label="Min Dot Size"
                  value={props.minDotSize}
                  onChange={handlePropChange('minDotSize')}
                  min={0.5}
                  max={5}
                  step={0.1}
                  display={props.minDotSize.toFixed(1)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <PreviewSlider
                  label="Max Dot Size"
                  value={props.maxDotSize}
                  onChange={handlePropChange('maxDotSize')}
                  min={2}
                  max={20}
                  step={0.5}
                  display={props.maxDotSize.toFixed(1)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                <PreviewColorPickerCustom title="Dot Color" value={props.dotColor} onChange={handlePropChange('dotColor')} />
                <PreviewColorPickerCustom title="Mid Color" value={props.dotColorMid} onChange={handlePropChange('dotColorMid')} />
                <PreviewColorPickerCustom title="Hot Color" value={props.dotColorHot} onChange={handlePropChange('dotColorHot')} />
              </div>
            </Customize>

            <PropsTable PROPS_DATA={PROPS_DATA} />

            <Dependencies dependencies={dep} />
          </>
        }
        code={
          <CodeTab
            pkgCmds={PKG_CMDS}
            shadcnCmds={shadcnCmds}
            usageCode={usageCode}
            codeVariants={CODE_VARIANTS}
            cssCode={CSS_CODE}
            CodeBlock={CodeBlock}
          />
        }
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const MouseRepelDotsDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <MouseRepelDotsInner />
  </ComponentPropsProvider>
);

export default MouseRepelDotsDemo;
