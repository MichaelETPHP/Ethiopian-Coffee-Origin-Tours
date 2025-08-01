import React, { useState } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import TourPackages from '../components/TourPackages'
import About from '../components/About'
// import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'
import CookiesPopup from '../components/CookiesPopup'

const HomePage: React.FC = () => {
  const [, setCookiesAccepted] = useState<boolean | null>(null)

  const handleAcceptCookies = () => {
    setCookiesAccepted(true)
    // Here you can add any analytics or tracking code
    console.log('Cookies accepted')
  }

  const handleRejectCookies = () => {
    setCookiesAccepted(false)
    // Here you can disable any analytics or tracking code
    console.log('Cookies rejected')
  }

  return (
    <>
      <Header />
      <Hero />
      <TourPackages />
      <About />
      {/* <Testimonials /> */}
      <Footer />
      <CookiesPopup
        onAccept={handleAcceptCookies}
        onReject={handleRejectCookies}
      />
    </>
  )
}

export default HomePage
