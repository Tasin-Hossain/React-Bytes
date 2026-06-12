import { FaXTwitter, FaYoutube, FaGithub } from 'react-icons/fa6';
import { Link } from 'react-router';
import { WordmarkParticles } from './Components/WordmarkParticles';

const socialLinks = [
  {
    label: 'GitHub',
    icon: <FaGithub size={18} />,
    to: 'https://github.com/Tasin-Hossain/React-Bytes',
    bg: 'bg-gray-900'
  },
  {
    label: 'Twitter',
    icon: <FaXTwitter size={18} />,
    to: 'https://x.com/react_bytes',
    bg: 'bg-black'
  },
  {
    label: 'Youtube',
    icon: <FaYoutube size={18} />,
    to: '#',
    bg: 'bg-red-500'
  }
];

const navColumns = [
  {
    title: 'Docs',
    links: [
      { label: 'Introduction', to: '/docs/introduction' },
      { label: 'Installation', to: '/docs/installation' },
      { label: 'Components', to: '/docs/components' },
      { label: 'Tools', to: '/docs/tools' },
      { label: 'Blocks', to: '/docs/blocks' }
    ]
  },
  {
    title: 'Site',
    links: [
      { label: 'Home', to: '/' },
      { label: 'License', to: '/license' },
      { label: 'FAQs', to: '/faqs' }
    ]
  },
  {
    title: 'Community',
    links: [{ label: 'Github', to: 'https://github.com' }]
  }
];

const Footer = () => {
  return (
    <footer className="bg-(--bg) overflow-hidden">
      {/* Top section */}
      <div className="border-t border-(--border-secondary)">
        <div className="app-container pt-10 pb-8 grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-6">
            <p className="text-(--text-primary) leading-relaxed max-w-65">
              React Bytes - Free Animated & Block UI Components For React
            </p>

            {/* Social icons */}
            <div className="flex flex-wrap items-center gap-4">
              {socialLinks.map((item, i) => (
                <Link
                  key={i}
                  to={item.to}
                  target="_blank"
                  className={`group w-10 hover:w-26 h-8 hover:${item.bg} relative ${item.bg} rounded-md text-(--text-primary) duration-700 font-medium flex justify-start gap-2 items-center 
                            p-2 pr-5 overflow-hidden before:absolute before:-z-10 before:left-6 hover:before:left-30 before:w-4 before:h-4 before:${item.bg} hover:before:bg-(--bg-hover) before:rotate-45 before:duration-700`}
                >
                  <span className="w-6 h-6 shrink-0 flex items-center justify-center text-white">{item.icon}</span>

                  <span
                    className="text-white origin-left inline-flex border-l border-(--border-primary) px-2 opacity-0 scale-x-0 transition-all duration-300 group-hover:delay-500 group-hover:opacity-100
                                group-hover:scale-x-100 text-sm"
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {navColumns.map((col, ci) => (
            <div key={ci} className="flex flex-col">
              <div className="border-t border-(--border-secondary) mb-5" />
              <h4 className="font-semibold mb-4 tracking-wide">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link, li) => (
                  <li key={li}>
                    <Link
                      to={link.to}
                      className="text-(--text-muted) hover:text-(--text-primary) transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Giant outlined wordmark with particles */}
      <WordmarkParticles />

      {/* Bottom bar */}
      <div className="border-t border-(--border-secondary)">
        <div className="app-container py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-(--text-muted) text-xs">© 2026 React Bytes / Reject all substitutes</p>
          <div className="flex items-center gap-5 flex-wrap">
            {['Security', 'Terms of service', 'Privacy policy'].map(item => (
              <Link
                key={item}
                to="/"
                className="text-(--text-muted) text-xs hover:text-(--text-primary) transition-colors duration-200"
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
