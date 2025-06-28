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
    id: 'southern-ethiopia',
    name: 'Southern Ethiopian Coffee Origin Trip 2025',
    dates: 'November 26 – December 1, 2025',
    duration: '7 Days',
    regions: ['Sidama', 'Yirgacheffe', 'Guji'],
    price: '$1,850',
    description: 'Explore the legendary coffee regions of Southern Ethiopia. Visit Sidama cooperatives, experience Yirgacheffe\'s floral profiles, and discover Guji\'s innovative processing techniques.',
    image: 'https://images.pexels.com/photos/4021521/pexels-photo-4021521.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
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
    image: 'https://images.pexels.com/photos/4349775/pexels-photo-4349775.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    highlights: ['Coffee Birthplace', 'Wild Forests', 'Historical Sites'],
    groupSize: '8-12 People',
    difficulty: 'Adventurous'
  },
  {
    id: 'complete-ethiopia',
    name: 'Complete Ethiopian Coffee Origin Trip 2025',
    dates: 'November 26 – December 6, 2025',
    duration: '11 Days',
    regions: ['Sidama', 'Yirgacheffe', 'Guji', 'Jimma', 'Kaffa', 'Bebeka'],
    price: '$2,850',
    description: 'The ultimate Ethiopian coffee experience. Combine both Southern and Western regions for a comprehensive journey through all major coffee-producing areas of Ethiopia.',
    image: 'https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    highlights: ['Complete Experience', 'All Major Regions', 'Comprehensive Journey'],
    groupSize: '10-18 People',
    difficulty: 'Comprehensive'
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
    <section id="tour-packages" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-coffee-100 px-4 py-2 rounded-full mb-4">
            <Coffee className="h-4 w-4 text-coffee-600" />
            <span className="text-sm font-inter font-medium text-coffee-600">2025 Origin Trips by Yoya Coffee ☕</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-coffee-800 mb-4">
            Ethiopian Coffee Origin Tours
          </h2>
          <p className="text-lg font-inter text-coffee-600 max-w-3xl mx-auto">
            Choose your perfect Ethiopian coffee adventure. From focused regional explorations to comprehensive 
            country-wide journeys, discover the birthplace of coffee with expert guides and authentic experiences.
          </p>
        </div>

        {/* Tour Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {tourPackages.map((tour, index) => (
            <div
              key={tour.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-cream-200 hover:border-coffee-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-coffee-800 px-4 py-2 rounded-full shadow-lg">
                  <div className="text-lg font-playfair font-bold">{tour.price}</div>
                  <div className="text-xs font-inter text-coffee-600">per person</div>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-4 left-4 bg-coffee-600 text-white px-3 py-1 rounded-full text-sm font-inter font-medium">
                  {tour.duration}
                </div>

                {/* Difficulty Badge */}
                <div className="absolute bottom-4 left-4 bg-earth-600 text-white px-3 py-1 rounded-full text-sm font-inter font-medium">
                  {tour.difficulty}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Tour Name */}
                <h3 className="text-xl font-playfair font-bold text-coffee-800 mb-3 group-hover:text-coffee-600 transition-colors duration-300 line-clamp-2">
                  {tour.name}
                </h3>

                {/* Organizer */}
                <div className="flex items-center space-x-2 mb-3">
                  <Coffee className="h-4 w-4 text-coffee-500" />
                  <span className="text-coffee-600 font-inter text-sm">Organized by <strong>Yoya Coffee ☕</strong></span>
                </div>

                {/* Dates */}
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="h-4 w-4 text-coffee-500" />
                  <span className="text-coffee-600 font-inter font-medium">{tour.dates}</span>
                </div>

                {/* Description */}
                <p className="text-coffee-600 font-inter mb-4 leading-relaxed line-clamp-3">
                  {tour.description}
                </p>

                {/* Regions */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-coffee-500" />
                    <span className="text-sm font-inter font-medium text-coffee-700">Regions Visited:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
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
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="h-4 w-4 text-coffee-500" />
                    <span className="text-sm font-inter font-medium text-coffee-700">Key Highlights:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
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
                <div className="flex items-center justify-between text-sm text-coffee-500 mb-6">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{tour.groupSize}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{tour.duration}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button 
                    onClick={() => handleReadMore(tour.id)}
                    className="group/btn w-full bg-coffee-600 text-white py-3 px-4 rounded-xl font-inter font-medium hover:bg-coffee-700 transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 shadow-lg"
                  >
                    <span>Read More</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </button>
                  
                  <button 
                    onClick={() => handleBookTour(tour.id)}
                    className="group/btn w-full bg-earth-600 text-white py-3 px-4 rounded-xl font-inter font-medium hover:bg-earth-700 transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 shadow-lg"
                  >
                    <Coffee className="h-4 w-4" />
                    <span>Book a Tour</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Our Tours */}
        <div className="bg-gradient-to-br from-coffee-50 to-cream-100 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-playfair font-bold text-coffee-800 mb-4">
              Why Choose Yoya Coffee ☕ Ethiopian Tours?
            </h3>
            <p className="text-coffee-600 font-inter max-w-2xl mx-auto">
              Experience authentic Ethiopian coffee culture with expert guides, exclusive access to top producers, 
              and immersive experiences you won't find anywhere else.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Coffee className="h-6 w-6" />,
                title: "Expert Guides",
                description: "Local coffee experts and cultural specialists"
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Small Groups",
                description: "Intimate experiences with 8-18 participants"
              },
              {
                icon: <MapPin className="h-6 w-6" />,
                title: "Exclusive Access",
                description: "Private visits to top cooperatives and farms"
              },
              {
                icon: <Star className="h-6 w-6" />,
                title: "Authentic Experiences",
                description: "Traditional ceremonies and cultural immersion"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white/80 transition-all duration-300">
                <div className="text-coffee-600 mb-3 flex justify-center">
                  {feature.icon}
                </div>
                <h4 className="font-playfair font-semibold text-coffee-800 mb-2">{feature.title}</h4>
                <p className="text-sm font-inter text-coffee-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-coffee-600 to-earth-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl lg:text-3xl font-playfair font-bold mb-4">
              Ready to Discover Coffee's Birthplace?
            </h3>
            <p className="text-coffee-100 font-inter mb-6 max-w-2xl mx-auto">
              Join Yoya Coffee ☕ for an unforgettable journey to Ethiopia, where coffee began. Experience ancient traditions, 
              meet passionate producers, and taste exceptional coffees at their source.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => handleReadMore('southern-ethiopia')}
                className="bg-white text-coffee-600 px-8 py-4 rounded-full font-inter font-medium hover:bg-cream-100 transition-all duration-200 hover:scale-105 flex items-center space-x-2"
              >
                <span>View Detailed Itinerary</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleBookTour('')}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-inter font-medium hover:bg-white hover:text-coffee-600 transition-all duration-200 flex items-center space-x-2"
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