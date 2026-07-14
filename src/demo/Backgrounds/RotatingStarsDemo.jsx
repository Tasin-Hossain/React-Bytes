// pages/Backgrounds/RotatingStarsDemo.jsx

import { getUsageCode } from '../../constants/code/Backgrounds/RotatingStars';
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
} from '../../config/Backgrounds/RotatingStars';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import Customize from '../../components/shared/preview/Customize';

import PreviewColorPickerCustom from '../../components/shared/preview/PreviewColorPicker';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import RotatingStars from '../../content/Backgrounds/RotatingStars';
import DemoBuilder from '../../components/layout/DemoBuilder';
import CraftedBy from '../../components/navbers/CraftedBy';

const RotatingStarsInner = () => {
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
      title="Rotating Stars"
      favKey="backgrounds/rotating-stars"
      prompt={usageCode}
      showReplay={false}
      demoContent={props.demoContent}
      onToggleDemoContent={handlePropChange('demoContent')}
      PreviewComponent={<RotatingStars key={animKey} {...props} />}
      childrenClassname="absolute inset-0"
      customize={
        <Customize>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Radius"
              value={props.radius}
              onChange={handlePropChange('radius')}
              min={2}
              max={80}
              step={0.5}
              display={props.radius.toFixed(1)}
            />
            <PreviewSlider
              label="Speed"
              value={props.speed}
              onChange={handlePropChange('speed')}
              min={0}
              max={5}
              step={0.05}
              display={props.speed.toFixed(2)}
            />
            <PreviewSlider
              label="Thickness"
              value={props.thickness}
              onChange={handlePropChange('thickness')}
              min={0.001}
              max={0.05}
              step={0.001}
              display={props.thickness.toFixed(3)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Roundness"
              value={props.roundness}
              onChange={handlePropChange('roundness')}
              min={0}
              max={1}
              step={0.01}
              display={props.roundness.toFixed(2)}
            />
            <PreviewSlider
              label="Blur"
              value={props.blur}
              onChange={handlePropChange('blur')}
              min={0}
              max={20}
              step={0.5}
              display={`${props.blur.toFixed(1)}px`}
            />
            <PreviewSlider
              label="Opacity"
              value={props.opacity}
              onChange={handlePropChange('opacity')}
              min={0}
              max={1}
              step={0.01}
              display={props.opacity.toFixed(2)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="X"
              value={props.x}
              onChange={handlePropChange('x')}
              min={-1}
              max={1}
              step={0.01}
              display={props.x.toFixed(2)}
            />
            <PreviewSlider
              label="Y"
              value={props.y}
              onChange={handlePropChange('y')}
              min={-1}
              max={1}
              step={0.01}
              display={props.y.toFixed(2)}
            />
            <PreviewColorPickerCustom
              title="Color"
              value={props.color}
              onChange={handlePropChange('color')}
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

const RotatingStarsDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <RotatingStarsInner />
  </ComponentPropsProvider>
);

export default RotatingStarsDemo;