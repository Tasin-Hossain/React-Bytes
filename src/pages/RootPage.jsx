import Features from '../components/RootLayout/Features/Features';
import Footer from '../components/RootLayout/Footer/Footer';
import Header from '../components/RootLayout/Header/Header';
import Hero from '../components/RootLayout/Hero/Hero';

const RootPage = () => {
  return (
    <>
      <section>
        <title>React Bytes - Free Animated & Block UI Components For React</title>
        <Header />
        <Hero />
        <Features />
        <Footer />
      </section>
    </>
  );
};

export default RootPage;
