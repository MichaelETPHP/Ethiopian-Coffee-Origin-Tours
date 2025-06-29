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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

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
    setIsMobileMenuOpen(false);
  };

  const handleBookTour = () => {
    setIsBookingModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  // Prepare packages data for modal
  const packagesForModal = [
    {
      id: 'complete-ethiopia',
      name: 'Complete Ethiopian Coffee Origin Trip 2025',
      dates: 'November 26 – December 6, 2025',
      price: '$2,850 USD'
    },
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
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* Logo - Mobile Optimized */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={handleLogoClick}>
              <Coffee className={`h-6 w-6 sm:h-8 sm:w-8 ${isScrolled ? 'text-coffee-600' : 'text-white'} transition-colors duration-300`} />
              <span className={`text-sm sm:text-lg lg:text-xl font-playfair font-bold ${isScrolled ? 'text-coffee-600' : 'text-white'} transition-colors duration-300 leading-tight`}>
                <span className="hidden sm:inline">Ethiopian Coffee Origin Trip</span>
                <span className="sm:hidden">Ethiopian Coffee</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
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
                className="bg-earth-600 text-white px-4 xl:px-6 py-2 xl:py-3 rounded-full font-inter font-medium hover:bg-earth-700 transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2 text-sm"
              >
                <Coffee className="h-4 w-4" />
                <span>Book a Tour</span>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation ${
                isScrolled ? 'text-coffee-600 hover:bg-coffee-100' : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Mobile Menu */}
        <div className={`lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-coffee-200">
              <div className="flex items-center space-x-2">
                <Coffee className="h-6 w-6 text-coffee-600" />
                <span className="text-lg font-playfair font-bold text-coffee-600">Ethiopian Coffee</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-coffee-400 hover:text-coffee-600 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
                aria-label="Close mobile menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <nav className="flex-1 py-6">
              <div className="space-y-2 px-4">
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
                    className="w-full text-left px-4 py-4 text-coffee-600 font-inter font-medium hover:bg-coffee-50 rounded-xl transition-colors duration-200 min-h-[48px] touch-manipulation"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              
              {/* Mobile Book Tour Button */}
              <div className="px-4 mt-6">
                <button 
                  onClick={handleBookTour}
                  className="w-full bg-earth-600 text-white px-6 py-4 rounded-xl font-inter font-medium hover:bg-earth-700 transition-colors duration-200 flex items-center justify-center space-x-2 min-h-[48px] touch-manipulation"
                >
                  <Coffee className="h-5 w-5" />
                  <span>Book a Tour</span>
                </button>
              </div>
            </nav>
          </div>
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