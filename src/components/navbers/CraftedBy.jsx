
import { AiFillHeart } from 'react-icons/ai';

const CraftedBy = ({ name }) => (
  <p className="mt-6 flex items-center justify-center gap-1.5 text-sm text-(--text-secondary) tracking-wide">
    Crafted with
    <AiFillHeart className="text-rose-500 animate-pulse" size={13} />
    by
    <span className="font-semibold text-(--text-primary) hover:text-rose-400 transition-colors duration-300 cursor-default">
      {name}
    </span>
  </p>
);

export default CraftedBy;