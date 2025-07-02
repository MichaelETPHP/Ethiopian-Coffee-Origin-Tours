import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import {
  ArrowLeft,
  Coffee,
  Calendar,
  MapPin,
  Users,
  ChevronDown,
  ChevronUp,
  Clock,
  Star,
  Utensils,
  Camera,
  Plane,
  ExternalLink,
} from 'lucide-react'
import { getTourPackage } from '../data/tourData'
import BookingModal from '../components/BookingModal'

const ItineraryPage: React.FC = () => {
  const { tourId } = useParams()
  const navigate = useNavigate()
  const tourData = getTourPackage(tourId)
  const [expandedDay, setExpandedDay] = useState<number | null>(1)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)

  // Ensure page starts at the very top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleBackToTours = () => {
    navigate('/#tour-packages')
  }

  const toggleDay = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day)
  }

  const handleBookTour = () => {
    setIsBookingModalOpen(true)
  }

  const closeBookingModal = () => {
    setIsBookingModalOpen(false)
  }

  // Prepare packages data for modal
  const packagesForModal = [
    {
      id: tourData.id,
      name: tourData.name,
      dates: tourData.dates,
      price: tourData.price,
    },
  ]

  return (
    <>
      <Header />

      {/* Hero Section with Video Background */}
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
        {/* Background Video */}
        <div className='absolute inset-0 z-0'>
          <video
            autoPlay
            muted
            loop
            playsInline
            className='w-full h-full object-cover'
            onLoadedData={() => setVideoLoaded(true)}
            poster='https://www.thecoffeequest.com/wp-content/uploads/elementor/thumbs/M-26-ql94pfku4z5tuhaev4sdxjqzzyl63znt7h4i91o0g0.jpg'
          >
            <source
              src='https://www.thecoffeequest.com/wp-content/uploads/2024/10/Abore.mp4'
              type='video/mp4'
            />
            {/* Fallback image if video fails to load */}
            <img
              src='https://www.thecoffeequest.com/wp-content/uploads/elementor/thumbs/M-26-ql94pfku4z5tuhaev4sdxjqzzyl63znt7h4i91o0g0.jpg'
              alt='Ethiopian Coffee Origin Trip - Beautiful landscape'
              className='w-full h-full object-cover'
            />
          </video>

          {/* Dark overlay for text readability */}
          <div className='absolute inset-0 bg-black/50 backdrop-blur-[1px]'></div>
        </div>

        {/* Back Button - Positioned over video */}
        <div className='absolute top-20 sm:top-24 left-4 sm:left-6 lg:left-8 z-20'>
          <button
            onClick={handleBackToTours}
            className='group flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-200 font-inter font-medium px-4 py-2 rounded-full border border-white/20 min-h-[48px] touch-manipulation'
          >
            <ArrowLeft className='h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform duration-200' />
            <span className='text-sm sm:text-base'>Back to Tours</span>
          </button>
        </div>

        {/* Hero Content - Centered over video */}
        <div className='relative z-10 text-center text-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
          {/* Main Title */}
          <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-playfair font-bold mb-6 sm:mb-8 leading-tight animate-fade-in'>
            Ethiopian Coffee
            <span className='block text-cream-200'>Origin Adventure</span>
          </h1>

          {/* Subtitle */}
          <div className='mb-8 sm:mb-12 animate-fade-in'>
            <div className='flex items-center justify-center space-x-2 sm:space-x-3 mb-4'>
              <Calendar className='h-4 w-4 sm:h-5 sm:w-5 text-cream-300' />
              <span className='text-lg sm:text-xl lg:text-2xl font-inter font-light text-cream-100'>
                {tourData.dates}
              </span>
            </div>
          </div>

          {/* Trip Details */}
          <div className='mb-8 sm:mb-12 animate-fade-in'>
            <p className='text-base sm:text-lg lg:text-xl font-inter font-light mb-6 max-w-3xl mx-auto text-cream-100 leading-relaxed'>
              Step into the birthplace of Arabica coffee. This immersive journey
              connects you to the people, places, and processes behind
              Ethiopia's world-renowned coffees.
            </p>

            {/* Tour Stats */}
            <div className='flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm sm:text-base'>
              <div className='bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20'>
                <span className='font-semibold'>{tourData.duration}</span>
              </div>

              <div className='bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20'>
                <span className='font-bold text-lg'>{tourData.price}</span>
              </div>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-fade-in'>
            <button
              onClick={handleBookTour}
              className='group w-full sm:w-auto bg-earth-600 text-white px-6 sm:px-8 py-4 rounded-full font-inter font-medium hover:bg-earth-700 transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-105 shadow-lg min-h-[48px] touch-manipulation'
            >
              <Coffee className='h-5 w-5 group-hover:rotate-12 transition-transform duration-300' />
              <span>Book This Adventure</span>
            </button>

            <button
              onClick={() => {
                const element = document.getElementById('trip-overview')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className='group w-full sm:w-auto border-2 border-white/60 text-white px-6 sm:px-8 py-4 rounded-full font-inter font-medium hover:bg-white/10 hover:border-white transition-all duration-300 flex items-center justify-center space-x-3 min-h-[48px] touch-manipulation'
            >
              <span>Explore Details</span>
              <ChevronDown className='h-5 w-5 group-hover:translate-y-1 transition-transform duration-200' />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow hidden sm:block z-10'>
          <div className='w-6 h-10 border-2 border-white/50 rounded-full flex justify-center'>
            <div className='w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse'></div>
          </div>
        </div>
      </section>

      {/* Trip Overview Section */}
      <section id='trip-overview' className='py-16 sm:py-20 lg:py-24 bg-white'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start'>
            {/* Overview Content */}
            <div className='space-y-6 sm:space-y-8'>
              <div>
                <h2 className='text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-coffee-800 mb-6'>
                  Trip Overview
                </h2>
                <p className='text-base sm:text-lg font-inter text-coffee-700 leading-relaxed mb-6'>
                  {tourData.overview}
                </p>
                <p className='text-base sm:text-lg font-inter text-coffee-700 leading-relaxed'>
                  Whether you're a green buyer, trader, roaster, or passionate
                  enthusiast, this trip offers deep learning, direct trade
                  access, and cultural connection at every stop.
                </p>
              </div>

              {/* Trip Details */}
              <div className='space-y-4'>
                <div className='flex items-start space-x-3'>
                  <Calendar className='h-5 w-5 text-coffee-500 flex-shrink-0 mt-0.5' />
                  <div>
                    <span className='font-inter font-semibold text-coffee-800'>
                      Dates:
                    </span>
                    <span className='font-inter text-coffee-600 ml-2'>
                      {tourData.dates}
                    </span>
                  </div>
                </div>
                <div className='flex items-start space-x-3'>
                  <MapPin className='h-5 w-5 text-coffee-500 flex-shrink-0 mt-0.5' />
                  <div>
                    <span className='font-inter font-semibold text-coffee-800'>
                      Start/End Point:
                    </span>
                    <span className='font-inter text-coffee-600 ml-2'>
                      {tourData.startEnd}
                    </span>
                  </div>
                </div>
                <div className='flex items-start space-x-3'>
                  <Users className='h-5 w-5 text-coffee-500 flex-shrink-0 mt-0.5' />
                </div>
              </div>
            </div>

            {/* Regions Visited */}
            <div className='bg-cream-50 rounded-2xl p-6 sm:p-8'>
              <h3 className='text-xl sm:text-2xl font-playfair font-bold text-coffee-800 mb-6'>
                Regions Visited
              </h3>
              <div className='grid grid-cols-2 gap-3 mb-6'>
                {tourData.regions.map((region, index) => (
                  <div
                    key={index}
                    className='bg-white text-coffee-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-inter font-medium text-center hover:bg-coffee-50 transition-colors duration-200 text-sm sm:text-base'
                  >
                    {region}
                  </div>
                ))}
              </div>

              <div className='bg-coffee-100 rounded-xl p-4 sm:p-6'>
                <h4 className='font-playfair font-semibold text-coffee-800 mb-3 text-base sm:text-lg'>
                  What's Included
                </h4>
                <p className='text-sm sm:text-base text-coffee-700 font-inter leading-relaxed'>
                  {tourData.includes}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Itinerary Section */}
      <section className='py-16 sm:py-20 lg:py-24 bg-cream-25'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-8 sm:mb-12'>
            <h2 className='text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-coffee-800 mb-4'>
              Daily Itinerary
            </h2>
            <p className='text-base sm:text-lg font-inter text-coffee-600 max-w-3xl mx-auto'>
              Explore each day of your Ethiopian coffee journey with detailed
              activities and experiences.
            </p>
          </div>

          {/* Interactive Accordion */}
          <div className='space-y-4 sm:space-y-6'>
            {tourData.itinerary.map((day, index) => (
              <div
                key={day.day}
                className='bg-white rounded-xl sm:rounded-2xl shadow-sm border border-cream-200 overflow-hidden hover:shadow-md transition-all duration-300'
              >
                {/* Day Header */}
                <div
                  className='flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-cream-25 transition-colors duration-200 touch-manipulation'
                  onClick={() => toggleDay(day.day)}
                >
                  <div className='flex items-center space-x-3 sm:space-x-6 flex-1 min-w-0'>
                    <div className='bg-coffee-600 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center flex-shrink-0'>
                      <div className='text-xs font-inter font-medium'>DAY</div>
                      <div className='text-lg sm:text-xl font-playfair font-bold'>
                        {day.day}
                      </div>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2'>
                        <h3 className='text-base sm:text-xl font-playfair font-bold text-coffee-800 leading-tight'>
                          {day.title}
                        </h3>
                        <span className='bg-earth-100 text-earth-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-inter self-start'>
                          {day.date}
                        </span>
                      </div>
                      <div className='flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-coffee-600 mb-2'>
                        <div className='flex items-center space-x-1'>
                          <MapPin className='h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0' />
                          <span className='text-xs sm:text-sm font-inter truncate'>
                            {day.location}
                          </span>
                        </div>
                        <div className='flex items-center space-x-1'>
                          <Clock className='h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0' />
                          <span className='text-xs sm:text-sm font-inter'>
                            {day.activities.length} Activities
                          </span>
                        </div>
                      </div>
                      <p className='text-coffee-600 font-inter text-xs sm:text-sm line-clamp-2 leading-relaxed'>
                        {day.description}
                      </p>
                    </div>
                  </div>
                  <div className='text-coffee-400 flex-shrink-0 ml-2'>
                    {expandedDay === day.day ? (
                      <ChevronUp className='h-5 w-5 sm:h-6 sm:w-6' />
                    ) : (
                      <ChevronDown className='h-5 w-5 sm:h-6 sm:w-6' />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedDay === day.day && (
                  <div className='border-t border-cream-200 bg-cream-25 animate-slide-up'>
                    <div className='p-4 sm:p-6'>
                      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8'>
                        {/* Image */}
                        <div className='relative rounded-xl overflow-hidden order-1 lg:order-none'>
                          <img
                            src={day.image}
                            alt={day.title}
                            className='w-full h-48 sm:h-56 lg:h-64 object-cover'
                            loading='lazy'
                          />
                          <div className='absolute top-3 sm:top-4 left-3 sm:left-4 bg-coffee-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-inter'>
                            Day {day.day}
                          </div>
                        </div>

                        {/* Content */}
                        <div className='space-y-4 sm:space-y-6 order-2 lg:order-none'>
                          <p className='text-coffee-700 font-inter leading-relaxed text-sm sm:text-base'>
                            {day.description}
                          </p>

                          {/* Activities */}
                          <div>
                            <h4 className='text-base sm:text-lg font-playfair font-semibold text-coffee-800 mb-3 flex items-center'>
                              <Coffee className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
                              Daily Activities
                            </h4>
                            <ul className='space-y-2'>
                              {day.activities.map((activity, actIndex) => (
                                <li
                                  key={actIndex}
                                  className='flex items-start space-x-3'
                                >
                                  <div className='w-2 h-2 bg-coffee-400 rounded-full mt-2 flex-shrink-0'></div>
                                  <span className='text-coffee-600 font-inter text-xs sm:text-sm leading-relaxed'>
                                    {activity}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Highlights & Accommodation */}
                          <div className='grid grid-cols-1 gap-4'>
                            <div>
                              <h4 className='text-sm font-playfair font-semibold text-coffee-800 mb-2 flex items-center'>
                                <Camera className='h-4 w-4 mr-2' />
                                Highlights
                              </h4>
                              <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                                {day.highlights.map((highlight, hlIndex) => (
                                  <span
                                    key={hlIndex}
                                    className='bg-earth-100 text-earth-700 px-2 py-1 rounded-full text-xs font-inter'
                                  >
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className='text-sm font-playfair font-semibold text-coffee-800 mb-2 flex items-center'>
                                <Utensils className='h-4 w-4 mr-2' />
                                Accommodation
                              </h4>
                              <p className='text-xs sm:text-sm text-coffee-600 font-inter leading-relaxed'>
                                {day.accommodation}
                              </p>
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
        </div>
      </section>

      {/* What's Included Section */}
      <section className='py-16 sm:py-20 lg:py-24 bg-white'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h3 className='text-2xl sm:text-3xl font-playfair font-bold text-coffee-800 mb-8 sm:mb-12 text-center'>
            What's Included
          </h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12'>
            {[
              {
                icon: <Plane className='h-5 w-5 sm:h-6 sm:w-6' />,
                title: 'All Local Travel',
                desc: 'Including flights within Ethiopia',
              },
              {
                icon: <Utensils className='h-5 w-5 sm:h-6 sm:w-6' />,
                title: 'Meals & Drinks',
                desc: 'Traditional Ethiopian cuisine and coffee experiences',
              },
              {
                icon: <MapPin className='h-5 w-5 sm:h-6 sm:w-6' />,
                title: 'Lodging',
                desc: 'Eco-lodges and guesthouses in coffee regions',
              },
              {
                icon: <Camera className='h-5 w-5 sm:h-6 sm:w-6' />,
                title: 'Marketing Support',
                desc: 'Professional content creation to enhance your coffee storytelling',
              },
              {
                icon: <Coffee className='h-5 w-5 sm:h-6 sm:w-6' />,
                title: 'Coffee Experiences',
                desc: 'Farm visits, processing tours, and cuppings',
              },
              {
                icon: <Users className='h-5 w-5 sm:h-6 sm:w-6' />,
                title: 'Expert Guides',
                desc: 'Local coffee experts and cultural guides',
              },
            ].map((item, index) => (
              <div
                key={index}
                className='text-center p-4 sm:p-6 bg-cream-50 rounded-xl hover:bg-cream-100 transition-colors duration-200'
              >
                <div className='text-coffee-600 mb-3 flex justify-center'>
                  {item.icon}
                </div>
                <h4 className='font-playfair font-semibold text-coffee-800 mb-2 text-sm sm:text-base'>
                  {item.title}
                </h4>
                <p className='text-xs sm:text-sm font-inter text-coffee-600 leading-relaxed'>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organize Yourself Section */}
      <section className='py-16 sm:py-20 lg:py-24 bg-cream-50'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h3 className='text-2xl sm:text-3xl font-playfair font-bold text-coffee-800 mb-8 sm:mb-12 text-center'>
            Organize Yourself
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8'>
            {/* International Flight */}
            <div className='bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-cream-200'>
              <div className='flex items-start space-x-3 mb-4'>
                <Plane className='h-6 w-6 text-coffee-600 flex-shrink-0 mt-1' />
                <div>
                  <h4 className='text-lg sm:text-xl font-playfair font-bold text-coffee-800 mb-2'>
                    International Flight
                  </h4>
                  <p className='text-sm sm:text-base font-inter text-coffee-700 leading-relaxed mb-3'>
                    <strong>Arrival on November 26th, latest 14:00</strong>
                  </p>
                  <p className='text-sm sm:text-base font-inter text-coffee-600 leading-relaxed'>
                    Arrivals from Western Europe are typically early morning.
                    Airport transfer will be arranged for all participants.
                  </p>
                </div>
              </div>
            </div>

            {/* E-visa Registration */}
            <div className='bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-cream-200'>
              <div className='flex items-start space-x-3 mb-4'>
                <MapPin className='h-6 w-6 text-coffee-600 flex-shrink-0 mt-1' />
                <div>
                  <h4 className='text-lg sm:text-xl font-playfair font-bold text-coffee-800 mb-2'>
                    E-visa Registration
                  </h4>
                  <div className='space-y-3'>
                    <div className='flex items-center space-x-2'>
                      <span className='text-sm font-inter font-semibold text-coffee-800'>
                        Apply here:
                      </span>
                      <a
                        href='https://www.evisa.gov.et/'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center space-x-1 text-earth-600 hover:text-earth-700 font-inter text-sm font-medium transition-colors duration-200'
                      >
                        <span>evisa.gov.et</span>
                        <ExternalLink className='h-3 w-3' />
                      </a>
                    </div>
                    <div className='text-sm font-inter text-coffee-600'>
                      <p>
                        <strong>Fee:</strong> $62
                      </p>
                      <p>
                        <strong>Processing time:</strong> 3 business days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-8 p-6 bg-coffee-100 rounded-xl'>
            <p className='text-sm sm:text-base font-inter text-coffee-700 text-center leading-relaxed'>
              <strong>Important:</strong> Please ensure your passport is valid
              for at least 6 months from your travel date. We recommend applying
              for your e-visa at least 2 weeks before departure to allow for any
              processing delays.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className='py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-coffee-600 to-earth-600'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white'>
          <h3 className='text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold mb-6'>
            Ready to Experience Ethiopian Coffee at Origin?
          </h3>
          <p className='text-base sm:text-lg font-inter mb-8 opacity-90 leading-relaxed'>
            Join us for this exclusive journey to the birthplace of coffee.
            Connect with producers, taste exceptional coffees, and build lasting
            relationships in Ethiopia's legendary coffee regions.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <button
              onClick={handleBookTour}
              className='w-full sm:w-auto bg-white text-coffee-600 px-6 sm:px-8 py-4 rounded-full font-inter font-medium hover:bg-cream-100 transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2 min-h-[48px] touch-manipulation'
            >
              <Coffee className='h-5 w-5' />
              <span>Book This Adventure</span>
            </button>
            <button
              onClick={handleBackToTours}
              className='w-full sm:w-auto border-2 border-white text-white px-6 sm:px-8 py-4 rounded-full font-inter font-medium hover:bg-white hover:text-coffee-600 transition-all duration-200 flex items-center justify-center space-x-2 min-h-[48px] touch-manipulation'
            >
              <Calendar className='h-5 w-5' />
              <span>View All 2025 Trips</span>
            </button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={closeBookingModal}
        selectedPackage={tourData.id}
        packages={packagesForModal}
      />
    </>
  )
}

export default ItineraryPage
