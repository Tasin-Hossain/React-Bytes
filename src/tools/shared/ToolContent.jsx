import { Suspense } from 'react';
import { TOOLS } from '../config/toolRegistry';
import ComingSoon from './ComingSoon';

const ToolContent = ({ toolId, toolSelector }) => {
  const tool = TOOLS.find(t => t.id === toolId);

  if (!tool?.component) {
    return <ComingSoon label={tool?.label || 'Tool'} toolSelector={toolSelector} />;
  }

  const Component = tool.component;
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center text-[14px] text-(--text-muted)">
          Loading...
        </div>
      }
    >
      <Component toolSelector={toolSelector} />
    </Suspense>
  );
};

export default ToolContent;
