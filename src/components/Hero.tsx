import React from 'react';
import { ArrowRight, Play, MapPin, Calendar } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToItinerary = () => {
    const element = document.getElementById('itinerary');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToExperiences = () => {
    const element = document.getElementById('experiences');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://www.aregashlodge.com/index_files/image9111.jpg"
          alt="Breathtaking Ethiopian landscape with mountains and traditional architecture"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Soft overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6 animate-fade-in">
          <MapPin className="h-4 w-4 text-cream-200" />
          <span className="text-sm font-inter font-medium text-cream-200">Ethiopia Adventure</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-playfair font-bold mb-6 animate-fade-in">
          Discover Ethiopia:
          <span className="block text-cream-200 animate-slide-up">Your 9-Day Cultural & Nature Adventure</span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-lg sm:text-xl lg:text-2xl font-inter font-light mb-8 max-w-3xl mx-auto animate-slide-up opacity-90 leading-relaxed">
          Experience breathtaking landscapes, vibrant culture, and unforgettable moments in the birthplace of coffee and humanity.
        </p>

        {/* Key Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-10 animate-slide-up">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <Calendar className="h-4 w-4 text-cream-200" />
            <span className="text-sm font-inter text-cream-200">9 Days</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <MapPin className="h-4 w-4 text-cream-200" />
            <span className="text-sm font-inter text-cream-200">6+ Regions</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-sm font-inter text-cream-200">Cultural Immersion</span>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-slide-up">
          <button 
            onClick={scrollToItinerary}
            className="group bg-earth-600 text-white px-8 py-4 rounded-full font-inter font-medium hover:bg-earth-700 transition-all duration-300 flex items-center space-x-2 hover:scale-105 shadow-lg"
          >
            <span>View Full Itinerary</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          
          <button 
            onClick={scrollToExperiences}
            className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-inter font-medium hover:bg-white hover:text-coffee-600 transition-all duration-300 flex items-center space-x-2 hover:scale-105"
          >
            <span>Explore Experiences</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        {/* Watch Story Button */}
        <div className="mt-8 animate-slide-up">
          <button className="group flex items-center space-x-3 text-white hover:text-cream-200 transition-colors duration-200 mx-auto">
            <div className="bg-white/15 backdrop-blur-sm rounded-full p-3 group-hover:bg-white/25 transition-all duration-200 border border-white/20">
              <Play className="h-6 w-6 ml-1" />
            </div>
            <span className="font-inter font-medium">Watch Our Ethiopia Story</span>
          </button>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-white/20 rounded-full animate-pulse hidden lg:block"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 border border-white/20 rounded-full animate-pulse hidden lg:block"></div>
    </section>
  );
};

export default Hero;