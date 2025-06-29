import React from 'react';
import { Heart, Globe, Users, Award } from 'lucide-react';

const stats = [
  { icon: <Globe className="h-5 w-5 sm:h-6 sm:w-6" />, number: '25+', label: 'Countries' },
  { icon: <Users className="h-5 w-5 sm:h-6 sm:w-6" />, number: '10K+', label: 'Happy Travelers' },
  { icon: <Heart className="h-5 w-5 sm:h-6 sm:w-6" />, number: '500+', label: 'Coffee Farms' },
  { icon: <Award className="h-5 w-5 sm:h-6 sm:w-6" />, number: '50+', label: 'Expert Guides' },
];

const About: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-coffee-800 mb-4 sm:mb-6">
                Our Mission
              </h2>
              <p className="text-base sm:text-lg font-inter text-coffee-600 leading-relaxed mb-4 sm:mb-6">
                At The Global Coffee Trail, we believe that coffee is more than just a beverage; it's a gateway to cultural immersion. Our mission is to connect travelers with the rich stories, traditions, and communities behind every cup.
              </p>
              <p className="text-base sm:text-lg font-inter text-coffee-600 leading-relaxed mb-6 sm:mb-8">
                We curate authentic experiences that foster a deeper appreciation for the art and soul of coffee, from the farmers who grow it to the baristas who perfect it.
              </p>
              
              <button className="group bg-earth-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-inter font-medium hover:bg-earth-700 transition-all duration-200 hover:scale-105 shadow-lg min-h-[48px] touch-manipulation">
                <span>Learn More About Us</span>
              </button>
            </div>

            {/* Statistics - Mobile Optimized */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-3 sm:p-4 rounded-xl bg-cream-50 hover:bg-cream-100 transition-colors duration-200"
                >
                  <div className="text-coffee-600 mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-lg sm:text-2xl font-playfair font-bold text-coffee-800 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm font-inter text-coffee-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/4349775/pexels-photo-4349775.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop"
                alt="Coffee farmer working in plantation"
                className="w-full h-64 sm:h-80 lg:h-96 xl:h-[600px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-800/20 to-transparent"></div>
            </div>
            
            {/* Floating Card - Mobile Optimized */}
            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-cream-200 max-w-xs">
              <div className="flex items-center space-x-3">
                <div className="bg-coffee-600 text-white p-2 rounded-full flex-shrink-0">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <div className="font-playfair font-semibold text-coffee-800 text-sm sm:text-base">Sustainable</div>
                  <div className="text-xs sm:text-sm font-inter text-coffee-600">Supporting local communities</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;