import { FaXTwitter, FaYoutube, FaGithub } from 'react-icons/fa6';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { WordmarkParticles } from './Components/WordmarkParticles';

const socialLinks = [
  {
    label: 'GitHub',
    icon: <FaGithub size={18} />,
    to: 'https://github.com/Tasin-Hossain/React-Bytes',
    classes: 'bg-gray-900 before:bg-gray-900',
  },
  {
    label: 'Twitter',
    icon: <FaXTwitter size={18} />,
    to: 'https://x.com/react_bytes',
    classes: 'bg-black before:bg-black',
  },
  {
    label: 'Youtube',
    icon: <FaYoutube size={18} />,
    to: '#',
    classes: 'bg-red-500 before:bg-red-500',
  },
];

const navColumns = [
  {
    title: 'Docs',
    links: [
      { label: 'Introduction', to: '/get-started/introduction' },
      { label: 'Installation', to: '/get-started/installation' },
      { label: 'Components', to: '/get-started/all-components' },
      { label: 'Tools', to: '/tools' },
    ],
  },
  {
    title: 'Site',
    links: [
      { label: 'Home', to: '/' },
      { label: 'License', to: 'https://github.com/Tasin-Hossain/React-Bytes?tab=License-1-ov-file' },
    ],
  },
  {
    title: 'Community',
    links: [{ label: 'Github', to: 'https://github.com/Tasin-Hossain/React-Bytes' }],
  },
];

const legalLinks = ['Security', 'Terms of service', 'Privacy policy'];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const SocialButton = ({ item }) => (
  <Link
    to={item.to}
    target="_blank"
    rel="noopener noreferrer"
    className={`group relative flex w-10 hover:w-26 h-8 items-center justify-start gap-2 overflow-hidden rounded-md p-2 pr-5 font-medium text-(--text-primary) duration-700
      before:absolute before:-z-10 before:left-6 before:h-4 before:w-4 before:rotate-45 before:duration-700 hover:before:left-30 hover:before:bg-(--bg-hover)
      ${item.classes}`}
  >
    <span className="flex h-6 w-6 shrink-0 items-center justify-center text-white">{item.icon}</span>

    <span
      className="origin-left inline-flex scale-x-0 border-l border-(--border-primary) px-2 text-sm text-white opacity-0 transition-all duration-300
        group-hover:scale-x-100 group-hover:opacity-100 group-hover:delay-500"
    >
      {item.label}
    </span>
  </Link>
);

const Footer = () => {
  return (
    <footer className="overflow-hidden bg-(--bg)">
      <div className="border-t border-(--border-secondary)">
        <motion.div
          className="app-container grid grid-cols-2 gap-10 pt-14 pb-8 md:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          transition={{ staggerChildren: 0.08 }}
        >
          <motion.div variants={fadeUp} className="col-span-2 flex flex-col gap-6 md:col-span-1">
            <p className="max-w-65 leading-relaxed text-(--text-primary)">
              React Bytes - Free Animated & Block UI Components For React
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {socialLinks.map((item) => (
                <SocialButton key={item.label} item={item} />
              ))}
            </div>
          </motion.div>

          {navColumns.map((col) => (
            <motion.nav key={col.title} variants={fadeUp} aria-label={col.title} className="flex flex-col">
              <div className="mb-5 border-t border-(--border-secondary)" />
              <h4 className="mb-4 font-semibold tracking-wide text-(--text-primary)">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-(--text-muted) transition-colors duration-200 hover:text-(--text-primary)"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}
        </motion.div>
      </div>

      <WordmarkParticles />

      <div className="border-t border-(--border-secondary)">
        <div className="app-container flex flex-col items-start justify-between gap-3 py-5 md:flex-row md:items-center">
          <p className="text-xs text-(--text-muted)">© 2026 React Bytes / Reject all substitutes</p>
          <div className="flex flex-wrap items-center gap-5">
            {legalLinks.map((item) => (
              <Link
                key={item}
                to="/"
                className="text-xs text-(--text-muted) transition-colors duration-200 hover:text-(--text-primary)"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;