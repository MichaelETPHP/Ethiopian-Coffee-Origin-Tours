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

          {/* Image - Updated with Ethiopian coffee culture image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/4349775/pexels-photo-4349775.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop"
                alt="Ethiopian coffee ceremony and cultural traditions"
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

        {/* Why Ethiopia Section - Updated with real Ethiopian coffee farm image */}
        <div className="mt-16 sm:mt-20">
          <div className="bg-gradient-to-br from-coffee-50 to-cream-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 w-20 h-20 border-2 border-coffee-600 rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-coffee-600 rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 border-2 border-coffee-600 rounded-full"></div>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center space-x-2 bg-coffee-600 text-white px-3 sm:px-4 py-2 rounded-full mb-4">
                  <Heart className="h-4 w-4" />
                  <span className="text-xs sm:text-sm font-inter font-medium">The Origin Story</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-coffee-800 mb-4 sm:mb-6 px-4">
                  Why Ethiopia?
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                {/* Content */}
                <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
                  <p className="text-sm sm:text-base lg:text-lg font-inter text-coffee-700 leading-relaxed">
                    Ethiopia is the <strong className="text-coffee-800">birthplace of Arabica coffee</strong>—the only place on earth where coffee still grows wild in its original forest habitat. This is where it all began.
                  </p>
                  
                  <p className="text-sm sm:text-base lg:text-lg font-inter text-coffee-700 leading-relaxed">
                    Across Ethiopia's diverse regions, heirloom varieties flourish—shaped by altitude, microclimate, and centuries of traditional knowledge. From the floral elegance of <strong className="text-coffee-800">Yirgacheffe</strong> and the berry brightness of <strong className="text-coffee-800">Sidama</strong>, to the winey depth of <strong className="text-coffee-800">Guji</strong> and the bold complexity of <strong className="text-coffee-800">Limu, Kaffa, and Jimma</strong>—Ethiopia offers a sensory experience unmatched anywhere else.
                  </p>

                  <p className="text-sm sm:text-base lg:text-lg font-inter text-coffee-700 leading-relaxed">
                    But visiting origin is about more than just tasting great coffee. It's about <strong className="text-coffee-800">connection</strong>—with the land, the people, and the story behind every bean. It's about understanding coffee not as a commodity, but as a living narrative that begins here—and continues with you.
                  </p>

                  {/* Highlight Features - Mobile Optimized */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
                    <div className="text-center p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                      <div className="text-coffee-600 mb-2 flex justify-center">
                        <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div className="text-xs sm:text-sm font-inter font-semibold text-coffee-800">Wild Origins</div>
                      <div className="text-xs text-coffee-600">Natural forest habitat</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                      <div className="text-coffee-600 mb-2 flex justify-center">
                        <Globe className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div className="text-xs sm:text-sm font-inter font-semibold text-coffee-800">Diverse Terroir</div>
                      <div className="text-xs text-coffee-600">Unique microclimates</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                      <div className="text-coffee-600 mb-2 flex justify-center">
                        <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div className="text-xs sm:text-sm font-inter font-semibold text-coffee-800">Living Culture</div>
                      <div className="text-xs text-coffee-600">Ancient traditions</div>
                    </div>
                  </div>
                </div>

                {/* Image - Updated with real Ethiopian coffee farm */}
                <div className="relative order-1 lg:order-2">
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src="https://images.pexels.com/photos/4021521/pexels-photo-4021521.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                      alt="Ethiopian coffee farm with traditional farming methods"
                      className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-coffee-800/30 to-transparent"></div>
                  </div>
                  
                  {/* Floating Badge - Adjusted for mobile */}
                  <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-cream-200 max-w-xs">
                    <div className="text-center">
                      <div className="text-lg sm:text-2xl font-playfair font-bold text-coffee-800">1000+</div>
                      <div className="text-xs sm:text-sm font-inter text-coffee-600">Years of Heritage</div>
                    </div>
                  </div>
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