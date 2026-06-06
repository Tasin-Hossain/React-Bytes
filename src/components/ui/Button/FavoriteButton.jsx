import { RiHeart2Line } from "react-icons/ri";
import { RiHeart2Fill } from "react-icons/ri";
import { useState } from 'react';

const FavoriteButton = ({ defaultFavorited = false, onChange }) => {
  const [favorited, setFavorited] = useState(defaultFavorited);

  const toggle = () => {
    const next = !favorited;
    setFavorited(next);
    onChange?.(next);
  };

  return (
    <button
      onClick={toggle}
      className={`w-9 h-9 flex items-center justify-center rounded-md border
        border-(--border-button) bg-(--bg-button) transition-all duration-150 text-lg cursor-pointer
        ${favorited ? 'text-(--brand)' : 'text-(--text-muted) hover:text-(--text-primary)'}`}
    >
      {favorited ? <RiHeart2Fill size={18}/> : <RiHeart2Line size={18}/>}
    </button>
  );
};

export default FavoriteButton;
