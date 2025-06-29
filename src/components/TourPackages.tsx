import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, Coffee, Clock, Star } from 'lucide-react';
import BookingModal from './BookingModal';

interface TourPackage {
  id: string;
  name: string;
  dates: string;
  duration: string;
  regions: string[];
  price: string;
  description: string;
  image: string;
  highlights: string[];
  groupSize: string;
  difficulty: string;
}

const tourPackages: TourPackage[] = [
  {
    id: 'complete-ethiopia',
    name: 'Complete Ethiopian Coffee Origin Trip 2025',
    dates: 'November 26 – December 6, 2025',
    duration: '11 Days',
    regions: ['Sidama', 'Yirgacheffe', 'Guji', 'Jimma', 'Kaffa', 'Bebeka'],
    price: '$2,850',
    description: 'The ultimate Ethiopian coffee experience. Combine both Southern and Western regions for a comprehensive journey through all major coffee-producing areas of Ethiopia.',
    image: 'https://media.istockphoto.com/id/1922227078/photo/farmer-talking-to-tourists-in-a-coffee-plantation.jpg?s=612x612&w=0&k=20&c=H0o0PqoMp8H5ROw7_VtrURwYoSEpfDfKDmcG1iq38is=',
    highlights: ['Complete Experience', 'All Major Regions', 'Comprehensive Journey'],
    groupSize: '10-18 People',
    difficulty: 'Comprehensive'
  },
  {
    id: 'southern-ethiopia',
    name: 'Southern Ethiopian Coffee Origin Trip 2025',
    dates: 'November 26 – December 2, 2025',
    duration: '7 Days',
    regions: ['Sidama', 'Yirgacheffe', 'Guji'],
    price: '$1,850',
    description: 'Explore the legendary coffee regions of Southern Ethiopia. Visit Sidama cooperatives, experience Yirgacheffe\'s floral profiles, and discover Guji\'s innovative processing techniques.',
    image: 'https://media.istockphoto.com/id/1487292164/photo/mature-woman-drinking-coffee-on-agricultural-field.jpg?s=612x612&w=0&k=20&c=a-mO8R03_WamsxEWRP8ZMMcc8C53N1VEEu_iNxnIpwA=',
    highlights: ['Sidama Cooperatives', 'Yirgacheffe Terroir', 'Guji Innovation'],
    groupSize: '8-15 People',
    difficulty: 'Moderate'
  },
  {
    id: 'western-ethiopia',
    name: 'Western Ethiopian Coffee Origin Trip 2025',
    dates: 'December 1 – December 6, 2025',
    duration: '6 Days',
    regions: ['Jimma', 'Kaffa', 'Bebeka'],
    price: '$1,650',
    description: 'Journey to the birthplace of coffee in Western Ethiopia. Explore wild coffee forests in Kaffa, visit historical Jimma, and experience large-scale production at Bebeka Estate.',
    image: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0f/e4/16/96.jpg',
    highlights: ['Coffee Birthplace', 'Wild Forests', 'Historical Sites'],
    groupSize: '8-12 People',
    difficulty: 'Adventurous'
  }
];

