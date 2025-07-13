import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ItineraryPage from './pages/ItineraryPage'
import BookingPage from './pages/BookingPage'
import TermsPage from './pages/TermsPage'
import CookiePolicyPage from './pages/CookiePolicyPage'
import NotFoundPage from './pages/NotFoundPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <div className='min-h-screen bg-cream-50'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/itinerary/:tourId' element={<ItineraryPage />} />
        <Route path='/itinerary' element={<ItineraryPage />} />
        <Route path='/booking' element={<BookingPage />} />
        <Route path='/terms' element={<TermsPage />} />
        <Route path='/cookies' element={<CookiePolicyPage />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
