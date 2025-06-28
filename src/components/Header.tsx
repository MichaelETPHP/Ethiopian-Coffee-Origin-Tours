import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Coffee, Menu, X } from 'lucide-react';
import BookingModal from './BookingModal';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleBookTour = () => {
    setIsBookingModalOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  // Prepare packages data for modal
  const packagesForModal = [
    {
      id: 'southern-ethiopia',
      name: 'Southern Ethiopian Coffee Origin Trip 2025',
      dates: 'November 26 – December 2, 2025',
      price: '$1,850 USD'
    },
    {
      id: 'western-ethiopia',
      name: 'Western Ethiopian Coffee Origin Trip 2025',
      dates: 'December 1 – December 6, 2025',
      price: '$1,650 USD'
    },
    {
      id: 'complete-ethiopia',
      name: 'Complete Ethiopian Coffee Origin Trip 2025',
      dates: 'November 26 – December 6, 2025',
      price: '$2,850 USD'
    }
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={handleLogoClick}>
              <Coffee className={`h-8 w-8 ${isScrolled ? 'text-coffee-600' : 'text-white'} transition-colors duration-300`} />
              <span className={`text-xl font-playfair font-bold ${isScrolled ? 'text-coffee-600' : 'text-white'} transition-colors duration-300`}>
                Ethiopian Coffee Origin Trip
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {[
                { label: 'Home', id: 'hero' },
                { label: 'Tour Packages', id: 'tour-packages' },
                { label: 'Experiences', id: 'experiences' },
                { label: 'About', id: 'about' },
                { label: 'Contact', id: 'contact' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-inter font-medium hover:scale-105 transition-all duration-200 ${
                    isScrolled 
                      ? 'text-coffee-600 hover:text-coffee-800' 
                      : 'text-white hover:text-cream-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button 
                onClick={handleBookTour}
                className="bg-earth-600 text-white px-6 py-2 rounded-full font-inter font-medium hover:bg-earth-700 transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <Coffee className="h-4 w-4" />
                <span>Book a Tour</span>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${
                isScrolled ? 'text-coffee-600 hover:bg-coffee-100' : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-coffee-200 py-4 animate-slide-up">
              <nav className="flex flex-col space-y-4">
                {[
                  { label: 'Home', id: 'hero' },
                  { label: 'Tour Packages', id: 'tour-packages' },
                  { label: 'Experiences', id: 'experiences' },
                  { label: 'About', id: 'about' },
                  { label: 'Contact', id: 'contact' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left px-4 py-2 text-coffee-600 font-inter font-medium hover:bg-coffee-50 rounded-lg transition-colors duration-200"
                  >
                    {item.label}
                  </button>
                ))}
                <button 
                  onClick={handleBookTour}
                  className="mx-4 bg-earth-600 text-white px-6 py-3 rounded-full font-inter font-medium hover:bg-earth-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Coffee className="h-4 w-4" />
                  <span>Book a Tour</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={closeBookingModal}
        selectedPackage=""
        packages={packagesForModal}
      />
    </>
  );
};

export default Header;