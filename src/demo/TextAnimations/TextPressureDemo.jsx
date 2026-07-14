// pages/TextAnimations/TextPressureDemo.jsx

import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  INITIAL_PROPS,
  TextPressurePrompt,
  CODE_VARIANTS,
  AUTHOR_NAME,
  getJsrepoCmds,
} from '../../config/TextAnimations/TextPressure';

import PreviewInput from '../../components/shared/preview/PreviewInput';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewColorPicker from '../../components/shared/preview/PreviewColorPicker';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';

import { getUsageCode } from '../../constants/code/TextAnimations/TextPressure';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';
import { TextPressure } from '../../content/TextAnimations/TextPressure';



// ─────────────────────────────────────────────────────────────────────────────
const TextPressureInner = () => {
  const { props, setProps, replay, animKey, langTab, styleTab } = useComponentProps();

  const variant = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsRepoCmds = getJsrepoCmds(variant);
  const usageCode = getUsageCode(props, langTab);

  const handlePropChange = key => val => {
    setProps({ [key]: val });
    replay();
  };

  const handlePressureChange = key => val => {
    setProps({ [key]: val });
  };

  return (
    <DemoBuilder
      title="Text Pressure"
      favKey="text-animations/text-pressure"
      prompt={TextPressurePrompt}
      PreviewComponent={<TextPressure key={animKey} {...props} />}
      customize={
        <Customize>
          {/* Row 0 – Text input */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            <PreviewInput title="Text" value={props.text} onChange={handlePropChange('text')} />
            <PreviewInput title="Tag (as)" value={props.as} onChange={handlePropChange('as')} />
            <PreviewColorPicker
              title="Text Color"
              value={props.textColor}
              onChange={handlePressureChange('textColor')}
            />
          </div>

          {/* Row 2 – Hover effect toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSwitch
              label="Width"
              value={props.width}
              onChange={handlePressureChange('width')}
            />
            <PreviewSwitch
              label="Weight"
              value={props.weight}
              onChange={handlePressureChange('weight')}
            />
            <PreviewSwitch
              label="Italic"
              value={props.italic}
              onChange={handlePressureChange('italic')}
            />
          </div>

          {/* Row 3 – More toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSwitch
              label="Alpha"
              value={props.alpha}
              onChange={handlePressureChange('alpha')}
            />
            <PreviewSwitch
              label="Flex Wrap"
              value={props.flex}
              onChange={handlePressureChange('flex')}
            />
            <PreviewSwitch
              label="Scale"
              value={props.scale}
              onChange={handlePressureChange('scale')}
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
const TextPressureDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <TextPressureInner />
  </ComponentPropsProvider>
);

export default TextPressureDemo;