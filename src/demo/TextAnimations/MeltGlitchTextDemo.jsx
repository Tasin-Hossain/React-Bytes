// pages/TextAnimations/MeltGlitchTextDemo.jsx

import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  FONT_SIZE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  RADIUS_OPTIONS,
  DROP_AMOUNT_OPTIONS,
  INITIAL_PROPS,
  MeltGlitchTextPrompt,
  CODE_VARIANTS,
  AUTHOR_NAME,
  getJsrepoCmds,
} from '../../config/TextAnimations/MeltGlitchText';

import PreviewSelect from '../../components/shared/preview/PreviewSelect';
import PreviewInput from '../../components/shared/preview/PreviewInput';
import PreviewColorPicker from '../../components/shared/preview/PreviewColorPicker';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import MeltGlitchText from '../../content/TextAnimations/MeltGlitchText';
import { getUsageCode } from '../../constants/code/TextAnimations/MeltGlitchText';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';



// ─────────────────────────────────────────────────────────────────────────────
const MeltGlitchTextInner = () => {
  const { props, setProps, replay, animKey, langTab, styleTab } = useComponentProps();

  const variant = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsRepoCmds = getJsrepoCmds(variant);
  const usageCode = getUsageCode(props, langTab);

  const handlePropChange = key => val => {
    setProps({ [key]: val });
    replay();
  };

  const handleMeltChange = key => val => {
    setProps({ [key]: val });
  };

  return (
    <DemoBuilder
      title="Melt Glitch Text"
      favKey="text-animations/meltglitch-text"
      prompt={MeltGlitchTextPrompt}
      PreviewComponent={<MeltGlitchText key={animKey} {...props} />}
      customize={
        <Customize>
          {/* Row 0 – Text input */}
          <div className="grid grid-cols-1 gap-2 mb-2">
            <PreviewInput title="Text" value={props.text} onChange={handlePropChange('text')} />
          </div>

          {/* Row 1 – Typography */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <PreviewSelect
              label="Font Size"
              value={props.fontSize}
              onChange={handleMeltChange('fontSize')}
              options={FONT_SIZE_OPTIONS}
            />
            <PreviewSelect
              label="Font Weight"
              value={props.fontWeight}
              onChange={handleMeltChange('fontWeight')}
              options={FONT_WEIGHT_OPTIONS}
            />
          </div>

          {/* Row 2 – Animation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <PreviewSelect
              label="Radius (px)"
              value={props.radius}
              onChange={handleMeltChange('radius')}
              options={RADIUS_OPTIONS}
            />
            <PreviewSelect
              label="Drop Amount (px)"
              value={props.dropAmount}
              onChange={handleMeltChange('dropAmount')}
              options={DROP_AMOUNT_OPTIONS}
            />
          </div>

          {/* Row 3 – Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <PreviewColorPicker
              title="Text Color"
              value={props.color}
              onChange={handleMeltChange('color')}
            />
            <PreviewColorPicker
              title="Cyan Echo Color"
              value={props.cyanColor}
              onChange={handleMeltChange('cyanColor')}
            />
            <PreviewColorPicker
              title="Magenta Echo Color"
              value={props.magentaColor}
              onChange={handleMeltChange('magentaColor')}
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
const MeltGlitchTextDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <MeltGlitchTextInner />
  </ComponentPropsProvider>
);

export default MeltGlitchTextDemo;
