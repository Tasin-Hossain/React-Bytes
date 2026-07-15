// pages/TextAnimations/ParticleTextDemo.jsx

import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  INITIAL_PROPS,
  ParticleTextPrompt,
  CODE_VARIANTS,
  AUTHOR_NAME,
  getJsrepoCmds
} from '../../config/TextAnimations/ParticleText';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewInput from '../../components/shared/preview/PreviewInput';
import PreviewSelect from '../../components/shared/preview/PreviewSelect';
import PreviewColorPicker from '../../components/shared/preview/PreviewColorPicker';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import { getUsageCode } from '../../constants/code/TextAnimations/ParticleText';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';

import ParticleText from '../../content/TextAnimations/ParticleText';

// ─────────────────────────────────────────────────────────────────────────────
const SHAPE_OPTIONS = [
  { label: 'Square', value: 'square' },
  { label: 'Circle', value: 'circle' },
  { label: 'ASCII', value: 'ascii' }
];

// ─────────────────────────────────────────────────────────────────────────────
const ParticleTextInner = () => {
  const { props, setProps, replay, animKey, langTab, styleTab } = useComponentProps();

  const variant = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsRepoCmds = getJsrepoCmds(variant);
  const usageCode = getUsageCode(props, langTab);

  const handlePropChange = key => val => {
    setProps({ [key]: val });
    replay();
  };

  const handleAnimChange = key => val => {
    setProps({ [key]: val });
  };

  const handleMouseControlChange = key => val => {
    setProps({ mouseControls: { ...props.mouseControls, [key]: val } });
  };

  const handleColorChange = index => val => {
    const next = [...props.colors];
    next[index] = val;
    setProps({ colors: next });
    replay();
  };

  return (
    <DemoBuilder
      title="Particle Text"
      favKey="text-animations/particle-text"
      prompt={ParticleTextPrompt}
      childrenClassname="w-800"
      PreviewComponent={<ParticleText key={animKey} {...props} />}
      customize={
        <Customize>
          {/* Row 0 – Text, autoFit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewInput title="Text" value={props.text} onChange={handlePropChange('text')} />
            <PreviewSwitch label="Auto Fit" value={props.autoFit} onChange={handlePropChange('autoFit')} />
            <PreviewSlider
              label="Font Size (px)"
              value={props.fontSize}
              onChange={handlePropChange('fontSize')}
              min={40}
              max={320}
              step={10}
              display={props.fontSize}
            />
          </div>

          {/* Row 1 – Sizing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Particle Size (px)"
              value={props.particleSize}
              onChange={handlePropChange('particleSize')}
              min={1}
              max={6}
              step={0.5}
              display={props.particleSize}
            />
            <PreviewSlider
              label="Particle Gap (px)"
              value={props.particleGap}
              onChange={handlePropChange('particleGap')}
              min={0}
              max={8}
              step={0.5}
              display={props.particleGap}
            />
            <PreviewSwitch
              label="Mouse Interaction"
              value={props.mouseControls.enabled}
              onChange={handleMouseControlChange('enabled')}
            />
          </div>

          {/* Row 2 – Mouse controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Mouse Radius (px)"
              value={props.mouseControls.radius}
              onChange={handleMouseControlChange('radius')}
              min={20}
              max={400}
              step={10}
              display={props.mouseControls.radius}
            />
            <PreviewSlider
              label="Mouse Strength"
              value={props.mouseControls.strength}
              onChange={handleMouseControlChange('strength')}
              min={0}
              max={20}
              step={0.5}
              display={props.mouseControls.strength}
            />
            <PreviewSlider
              label="Friction"
              value={props.friction}
              onChange={handleAnimChange('friction')}
              min={0.5}
              max={0.98}
              step={0.01}
              display={props.friction.toFixed(2)}
            />
          </div>

          {/* Row 3 – Physics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <PreviewSlider
              label="Ease"
              value={props.ease}
              onChange={handleAnimChange('ease')}
              min={0.01}
              max={0.3}
              step={0.01}
              display={props.ease.toFixed(2)}
            />
            <PreviewColorPicker
              title="Background Color"
              color={props.backgroundColor === 'transparent' ? '#000000' : props.backgroundColor}
              onChange={handleAnimChange('backgroundColor')}
            />
          </div>

          {/* Row 4 – Colors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
            {props.colors.map((c, i) => (
              <PreviewColorPicker key={i} title={`Color ${i + 1}`} color={c} onChange={handleColorChange(i)} />
            ))}
          </div>

          {/* Row 5 – Shape */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <PreviewSelect
              label="Shape"
              value={props.shape}
              onChange={handlePropChange('shape')}
              options={SHAPE_OPTIONS}
            />
            {props.shape === 'ascii' && (
              <PreviewInput
                title="ASCII Characters"
                value={props.asciiChars}
                onChange={handlePropChange('asciiChars')}
              />
            )}
          </div>

          {/* Row 6 – Background */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2"></div>
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
const ParticleTextDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <ParticleTextInner />
  </ComponentPropsProvider>
);

export default ParticleTextDemo;
