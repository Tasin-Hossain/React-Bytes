import Logo from '../../../assets/logos/logo.svg';
import DarkLogo from '../../../assets/logos/dark-logo.png';
import Button from '../../ui/Button/Button';
import { useTheme } from '../../../hooks/useTheme';
import { FaArrowRightLong } from 'react-icons/fa6';

const DemoOverlay = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none z-10 overflow-hidden">
      {/* Rounded floating navbar */}
      <div className="m-4 sm:m-6 px-4 sm:px-6 py-2 rounded-md backdrop-blur-md bg-(--bg-white)/5 border border-(--border-secondary) flex items-center justify-between">
        <div className="flex items-center gap-2 text-(--text-primary) font-semibold">
          <div className="w-5 h-5 flex items-center justify-center">
            <img src={isDark ? Logo : DarkLogo} alt="Logo" className="w-full h-full" />
          </div>
          <span>React Bytes</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-(--text-muted) text-sm">
          <span>Features</span>
          <span>About</span>
          <button className="pointer-events-auto px-4 py-1.5 rounded-md bg-white text-black text-sm font-semibold">
            Sign up
          </button>
        </div>
      </div>

      {/* Hero content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 -mt-10">
        <div className="mb-6 px-1 py-0.5 rounded-lg border border-(--border-secondary) bg-(--bg-card) text-xs tracking-wide pointer-events-auto">
          <div className="flex items-center justify-center gap-2">
            <Button text="New Components" />
            <button className="btn gap-2 bg-transparent border-none text-[11px]">
              CURTAIN
              <FaArrowRightLong size={12} />
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-3xl lg:text-4xl font-extrabold text-(--text-primary) max-w-3xl leading-tight">
          Build Faster With React Bytes
        </h1>

        <div className="mt-7 flex items-center gap-3 pointer-events-auto">
          <Button text="Get started" className="py-2 px-4" />
          <button className="px-4 py-2 rounded-md bg-(--bg-button) border border-(--border-button) text-(--text-muted) text-sm ">
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoOverlay;
