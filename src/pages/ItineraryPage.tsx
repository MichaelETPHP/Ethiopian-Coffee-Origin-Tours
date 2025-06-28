import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SampleItinerary from '../components/SampleItinerary';
import { ArrowLeft } from 'lucide-react';

const ItineraryPage: React.FC = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();

  const handleBackToTours = () => {
    navigate('/#tour-packages');
  };

  return (
    <>
      <Header />
      
      {/* Back to Tours Button */}
      <div className="pt-24 pb-8 bg-white border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleBackToTours}
            className="group flex items-center space-x-2 text-coffee-600 hover:text-coffee-800 transition-colors duration-200 font-inter font-medium"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to All Tours</span>
          </button>
        </div>
      </div>

      <SampleItinerary tourId={tourId} />
      <Footer />
    </>
  );
};

export default ItineraryPage;