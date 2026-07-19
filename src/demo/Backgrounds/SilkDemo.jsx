// pages/Backgrounds/SilkDemo.jsx

import { getUsageCode } from '../../constants/code/Backgrounds/Silk';
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
} from '../../config/Backgrounds/Silk';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import Customize from '../../components/shared/preview/Customize';

import PreviewColorPickerCustom from '../../components/shared/preview/PreviewColorPicker';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Silk from '../../content/Backgrounds/Silk';
import DemoBuilder from '../../components/layout/DemoBuilder';
import CraftedBy from '../../components/navbers/CraftedBy';

const SilkInner = () => {
  const { props, setProps, langTab, styleTab, animKey } = useComponentProps();

  const variant = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsrepoCmds = getJsrepoCmds(variant);
  const usageCode = getUsageCode(props, langTab);

  const handlePropChange = key => val => {
    setProps({ [key]: val });
  };

  return (
    <DemoBuilder
      title="Silk"
      favKey="backgrounds/silk"
      prompt={usageCode}
      showReplay={false}
      demoContent={props.demoContent}
      onToggleDemoContent={handlePropChange('demoContent')}
      PreviewComponent={<Silk key={animKey} {...props} />}
      childrenClassname="absolute inset-0"
      customize={
        <Customize>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Speed"
              value={props.speed}
              onChange={handlePropChange('speed')}
              min={1}
              max={15}
              step={1}
              display={props.speed.toFixed(0)}
            />
            <PreviewSlider
              label="Scale"
              value={props.scale}
              onChange={handlePropChange('scale')}
              min={0.3}
              max={3}
              step={0.1}
              display={props.scale.toFixed(1)}
            />
            <PreviewSlider
              label="Noise intensity"
              value={props.noiseIntensity}
              onChange={handlePropChange('noiseIntensity')}
              min={0}
              max={4}
              step={0.1}
              display={props.noiseIntensity.toFixed(1)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Rotation"
              value={props.rotation}
              onChange={handlePropChange('rotation')}
              min={0}
              max={6.28}
              step={0.05}
              display={props.rotation.toFixed(2)}
            />
            <PreviewColorPickerCustom
              title="Color"
              value={props.color}
              onChange={handlePropChange('color')}
            />
            <PreviewSwitch
              label="Show content"
              value={props.showContent}
              onChange={handlePropChange('showContent')}
            />
          </div>
        </Customize>
      }
      propsTable={<PropsTable PROPS_DATA={PROPS_DATA} />}
      dependencies={<Dependencies dependencies={dep} />}
      footer={<CraftedBy name={AUTHOR_NAME} />}
      pkgCmds={PKG_CMDS}
      shadcnCmds={shadcnCmds}
      jsrepoCmds={jsrepoCmds}
      usageCode={usageCode}
      codeVariants={CODE_VARIANTS}
      CodeBlock={CodeBlock}
    />
  );
};

const SilkDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <SilkInner />
  </ComponentPropsProvider>
);

export default SilkDemo;