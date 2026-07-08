import { Link } from 'react-router';
import Button from '../components/ui/Button/Button';
import { FaArrowRightLong } from 'react-icons/fa6';

const Introduction = () => {
  return (
    <>
      <div className="max-w-3xl mx-auto  text-(--text-primary)">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-medium text-(--brand) leading-relaxed uppercase tracking-wider mb-3">
            Get Started
          </p>
          <h1 className="title-two">Introduction</h1>
          <p className="mb-4 leading-relaxed">
            React Bytes is an open-source showcase of creative React components crafted for developers who want their
            products to stand out.
          </p>
          <p className="mb-4 leading-relaxed">
            Instead of offering another collection of basic UI elements, React Bytes delivers unique interactions,
            eye-catching effects, and modern design patterns that bring personality to your applications.
          </p>
          <p className="mb-4 leading-relaxed">
            From subtle animations to immersive visual experiences, every component is built to help you create
            interfaces that feel dynamic, polished, and unforgettable.
          </p>
          <p>Build faster. Design better. Create experiences that users remember.</p>
        </div>

        {/* Goal */}
        <section className="mb-10">
          <h2 className="title-two">Goal</h2>
          <p className="mb-4 leading-relaxed">
            The mission of React Bytes is to empower developers with flexible, high-quality, and visually impressive
            components that make building exceptional web experiences faster and more enjoyable.
          </p>
          <ul className=" space-y-3">
            {[
              { step: 'Open & Free', text: 'Free to use, modify, and ship in any project—personal or commercial.' },
              { step: 'Customization First', text: 'Flexible props and options make every component easy to tailor.' },
              { step: 'Modular by Design', text: 'Install only what you need and keep your bundle lightweight.' },
              { step: 'Developer Freedom', text: 'Works with your preferred stack, whether JS, TS, CSS, or Tailwind.' }
            ].map(({ step, text }) => (
              <li key={step} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-(--brand) shrink-0 leading-relaxed" />
                <span className="text-(--brand) font-medium text-sm leading-relaxed">{step}</span>
                <span className="text-(--text-muted)">{text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Contributing */}
        <section className="mb-10">
          <h2 className="title-two mb-3">Contributing</h2>
          <p className=" leading-relaxed">
            This project is open source and contributions are welcome. If you've built something cool with React and
            want to share it, feel free to open a pull request on GitHub.
          </p>
        </section>

        {/* Next step */}
        <div className="rounded-md border border-(--border-secondary) bg-(--bg-card) p-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-(--text-primary) uppercase tracking-widest mb-1">Next</p>
          </div>
          <Link to="/get-started/installation">
            <Button text="Installation" icon={<FaArrowRightLong />} />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Introduction;
