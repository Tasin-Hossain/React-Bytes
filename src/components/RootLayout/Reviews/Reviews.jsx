import { Link } from 'react-router';
import './Reviews.css';
import { motion } from 'framer-motion';
const REVIEWS = [
  {
    name: 'shadcn',
    handle: '@shadcn',
    avatar: 'https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg',
    text: 'Everything about this is next level.',
    url: 'https://twitter.com/shadcn',
  },
  {
    name: 'Dany',
    handle: '@MajorBaguette',
    avatar: 'https://pbs.twimg.com/profile_images/1681213499972276224/NzlaKnFf_400x400.jpg',
    text: 'A product so well crafted that it becomes an instant classic in your stack? My last one is React Bits.',
    url: 'https://twitter.com/MajorBaguette',
  },
  {
    name: 'Tanmay',
    handle: '@syskey_dmg',
    avatar: 'https://pbs.twimg.com/profile_images/1764177580312317952/YTB4ZYDL_400x400.jpg',
    text: 'A sleek, minimal, and super dev-friendly React component library. Clean UI, easy to use, and perfect for modern projects.',
    url: 'https://twitter.com/syskey_dmg',
  },

];

// split into 3 rows
const ROW1 = REVIEWS.slice(0, 4);
const ROW2 = REVIEWS.slice(4, 8);
const ROW3 = REVIEWS.slice(8, 12);

function ReviewCard({ review }) {
  return (
    <Link
      to={review.url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group flex-none w-64 sm:w-72
        bg-(--bg-card) border border-(--border-secondary)
        rounded-xl p-4 mx-2
        flex flex-col gap-3
        transition-all duration-300
         hover:border-(--bg-white)/15 hover:translate-y-0.5 hover:bg-(--bg-white)/5
        cursor-pointer
      "
    >
      {/* header */}
      <div className="flex items-center gap-2.5">
        <img
          src={review.avatar}
          alt={review.name}
          onError={e => {
            e.target.onerror = null;
            e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${review.name}&backgroundColor=333333&textColor=ffffff`;
          }}
          className="w-9 h-9 rounded-full object-cover border border-(--border-secondary)"
        />
        <div className="flex flex-col min-w-0">
          <span className="text-[13px] font-semibold text-(--text-primary) leading-tight truncate">
            {review.name}
          </span>
          <span className="text-[11px] text-(--text-muted) leading-tight truncate">
            {review.handle}
          </span>
        </div>
        {/* X icon */}
        <div className="ml-auto opacity-0 group-hover:opacity-60 transition-opacity duration-200 shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-(--text-muted)">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
      </div>

      {/* text */}
      <p className="text-[12.5px] text-(--text-muted) leading-5 line-clamp-3">
        {review.text}
      </p>
    </Link>
  );
}

function ReviewRow({ reviews, direction }) {
  // duplicate for seamless loop
  const doubled = [...reviews, ...reviews];
  return (
    <div className="overflow-hidden py-1 w-full">
      <div className={direction === 'right' ? 'reviews-row-right' : 'reviews-row-left'}>
        {doubled.map((r, i) => (
          <ReviewCard key={`${r.handle}-${i}`} review={r} />
        ))}
      </div>
    </div>
  );
}

const Reviews = () => {
  return (
    <section className="app-container py-1 overflow-hidden">
      {/* heading */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="title">Loved by developers</h2>
      </motion.div>

      {/* rows */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        {/* left fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-40 z-10 bg-linear-to-r from-(--bg) to-transparent" />
        {/* right fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-40 z-10 bg-linear-to-l from-(--bg) to-transparent" />

        <div className="flex flex-col gap-3">
          <ReviewRow reviews={ROW1} direction="right" />
          <ReviewRow reviews={ROW2} direction="left" />
          <ReviewRow reviews={ROW3} direction="right" />
        </div>
      </motion.div>
    </section>
  );
};

export default Reviews;
