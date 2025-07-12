import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Coffee, Shield, FileText } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const TermsPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-cream-50'>
      <Header />

      {/* Hero Section */}
      <div className='bg-gradient-to-br from-coffee-800 via-coffee-700 to-coffee-900 text-white py-20'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <div className='flex items-center justify-center space-x-3 mb-6'>
            <Link
              to='/'
              className='flex items-center space-x-2 text-cream-200 hover:text-white transition-colors duration-200'
            >
              <ArrowLeft className='h-5 w-5' />
              <span className='font-inter'>Back to Home</span>
            </Link>
          </div>

          <div className='flex items-center justify-center space-x-4 mb-8'>
            <div className='p-3 bg-white/20 rounded-full backdrop-blur-sm'>
              <FileText className='h-8 w-8 text-cream-200' />
            </div>
            <h1 className='text-4xl sm:text-5xl font-playfair font-bold text-cream-100'>
              Terms & Conditions
            </h1>
          </div>

          <p className='text-coffee-200 font-inter text-lg leading-relaxed max-w-2xl mx-auto'>
            Terms and Conditions for Participation in Activities Hosted by
            Ethiopian Coffee Origin Trip (ECOT)
          </p>

          <div className='mt-8 flex items-center justify-center space-x-6 text-coffee-200'>
            <div className='flex items-center space-x-2'>
              <Shield className='h-5 w-5' />
              <span className='font-inter text-sm'>Legal Protection</span>
            </div>
            <div className='flex items-center space-x-2'>
              <Coffee className='h-5 w-5' />
              <span className='font-inter text-sm'>Tour Guidelines</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className='py-16'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='bg-white rounded-xl shadow-lg p-8'>
            {/* Introduction */}
            <div className='mb-8 p-6 bg-coffee-50 rounded-lg border-l-4 border-coffee-600'>
              <p className='text-coffee-700 font-inter text-base leading-relaxed'>
                By participating in any activities hosted by Ethiopian Coffee
                Origin Trip (ECOT) (hereinafter referred to as "The Company"),
                participants acknowledge and agree to the following terms and
                conditions:
              </p>
            </div>

            {/* Terms Content */}
            <div className='space-y-8 font-inter text-coffee-800 leading-relaxed'>
              {/* Section 1 */}
              <section className='border-b border-coffee-100 pb-6'>
                <h2 className='text-xl font-playfair font-semibold text-coffee-900 mb-4 flex items-center space-x-3'>
                  <span className='bg-coffee-100 text-coffee-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold'>
                    1
                  </span>
                  <span>Voluntary Participation and Assumption of Risk</span>
                </h2>
                <ul className='list-disc list-inside ml-11 space-y-2 text-coffee-700'>
                  <li>
                    Participation in activities hosted by The Company is
                    entirely voluntary.
                  </li>
                  <li>
                    Participants acknowledge and accept all risks associated
                    with the planned activities, including but not limited to
                    travel to and from the activity (including air travel) and
                    any events incidental to the activity.
                  </li>
                </ul>
              </section>

              {/* Section 2 */}
              <section className='border-b border-coffee-100 pb-6'>
                <h2 className='text-xl font-playfair font-semibold text-coffee-900 mb-4 flex items-center space-x-3'>
                  <span className='bg-coffee-100 text-coffee-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold'>
                    2
                  </span>
                  <span>Liability Waiver</span>
                </h2>
                <ul className='list-disc list-inside ml-11 space-y-2 text-coffee-700'>
                  <li>
                    Participants agree to hold The Company harmless from any
                    claims, losses, damages to personal property, liabilities,
                    or costs arising from their participation in the activities.
                  </li>
                  <li>
                    This waiver of liability extends to managers, independent
                    contractors, associates, and affiliates of The Company.
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section className='border-b border-coffee-100 pb-6'>
                <h2 className='text-xl font-playfair font-semibold text-coffee-900 mb-4 flex items-center space-x-3'>
                  <span className='bg-coffee-100 text-coffee-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold'>
                    3
                  </span>
                  <span>Nature of Activities</span>
                </h2>
                <ul className='list-disc list-inside ml-11 space-y-2 text-coffee-700'>
                  <li>
                    Activities may involve physical exertion such as walking or
                    hiking around coffee crops, exposure to heavy machinery, and
                    the presence of wild animals.
                  </li>
                  <li>
                    Participants accept the inherent risks of travel by car,
                    including normal risks associated with travel and
                    exploration.
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className='border-b border-coffee-100 pb-6'>
                <h2 className='text-xl font-playfair font-semibold text-coffee-900 mb-4 flex items-center space-x-3'>
                  <span className='bg-coffee-100 text-coffee-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold'>
                    4
                  </span>
                  <span>Participant Responsibilities</span>
                </h2>
                <p className='mb-4 text-coffee-700'>
                  Participants agree to exercise caution to ensure their safety
                  and the safety of those around them. This includes but is not
                  limited to:
                </p>
                <ul className='list-disc list-inside ml-11 space-y-2 text-coffee-700'>
                  <li>
                    Avoiding walking in public areas with valuables that may
                    increase the risk of theft
                  </li>
                  <li>
                    Wearing a seatbelt at all times while traveling by car
                  </li>
                </ul>
              </section>

              {/* Section 5 */}
              <section className='border-b border-coffee-100 pb-6'>
                <h2 className='text-xl font-playfair font-semibold text-coffee-900 mb-4 flex items-center space-x-3'>
                  <span className='bg-coffee-100 text-coffee-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold'>
                    5
                  </span>
                  <span>Insurance and Medical Facilities</span>
                </h2>
                <ul className='list-disc list-inside ml-11 space-y-2 text-coffee-700'>
                  <li>
                    While Ethiopia offers accessible medical services at fair
                    prices, The Company does not provide any form of insurance
                    coverage.
                  </li>
                  <li>
                    Participants are strongly encouraged to obtain their own
                    travel and international medical insurance prior to
                    participating in the activities.
                  </li>
                </ul>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className='text-xl font-playfair font-semibold text-coffee-900 mb-4 flex items-center space-x-3'>
                  <span className='bg-coffee-100 text-coffee-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold'>
                    6
                  </span>
                  <span>Acknowledgment of Risks and Release of Liability</span>
                </h2>
                <ul className='list-disc list-inside ml-11 space-y-2 text-coffee-700'>
                  <li>
                    By participating in activities hosted by The Company,
                    participants acknowledge the reasonable risks involved,
                    including but not limited to personal injury, property loss,
                    or other incidents.
                  </li>
                  <li>
                    Participants agree to release The Company, its managers,
                    contractors, and associates from all liability, waive the
                    right to sue, and assume all risks associated with their
                    participation.
                  </li>
                </ul>
              </section>
            </div>

            {/* Contact Information */}
            <div className='mt-12 p-6 bg-gradient-to-r from-coffee-50 to-cream-100 rounded-lg border border-coffee-200'>
              <h3 className='text-lg font-playfair font-semibold text-coffee-900 mb-4 flex items-center space-x-2'>
                <Coffee className='h-5 w-5 text-coffee-600' />
                <span>Contact Information</span>
              </h3>
              <div className='space-y-2 text-coffee-700 font-inter'>
                <p>
                  <strong>Ethiopian Coffee Origin Trip (ECOT)</strong>
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
                className='inline-flex items-center space-x-2 bg-coffee-700 text-white px-8 py-4 rounded-full font-inter font-medium hover:bg-coffee-800 transition-all duration-200 hover:scale-105 shadow-lg'
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

export default TermsPage
