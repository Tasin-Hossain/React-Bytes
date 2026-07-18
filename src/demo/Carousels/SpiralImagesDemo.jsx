import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  getJsrepoCmds,
  INITIAL_PROPS,
  CODE_VARIANTS,
  AUTHOR_NAME,
  SpiralImagesPrompt
} from '../../config/Carousels/SpiralImages';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';

import { getUsageCode } from '../../constants/code/Carousels/SpiralImages';
import SpiralImages from '../../content/Carousels/SpiralImages';

const SpiralImagesInner = () => {
  const { props, replay, setProps, langTab, styleTab } = useComponentProps();

  const variant = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsRepoCmds = getJsrepoCmds(variant);
  const usageCode = getUsageCode(props, langTab);

  const handlePropChange = key => val => {
    setProps({ [key]: val });
    replay();
  };

  return (
    <DemoBuilder
      title="Spiral Images"
      favKey="images/spiral-images"
      prompt={SpiralImagesPrompt}
      demoContent={props.demoContent}
      onToggleDemoContent={handlePropChange('demoContent')}
      childrenClassname="w-full"
      PreviewComponent={<SpiralImages {...props} className="w-full min-h-120" />}
      customize={
        <Customize>
          {/* Row 1 – Spiral shape */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Turns"
              value={props.turns}
              onChange={handlePropChange('turns')}
              min={0.5}
              max={8}
              step={0.1}
            />
            <PreviewSlider
              label="Spread"
              value={props.spread}
              onChange={handlePropChange('spread')}
              min={1}
              max={15}
              step={0.5}
            />
            <PreviewSlider
              label="Spacing"
              value={props.spacing}
              onChange={handlePropChange('spacing')}
              min={1}
              max={20}
              step={0.5}
            />
          </div>

          {/* Row 2 – Motion */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Speed"
              value={props.speed}
              onChange={handlePropChange('speed')}
              min={0.1}
              max={10}
              step={0.1}
            />
            <PreviewSlider
              label="Fade In (%)"
              value={props.fadeIn}
              onChange={handlePropChange('fadeIn')}
              min={0}
              max={100}
              step={1}
            />
            <PreviewSlider
              label="Fade Out (%)"
              value={props.fadeOut}
              onChange={handlePropChange('fadeOut')}
              min={0}
              max={100}
              step={1}
            />
          </div>

          {/* Row 3 – Card appearance */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Image Size"
              value={props.imageSize}
              onChange={handlePropChange('imageSize')}
              min={50}
              max={400}
              step={5}
            />
            <PreviewSlider
              label="Size Attenuation"
              value={props.sizeAttenuation}
              onChange={handlePropChange('sizeAttenuation')}
              min={0}
              max={5}
              step={0.1}
            />
            <PreviewSlider
              label="Corner Radius"
              value={props.cornerRadius}
              onChange={handlePropChange('cornerRadius')}
              min={0}
              max={20}
              step={1}
            />
          </div>
        </Customize>
      }
      propsTable={<PropsTable PROPS_DATA={PROPS_DATA} />}
      dependencies={<Dependencies dependencies={dep} />}
      footer={<CraftedBy name={AUTHOR_NAME} />}
      pkgCmds={PKG_CMDS}
      shadcnCmds={shadcnCmds}
      jsrepoCmds={jsRepoCmds}
      usageCode={usageCode}
      codeVariants={CODE_VARIANTS}
      CodeBlock={CodeBlock}
    />
  );
};

const SpiralImagesDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <SpiralImagesInner />
  </ComponentPropsProvider>
);

export default SpiralImagesDemo;