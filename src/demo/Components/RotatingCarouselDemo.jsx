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
  RotatingCarouselPrompt,
  ENTRANCETYPES,
  FACEFITTYPES
} from '../../config/Components/RotatingCarousel';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewSelect from '../../components/shared/preview/PreviewSelect';
import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';

import { getUsageCode } from '../../constants/code/Components/RotatingCarousel';
import RotatingCarousel from '../../content/Components/RotatingCarousel';


const RotatingCarouselInner = () => {
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
      title="Rotating Carousel"
      favKey="components/rotating-carousel"
      prompt={RotatingCarouselPrompt}
      childrenClassname="w-full"
      PreviewComponent={<RotatingCarousel {...props} className="w-full min-h-120" />}
      customize={
        <Customize>
          {/* Row 1 – Face Count · Entrance Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Face Count"
              value={props.faceCount}
              onChange={handlePropChange('faceCount')}
              min={3}
              max={12}
              step={1}
            />
            <PreviewSelect
              label="Entrance Types"
              value={props.entranceType}
              onChange={handlePropChange('entranceType')}
              options={ENTRANCETYPES}
            />
            <PreviewSelect
              label="Face Fit"
              value={props.faceFit}
              onChange={handlePropChange('faceFit')}
              options={FACEFITTYPES}
            />
          </div>

          {/* Row 2 – Face Width · Face Height */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Face Width"
              value={props.faceWidth}
              onChange={handlePropChange('faceWidth')}
              min={120}
              max={500}
              step={1}
            />
            <PreviewSlider
              label="Face Height"
              value={props.faceHeight}
              onChange={handlePropChange('faceHeight')}
              min={120}
              max={500}
              step={1}
            />
            <PreviewSlider
              label="Initial Rotation"
              value={props.initialRotation}
              onChange={handlePropChange('initialRotation')}
              min={0}
              max={360}
              step={1}
            />
          </div>

          {/* Row 3 – Card Gap · Drag */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Card Gap"
              value={props.cardGap}
              onChange={handlePropChange('cardGap')}
              min={-60}
              max={120}
              step={5}
            />
            <PreviewSwitch label="Draggable" value={props.draggable} onChange={handlePropChange('draggable')} />
            <PreviewSlider
              label="Drag Sensitivity"
              value={props.dragSensitivity}
              onChange={handlePropChange('dragSensitivity')}
              min={0.1}
              max={3}
              step={0.1}
              disabled={!props.draggable}
            />
          </div>

          {/* Row 4 – Drag / Inertia */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Smoothness"
              value={props.smoothness}
              onChange={handlePropChange('smoothness')}
              min={0.05}
              max={1}
              step={0.05}
              disabled={!props.draggable}
            />
            <PreviewSlider
              label="Inertia Resistance"
              value={props.inertiaResistance}
              onChange={handlePropChange('inertiaResistance')}
              min={1}
              max={20}
              step={1}
              disabled={!props.draggable || !props.inertia}
            />
            <PreviewSwitch
              label="Inertia"
              value={props.inertia}
              onChange={handlePropChange('inertia')}
              disabled={!props.draggable}
            />
          </div>

          {/* Row 5 – Shading */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Shade Intensity"
              value={props.shadeIntensity}
              onChange={handlePropChange('shadeIntensity')}
              min={0}
              max={1}
              step={0.05}
            />
            <PreviewSlider
              label="Shade Base"
              value={props.shadeBase}
              onChange={handlePropChange('shadeBase')}
              min={0}
              max={1}
              step={0.05}
            />
            <PreviewSwitch label="Auto Rotate" value={props.autoRotate} onChange={handlePropChange('autoRotate')} />
          </div>

          {/* Row 6 – Auto Rotate */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Auto Rotate Speed (s)"
              value={props.autoRotateSpeed}
              onChange={handlePropChange('autoRotateSpeed')}
              min={3}
              max={60}
              step={1}
              disabled={!props.autoRotate}
            />
            <PreviewSwitch
              label="Pause On Hover"
              value={props.pauseAutoRotateOnHover}
              onChange={handlePropChange('pauseAutoRotateOnHover')}
              disabled={!props.autoRotate}
            />
            <PreviewSwitch label="Filter On Hover" value={props.filterOnHover} onChange={handlePropChange('filterOnHover')} />
          </div>

          {/* Row 7 – Filter toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSwitch label="Default Filtered" value={props.defaultFiltered} onChange={handlePropChange('defaultFiltered')} />
            <PreviewSwitch
              label="Entrance Animation"
              value={props.entranceAnimation}
              onChange={handlePropChange('entranceAnimation')}
            />
            <PreviewSlider
              label="Entrance Duration (s)"
              value={props.entranceDuration}
              onChange={handlePropChange('entranceDuration')}
              min={0.2}
              max={3}
              step={0.1}
              disabled={!props.entranceAnimation}
            />
          </div>

          {/* Row 8 – Entrance animation tuning */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Entrance Stagger (s)"
              value={props.entranceStagger}
              onChange={handlePropChange('entranceStagger')}
              min={0}
              max={0.3}
              step={0.01}
              disabled={!props.entranceAnimation}
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

const RotatingCarouselDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <RotatingCarouselInner />
  </ComponentPropsProvider>
);

export default RotatingCarouselDemo;
