import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { TOOLS } from '../tools/config/toolRegistry';
import ToolDropdown from '../tools/shared/ToolDropdown';
import ToolContent from '../tools/shared/ToolContent';
import ToolsLanding from '../tools/ToolsLanding';
import Header from '../components/navbers/Header';


export default function ToolsPage() {


  const { toolId } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const tool = TOOLS.find(t => t.id === toolId);
    document.title = tool ? `React Bytes - ${tool.label}` : 'React Bytes - Tools';
  }, [toolId]);

  // No toolId → landing grid
  if (!toolId) return <ToolsLanding />;

  const selectedTool = TOOLS.find(t => t.id === toolId)?.id || TOOLS[0].id;

  return (
    <div className="h-screen overflow-hidden bg-(--bg)">
      <Header />
      <div className="flex h-screen flex-col overflow-hidden px-3 pb-3 pt-20 md:px-6 md:pb-6">
        {/* Mobile dropdown */}
        <div className="mb-3 shrink-0 lg:hidden">
          <ToolDropdown
            selectedTool={selectedTool}
            onSelect={id => navigate(`/tools/${id}`)}
            isOpen={isMobileOpen}
            setIsOpen={setIsMobileOpen}
          />
        </div>

        {/* Tool content */}
        <div className="flex-1 overflow-hidden">
          <ToolContent
            toolId={selectedTool}
            toolSelector={
              <ToolDropdown
                selectedTool={selectedTool}
                onSelect={id => navigate(`/tools/${id}`)}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
