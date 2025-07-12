import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Coffee,
  ArrowLeft,
  Home,
  Search,
  MapPin,
  Users,
  Calendar,
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  const popularPages = [
    { name: 'Home', path: '/', icon: <Home className='h-4 w-4' /> },
    {
      name: 'Tour Packages',
      path: '/#tour-packages',
      icon: <Coffee className='h-4 w-4' />,
    },
    {
      name: 'Book a Tour',
      path: '/booking',
      icon: <Calendar className='h-4 w-4' />,
    },
    { name: 'About Us', path: '/#about', icon: <Users className='h-4 w-4' /> },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-cream-50 via-coffee-50 to-earth-50'>
      <Header />

      {/* Main 404 Content */}
      <div className='py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto text-center'>
          {/* 404 Number */}
          <div className='mb-8'>
            <div className='relative inline-block'>
              <div className='text-8xl sm:text-9xl lg:text-[12rem] font-playfair font-bold bg-gradient-to-r from-coffee-600 via-earth-600 to-coffee-800 bg-clip-text text-transparent animate-pulse'>
                404
              </div>
              <div className='absolute -top-4 -right-4 animate-bounce'>
                <Coffee className='h-12 w-12 text-coffee-600' />
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className='mb-8'>
            <h1 className='text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-coffee-800 mb-4'>
              Oops! This Page Got Lost in the Coffee Fields
            </h1>
            <p className='text-lg sm:text-xl text-coffee-600 font-inter max-w-2xl mx-auto leading-relaxed'>
              It seems this page wandered off into the Ethiopian highlands.
              Don't worry, let's get you back to exploring amazing coffee
              adventures!
            </p>
          </div>

          {/* Popular Pages */}
          <div className='mb-12'>
            <h3 className='text-xl font-playfair font-semibold text-coffee-800 mb-6'>
              Popular Destinations
            </h3>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto'>
              {popularPages.map((page, index) => (
                <Link
                  key={page.name}
                  to={page.path}
                  className='group bg-white/80 backdrop-blur-sm border border-coffee-200 rounded-xl p-4 hover:bg-white hover:border-coffee-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'
                >
                  <div className='text-coffee-600 group-hover:text-coffee-700 mb-2 flex justify-center'>
                    {page.icon}
                  </div>
                  <p className='text-sm font-inter font-medium text-coffee-800 group-hover:text-coffee-900'>
                    {page.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-12'>
            <Link
              to='/'
              className='group bg-gradient-to-r from-coffee-600 to-earth-600 text-white px-8 py-4 rounded-full font-inter font-semibold hover:from-coffee-700 hover:to-earth-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2'
            >
              <Home className='h-5 w-5 group-hover:rotate-12 transition-transform duration-300' />
              <span>Back to Home</span>
            </Link>

            <button
              onClick={() => navigate(-1)}
              className='group bg-white text-coffee-700 border-2 border-coffee-300 px-8 py-4 rounded-full font-inter font-semibold hover:border-coffee-500 hover:text-coffee-800 transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2'
            >
              <ArrowLeft className='h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300' />
              <span>Go Back</span>
            </button>
          </div>

          {/* Fun Coffee Fact */}
          <div className='p-6 bg-gradient-to-r from-coffee-100 to-cream-100 rounded-2xl border border-coffee-200 max-w-2xl mx-auto'>
            <div className='flex items-center justify-center space-x-3 mb-3'>
              <MapPin className='h-6 w-6 text-coffee-600' />
              <h3 className='text-lg font-playfair font-semibold text-coffee-800'>
                Coffee Discovery
              </h3>
            </div>
            <p className='text-coffee-700 font-inter text-sm leading-relaxed'>
              Did you know? Ethiopia is the birthplace of coffee, discovered by
              a goat herder named Kaldi in the 9th century. While you're here,
              why not explore our authentic coffee origin tours?
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default NotFoundPage
