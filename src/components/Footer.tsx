import React, { useState } from 'react';
import { Coffee, Instagram, Facebook, Twitter, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-coffee-800 text-white">
      {/* Newsletter Section */}
      <div className="bg-coffee-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl lg:text-3xl font-playfair font-bold mb-4">
            Join Our Coffee Community
          </h3>
          <p className="text-coffee-200 font-inter mb-8 max-w-2xl mx-auto">
            Get exclusive access to new tours, coffee insights, and special offers delivered to your inbox.
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-full text-coffee-800 font-inter focus:outline-none focus:ring-2 focus:ring-cream-300"
                required
              />
              <button
                type="submit"
                disabled={isSubscribed}
                className="bg-earth-600 text-white px-6 py-3 rounded-full font-inter font-medium hover:bg-earth-700 transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubscribed ? (
                  <span>Subscribed! ✓</span>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Coffee className="h-8 w-8 text-cream-200" />
                <span className="text-xl font-playfair font-bold text-cream-100">
                  Ethiopian Coffee Origin Trip
                </span>
              </div>
              <p className="text-coffee-300 font-inter leading-relaxed mb-4">
                Organized by <strong className="text-cream-200">Yoya Coffee ☕</strong>
              </p>
              <p className="text-coffee-300 font-inter leading-relaxed mb-6">
                Connecting travelers with authentic coffee experiences and the stories behind every cup in Ethiopia's legendary coffee regions.
              </p>
              
              {/* Social Media */}
              <div className="flex space-x-4">
                {[
                  { icon: <Instagram className="h-5 w-5" />, label: 'Instagram' },
                  { icon: <Facebook className="h-5 w-5" />, label: 'Facebook' },
                  { icon: <Twitter className="h-5 w-5" />, label: 'Twitter' }
                ].map((social, index) => (
                  <button
                    key={index}
                    className="bg-coffee-700 text-coffee-200 p-2 rounded-full hover:bg-coffee-600 hover:text-white transition-all duration-200 hover:scale-110"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-playfair font-semibold text-cream-100 mb-4">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'Home', id: 'hero' },
                  { label: 'Experiences', id: 'experiences' },
                  { label: 'Destinations', id: 'destinations' },
                  { label: 'About', id: 'about' }
                ].map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-coffee-300 font-inter hover:text-cream-200 transition-colors duration-200 hover:translate-x-1 transform"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Experiences */}
            <div>
              <h4 className="text-lg font-playfair font-semibold text-cream-100 mb-4">
                Experiences
              </h4>
              <ul className="space-y-3">
                {[
                  'Farm-to-Cup Tours',
                  'Urban Café Walks',
                  'Barista Workshops',
                  'Coffee Tastings',
                  'Cultural Immersion'
                ].map((experience) => (
                  <li key={experience}>
                    <span className="text-coffee-300 font-inter hover:text-cream-200 transition-colors duration-200 cursor-pointer">
                      {experience}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-playfair font-semibold text-cream-100 mb-4">
                Contact Yoya Coffee ☕
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-coffee-400" />
                  <span className="text-coffee-300 font-inter">hello@yoyacoffee.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-coffee-400" />
                  <span className="text-coffee-300 font-inter">+251 (911) 123-456</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-coffee-400 mt-0.5" />
                  <span className="text-coffee-300 font-inter">
                    Addis Ababa, Ethiopia<br />
                    Coffee Capital of the World
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <button 
                onClick={() => scrollToSection('experiences')}
                className="mt-6 bg-earth-600 text-white px-6 py-3 rounded-full font-inter font-medium hover:bg-earth-700 transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <span>Book a Tour</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-coffee-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-coffee-400 font-inter text-sm">
              © 2025 Ethiopian Coffee Origin Trip by Yoya Coffee ☕. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                <button
                  key={link}
                  className="text-coffee-400 font-inter text-sm hover:text-cream-200 transition-colors duration-200"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;