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
  SpectraSliderPrompt,
  ENTRANCETYPES,
  DIRECTIONS
} from '../../config/Components/SpectraSlider';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewSelect from '../../components/shared/preview/PreviewSelect';
import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';

import { getUsageCode } from '../../constants/code/Components/SpectraSlider';
import { SpectraSlider } from '../../content/Components/SpectraSlider';

const SpectraSliderInner = () => {
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
      title="Spectra Slider"
      favKey="components/spectra-slider"
      prompt={SpectraSliderPrompt}
      childrenClassname="w-full"
      PreviewComponent={<SpectraSlider {...props} className="w-full min-h-120" />}
      customize={
        <Customize>
          {/* Row 1 – Card Width · Card Height · Number of Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Card Width"
              value={props.cardWidth}
              onChange={handlePropChange('cardWidth')}
              min={80}
              max={320}
              step={1}
            />
            <PreviewSlider
              label="Card Height"
              value={props.cardHeight}
              onChange={handlePropChange('cardHeight')}
              min={100}
              max={420}
              step={1}
            />
            <PreviewSlider
              label="Number of Cards"
              value={props.numberOfCards}
              onChange={handlePropChange('numberOfCards')}
              min={3}
              max={10}
              step={1}
            />
          </div>

          {/* Row 2 – Directions · CurveIntensity · Gap */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSelect
              label="Directions"
              value={props.direction}
              onChange={handlePropChange('direction')}
              options={DIRECTIONS}
            />
            <PreviewSlider
              label="Curve Intensity"
              value={props.curveIntensity}
              onChange={handlePropChange('curveIntensity')}
              min={-20}
              max={20}
              step={1}
            />
            <PreviewSlider
              label="Gap"
              value={props.gap}
              onChange={handlePropChange('gap')}
              min={60}
              max={320}
              step={1}
            />
          </div>

          {/* Row 3 – Scale Step · Perspective · Max Rotation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Perspective"
              value={props.perspective}
              onChange={handlePropChange('perspective')}
              min={400}
              max={2000}
              step={10}
            />
            <PreviewSlider
              label="Max Rotation"
              value={props.maxRotation}
              onChange={handlePropChange('maxRotation')}
              min={0}
              max={90}
              step={1}
            />
            <PreviewSlider
              label="Scale Step"
              value={props.scaleStep}
              onChange={handlePropChange('scaleStep')}
              min={0}
              max={0.5}
              step={0.01}
            />
          </div>

          {/* Row 4 – initialIndex · Opacity Step · Brightness Step */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Opacity Step"
              value={props.opacityStep}
              onChange={handlePropChange('opacityStep')}
              min={0}
              max={0.5}
              step={0.01}
            />
            <PreviewSlider
              label="Brightness Step"
              value={props.brightnessStep}
              onChange={handlePropChange('brightnessStep')}
              min={0}
              max={0.5}
              step={0.01}
            />
            <PreviewSlider
              label="Initial Index"
              value={props.initialIndex}
              onChange={handlePropChange('initialIndex')}
              min={0}
              max={Math.max(props.numberOfCards - 1, 0)}
              step={1}
            />
          </div>

          {/* Row 5 – Initial Index · Draggable · Snap */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSwitch label="Draggable" value={props.draggable} onChange={handlePropChange('draggable')} />
            <PreviewSwitch label="Snap" value={props.snap} onChange={handlePropChange('snap')} />
            <PreviewSwitch label="Auto Play" value={props.autoPlay} onChange={handlePropChange('autoPlay')} />
          </div>

          {/* Row 6 – Autoplay · Duration · Reverse */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Duration (s)"
              value={props.duration}
              onChange={handlePropChange('duration')}
              min={5}
              max={80}
              step={1}
              isDisabled={!props.autoPlay}
            />
            <PreviewSwitch label="Reverse" value={props.reverse} onChange={handlePropChange('reverse')} />
            <PreviewSwitch
              label="Pause On Hover"
              value={props.pauseOnHover}
              onChange={handlePropChange('pauseOnHover')}
            />
          </div>

          {/* Row 7 – Pause On Hover · Mouse Wheel · Filter On Hover */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSwitch label="Mouse Wheel" value={props.mouseWheel} onChange={handlePropChange('mouseWheel')} />
            <PreviewSlider
              label="Wheel Smoothness"
              value={props.wheelSmoothness}
              onChange={handlePropChange('wheelSmoothness')}
              min={0}
              max={1}
              step={0.1}
              isDisabled={!props.mouseWheel}
            />
            <PreviewSlider
              label="Wheel Sensitivity"
              value={props.wheelSensitivity}
              onChange={handlePropChange('wheelSensitivity')}
              min={0}
              max={1}
              step={0.1}
              isDisabled={!props.mouseWheel}
            />
          </div>

          {/* Row 8 – Default Filtered · Entrance Animation · Entrance Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSwitch
              label="Filter On Hover"
              value={props.filterOnHover}
              onChange={handlePropChange('filterOnHover')}
            />
            <PreviewSwitch
              label="Default Filtered"
              value={props.defaultFiltered}
              onChange={handlePropChange('defaultFiltered')}
            />
            <PreviewSwitch
              label="Entrance Animation"
              value={props.entranceAnimation}
              onChange={handlePropChange('entranceAnimation')}
            />
          </div>

          {/* Row 9 – Entrance animation tuning */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSelect
              label="Entrance Type"
              value={props.entranceType}
              onChange={handlePropChange('entranceType')}
              options={ENTRANCETYPES}
              isDisabled={!props.entranceAnimation}
            />
            <PreviewSlider
              label="Entrance Duration (s)"
              value={props.entranceDuration}
              onChange={handlePropChange('entranceDuration')}
              min={0.2}
              max={3}
              step={0.1}
              isDisabled={!props.entranceAnimation}
            />
            <PreviewSlider
              label="Entrance Stagger (s)"
              value={props.entranceStagger}
              onChange={handlePropChange('entranceStagger')}
              min={0}
              max={0.3}
              step={0.01}
              isDisabled={!props.entranceAnimation}
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

const SpectraSliderDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <SpectraSliderInner />
  </ComponentPropsProvider>
);

export default SpectraSliderDemo;