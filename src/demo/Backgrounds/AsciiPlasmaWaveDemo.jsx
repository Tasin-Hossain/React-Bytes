// pages/Backgrounds/PlasmaWaveDemo.jsx

import { getUsageCode } from '../../constants/code/Backgrounds/AsciiPlasmaWave';
import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  CODE_VARIANTS,
  dep,
  PROPS_DATA,
  INITIAL_PROPS,
  PKG_CMDS,
  getShadcnCmds,
  getJsrepoCmds,
  AUTHOR_NAME

} from '../../config/Backgrounds/AsciiPlasmaWave';


import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewInput from '../../components/shared/preview/PreviewInput';
import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import Customize from '../../components/shared/preview/Customize';

import PreviewColorPickerCustom from '../../components/shared/preview/PreviewColorPicker';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import PlasmaWave from '../../content/Backgrounds/AskiiPlasmaWave';
import DemoBuilder from '../../components/layout/DemoBuilder';
import CraftedBy from '../../components/navbers/CraftedBy';

// ─────────────────────────────────────────────────────────────────────────────
const PlasmaWaveInner = () => {
  const { props, setProps, langTab, styleTab, animKey } = useComponentProps();

  const variant = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsrepoCmds = getJsrepoCmds(variant);
  const usageCode = getUsageCode(props, langTab);

  const handlePropChange = key => val => {
    setProps({ [key]: val });
  };

  const handleColorChange = index => val => {
    const nextColors = [...props.colors];
    nextColors[index] = val;
    setProps({ colors: nextColors });
  };

  return (
    <DemoBuilder
      title="Ascii Plasma Wave"
      favKey="backgrounds/plasma-wave"
      prompt={usageCode}
      showReplay={false}
      demoContent={props.demoContent}
      onToggleDemoContent={handlePropChange('demoContent')}
      PreviewComponent={<PlasmaWave key={animKey} {...props} />}
      childrenClassname="absolute inset-0"
      customize={
        <Customize>
          {/* Row 0 – ASCII characters */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            <PreviewInput
              title="ASCII Characters"
              value={props.asciiChars}
              onChange={handlePropChange('asciiChars')}
              placeholder=" .:-=+*#%@■"
            />
            <PreviewColorPickerCustom
              title="Color A"
              value={props.colors[0]}
              onChange={handleColorChange(0)}
            />
            <PreviewColorPickerCustom
              title="Color B"
              value={props.colors[1]}
              onChange={handleColorChange(1)}
            />
          </div>

          {/* Row 1 – Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Cell Size"
              value={props.cellSize}
              onChange={handlePropChange('cellSize')}
              min={4}
              max={32}
              step={1}
            />
            <PreviewSlider
              label="Speed 1"
              value={props.speed1}
              onChange={handlePropChange('speed1')}
              min={0.01}
              max={0.2}
              step={0.01}
              display={props.speed1.toFixed(2)}
            />
            <PreviewSlider
              label="Speed 2"
              value={props.speed2}
              onChange={handlePropChange('speed2')}
              min={0.01}
              max={0.2}
              step={0.01}
              display={props.speed2.toFixed(2)}
            />
          </div>

          {/* Row 2 – Speeds */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSwitch
              label="Reverse Wave 2"
              value={props.dir2 === -1}
              onChange={checked => handlePropChange('dir2')(checked ? -1 : 1)}
            />
            <PreviewSlider
              label="Bend 1"
              value={props.bend1}
              onChange={handlePropChange('bend1')}
              min={0}
              max={3}
              step={0.1}
              display={props.bend1.toFixed(1)}
            />
            <PreviewSlider
              label="Bend 2"
              value={props.bend2}
              onChange={handlePropChange('bend2')}
              min={0}
              max={3}
              step={0.1}
              display={props.bend2.toFixed(1)}
            />
          </div>

          {/* Row 3 – Bend & focal length */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Focal Length"
              value={props.focalLength}
              onChange={handlePropChange('focalLength')}
              min={0.1}
              max={3}
              step={0.1}
              display={props.focalLength.toFixed(1)}
            />
            <PreviewSlider
              label="Rotation"
              value={props.rotationDeg}
              onChange={handlePropChange('rotationDeg')}
              min={-180}
              max={180}
              step={1}
            />
            <PreviewSlider
              label="X Offset"
              value={props.xOffset}
              onChange={handlePropChange('xOffset')}
              min={-200}
              max={200}
              step={5}
            />
          </div>

          {/* Row 4 – Camera transform */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Y Offset"
              value={props.yOffset}
              onChange={handlePropChange('yOffset')}
              min={-200}
              max={200}
              step={5}
            />
            <PreviewSlider
              label="Cell Fill"
              value={props.cellFill}
              onChange={handlePropChange('cellFill')}
              min={0.1}
              max={1}
              step={0.05}
              display={props.cellFill.toFixed(2)}
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
      jsrepoCmds={jsrepoCmds}
      usageCode={usageCode}
      codeVariants={CODE_VARIANTS}
      CodeBlock={CodeBlock}
    />
  );
};

const PlasmaWaveDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <PlasmaWaveInner />
  </ComponentPropsProvider>
);

export default PlasmaWaveDemo;