// pages/TextAnimations/Letter3DSwapDemo.jsx

import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  INITIAL_PROPS,
  Letter3DSwapPrompt,
  CODE_VARIANTS,
  AUTHOR_NAME,
  getJsrepoCmds,
  DIRECTION_OPTIONS,
  STAGGER_FROM_OPTIONS,
  TRIGGER_OPTIONS,
} from '../../config/TextAnimations/Letter3DSwap';

import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewInput from '../../components/shared/preview/PreviewInput';
import PreviewSelect from '../../components/shared/preview/PreviewSelect';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import { getUsageCode } from '../../constants/code/TextAnimations/Letter3DSwap';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';

import Letter3DSwap from '../../content/TextAnimations/Letter3DSwap';



// ─────────────────────────────────────────────────────────────────────────────
const Letter3DSwapInner = () => {
  const { props, setProps, replay, animKey, langTab, styleTab } = useComponentProps();

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
      title="Letter 3D Swap"
      favKey="text-animations/letter-3d-swap"
      prompt={Letter3DSwapPrompt}
      PreviewComponent={
        <Letter3DSwap
          key={animKey}
          text={props.text}
          direction={props.direction}
          staggerFrom={props.staggerFrom}
          staggerDuration={props.staggerDuration}
          flipDuration={props.flipDuration}
          trigger={props.trigger}
          className={props.className}
          charClassName={props.charClassName}
        />
      }
      customize={
        <Customize>
          {/* Row 0 – Text + Direction */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewInput
              title="Text"
              value={props.text}
              onChange={handlePropChange('text')}
            />
            <PreviewSelect
              title="Direction"
              value={props.direction}
              options={DIRECTION_OPTIONS}
              onChange={handlePropChange('direction')}
            />
            <PreviewSelect
              title="Stagger From"
              value={props.staggerFrom}
              options={STAGGER_FROM_OPTIONS}
              onChange={handlePropChange('staggerFrom')}
            />
          </div>

          {/* Row 1 – Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <PreviewSlider
              label="Flip Duration (s)"
              value={props.flipDuration}
              onChange={handlePropChange('flipDuration')}
              min={0.2}
              max={2}
              step={0.05}
              display={props.flipDuration.toFixed(2)}
            />
            <PreviewSlider
              label="Stagger Duration (ms)"
              value={props.staggerDuration}
              onChange={handlePropChange('staggerDuration')}
              min={10}
              max={200}
              step={5}
              display={props.staggerDuration}
            />
          </div>

          {/* Row 2 – Trigger */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSelect
              title="Trigger"
              value={props.trigger}
              options={TRIGGER_OPTIONS}
              onChange={handlePropChange('trigger')}
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
      jsrepoCmds={jsRepoCmds}
      usageCode={usageCode}
      codeVariants={CODE_VARIANTS}
      CodeBlock={CodeBlock}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const Letter3DSwapDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <Letter3DSwapInner />
  </ComponentPropsProvider>
);

export default Letter3DSwapDemo;
