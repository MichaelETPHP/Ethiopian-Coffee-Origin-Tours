import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
  tour: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Alex Rodriguez',
    location: 'New York, USA',
    rating: 5,
    comment: 'An unforgettable journey into the heart of Ethiopian coffee country. The farm tours were insightful and the landscapes were breathtaking. Our guide was incredibly knowledgeable about the entire coffee process.',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    tour: 'Ethiopian Coffee Origin Trip'
  },
  {
    id: '2',
    name: 'Sarah Lambert',
    location: 'London, UK',
    rating: 5,
    comment: 'The traditional coffee ceremony in Addis Ababa was a spiritual experience. Learning about the cultural significance while tasting the most amazing coffee was truly special. Ethiopia exceeded all expectations.',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    tour: 'Ethiopian Cultural Coffee Tour'
  },
  {
    id: '3',
    name: 'Michael Park',
    location: 'Tokyo, Japan',
    rating: 5,
    comment: 'Visiting the Yirgacheffe region and meeting the producers was incredible. The direct bean selection experience gave me insights I could never get elsewhere. Perfect for coffee professionals.',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    tour: 'Yirgacheffe Producer Visit'
  },
  {
    id: '4',
    name: 'Emma Thompson',
    location: 'Sydney, Australia',
    rating: 5,
    comment: 'The journey to Kaffa region, the birthplace of coffee, was magical. Walking through wild coffee forests and learning about the origin legends was an experience I\'ll never forget.',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    tour: 'Kaffa Origin Discovery'
  },
  {
    id: '5',
    name: 'David Chen',
    location: 'Vancouver, Canada',
    rating: 5,
    comment: 'The Sidama Bensa experience at Gatta Farm was outstanding. The combination of stunning landscapes, exceptional coffee, and warm hospitality made this trip unforgettable.',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    tour: 'Sidama Gatta Farm Experience'
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section className="py-16 sm:py-20 lg:py-32 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-coffee-800 mb-4 px-4">
            What Our Travelers Say
          </h2>
          <p className="text-base sm:text-lg font-inter text-coffee-600 max-w-2xl mx-auto px-4">
            Join thousands of coffee lovers who have discovered the birthplace of coffee through our authentic Ethiopian experiences.
          </p>
        </div>

        {/* Testimonials Carousel - Mobile Optimized */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-xl sm:rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 bg-white p-6 sm:p-8 lg:p-12"
                >
                  <div className="text-center">
                    {/* Quote Icon */}
                    <div className="flex justify-center mb-4 sm:mb-6">
                      <div className="bg-coffee-100 p-2 sm:p-3 rounded-full">
                        <Quote className="h-5 w-5 sm:h-6 sm:w-6 text-coffee-600" />
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center space-x-1 mb-4 sm:mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    {/* Comment */}
                    <blockquote className="text-base sm:text-lg lg:text-xl font-inter text-coffee-700 leading-relaxed mb-6 sm:mb-8 italic px-4">
                      "{testimonial.comment}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                        loading="lazy"
                      />
                      <div className="text-left">
                        <div className="font-playfair font-semibold text-coffee-800 text-sm sm:text-base">
                          {testimonial.name}
                        </div>
                        <div className="text-xs sm:text-sm font-inter text-coffee-600">
                          {testimonial.location}
                        </div>
                        <div className="text-xs font-inter text-coffee-500 mt-1">
                          {testimonial.tour}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons - Mobile Optimized */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-coffee-600 p-2 sm:p-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 hover:scale-110 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-coffee-600 p-2 sm:p-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 hover:scale-110 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Pagination Dots - Mobile Optimized */}
          <div className="flex justify-center space-x-2 mt-6 sm:mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation ${
                  index === currentIndex
                    ? 'bg-coffee-600 scale-125'
                    : 'bg-coffee-300 hover:bg-coffee-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              >
                <span className="sr-only">Testimonial {index + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;