const TourPackages: React.FC = () => {
  const navigate = useNavigate();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState<string>('');

  const handleReadMore = (tourId: string) => {
    navigate(`/itinerary/${tourId}`);
  };

  const handleBookTour = (tourId: string) => {
    setSelectedPackageForBooking(tourId);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedPackageForBooking('');
  };

  // Prepare packages data for modal
  const packagesForModal = tourPackages.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    dates: pkg.dates,
    price: pkg.price
  }));

  return (
    <section id="tour-packages" className="py-16 sm:py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 bg-coffee-100 px-3 sm:px-4 py-2 rounded-full mb-4">
            <Coffee className="h-4 w-4 text-coffee-600" />
            <span className="text-xs sm:text-sm font-inter font-medium text-coffee-600">2025 Origin Trips by Yoya Coffee ☕</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-coffee-800 mb-4 px-4">
            Ethiopian Coffee Origin Tours
          </h2>
          <p className="text-base sm:text-lg font-inter text-coffee-600 max-w-3xl mx-auto px-4">
            Choose your perfect Ethiopian coffee adventure. From focused regional explorations to comprehensive 
            country-wide journeys, discover the birthplace of coffee with expert guides and authentic experiences.
          </p>
        </div>

        {/* Tour Packages Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {tourPackages.map((tour, index) => (
            <div
              key={tour.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-cream-200 hover:border-coffee-300 hover:-translate-y-2 flex flex-col h-full"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Featured Image */}
              <div className="relative overflow-hidden h-64 sm:h-72 md:h-80">
                <img
                  src={tour.image}
                  alt={tour.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                
                {/* Image Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Price Badge - Top Right */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-coffee-800 px-3 sm:px-4 py-2 rounded-full shadow-lg">
                  <div className="text-base sm:text-lg font-playfair font-bold">{tour.price}</div>
                  <div className="text-xs font-inter text-coffee-600 text-center">per person</div>
                </div>

                {/* Duration Badge - Top Left */}
                <div className="absolute top-4 left-4 bg-coffee-600 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-inter font-medium shadow-lg">
                  {tour.duration}
                </div>

                {/* Difficulty Badge - Bottom Left */}
                <div className="absolute bottom-4 left-4 bg-earth-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-inter font-medium shadow-lg">
                  {tour.difficulty}
                </div>

                {/* Organizer Badge - Bottom Right */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-coffee-700 px-3 py-1.5 rounded-full text-xs font-inter font-medium shadow-lg flex items-center space-x-1">
                  <Coffee className="h-3 w-3" />
                  <span>Yoya Coffee ☕</span>
                </div>
              </div>

              {/* Content - Flex grow to push button to bottom */}
              <div className="flex flex-col flex-grow">
                <div className="p-4 sm:p-6 flex-grow">
                  {/* Tour Name */}
                  <h3 className="text-lg sm:text-xl font-playfair font-bold text-coffee-800 mb-3 group-hover:text-coffee-600 transition-colors duration-300 line-clamp-2 leading-tight">
                    {tour.name}
                  </h3>

                  {/* Dates */}
                  <div className="flex items-start space-x-2 mb-4">
                    <Calendar className="h-4 w-4 text-coffee-500 flex-shrink-0 mt-0.5" />
                    <span className="text-coffee-600 font-inter font-medium text-sm leading-tight">{tour.dates}</span>
                  </div>

                  {/* Read More Link */}
                  <div className="mb-4">
                    <button 
                      onClick={() => handleReadMore(tour.id)}
                      className="group/link text-coffee-600 hover:text-coffee-800 font-inter text-sm font-medium transition-all duration-200 flex items-center space-x-1 hover:space-x-2 min-h-[44px] touch-manipulation"
                    >
                      <span className="border-b border-coffee-300 hover:border-coffee-600 transition-colors duration-200">
                        Read Full Itinerary
                      </span>
                      <ArrowRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-coffee-600 font-inter mb-4 leading-relaxed text-sm sm:text-base line-clamp-3">
                    {tour.description}
                  </p>

                  {/* Regions */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-coffee-500 flex-shrink-0" />
                      <span className="text-sm font-inter font-medium text-coffee-700">Regions Visited:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {tour.regions.map((region, regionIndex) => (
                        <span
                          key={regionIndex}
                          className="bg-cream-100 text-coffee-700 px-2 py-1 rounded-full text-xs font-inter"
                        >
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="h-4 w-4 text-coffee-500 flex-shrink-0" />
                      <span className="text-sm font-inter font-medium text-coffee-700">Key Highlights:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {tour.highlights.map((highlight, hlIndex) => (
                        <span
                          key={hlIndex}
                          className="bg-earth-100 text-earth-700 px-2 py-1 rounded-full text-xs font-inter"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center justify-between text-sm text-coffee-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{tour.groupSize}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{tour.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Separator Line */}
                <div className="mx-4 sm:mx-6 border-t border-cream-200"></div>

                {/* Book a Tour Button - Fixed at bottom with consistent spacing */}
                <div className="p-4 sm:p-6">
                  <button 
                    onClick={() => handleBookTour(tour.id)}
                    className="group/btn w-full bg-gradient-to-r from-earth-600 to-earth-700 text-white py-4 px-6 rounded-xl font-inter font-semibold hover:from-earth-700 hover:to-earth-800 transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-105 shadow-lg hover:shadow-xl transform min-h-[48px] touch-manipulation"
                  >
                    <Coffee className="h-5 w-5 group-hover/btn:rotate-12 transition-transform duration-300 flex-shrink-0" />
                    <span>Book This Adventure</span>
                    <div className="bg-white/20 rounded-full p-1 flex-shrink-0">
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Our Tours - Mobile Optimized */}
        <div className="bg-gradient-to-br from-coffee-50 to-cream-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold text-coffee-800 mb-4">
              Why Choose Yoya Coffee ☕ Ethiopian Tours?
            </h3>
            <p className="text-coffee-600 font-inter max-w-2xl mx-auto text-sm sm:text-base px-4">
              Experience authentic Ethiopian coffee culture with expert guides, exclusive access to top producers, 
              and immersive experiences you won't find anywhere else.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: <Coffee className="h-5 w-5 sm:h-6 sm:w-6" />,
                title: "Expert Guides",
                description: "Local coffee experts and cultural specialists"
              },
              {
                icon: <Users className="h-5 w-5 sm:h-6 sm:w-6" />,
                title: "Small Groups",
                description: "Intimate experiences with 8-18 participants"
              },
              {
                icon: <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />,
                title: "Exclusive Access",
                description: "Private visits to top cooperatives and farms"
              },
              {
                icon: <Star className="h-5 w-5 sm:h-6 sm:w-6" />,
                title: "Authentic Experiences",
                description: "Traditional ceremonies and cultural immersion"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white/80 transition-all duration-300">
                <div className="text-coffee-600 mb-3 flex justify-center">
                  {feature.icon}
                </div>
                <h4 className="font-playfair font-semibold text-coffee-800 mb-2 text-sm sm:text-base">{feature.title}</h4>
                <p className="text-xs sm:text-sm font-inter text-coffee-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action - Mobile Optimized */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="bg-gradient-to-r from-coffee-600 to-earth-600 rounded-2xl p-6 sm:p-8 text-white">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold mb-4">
              Ready to Discover Coffee's Birthplace?
            </h3>
            <p className="text-coffee-100 font-inter mb-6 max-w-2xl mx-auto text-sm sm:text-base px-4">
              Join Yoya Coffee ☕ for an unforgettable journey to Ethiopia, where coffee began. Experience ancient traditions, 
              meet passionate producers, and taste exceptional coffees at their source.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => handleReadMore('complete-ethiopia')}
                className="w-full sm:w-auto bg-white text-coffee-600 px-6 sm:px-8 py-4 rounded-full font-inter font-medium hover:bg-cream-100 transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2 min-h-[48px] touch-manipulation"
              >
                <span>View Detailed Itinerary</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleBookTour('')}
                className="w-full sm:w-auto border-2 border-white text-white px-6 sm:px-8 py-4 rounded-full font-inter font-medium hover:bg-white/10 hover:border-white transition-all duration-200 flex items-center justify-center space-x-2 min-h-[48px] touch-manipulation"
              >
                <Calendar className="h-5 w-5" />
                <span>Contact Yoya Coffee ☕</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={closeBookingModal}
        selectedPackage={selectedPackageForBooking}
        packages={packagesForModal}
      />
    </section>
  );
};

export default TourPackages;