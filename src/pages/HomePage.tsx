import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import TourPackages from '../components/TourPackages';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <TourPackages />
      <About />
      <Testimonials />
      <Footer />
    </>
  );
};

export default HomePage;