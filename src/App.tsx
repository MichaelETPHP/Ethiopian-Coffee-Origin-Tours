import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ItineraryPage from './pages/ItineraryPage';
import BookingPage from './pages/BookingPage';

function App() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/itinerary/:tourId" element={<ItineraryPage />} />
        <Route path="/itinerary" element={<ItineraryPage />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
    </div>
  );
}

export default App;