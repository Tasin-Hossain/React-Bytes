// pages/TextAnimations/CurtainTextDemo.jsx

import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  DIRECTION_OPTIONS,
  FONT_SIZE_OPTIONS,
  STAGGER_OPTIONS,
  DURATION_OPTIONS,
  EASING_OPTIONS,
  INITIAL_PROPS,
  CurtainTextPrompt,
  CODE_VARIANTS,
  AUTHOR_NAME,
  getJsrepoCmds
} from '../../config/TextAnimations/Curtaintext';

import PreviewSelect from '../../components/shared/preview/PreviewSelect';

import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewInput from '../../components/shared/preview/PreviewInput';
import PreviewColorPicker from '../../components/shared/preview/PreviewColorPicker';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import CurtainText from '../../content/TextAnimations/CurtainText';
import { getUsageCode } from '../../constants/code/TextAnimations/CurtainText';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';

// ─────────────────────────────────────────────────────────────────────────────

const CurtainTextInner = () => {
  const { props, setProps, replay, animKey, langTab, styleTab } = useComponentProps();

  const variant = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsRepoCmds = getJsrepoCmds(variant);
  const usageCode = getUsageCode(props, langTab);

  // Props that trigger a replay (text / layout changes re-mount the component)
  const handlePropChange = key => val => {
    setProps({ [key]: val });
    replay();
  };

  // Props that update live without re-mounting (colors, anim tunables)
  const handleLivePropChange = key => val => {
    setProps({ [key]: val });
  };

  return (
    <DemoBuilder
      title="Curtain Text"
      favKey="text-animations/curtain-text"
      prompt={CurtainTextPrompt}
      PreviewComponent={<CurtainText key={animKey} {...props} />}
      customize={
        <Customize>
          {/* Row 0 — Text */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <PreviewInput title="Text" value={props.text} onChange={handlePropChange('text')} />
            <PreviewSelect
              label="Direction"
              value={props.direction}
              onChange={handlePropChange('direction')}
              options={DIRECTION_OPTIONS}
            />
          </div>

          {/* Row 1 — Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewColorPicker
              title="Base Color"
              value={props.baseColor}
              onChange={handleLivePropChange('baseColor')}
            />
            <PreviewColorPicker
              title="Active Color"
              value={props.activeColor}
              onChange={handleLivePropChange('activeColor')}
            />

            <PreviewSelect
              label="Font Size"
              value={props.fontSize}
              onChange={handlePropChange('fontSize')}
              options={FONT_SIZE_OPTIONS}
            />
          </div>

          {/* Row 2 — Typography */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSelect
              label="Stagger"
              value={props.staggerMs}
              onChange={handleLivePropChange('staggerMs')}
              options={STAGGER_OPTIONS}
            />
            <PreviewSelect
              label="Duration"
              value={props.durationMs}
              onChange={handleLivePropChange('durationMs')}
              options={DURATION_OPTIONS}
            />
            <PreviewSelect
              label="Easing"
              value={props.easing}
              onChange={handleLivePropChange('easing')}
              options={EASING_OPTIONS}
            />
          </div>

          {/* Row 3 — Animation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSwitch
              label="Reset On Leave"
              value={props.resetOnLeave}
              onChange={handleLivePropChange('resetOnLeave')}
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

const CurtainTextDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <CurtainTextInner />
  </ComponentPropsProvider>
);

export default CurtainTextDemo;
