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
  ScrollStackPrompt
} from '../../config/Components/ScrollStack';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';

import { getUsageCode } from '../../constants/code/Components/ScrollStack';
import ScrollStack from '../../content/Components/ScrollStack';

const ScrollStackInner = () => {
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
      title="Scroll Stack"
      favKey="components/scroll-stack"
      prompt={ScrollStackPrompt}
      childrenClassname="w-full h-[460px]"
      PreviewComponent={<ScrollStack key={props.count} {...props} />}
      customize={
        <Customize>
          {/* Row 1 – Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider label="Cards" value={props.count} onChange={handlePropChange('count')} min={3} max={10} step={1} />
            <PreviewSlider
              label="Card Width"
              value={props.cardMaxWidth}
              onChange={handlePropChange('cardMaxWidth')}
              min={480}
              max={960}
              step={10}
            />
            <PreviewSlider
              label="Item Gap"
              value={props.itemDistance}
              onChange={handlePropChange('itemDistance')}
              min={0}
              max={200}
              step={5}
            />
          </div>

          {/* Row 2 – Stack cont. */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Stack Distance"
              value={props.itemStackDistance}
              onChange={handlePropChange('itemStackDistance')}
              min={0}
              max={60}
              step={1}
            />
            <PreviewSlider label="Corner" value={props.corner} onChange={handlePropChange('corner')} min={0} max={48} step={1} />
            <PreviewSlider
              label="Shadow"
              value={props.shadow}
              onChange={handlePropChange('shadow')}
              min={0}
              max={2}
              step={0.05}
            />
          </div>

          {/* Row 3 – Motion */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Pin Position"
              value={props.stackPosition}
              onChange={handlePropChange('stackPosition')}
              min={0}
              max={40}
              step={1}
            />
            <PreviewSlider
              label="Base Scale"
              value={props.baseScale}
              onChange={handlePropChange('baseScale')}
              min={0.6}
              max={1}
              step={0.01}
            />
            <PreviewSlider
              label="Item Scale"
              value={props.itemScale}
              onChange={handlePropChange('itemScale')}
              min={0}
              max={0.1}
              step={0.005}
            />
          </div>

          {/* Row 4 – Motion cont. */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Rotation"
              value={props.rotationAmount}
              onChange={handlePropChange('rotationAmount')}
              min={0}
              max={10}
              step={0.5}
            />
            <PreviewSlider
              label="Blur"
              value={props.blurAmount}
              onChange={handlePropChange('blurAmount')}
              min={0}
              max={10}
              step={0.5}
            />
            <PreviewSlider
              label="Image Ratio"
              value={props.imageRatio}
              onChange={handlePropChange('imageRatio')}
              min={0.5}
              max={1.5}
              step={0.05}
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

const ScrollStackDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <ScrollStackInner />
  </ComponentPropsProvider>
);

export default ScrollStackDemo;
