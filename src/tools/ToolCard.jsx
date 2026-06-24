import { Link } from 'react-router';
import { HiArrowRight } from 'react-icons/hi2';

const ToolCard = ({ tool }) => {
  const Icon = tool.icon;

  return (
    <Link
      to={tool.path}
      className="group block h-full no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg)"
    >
      <article className="relative flex h-full min-h-64 flex-col rounded-[18px] border border-(--border-secondary) bg-(--bg-card) p-2.5 overflow-hidden transition-all duration-300 group-hover:border-purple-500/20">

        {/* top: badge + icon */}
        <div className="flex flex-col items-center px-2 pt-2 pb-3.5">
          <div className="flex justify-end w-full min-h-5 mb-3">
            {tool.comingSoon && (
              <span className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-md bg-(--bg-button) text-(--text-muted) border border-(--border-button)">
                Coming soon
              </span>
            )}
          </div>

          <div className="flex size-15 items-center justify-center rounded-2xl border border-(--brand)/15 bg-(--brand)/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-(--brand)/15">
            <Icon size={24} strokeWidth={1.5} className="text-(--brand)" />
          </div>
        </div>

        {/* inner box */}
        <div className="flex flex-1 flex-col rounded-xl border border-(--border-secondary) bg-(--bg-card)/50 overflow-hidden">
          {/* text */}
          <div className="flex-1 p-3.5 pt-3">
            <h3 className="mb-2 text-[14px] font-medium text-(--text-primary)">{tool.label}</h3>
            <p className="text-[12px] leading-[1.75] text-(--text-dimmed)">{tool.description}</p>
          </div>

          {/* footer */}
          <div className="flex items-center justify-between border-t border-(--border-secondary) px-3.5 py-2.5">
            <div className="flex items-center gap-1.5 text-[12px] text-(--text-muted) transition-colors duration-200 group-hover:text-(--text-secondary)">
              <span>Open</span>
              <HiArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
            <div className="size-1.25 rounded-full bg-(--brand)/25" />
          </div>
        </div>

      </article>
    </Link>
  );
};

export default ToolCard;
