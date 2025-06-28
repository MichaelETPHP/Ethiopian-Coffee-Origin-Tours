import React, { useState, useEffect } from 'react';
import { X, Coffee, User, Mail, Phone, Users, Calendar, Check } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: string;
  packages: Array<{ id: string; name: string; dates: string; price: string }>;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  bookingType: 'individual' | 'group';
  numberOfPeople: string;
  selectedPackage: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, selectedPackage, packages }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    bookingType: 'individual',
    numberOfPeople: '1',
    selectedPackage: selectedPackage || ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update selected package when prop changes
  useEffect(() => {
    if (selectedPackage) {
      setFormData(prev => ({ ...prev, selectedPackage }));
    }
  }, [selectedPackage]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          age: '',
          bookingType: 'individual',
          numberOfPeople: '1',
          selectedPackage: selectedPackage || ''
        });
      }, 300);
    }
  }, [isOpen, selectedPackage]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsSubmitting(false);

    // Auto-close modal after 3 seconds
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  const selectedPackageDetails = packages.find(pkg => pkg.id === formData.selectedPackage);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-cream-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-coffee-600 text-white p-2 rounded-full">
                <Coffee className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-playfair font-bold text-coffee-800">
                  Book Your Ethiopian Adventure
                </h2>
                <p className="text-coffee-600 font-inter text-sm">
                  Join Yoya Coffee ☕ for an unforgettable journey
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-coffee-400 hover:text-coffee-600 transition-colors duration-200 p-2 hover:bg-coffee-50 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selected Package Info */}
              {selectedPackageDetails && (
                <div className="bg-coffee-50 border border-coffee-200 rounded-xl p-4 mb-6">
                  <h3 className="font-playfair font-semibold text-coffee-800 mb-2">
                    Selected Package
                  </h3>
                  <div className="text-coffee-700 font-inter">
                    <p className="font-medium">{selectedPackageDetails.name}</p>
                    <p className="text-sm text-coffee-600">{selectedPackageDetails.dates}</p>
                    <p className="text-lg font-bold text-coffee-800 mt-1">{selectedPackageDetails.price}</p>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-playfair font-semibold text-coffee-800 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-inter font-medium text-coffee-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="age" className="block text-sm font-inter font-medium text-coffee-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      min="18"
                      max="100"
                      className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter"
                      placeholder="Your age"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-inter font-medium text-coffee-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-inter font-medium text-coffee-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-playfair font-semibold text-coffee-800 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Booking Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bookingType" className="block text-sm font-inter font-medium text-coffee-700 mb-2">
                      Booking Type *
                    </label>
                    <select
                      id="bookingType"
                      name="bookingType"
                      value={formData.bookingType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter"
                    >
                      <option value="individual">Individual</option>
                      <option value="group">Group</option>
                    </select>
                  </div>
                  
                  {formData.bookingType === 'group' && (
                    <div>
                      <label htmlFor="numberOfPeople" className="block text-sm font-inter font-medium text-coffee-700 mb-2">
                        Number of People *
                      </label>
                      <input
                        type="number"
                        id="numberOfPeople"
                        name="numberOfPeople"
                        value={formData.numberOfPeople}
                        onChange={handleInputChange}
                        required
                        min="2"
                        max="18"
                        className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter"
                        placeholder="Number of travelers"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="selectedPackage" className="block text-sm font-inter font-medium text-coffee-700 mb-2">
                    Select Package *
                  </label>
                  <select
                    id="selectedPackage"
                    name="selectedPackage"
                    value={formData.selectedPackage}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter"
                  >
                    <option value="">Choose a package...</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - {pkg.dates} ({pkg.price})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-coffee-600 text-white py-4 px-6 rounded-xl font-inter font-medium hover:bg-coffee-700 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Coffee className="h-5 w-5" />
                      <span>Submit Booking Request</span>
                    </>
                  )}
                </button>
              </div>

              {/* Disclaimer */}
              <div className="text-xs text-coffee-500 font-inter text-center bg-cream-50 p-4 rounded-xl">
                <p>
                  * This is a booking request. Yoya Coffee ☕ will contact you within 24 hours to confirm availability and finalize your reservation.
                </p>
              </div>
            </form>
          ) : (
            /* Success Message */
            <div className="text-center py-8">
              <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-coffee-800 mb-4">
                Booking Request Received!
              </h3>
              <p className="text-coffee-600 font-inter mb-6 max-w-md mx-auto">
                Thank you for your interest in our Ethiopian Coffee Origin Trip. 
                Yoya Coffee ☕ will contact you within 24 hours to confirm your booking details.
              </p>
              <div className="bg-coffee-50 border border-coffee-200 rounded-xl p-4 text-left max-w-md mx-auto">
                <h4 className="font-playfair font-semibold text-coffee-800 mb-2">Next Steps:</h4>
                <ul className="text-sm text-coffee-600 font-inter space-y-1">
                  <li>• Check your email for confirmation</li>
                  <li>• We'll verify availability for your dates</li>
                  <li>• Payment and travel details will follow</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;