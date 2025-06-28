import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Coffee, Camera, Utensils, ArrowRight, ChevronDown, ChevronUp, Plane, Clock, Star } from 'lucide-react';
import { getTourPackage } from '../data/tourData';
import type { TourPackage } from '../data/tourData';
import BookingModal from './BookingModal';

interface SampleItineraryProps {
  tourId?: string;
}

const SampleItinerary: React.FC<SampleItineraryProps> = ({ tourId }) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [activeDay, setActiveDay] = useState(1);
  const [tourData, setTourData] = useState<TourPackage | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const data = getTourPackage(tourId);
    setTourData(data);
    setExpandedDay(1);
    setActiveDay(1);
  }, [tourId]);

  const toggleDay = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day);
    setActiveDay(day);
  };

  const scrollToDay = (day: number) => {
    const element = document.getElementById(`day-${day}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveDay(day);
    }
  };

  const handleBookTour = () => {
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  if (!tourData) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600 mx-auto mb-4"></div>
          <p className="text-coffee-600 font-inter">Loading itinerary...</p>
        </div>
      </div>
    );
  }

  // Prepare packages data for modal
  const packagesForModal = [
    {
      id: tourData.id,
      name: tourData.name,
      dates: tourData.dates,
      price: tourData.price
    }
  ];

  return (
    <section id="itinerary" className="py-20 lg:py-32 bg-cream-25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-coffee-100 px-4 py-2 rounded-full mb-4">
            <Calendar className="h-4 w-4 text-coffee-600" />
            <span className="text-sm font-inter font-medium text-coffee-600">2025 Origin Trip</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-coffee-800 mb-4">
            {tourData.name}
          </h2>
          <p className="text-lg font-inter text-coffee-600 max-w-3xl mx-auto mb-8">
            {tourData.description}
          </p>
          
          {/* Trip Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: <Calendar className="h-5 w-5" />, label: "Duration", value: tourData.duration },
              { icon: <Users className="h-5 w-5" />, label: "Group Size", value: tourData.groupSize },
              { icon: <MapPin className="h-5 w-5" />, label: "Regions", value: `${tourData.regions.length} Major` },
              { icon: <Star className="h-5 w-5" />, label: "Price", value: tourData.price }
            ].map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-cream-200">
                <div className="text-coffee-600 mb-2 flex justify-center">
                  {item.icon}
                </div>
                <div className="text-lg font-playfair font-bold text-coffee-800 mb-1">
                  {item.value}
                </div>
                <div className="text-sm font-inter text-coffee-600">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Overview */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-cream-200">
            <h3 className="text-xl font-playfair font-bold text-coffee-800 mb-4">
              Trip Overview
            </h3>
            <p className="text-coffee-600 font-inter leading-relaxed mb-6">
              {tourData.overview}
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-coffee-500" />
                <span className="text-sm font-inter text-coffee-600">
                  <strong>Dates:</strong> {tourData.dates}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-coffee-500" />
                <span className="text-sm font-inter text-coffee-600">
                  <strong>Start/End:</strong> {tourData.startEnd}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-4 w-4 text-coffee-500" />
                <span className="text-sm font-inter text-coffee-600">
                  <strong>Organizer:</strong> {tourData.organizer}
                </span>
              </div>
            </div>
          </div>

          {/* Regions Visited */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-cream-200">
            <h3 className="text-xl font-playfair font-bold text-coffee-800 mb-6">
              Regions Visited
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {tourData.regions.map((region, index) => (
                <div
                  key={index}
                  className="bg-coffee-50 text-coffee-700 px-4 py-3 rounded-xl font-inter font-medium text-center hover:bg-coffee-100 transition-colors duration-200"
                >
                  {region}
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-cream-50 rounded-xl">
              <h4 className="font-playfair font-semibold text-coffee-800 mb-2">What's Included</h4>
              <p className="text-sm text-coffee-600 font-inter">{tourData.includes}</p>
            </div>
          </div>
        </div>

        {/* Day Navigation */}
        <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm rounded-2xl p-4 mb-8 shadow-lg border border-cream-200">
          <div className="flex items-center justify-between">
            <h4 className="font-playfair font-semibold text-coffee-800">Quick Navigation</h4>
            <div className="flex space-x-2 overflow-x-auto">
              {tourData.itinerary.map((day) => (
                <button
                  key={day.day}
                  onClick={() => scrollToDay(day.day)}
                  className={`px-3 py-2 rounded-full text-sm font-inter font-medium transition-all duration-200 whitespace-nowrap ${
                    activeDay === day.day
                      ? 'bg-coffee-600 text-white'
                      : 'bg-cream-100 text-coffee-600 hover:bg-coffee-100'
                  }`}
                >
                  Day {day.day}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Itinerary Days */}
        <div className="space-y-6">
          {tourData.itinerary.map((day, index) => (
            <div
              key={day.day}
              id={`day-${day.day}`}
              className="bg-white rounded-2xl shadow-sm border border-cream-200 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              {/* Day Header */}
              <div 
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-cream-25 transition-colors duration-200"
                onClick={() => toggleDay(day.day)}
              >
                <div className="flex items-center space-x-6">
                  <div className="bg-coffee-600 text-white w-16 h-16 rounded-2xl flex flex-col items-center justify-center">
                    <div className="text-xs font-inter font-medium">DAY</div>
                    <div className="text-xl font-playfair font-bold">{day.day}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-playfair font-bold text-coffee-800">
                        {day.title}
                      </h3>
                      <span className="bg-earth-100 text-earth-700 px-3 py-1 rounded-full text-sm font-inter">
                        {day.date}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-coffee-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-inter">{day.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-inter">{day.activities.length} Activities</span>
                      </div>
                    </div>
                    <p className="text-coffee-600 font-inter mt-2 line-clamp-2">
                      {day.description}
                    </p>
                  </div>
                </div>
                <div className="text-coffee-400">
                  {expandedDay === day.day ? (
                    <ChevronUp className="h-6 w-6" />
                  ) : (
                    <ChevronDown className="h-6 w-6" />
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedDay === day.day && (
                <div className="border-t border-cream-200 bg-cream-25">
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Image */}
                      <div className="relative rounded-xl overflow-hidden">
                        <img
                          src={day.image}
                          alt={day.title}
                          className="w-full h-64 object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-4 left-4 bg-coffee-600 text-white px-3 py-1 rounded-full text-sm font-inter">
                          Day {day.day}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-6">
                        <p className="text-coffee-700 font-inter leading-relaxed">
                          {day.description}
                        </p>

                        {/* Activities */}
                        <div>
                          <h4 className="text-lg font-playfair font-semibold text-coffee-800 mb-3 flex items-center">
                            <Coffee className="h-5 w-5 mr-2" />
                            Daily Activities
                          </h4>
                          <ul className="space-y-2">
                            {day.activities.map((activity, actIndex) => (
                              <li key={actIndex} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-coffee-400 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-coffee-600 font-inter">{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Highlights & Accommodation */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-playfair font-semibold text-coffee-800 mb-2 flex items-center">
                              <Camera className="h-4 w-4 mr-2" />
                              Highlights
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {day.highlights.map((highlight, hlIndex) => (
                                <span
                                  key={hlIndex}
                                  className="bg-earth-100 text-earth-700 px-2 py-1 rounded-full text-xs font-inter"
                                >
                                  {highlight}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-playfair font-semibold text-coffee-800 mb-2 flex items-center">
                              <Utensils className="h-4 w-4 mr-2" />
                              Accommodation
                            </h4>
                            <p className="text-sm text-coffee-600 font-inter">{day.accommodation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Trip Includes */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-cream-200">
          <h3 className="text-2xl font-playfair font-bold text-coffee-800 mb-6 text-center">
            What's Included
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Utensils className="h-5 w-5" />, title: "All Meals", desc: "Traditional Ethiopian cuisine and coffee experiences" },
              { icon: <MapPin className="h-5 w-5" />, title: "Accommodation", desc: "Eco-lodges and guesthouses in coffee regions" },
              { icon: <Plane className="h-5 w-5" />, title: "Transportation", desc: "All domestic flights and ground transport" },
              { icon: <Coffee className="h-5 w-5" />, title: "Coffee Experiences", desc: "Farm visits, processing tours, and cuppings" },
              { icon: <Users className="h-5 w-5" />, title: "Expert Guides", desc: "Local coffee experts and cultural guides" },
              { icon: <Camera className="h-5 w-5" />, title: "Documentation", desc: "Professional photos and sourcing certificates" }
            ].map((item, index) => (
              <div key={index} className="text-center p-4">
                <div className="text-coffee-600 mb-3 flex justify-center">
                  {item.icon}
                </div>
                <h4 className="font-playfair font-semibold text-coffee-800 mb-2">{item.title}</h4>
                <p className="text-sm font-inter text-coffee-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-coffee-600 to-earth-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl lg:text-3xl font-playfair font-bold mb-4">
              Ready to Experience Ethiopian Coffee at Origin?
            </h3>
            <p className="text-coffee-100 font-inter mb-6 max-w-2xl mx-auto">
              Join us for this exclusive journey to the birthplace of coffee. Connect with producers, 
              taste exceptional coffees, and build lasting relationships in Ethiopia's legendary coffee regions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleBookTour}
                className="bg-white text-coffee-600 px-8 py-4 rounded-full font-inter font-medium hover:bg-cream-100 transition-all duration-200 hover:scale-105 flex items-center space-x-2"
              >
                <Coffee className="h-5 w-5" />
                <span>Book This Tour</span>
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-inter font-medium hover:bg-white hover:text-coffee-600 transition-all duration-200 flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>View All 2025 Trips</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={closeBookingModal}
        selectedPackage={tourData.id}
        packages={packagesForModal}
      />
    </section>
  );
};

export default SampleItinerary;