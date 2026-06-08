// pages/TextAnimations/MagneticTextDemo.jsx


import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import { dep, PROPS_DATA, PKG_CMDS, getShadcnCmds, ENTRANCE_OPTIONS, FONT_SIZE_OPTIONS, SUBTITLE_SIZE_OPTIONS, LETTER_SPACING_OPTIONS, ALIGN_OPTIONS, GAP_OPTIONS, INITIAL_PROPS, MagneticTextPrompt, CODE_VARIANTS, CSS_CODE } from '../../config/TextAnimations/MagneticText';

import FavoriteButton from '../../components/ui/Button/FavoriteButton';
import CopyPromptButton from '../../components/ui/Button/CopyPromptButton';

import PreviewSelect from '../../components/shared/preview/PreviewSelect';
import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewInput from '../../components/shared/preview/PreviewInput';
import PreviewColorPicker from '../../components/shared/preview/PreviewColorPicker';
import PreviewColorArray from '../../components/shared/preview/PreviewColorArray';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import TabsLayout from '../../components/shared/TabsLayout';
import PreviewTab from '../../components/shared/preview/PreviewTab';
import Customize from '../../components/shared/preview/Customize';
import CodeTab from '../../components/shared/code/CodeTab';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import MagneticText from '../../content/TextAnimations/MagneticText';
import { getUsageCode } from '../../constants/code/TextAnimations/MagneticText';




// ─────────────────────────────────────────────────────────────────────────────
const MagneticTextInner = () => {
  const { props, setProps, replay, animKey, langTab, styleTab } = useComponentProps();

  const variant = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'Tailwind'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const usageCode = getUsageCode(props, langTab);


  const handlePropChange = key => val => {
    setProps({ [key]: val });
    replay();
  };

  const handleMagneticChange = key => val => {
    setProps({ [key]: val });
  };

  return (
    <div className="max-w-3xl mx-auto text-(--text-primary) relative">
      {/* Title row */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <h1 className="title mb-0">Magnetic Text</h1>
        <div className="flex items-center gap-2">
          <FavoriteButton favKey="text-animations/magnetic-text" />
          <CopyPromptButton text={MagneticTextPrompt}/>
        </div>
      </div>

      {/* Tabs */}
      <TabsLayout
        preview={
          <>
            <PreviewTab>
              <MagneticText key={animKey} {...props} />
            </PreviewTab>

            <Customize>
              {/* Row 0 – Text inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <PreviewInput title="Main Text" value={props.text} onChange={handlePropChange('text')} />
                <PreviewInput title="Subtitle Text" value={props.subtitle} onChange={handlePropChange('subtitle')} />
              </div>

              {/* Row 1 – Entrance */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                <PreviewSelect
                  label="Entrance Anim"
                  value={props.entranceAnim}
                  onChange={handlePropChange('entranceAnim')}
                  options={ENTRANCE_OPTIONS}
                />
                <PreviewSlider
                  label="Stagger (s)"
                  value={props.entranceStagger}
                  onChange={handlePropChange('entranceStagger')}
                  min={0}
                  max={0.15}
                  step={0.01}
                  display={props.entranceStagger.toFixed(2)}
                />
                <PreviewSlider
                  label="Duration (s)"
                  value={props.entranceDuration}
                  onChange={handlePropChange('entranceDuration')}
                  min={0.1}
                  max={2}
                  step={0.1}
                  display={props.entranceDuration.toFixed(1)}
                />
              </div>

              {/* Row 2 – Magnetic */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                <PreviewSlider
                  label="Magnet Radius (px)"
                  value={props.magnetRadius}
                  onChange={handleMagneticChange('magnetRadius')}
                  min={40}
                  max={300}
                  step={10}
                />
                <PreviewSlider
                  label="Magnet Strength"
                  value={props.magnetStrength}
                  onChange={handleMagneticChange('magnetStrength')}
                  min={0}
                  max={1}
                  step={0.05}
                  display={props.magnetStrength.toFixed(2)}
                />
                <PreviewSlider
                  label="Attract Duration (s)"
                  value={props.attractDuration}
                  onChange={handleMagneticChange('attractDuration')}
                  min={0.05}
                  max={1}
                  step={0.05}
                  display={props.attractDuration.toFixed(2)}
                />
              </div>

              {/* Row 3 – Return & hover colors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                <PreviewSlider
                  label="Return Duration (s)"
                  value={props.returnDuration}
                  onChange={handleMagneticChange('returnDuration')}
                  min={0.1}
                  max={2}
                  step={0.1}
                  display={props.returnDuration.toFixed(1)}
                />
                <div className="sm:col-span-2">
                  <PreviewColorArray
                    title="Hover Colors"
                    colors={props.hoverColors}
                    onChange={handleMagneticChange('hoverColors')}
                  />
                </div>
              </div>

              {/* Row 4 – Typography */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                <PreviewSelect
                  label="Font Size"
                  value={props.fontSize}
                  onChange={handlePropChange('fontSize')}
                  options={FONT_SIZE_OPTIONS}
                />
                <PreviewSelect
                  label="Subtitle Size"
                  value={props.subtitleSize}
                  onChange={handleMagneticChange('subtitleSize')}
                  options={SUBTITLE_SIZE_OPTIONS}
                />
                <PreviewSelect
                  label="Letter Spacing"
                  value={props.letterSpacing}
                  onChange={handlePropChange('letterSpacing')}
                  options={LETTER_SPACING_OPTIONS}
                />
              </div>

              {/* Row 5 – Layout & colors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                <PreviewSelect
                  label="Align"
                  value={props.align}
                  onChange={handlePropChange('align')}
                  options={ALIGN_OPTIONS}
                />
                <PreviewSelect label="Gap" value={props.gap} onChange={handlePropChange('gap')} options={GAP_OPTIONS} />
                <PreviewColorPicker
                  title="Text Color"
                  value={props.textColor}
                  onChange={handleMagneticChange('textColor')}
                />
              </div>

              {/* Row 6 – Subtitle color + entrance delay + visibility */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <PreviewColorPicker
                  title="Subtitle Color"
                  value={props.subtitleColor}
                  onChange={handleMagneticChange('subtitleColor')}
                />
                <PreviewSlider
                  label="Entrance Delay (s)"
                  value={props.entranceDelay}
                  onChange={handlePropChange('entranceDelay')}
                  min={0}
                  max={1}
                  step={0.05}
                  display={props.entranceDelay.toFixed(2)}
                />
                <PreviewSwitch
                  label="Show Cursor"
                  value={props.showCursor}
                  onChange={handleMagneticChange('showCursor')}
                />
              </div>

              {/* Row 7 – Show subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                <PreviewSwitch
                  label="Show Subtitle"
                  value={props.showSubtitle}
                  onChange={handleMagneticChange('showSubtitle')}
                />
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
const MagneticTextDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <MagneticTextInner />
  </ComponentPropsProvider>
);

export default MagneticTextDemo;
