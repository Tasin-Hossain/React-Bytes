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
  ImageCardHoverPrompt,
  SHAPES
} from '../../config/Cards/ImageCardHover';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewSwitch from '../../components/shared/preview/PreviewSwitch';
import PreviewSelect from '../../components/shared/preview/PreviewSelect';
import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';

import { getUsageCode } from '../../constants/code/Cards/ImageCardHover';
import ImageCardHover from '../../content/Cards/ImageCardHover';

const SHAPE_OPTIONS = SHAPES.map(s => ({ label: s, value: s }));

const ImageCardHoverInner = () => {
  const { props, replay, setProps, langTab, styleTab } = useComponentProps();

  const variant = `${langTab.toUpperCase()}-${styleTab === 'css' ? 'CSS' : 'TW'}`;
  const shadcnCmds = getShadcnCmds(variant);
  const jsRepoCmds = getJsrepoCmds(variant);
  const usageCode = getUsageCode(props, langTab);

  const handlePropChange = key => val => {
    setProps({ [key]: val });
    replay();
  };

  // 3D tuning controls only mean something once Initial 3D is on
  const is3DTuningDisabled = !props.initial3D;

  return (
    <DemoBuilder
      title="Image Card Hover"
      favKey="cards/image-card-hover"
      prompt={ImageCardHoverPrompt}
      childrenClassname="w-full"
      PreviewComponent={<ImageCardHover {...props} className="w-full" />}
      customize={
        <Customize>
          {/* Row 1 – Layer Count · Default Shape · Width */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Layer Count"
              value={props.layerCount}
              onChange={handlePropChange('layerCount')}
              min={1}
              max={20}
              step={1}
            />
            <PreviewSelect
              label="Default Shape"
              value={props.defaultShape}
              onChange={handlePropChange('defaultShape')}
              options={SHAPE_OPTIONS}
            />
            <PreviewSlider
              label="Width"
              value={props.width}
              onChange={handlePropChange('width')}
              min={200}
              max={800}
              step={10}
            />
          </div>

          {/* Row 2 – Height · Tilt Max · Pan Max */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Height"
              value={props.height}
              onChange={handlePropChange('height')}
              min={200}
              max={800}
              step={10}
            />
            <PreviewSlider
              label="Tilt Max"
              value={props.tiltMax}
              onChange={handlePropChange('tiltMax')}
              min={1}
              max={90}
              step={1}
              isDisabled={is3DTuningDisabled}
            />
            <PreviewSlider
              label="Pan Max"
              value={props.panMax}
              onChange={handlePropChange('panMax')}
              min={1}
              max={200}
              step={1}
              isDisabled={is3DTuningDisabled}
            />
          </div>

          {/* Row 3 – Depth Step · Scale 3D · Opacity Falloff */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Depth Step"
              value={props.depthStep}
              onChange={handlePropChange('depthStep')}
              min={1}
              max={100}
              step={1}
              isDisabled={is3DTuningDisabled}
            />
            <PreviewSlider
              label="Scale 3D"
              value={props.scale3D}
              onChange={handlePropChange('scale3D')}
              min={0.01}
              max={0.3}
              step={0.01}
              isDisabled={is3DTuningDisabled}
            />
            <PreviewSlider
              label="Opacity Falloff"
              value={props.opacityFalloff}
              onChange={handlePropChange('opacityFalloff')}
              min={0.01}
              max={0.5}
              step={0.01}
              isDisabled={is3DTuningDisabled}
            />
          </div>

          {/* Row 4 – Move Amplify · Tilt Boost · Pan Boost */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Move Amplify"
              value={props.moveAmplify}
              onChange={handlePropChange('moveAmplify')}
              min={0.01}
              max={3}
              step={0.01}
              isDisabled={is3DTuningDisabled}
            />
            <PreviewSlider
              label="Tilt Boost"
              value={props.tiltBoost}
              onChange={handlePropChange('tiltBoost')}
              min={0.1}
              max={3}
              step={0.05}
              isDisabled={is3DTuningDisabled}
            />
            <PreviewSlider
              label="Pan Boost"
              value={props.panBoost}
              onChange={handlePropChange('panBoost')}
              min={0.1}
              max={3}
              step={0.05}
              isDisabled={is3DTuningDisabled}
            />
          </div>

          {/* Row 6 – Initial effect toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSwitch
              label="Initial Rotation"
              value={props.initialRotation}
              onChange={handlePropChange('initialRotation')}
            />
            <PreviewSwitch label="Initial Blur" value={props.initialBlur} onChange={handlePropChange('initialBlur')} />
            <PreviewSwitch
              label="Initial Color"
              value={props.initialColor}
              onChange={handlePropChange('initialColor')}
            />
          </div>

          {/* Row 7 – More initial toggles (parallax / 3d mutually exclusive) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSwitch
              label="Initial Opacity"
              value={props.initialOpacity}
              onChange={handlePropChange('initialOpacity')}
            />
            <PreviewSwitch
              label="Initial Parallax"
              value={props.initialParallax}
              onChange={val => {
                if (val && props.initial3D) setProps({ initial3D: false });
                setProps({ initialParallax: val });
                replay();
              }}
            />
            <PreviewSwitch
              label="Initial 3D"
              value={props.initial3D}
              onChange={val => {
                if (val && props.initialParallax) setProps({ initialParallax: false });
                setProps({ initial3D: val });
                replay();
              }}
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

const ImageCardHoverDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <ImageCardHoverInner />
  </ComponentPropsProvider>
);

export default ImageCardHoverDemo;
