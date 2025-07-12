import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Cookie, Shield, Settings, BarChart3 } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const CookiePolicyPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-cream-50'>
      <Header />

      {/* Hero Section */}
      <div className='bg-coffee-800 text-white py-16'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center space-x-3 mb-6'>
            <Link
              to='/'
              className='flex items-center space-x-2 text-cream-200 hover:text-white transition-colors duration-200'
            >
              <ArrowLeft className='h-5 w-5' />
              <span className='font-inter'>Back to Home</span>
            </Link>
          </div>

          <div className='flex items-center space-x-3 mb-8'>
            <Cookie className='h-8 w-8 text-cream-200' />
            <h1 className='text-3xl sm:text-4xl font-playfair font-bold text-cream-100'>
              Cookie Policy
            </h1>
          </div>

          <p className='text-coffee-200 font-inter text-lg leading-relaxed'>
            Learn how Ethiopian Coffee Origin Trip uses cookies to enhance your
            browsing experience.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className='py-16'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='bg-white rounded-lg shadow-lg p-8 sm:p-12'>
            {/* Last Updated */}
            <div className='mb-8 p-4 bg-coffee-50 rounded-lg'>
              <p className='text-coffee-700 font-inter text-sm'>
                <strong>Last Updated:</strong> January 2025
              </p>
            </div>

            {/* Content */}
            <div className='space-y-8 font-inter text-coffee-800 leading-relaxed'>
              {/* What are Cookies */}
              <section>
                <h2 className='text-2xl font-playfair font-semibold text-coffee-900 mb-4'>
                  What Are Cookies?
                </h2>
                <p className='mb-4'>
                  Cookies are small text files that are stored on your device
                  when you visit our website. They help us provide you with a
                  better browsing experience by remembering your preferences and
                  analyzing how you use our site.
                </p>
              </section>

              {/* Types of Cookies */}
              <section>
                <h2 className='text-2xl font-playfair font-semibold text-coffee-900 mb-4'>
                  Types of Cookies We Use
                </h2>

                <div className='space-y-6'>
                  {/* Essential Cookies */}
                  <div className='p-4 border border-coffee-200 rounded-lg'>
                    <div className='flex items-start space-x-3 mb-3'>
                      <Shield className='h-5 w-5 text-coffee-600 mt-0.5 flex-shrink-0' />
                      <div>
                        <h3 className='text-lg font-playfair font-semibold text-coffee-900'>
                          Essential Cookies
                        </h3>
                        <p className='text-coffee-600 font-inter text-sm'>
                          Required for basic site functionality
                        </p>
                      </div>
                    </div>
                    <p className='text-coffee-700 font-inter text-sm'>
                      These cookies are necessary for the website to function
                      properly. They enable basic functions like page
                      navigation, access to secure areas, and form submissions.
                      The website cannot function properly without these
                      cookies.
                    </p>
                  </div>

                  {/* Analytics Cookies */}
                  <div className='p-4 border border-coffee-200 rounded-lg'>
                    <div className='flex items-start space-x-3 mb-3'>
                      <BarChart3 className='h-5 w-5 text-coffee-600 mt-0.5 flex-shrink-0' />
                      <div>
                        <h3 className='text-lg font-playfair font-semibold text-coffee-900'>
                          Analytics Cookies
                        </h3>
                        <p className='text-coffee-600 font-inter text-sm'>
                          Help us improve our website
                        </p>
                      </div>
                    </div>
                    <p className='text-coffee-700 font-inter text-sm'>
                      These cookies help us understand how visitors interact
                      with our website by collecting and reporting information
                      anonymously. This helps us improve our website and provide
                      better user experiences.
                    </p>
                  </div>

                  {/* Preference Cookies */}
                  <div className='p-4 border border-coffee-200 rounded-lg'>
                    <div className='flex items-start space-x-3 mb-3'>
                      <Settings className='h-5 w-5 text-coffee-600 mt-0.5 flex-shrink-0' />
                      <div>
                        <h3 className='text-lg font-playfair font-semibold text-coffee-900'>
                          Preference Cookies
                        </h3>
                        <p className='text-coffee-600 font-inter text-sm'>
                          Remember your choices and preferences
                        </p>
                      </div>
                    </div>
                    <p className='text-coffee-700 font-inter text-sm'>
                      These cookies allow our website to remember choices you
                      make (such as your language preference or the region you
                      are in) and provide enhanced, more personal features.
                    </p>
                  </div>
                </div>
              </section>

              {/* How We Use Cookies */}
              <section>
                <h2 className='text-2xl font-playfair font-semibold text-coffee-900 mb-4'>
                  How We Use Cookies
                </h2>
                <ul className='list-disc list-inside ml-4 space-y-2'>
                  <li>To provide and maintain our website functionality</li>
                  <li>
                    To understand how you use our website and improve user
                    experience
                  </li>
                  <li>To remember your preferences and settings</li>
                  <li>To provide personalized content and recommendations</li>
                  <li>To analyze website traffic and usage patterns</li>
                  <li>To ensure the security and integrity of our website</li>
                </ul>
              </section>

              {/* Third-Party Cookies */}
              <section>
                <h2 className='text-2xl font-playfair font-semibold text-coffee-900 mb-4'>
                  Third-Party Cookies
                </h2>
                <p className='mb-4'>
                  We may use third-party services that place cookies on your
                  device. These services help us:
                </p>
                <ul className='list-disc list-inside ml-4 space-y-2'>
                  <li>Analyze website traffic and user behavior</li>
                  <li>Provide social media integration</li>
                  <li>Enable payment processing</li>
                  <li>Improve website performance and security</li>
                </ul>
              </section>

              {/* Managing Cookies */}
              <section>
                <h2 className='text-2xl font-playfair font-semibold text-coffee-900 mb-4'>
                  Managing Your Cookie Preferences
                </h2>
                <div className='space-y-4'>
                  <p>You can control and manage cookies in several ways:</p>
                  <ul className='list-disc list-inside ml-4 space-y-2'>
                    <li>
                      <strong>Browser Settings:</strong> Most web browsers allow
                      you to control cookies through their settings. You can
                      delete existing cookies and prevent new ones from being
                      set.
                    </li>
                    <li>
                      <strong>Cookie Consent:</strong> When you first visit our
                      website, you can choose to accept or reject non-essential
                      cookies.
                    </li>
                    <li>
                      <strong>Opt-Out:</strong> You can opt out of analytics
                      cookies by rejecting them in our cookie consent popup.
                    </li>
                  </ul>
                  <p className='text-coffee-600 font-inter text-sm'>
                    <strong>Note:</strong> Disabling certain cookies may affect
                    the functionality of our website.
                  </p>
                </div>
              </section>

              {/* Updates to Policy */}
              <section>
                <h2 className='text-2xl font-playfair font-semibold text-coffee-900 mb-4'>
                  Updates to This Policy
                </h2>
                <p className='mb-4'>
                  We may update this Cookie Policy from time to time to reflect
                  changes in our practices or for other operational, legal, or
                  regulatory reasons. We will notify you of any material changes
                  by posting the new policy on this page.
                </p>
              </section>
            </div>

            {/* Contact Information */}
            <div className='mt-12 p-6 bg-coffee-50 rounded-lg'>
              <h3 className='text-xl font-playfair font-semibold text-coffee-900 mb-4'>
                Contact Us
              </h3>
              <p className='text-coffee-700 font-inter mb-4'>
                If you have any questions about our use of cookies, please
                contact us:
              </p>
              <div className='space-y-2 text-coffee-700 font-inter'>
                <p>
                  <strong>Ethiopian Coffee Origin Trip</strong>
                </p>
                <p>Email: info@ethiopiancoffeetrip.com</p>
                <p>Phone: +251 (911) 123-456</p>
                <p>Address: Addis Ababa, Ethiopia</p>
              </div>
            </div>

            {/* Back to Home Button */}
            <div className='mt-12 text-center'>
              <Link
                to='/'
                className='inline-flex items-center space-x-2 bg-coffee-700 text-white px-6 py-3 rounded-full font-inter font-medium hover:bg-coffee-800 transition-all duration-200 hover:scale-105 shadow-lg'
              >
                <ArrowLeft className='h-5 w-5' />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CookiePolicyPage
