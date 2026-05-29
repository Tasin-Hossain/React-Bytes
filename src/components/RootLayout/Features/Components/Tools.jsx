import Logo from '../../../../assets/logos/logo.png';
import DarkLogo from '../../../../assets/logos/dark-logo.svg';

import { useTheme } from '../../../../hooks/useTheme';
import { LuImage, LuShapes } from 'react-icons/lu';
import { IoColorWandSharp } from 'react-icons/io5';
import { BiText } from 'react-icons/bi';

const Tools = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div className="relative h-70 w-70">
      {/* Center */}
      <div className="absolute left-1/2 top-1/2 z-3 flex h-13.5 w-13.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-(--border-button) bg-(--bg-button)">
        <img src={isDark ? Logo : DarkLogo} alt="" width={28} height={28} className="h-7 w-7 opacity-70" />
      </div>

      {/* Ring 1 */}
      <div className="orbit-ring orbit-ring-1">
        <div className="orbit-node absolute left-1/2 -top-5.25 -translate-x-1/2">
          <LuImage className="orbit-icon-ccw" size={16} />
        </div>

        <div className="orbit-node absolute -right-5.25 top-1/2 -translate-y-1/2">
          <IoColorWandSharp className="orbit-icon-ccw" size={16} />
        </div>

        <div className="orbit-node absolute -bottom-5.25 left-1/2 -translate-x-1/2">
          <LuShapes className="orbit-icon-ccw" size={16} />
        </div>

        <div className="orbit-node absolute -left-5.25 top-1/2 -translate-y-1/2">
          <BiText  className="orbit-icon-ccw" size={16} />
        </div>
      </div>
    </div>
  );
};

export default Tools;
