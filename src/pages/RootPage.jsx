import Features from '../components/landing/Features/Features';
import Footer from '../components/landing/Footer/Footer';
import Header from '../components/landing/Header/Header';
import Hero from '../components/landing/Hero/Hero';
import NeedLaunch from '../components/landing/BuildFast/BuildFast';
import CTA from '../components/landing/CTA/CTA';
import Sponsors from '../components/landing/Sponsors/Sponsors';
// import Reviews from '../components/landing/Reviews/Reviews';

const RootPage = () => {

  return (
    <>
      <section>
        <Header />
        <Hero />
        <NeedLaunch />
        <Features />
        {/* <Reviews /> */}
        <Sponsors/>
        <CTA/>
        <Footer />
      </section>
    </>
  );
};

export default RootPage;
