import { Link } from 'react-router';
import { HiArrowRight } from 'react-icons/hi2';
import { TOOLS } from './config/toolRegistry';
import ShapesDots from '../content/Backgrounds/ShapesDots';
import Header from '../components/landing/Header/Header';
import Footer from '../components/landing/Footer/Footer';

const ToolsLanding = () => (
  
  <>
    <title>React Bytes - Tools</title>
    <Header />
    <section className="relative min-h-screen overflow-hidden bg-(--bg) text-(--text-primary)">
      <div className="absolute inset-0">
        <ShapesDots
          cellSize={25}
          idleScale={0}
          animationMode="random"
          maxPeakScale={0.5}
          backgroundColor=""
          minPeakScale={0.5}
        />
      </div>

      <div className="app-container relative py-14 sm:py-20">
        <header className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <h1 className="title">Create faster with built-in utilities</h1>
          <p>
            Free interactive tools for backgrounds, shapes, and textures — customize, preview, and export without
            leaving React Bytes.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          {TOOLS.map(tool => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={`/tools/${tool.id}`}
                className="group block h-full no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40"
              >
                <article className="relative flex h-full min-h-64 flex-col overflow-hidden rounded-[18px] border border-(--border-secondary) bg-(--bg-card) p-2.5 transition-all duration-300 group-hover:border-purple-500/20">
                  <div className="flex flex-col items-center px-2 pb-3.5 pt-2">
                    <div className="mb-3 flex min-h-5 w-full justify-end">
                      {tool.comingSoon && (
                        <span className="shrink-0 rounded-md border border-(--border-button) bg-(--bg-button) px-2 py-1 text-[10px] font-bold text-(--text-muted)">
                          Coming soon
                        </span>
                      )}
                    </div>
                    <div className="flex size-15 items-center justify-center rounded-2xl border border-(--brand)/15 bg-(--brand)/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-(--brand)/15">
                      <Icon size={24} strokeWidth={1.5} className="text-(--brand)" />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-(--border-secondary) bg-(--bg-card)/50">
                    <div className="flex-1 p-3.5 pt-3">
                      <h3 className="mb-2 text-[14px] font-medium text-(--text-primary)">{tool.label}</h3>
                      <p className="text-[12px] leading-[1.75] text-(--text-dimmed)">{tool.description}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-(--border-secondary) px-3.5 py-2.5">
                      <div className="flex items-center gap-1.5 text-[12px] text-(--text-muted) transition-colors duration-200 group-hover:text-(--text-secondary)">
                        <span>Open</span>
                        <HiArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
    <Footer />
  </>
);

export default ToolsLanding;
