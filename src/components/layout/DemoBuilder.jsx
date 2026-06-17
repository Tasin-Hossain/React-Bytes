import CodeTab from "../shared/code/CodeTab";
import PreviewTab from "../shared/preview/PreviewTab";
import TabsLayout from "../shared/TabsLayout";
import CopyPromptButton from "../ui/Button/CopyPromptButton";
import FavoriteButton from "../ui/Button/FavoriteButton";

export default function DemoBuilder({
  title,
  favKey,
  prompt,
  PreviewComponent,
  showReplay,
  demoContent,
  onToggleDemoContent,
  customize,
  dependencies,
  propsTable,
  footer,

  // CodeTab props
  pkgCmds,
  shadcnCmds,
  jsrepoCmds,
  usageCode,
  codeVariants,
  cssCode,
  CodeBlock,
  childrenClassname,
}) {
  return (
    <div className="md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto text-(--text-primary) relative">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h1 className="title-two truncate mb-0">{title}</h1>

        <div className="flex items-center gap-2">
          <FavoriteButton favKey={favKey} />
          <CopyPromptButton text={prompt} />
        </div>
      </div>

      <TabsLayout
        preview={
          <>
            <PreviewTab childrenClassname={childrenClassname}  showReplay={showReplay} demoContent={demoContent} onToggleDemoContent={onToggleDemoContent}>
              {PreviewComponent}
            </PreviewTab>

            {customize}
            {propsTable}
            {dependencies}
          </>
        }
        code={
          <CodeTab
            pkgCmds={pkgCmds}
            shadcnCmds={shadcnCmds}
            jsrepoCmds={jsrepoCmds}
            usageCode={usageCode}
            codeVariants={codeVariants}
            cssCode={cssCode}
            CodeBlock={CodeBlock}
          />
        }
      />

      {footer}
    </div>
  );
}