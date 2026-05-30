import Features from '../components/RootLayout/Features/Features';
import Footer from '../components/RootLayout/Footer/Footer';
import Header from '../components/RootLayout/Header/Header';
import Hero from '../components/RootLayout/Hero/Hero';
import NeedLaunch from '../components/RootLayout/BuildFast/BuildFast';
import Reviews from '../components/RootLayout/Reviews/Reviews';

const RootPage = () => {
  return (
    <>
      <section>
        <title>React Bytes - Free Animated & Block UI Components For React</title>
        <Header />
        <Hero />
        <Features />
        <NeedLaunch/>
        <Reviews/>
        <Footer />
      </section>
    </>
  );
};

export default RootPage;
