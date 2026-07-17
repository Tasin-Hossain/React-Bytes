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
  RotatingCardsPrompt,
  ENTRANCETYPES,
  DIRECTIONS
} from '../../config/Carousels/RotatingCards';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewSelect from '../../components/shared/preview/PreviewSelect';
import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';

import { getUsageCode } from '../../constants/code/Carousels/RotatingCards';
import { RotatingCards } from '../../content/Carousels/RotatingCards';

const RotatingCardsInner = () => {
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
      title="Rotating Cards"
      favKey="carousels/rotating-cards"
      prompt={RotatingCardsPrompt}
      childrenClassname="w-full"
      PreviewComponent={<RotatingCards {...props} className="w-full min-h-120" />}
      customize={
        <Customize>
          {/* Row 1 – Radius · Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Number of Cards"
              value={props.numberOfCards}
              onChange={handlePropChange('numberOfCards')}
              min={3}
              max={10}
              step={1}
            />
            <PreviewSlider
              label="Radius"
              value={props.radius}
              onChange={handlePropChange('radius')}
              min={150}
              max={700}
              step={1}
            />
            <PreviewSelect
              label="Directions"
              value={props.direction}
              onChange={handlePropChange('direction')}
              options={DIRECTIONS}
            />
          </div>

          {/* Row 2 – Card Width · Card Height */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Duration (s)"
              value={props.duration}
              onChange={handlePropChange('duration')}
              min={5}
              max={80}
              step={1}
            />
            <PreviewSelect
              label="Entrance Types"
              value={props.entranceType}
              onChange={handlePropChange('entranceType')}
              options={ENTRANCETYPES}
              isDisabled={!props.entranceAnimation}
            />
            <PreviewSlider
              label="Card Width"
              value={props.cardWidth}
              onChange={handlePropChange('cardWidth')}
              min={80}
              max={260}
              step={1}
            />
          </div>

          {/* Row 3 – Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Card Height"
              value={props.cardHeight}
              onChange={handlePropChange('cardHeight')}
              min={90}
              max={300}
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
            <PreviewSwitch label="Auto Play" value={props.autoPlay} onChange={handlePropChange('autoPlay')} />
          </div>

          {/* Row 4 – More toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSwitch label="Draggable" value={props.draggable} onChange={handlePropChange('draggable')} />
            <PreviewSwitch label="Mouse Wheel" value={props.mouseWheel} onChange={handlePropChange('mouseWheel')} />
            <PreviewSwitch label="Reverse" value={props.reverse} onChange={handlePropChange('reverse')} />
          </div>

          {/* Row 5 – More toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSwitch
              label="Pause On Hover"
              value={props.pauseOnHover}
              onChange={handlePropChange('pauseOnHover')}
            />
            <PreviewSwitch label="Filter On hover" value={props.filterOnHover} onChange={handlePropChange('filterOnHover')} />
            <PreviewSwitch label="Default Filtered" value={props.defaultFiltered} onChange={handlePropChange('defaultFiltered')} />
          </div>

          {/* Row 6 – Entrance animation tuning */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
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

const RotatingCardsDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <RotatingCardsInner />
  </ComponentPropsProvider>
);

export default RotatingCardsDemo;
