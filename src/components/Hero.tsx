import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, Coffee } from 'lucide-react';

const Hero: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate countdown to November 26, 2025
  useEffect(() => {
    const targetDate = new Date('2025-11-26T00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const viewFullItinerary = () => {
    window.location.href = '/itinerary/complete-ethiopia';
  };

  const scrollToTours = () => {
    const element = document.getElementById('tour-packages');
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
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Organizer */}
        <div className="mb-4 sm:mb-6">
          <div className="inline-flex items-center space-x-2 text-cream-200">
            <Coffee className="h-4 w-4" />
            <span className="text-sm font-inter">by Yoya Coffee ☕</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-playfair font-bold mb-6 sm:mb-8 leading-tight">
          Ethiopian Coffee
          <span className="block text-cream-200">Origin Adventure</span>
        </h1>
        
        {/* Trip Dates */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-cream-300" />
            <span className="text-base sm:text-lg lg:text-xl font-inter font-light text-cream-100">
              November 26 – December 6, 2025
            </span>
          </div>
        </div>

        {/* Countdown Timer - Mobile Optimized */}
        <div className="mb-8 sm:mb-12">
          <div className="text-xs sm:text-sm font-inter text-cream-300 mb-3 sm:mb-4 uppercase tracking-wider">
            Adventure begins in
          </div>
          <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-md mx-auto">
            {[
              { value: timeLeft.days, label: 'Days' },
              { value: timeLeft.hours, label: 'Hours' },
              { value: timeLeft.minutes, label: 'Min' },
              { value: timeLeft.seconds, label: 'Sec' }
            ].map((item, index) => (
              <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-xl py-3 sm:py-4 px-2 sm:px-3">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-white mb-1">
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div className="text-xs font-inter text-cream-300 uppercase tracking-wide">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-base sm:text-lg font-inter font-light mb-8 sm:mb-12 max-w-2xl mx-auto text-cream-100 leading-relaxed px-4">
          Journey to the birthplace of coffee. Experience authentic culture, 
          breathtaking landscapes, and unforgettable moments in Ethiopia.
        </p>

        {/* Call to Action Buttons - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
          <button 
            onClick={viewFullItinerary}
            className="group w-full sm:w-auto bg-earth-600 text-white px-6 sm:px-8 py-4 rounded-full font-inter font-medium hover:bg-earth-700 transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-105 shadow-lg min-h-[48px] touch-manipulation"
          >
            <span>View Full Itinerary</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          
          <button 
            onClick={scrollToTours}
            className="group w-full sm:w-auto border-2 border-white/60 text-white px-6 sm:px-8 py-4 rounded-full font-inter font-medium hover:bg-white/10 hover:border-white transition-all duration-300 flex items-center justify-center space-x-3 min-h-[48px] touch-manipulation"
          >
            <span>Explore Tours</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on small screens */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;