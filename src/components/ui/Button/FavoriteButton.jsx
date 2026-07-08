import { RiHeart2Line, RiHeart2Fill } from 'react-icons/ri';
import { useRef, useState } from 'react';
import gsap from 'gsap';

const getSaved = () => {
  try { return JSON.parse(localStorage.getItem('savedComponents') || '[]'); }
  catch { return []; }
};

const FavoriteButton = ({ favKey = '' }) => {
  const [favorited, setFavorited] = useState(() => getSaved().includes(favKey));
  const heartRef = useRef(null);
  const burstRef = useRef(null);

  const spawnBurst = () => {
    const burst = burstRef.current;
    if (!burst) return;
    burst.innerHTML = '';

    const particles = 6;
    for (let i = 0; i < particles; i++) {
      const dot = document.createElement('span');
      dot.className = 'absolute w-1 h-1 rounded-full bg-(--brand)';
      dot.style.left = '50%';
      dot.style.top = '50%';
      burst.appendChild(dot);

      const angle = (i / particles) * Math.PI * 2;
      const dist = 16 + Math.random() * 6;

      gsap.fromTo(
        dot,
        { x: 0, y: 0, opacity: 1, scale: 1 },
        {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          opacity: 0,
          scale: 0,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => dot.remove()
        }
      );
    }
  };

  const toggle = () => {
    const saved = getSaved();
    const willFavorite = !favorited;
    let next;
    if (saved.includes(favKey)) {
      next = saved.filter(k => k !== favKey);
    } else {
      next = [...saved, favKey];
    }
    localStorage.setItem('savedComponents', JSON.stringify(next));
    window.dispatchEvent(new Event('favorites:updated'));
    setFavorited(willFavorite);

    if (willFavorite) {
      gsap.timeline()
        .to(heartRef.current, { scale: 1.5, duration: 0.15, ease: 'power2.out' })
        .to(heartRef.current, { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.4)' });
      spawnBurst();
    } else {
      gsap.fromTo(
        heartRef.current,
        { scale: 0.8 },
        { scale: 1, duration: 0.3, ease: 'back.out(3)' }
      );
    }
  };

  return (
    <button
      onClick={toggle}
      className={`relative w-9 h-9 flex items-center justify-center rounded-md border
        border-(--border-button) bg-(--bg-button) transition-colors duration-150 text-lg cursor-pointer
        ${favorited ? 'text-(--brand)' : 'text-(--text-muted) hover:text-(--text-primary)'}`}
    >
      <div ref={burstRef} className="absolute inset-0 pointer-events-none overflow-visible" />
      <span ref={heartRef} className="flex items-center justify-center">
        {favorited ? <RiHeart2Fill size={18} /> : <RiHeart2Line size={18} />}
      </span>
    </button>
  );
};

export default FavoriteButton;