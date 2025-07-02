import React from 'react';
import { MapPin, Users, Coffee, ArrowRight, Leaf, Mountain, Heart } from 'lucide-react';

interface Experience {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  duration: string;
  groupSize: string;
}

const experiences: Experience[] = [
  {
    id: 'farm-to-cup',
    title: 'Farm-to-Cup Tours',
    description: 'Journey to the source. Walk through lush coffee farms, meet the growers, and participate in the harvest. Understand the meticulous process from bean to your cup.',
    image: 'https://images.pexels.com/photos/4021521/pexels-photo-4021521.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    icon: <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />,
    duration: '3-5 days',
    groupSize: '8-12 people'
  },
  {
    id: 'urban-cafe-walks',
    title: 'Urban Café Walks',
    description: 'Explore the vibrant coffee scene of the world\'s most iconic cities. Discover hidden gems, traditional coffee houses, and third-wave specialty cafes.',
    image: 'https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    icon: <Users className="h-5 w-5 sm:h-6 sm:w-6" />,
    duration: '1 day',
    groupSize: '6-10 people'
  },
  {
    id: 'barista-workshops',
    title: 'Hands-On Barista Workshops',
    description: 'Unlock the secrets of a perfect brew. Learn from expert baristas in our hands-on workshops, from espresso extraction to the art of latte foam.',
    image: 'https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    icon: <Coffee className="h-5 w-5 sm:h-6 sm:w-6" />,
    duration: '4 hours',
    groupSize: '4-8 people'
  }
];

const FeaturedExperiences: React.FC = () => {
  return (
    <section id="experiences" className="py-16 sm:py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-coffee-800 mb-4 px-4">
            Coffee Experiences
          </h2>
          <p className="text-base sm:text-lg font-inter text-coffee-600 max-w-2xl mx-auto px-4">
            Choose your perfect coffee adventure and dive deep into the culture, craft, and community behind every cup.
          </p>
        </div>

        {/* Why Ethiopia Section - Mobile Optimized */}
        <div className="mb-16 sm:mb-20">
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
                  <Leaf className="h-4 w-4" />
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
                        <Leaf className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div className="text-xs sm:text-sm font-inter font-semibold text-coffee-800">Wild Origins</div>
                      <div className="text-xs text-coffee-600">Natural forest habitat</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                      <div className="text-coffee-600 mb-2 flex justify-center">
                        <Mountain className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div className="text-xs sm:text-sm font-inter font-semibold text-coffee-800">Diverse Terroir</div>
                      <div className="text-xs text-coffee-600">Unique microclimates</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                      <div className="text-coffee-600 mb-2 flex justify-center">
                        <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div className="text-xs sm:text-sm font-inter font-semibold text-coffee-800">Living Culture</div>
                      <div className="text-xs text-coffee-600">Ancient traditions</div>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="relative order-1 lg:order-2">
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src="https://images.pexels.com/photos/4349775/pexels-photo-4349775.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                      alt="Ethiopian coffee farmer in traditional coffee forest"
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

        {/* Experiences Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {experiences.map((experience, index) => (
            <div
              key={experience.id}
              className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={experience.image}
                  alt={experience.title}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-coffee-600 text-white p-2 rounded-full">
                  {experience.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-playfair font-semibold text-coffee-800 mb-3 group-hover:text-coffee-600 transition-colors duration-200">
                  {experience.title}
                </h3>
                <p className="text-coffee-600 font-inter mb-4 leading-relaxed text-sm sm:text-base">
                  {experience.description}
                </p>

                {/* Details */}
                <div className="flex items-center justify-between text-xs sm:text-sm text-coffee-500 mb-4">
                  <span className="bg-cream-100 px-2 sm:px-3 py-1 rounded-full">{experience.duration}</span>
                  <span className="bg-cream-100 px-2 sm:px-3 py-1 rounded-full">{experience.groupSize}</span>
                </div>

                {/* CTA Button */}
                <button className="group/btn w-full bg-coffee-600 text-white py-3 px-4 rounded-xl font-inter font-medium hover:bg-coffee-700 transition-all duration-200 flex items-center justify-center space-x-2 min-h-[48px] touch-manipulation">
                  <span>Learn More</span>
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedExperiences;