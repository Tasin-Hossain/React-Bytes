import Features from '../components/landing/Features/Features';
import Footer from '../components/landing/Footer/Footer';
import Header from '../components/landing/Header/Header';
import Hero from '../components/landing/Hero/Hero';
import NeedLaunch from '../components/landing/BuildFast/BuildFast';
import { useSEO } from '../hooks/useSEO';
// import Reviews from '../components/landing/Reviews/Reviews';

const RootPage = () => {
  useSEO({
    title: 'React Bytes — Free Animated React Components',
    description:
      'React Bytes is a free and open source collection of high quality, animated, interactive & fully customizable React components for building stunning, memorable user interfaces.',
    path: '/'
  });

  return (
    <>
      <section>
        <Header />
        <Hero />
        <NeedLaunch />
        <Features />
        {/* <Reviews /> */}
        <Footer />
      </section>
    </>
  );
};

export default RootPage;
