import { getUsageCode, CODE_VARIANTS, CSS_CODE } from '../../constants/code/TextAnimations/MagneticText';
import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import MagneticTextPreview from '../../components/previews/TextAnimations/MagneticTextPreview';

import { dep, PROPS_DATA, PKG_CMDS, getShadcnCmds } from '../../config/TextAnimations/MagneticText';

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

// ─────────────────────────────────────────────────────────────────────────────
const ENTRANCE_OPTIONS = [
  { value: 'fadeUp',    label: 'Fade Up' },
  { value: 'scaleIn',   label: 'Scale In' },
  { value: 'slideLeft', label: 'Slide Left' },
  { value: 'blur',      label: 'Blur' },
  { value: 'none',      label: 'None' },
];

const ALIGN_OPTIONS = [
  { value: 'center', label: 'Center' },
  { value: 'left',   label: 'Left' },
  { value: 'right',  label: 'Right' },
];

const FONT_SIZE_OPTIONS = [
  { value: 'clamp(40px, 13vw, 85px)', label: 'Default (clamp)' },
  { value: '64px',  label: '64px' },
  { value: '80px',  label: '80px' },
  { value: '96px',  label: '96px' },
  { value: '112px', label: '112px' },
];

const SUBTITLE_SIZE_OPTIONS = [
  { value: '14px', label: '14px' },
  { value: '16px', label: '16px' },
  { value: '18px', label: '18px' },
  { value: '20px', label: '20px' },
  { value: '22px', label: '22px' },
  { value: '26px', label: '26px' },
  { value: '30px', label: '30px' },
];

const LETTER_SPACING_OPTIONS = [
  { value: '0em',     label: '0em' },
  { value: '0.05em',  label: '0.05em' },
  { value: '0.1em',   label: '0.1em' },
  { value: '0.15em',  label: '0.15em' },
  { value: '-0.03em', label: '-0.03em' },
];

const GAP_OPTIONS = [
  { value: '0px', label: '0px' },
  { value: '2px', label: '2px' },
  { value: '4px', label: '4px' },
  { value: '6px', label: '6px' },
  { value: '8px', label: '8px' },
];

// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_PROPS = {
  // text
  text:             'ATTRACT',
  subtitle:         'PULL · PUSH · REPEL',
  // typography
  fontSize:         'clamp(40px, 13vw, 85px)',
  subtitleSize:     '22px',
  letterSpacing:    '0.05em',
  // colors
  textColor:        '#a757f7',
  subtitleColor:    '#a757f7',
  hoverColors:      ['#ff6b6b', '#f7c948', '#4ecdc4', '#a78bfa'],
  // animation
  magnetRadius:     120,
  magnetStrength:   0.55,
  attractDuration:  0.25,
  returnDuration:   0.6,
  entranceAnim:     'fadeUp',
  entranceStagger:  0.04,
  entranceDuration: 0.7,
  entranceDelay:    0.1,
  // visibility
  showCursor:       true,
  showSubtitle:     true,
  // layout
  align:            'center',
  gap:              '0px',
};

// ─────────────────────────────────────────────────────────────────────────────
const MagneticTextInner = () => {
  const { props, setProps, replay, langTab, styleTab } = useComponentProps();

  const variant    = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'Tailwind'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const usageCode  = getUsageCode(props, langTab);

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
          <FavoriteButton />
          <CopyPromptButton text={usageCode} />
        </div>
      </div>

      {/* Tabs */}
      <TabsLayout
        preview={
          <>
            <PreviewTab>
              <MagneticTextPreview />
            </PreviewTab>

            <Customize>
              {/* Row 0 – Text inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <PreviewInput title="Main Text"     value={props.text}     onChange={handlePropChange('text')} />
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
                  min={0} max={0.15} step={0.01}
                  display={props.entranceStagger.toFixed(2)}
                />
                <PreviewSlider
                  label="Duration (s)"
                  value={props.entranceDuration}
                  onChange={handlePropChange('entranceDuration')}
                  min={0.1} max={2} step={0.1}
                  display={props.entranceDuration.toFixed(1)}
                />
              </div>

              {/* Row 2 – Magnetic */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                <PreviewSlider
                  label="Magnet Radius (px)"
                  value={props.magnetRadius}
                  onChange={handleMagneticChange('magnetRadius')}
                  min={40} max={300} step={10}
                />
                <PreviewSlider
                  label="Magnet Strength"
                  value={props.magnetStrength}
                  onChange={handleMagneticChange('magnetStrength')}
                  min={0} max={1} step={0.05}
                  display={props.magnetStrength.toFixed(2)}
                />
                <PreviewSlider
                  label="Attract Duration (s)"
                  value={props.attractDuration}
                  onChange={handleMagneticChange('attractDuration')}
                  min={0.05} max={1} step={0.05}
                  display={props.attractDuration.toFixed(2)}
                />
              </div>

              {/* Row 3 – Return & hover colors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                <PreviewSlider
                  label="Return Duration (s)"
                  value={props.returnDuration}
                  onChange={handleMagneticChange('returnDuration')}
                  min={0.1} max={2} step={0.1}
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
                <PreviewSelect
                  label="Gap"
                  value={props.gap}
                  onChange={handlePropChange('gap')}
                  options={GAP_OPTIONS}
                />
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
                  min={0} max={1} step={0.05}
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