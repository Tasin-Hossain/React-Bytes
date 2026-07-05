// pages/TextAnimations/SmokeAwayDemo.jsx

import CodeBlock from '../../components/shared/code/CodeBlock';
import { PropsTable } from '../../components/shared/preview/PropsTable';

import {
  dep,
  PROPS_DATA,
  PKG_CMDS,
  getShadcnCmds,
  EASE_OPTIONS,
  INITIAL_PROPS,
  SmokeAwayPrompt,
  CODE_VARIANTS,
  AUTHOR_NAME,
  getJsrepoCmds,
} from '../../config/TextAnimations/SmokeAway';

import PreviewSelect from '../../components/shared/preview/PreviewSelect';
import PreviewSlider from '../../components/shared/preview/PreviewSlider';
import PreviewInput from '../../components/shared/preview/PreviewInput';

import Dependencies from '../../components/shared/preview/Dependencies';
import useComponentProps from '../../hooks/useComponentProps';
import ComponentPropsProvider from '../../components/context/ComponentPropsProvider';
import Customize from '../../components/shared/preview/Customize';
import { getUsageCode } from '../../constants/code/TextAnimations/SmokeAway';
import CraftedBy from '../../components/navbers/CraftedBy';
import DemoBuilder from '../../components/layout/DemoBuilder';

import SmokeAway from '../../content/TextAnimations/SmokeAway';



// ─────────────────────────────────────────────────────────────────────────────
const SmokeAwayInner = () => {
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
      title="Smoke Away"
      favKey="text-animations/smoke-away"
      prompt={SmokeAwayPrompt}
      PreviewComponent={<SmokeAway key={animKey} {...props} />}
      customize={
        <Customize>
          {/* Row 0 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewInput
              title="Text"
              value={props.text}
              onChange={handlePropChange('text')}
            />
            <PreviewSelect
              label="Return Ease"
              value={props.returnEase}
              onChange={handlePropChange('returnEase')}
              options={EASE_OPTIONS}
            />
            <PreviewSlider
              label="Smoke Y (px)"
              value={props.smokeY}
              onChange={handlePropChange('smokeY')}
              min={-100}
              max={100}
              step={1}
            />
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <PreviewSlider
              label="Smoke Scale"
              value={props.smokeScale}
              onChange={handlePropChange('smokeScale')}
              min={0.5}
              max={3}
              step={0.05}
              display={props.smokeScale.toFixed(2)}
            />
            <PreviewSlider
              label="Smoke Blur (px)"
              value={props.smokeBlur}
              onChange={handlePropChange('smokeBlur')}
              min={0}
              max={30}
              step={1}
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
const SmokeAwayDemo = () => (
  <ComponentPropsProvider initialProps={INITIAL_PROPS}>
    <SmokeAwayInner />
  </ComponentPropsProvider>
);

export default SmokeAwayDemo;