import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { FaCode } from 'react-icons/fa6';
import useComponentProps from '../../hooks/useComponentProps';

const TabsLayout = ({ preview, code }) => {
  const { mainTab, setMainTab } = useComponentProps();

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex items-center gap-1 mb-4 p-1 rounded-md border border-(--border-secondary)  w-fit">
        <TabBtn
          active={mainTab === 'preview'}
          onClick={() => setMainTab('preview')}
          icon={<MdOutlineRemoveRedEye size={18} />}
        >
          Preview
        </TabBtn>
        <TabBtn active={mainTab === 'code'} onClick={() => setMainTab('code')} icon={<FaCode size={18} />}>
          Code
        </TabBtn>
      </div>

      {/* Active tab */}
      {mainTab === 'preview' && preview}
      {mainTab === 'code' && code}
    </div>
  );
};

const TabBtn = ({ active, onClick, icon, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md  text-sm font-medium transition-all duration-200 cursor-pointer
      ${active ? 'bg-(--bg-button) text-(--text-primary) ' : 'text-(--text-muted) hover:text-(--text-primary)'}`}
  >
    {icon}
    {children}
  </button>
);

export default TabsLayout;
