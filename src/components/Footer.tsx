import { Link } from 'react-router-dom';
import { Building2, MapPin, Phone, Mail, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Building2 className="w-7 h-7 text-accent-400" />
              <span className="text-xl font-bold">
                Stay<span className="text-accent-400">India</span>
              </span>
            </Link>
            <p className="text-primary-200 text-sm leading-relaxed">
              Discover India's finest hotels and create unforgettable travel experiences. From heritage palaces to modern luxury, we bring you the best of Indian hospitality.
            </p>
          </div>

          <div>
            <h3 className="text-accent-400 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/rooms', label: 'Browse Rooms' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/my-bookings', label: 'My Bookings' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-primary-200 hover:text-accent-400 text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-accent-400 font-semibold mb-4">Popular Destinations</h3>
            <ul className="space-y-2.5">
              {['Hyderabad', 'Mumbai', 'Chennai', 'Jaipur', 'Goa', 'Kochi'].map((city) => (
                <li key={city}>
                  <Link
                    to={`/rooms?city=${city}`}
                    className="text-primary-200 hover:text-accent-400 text-sm transition-colors duration-200 flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" />
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-accent-400 font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-primary-200 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                Miyapur, Miyapur Metro, Hyderabad 500001, India
              </li>
              <li className="flex items-center gap-2 text-primary-200 text-sm">
                <Phone className="w-4 h-4 shrink-0" />
                +91-1800-123-4567
              </li>
              <li className="flex items-center gap-2 text-primary-200 text-sm">
                <Mail className="w-4 h-4 shrink-0" />
                hello@stayindia.com
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="p-2 rounded-lg bg-primary-400/30 hover:bg-accent-400 transition-colors duration-200">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary-400/30 hover:bg-accent-400 transition-colors duration-200">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary-400/30 hover:bg-accent-400 transition-colors duration-200">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-400/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-center text-primary-300 text-sm">
            &copy; {new Date().getFullYear()} StayIndia. All rights reserved. Made with love in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
