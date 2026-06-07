import { RiHeart2Line, RiHeart2Fill } from "react-icons/ri";
import { useState } from 'react';

const getSaved = () => {
  try { return JSON.parse(localStorage.getItem('savedComponents') || '[]'); }
  catch { return []; }
};

const FavoriteButton = ({ favKey = '' }) => {
  const [favorited, setFavorited] = useState(() => getSaved().includes(favKey));

  const toggle = () => {
    const saved = getSaved();
    let next;
    if (saved.includes(favKey)) {
      next = saved.filter(k => k !== favKey);
    } else {
      next = [...saved, favKey];
    }
    localStorage.setItem('savedComponents', JSON.stringify(next));
    window.dispatchEvent(new Event('favorites:updated'));
    setFavorited(!favorited);
  };

  return (
    <button
      onClick={toggle}
      className={`w-9 h-9 flex items-center justify-center rounded-md border
        border-(--border-button) bg-(--bg-button) transition-all duration-150 text-lg cursor-pointer
        ${favorited ? 'text-(--brand)' : 'text-(--text-muted) hover:text-(--text-primary)'}`}
    >
      {favorited ? <RiHeart2Fill size={18} /> : <RiHeart2Line size={18} />}
    </button>
  );
};

export default FavoriteButton;