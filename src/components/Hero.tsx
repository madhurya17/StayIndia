import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const cities = ['All', 'Hyderabad', 'Mumbai', 'Chennai', 'Jaipur', 'Goa', 'Kochi'];

export default function Hero() {
  const navigate = useNavigate();
  const [city, setCity] = useState('All');
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city && city !== 'All') params.set('city', city);
    if (search.trim()) params.set('search', search.trim());
    navigate(`/rooms?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 via-primary-800/60 to-primary-900/80" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <div className="animate-fade-in">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-400/20 text-accent-400 text-sm font-medium mb-6 border border-accent-400/30">
            India's Trusted Hotel Booking Platform
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 animate-slide-up leading-tight">
          Discover India's
          <br />
          <span className="text-accent-400">Finest Hotels</span>
        </h1>

        <p className="text-lg sm:text-xl text-primary-100 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
          From heritage palaces in Jaipur to beachfront resorts in Goa, find your perfect stay across India's most iconic destinations.
        </p>

        <form
          onSubmit={handleSearch}
          className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl max-w-3xl mx-auto animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c === 'All' ? 'All Cities' : c}</option>
                ))}
              </select>
            </div>
            <div className="flex-[2] w-full">
              <input
                type="text"
                placeholder="Search hotels, rooms, or room types..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-primary-500 text-white rounded-xl font-medium text-sm hover:bg-primary-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-8 mt-10 text-primary-200 text-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">500+</div>
            <div>Hotels</div>
          </div>
          <div className="w-px h-8 bg-primary-400/40" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">50+</div>
            <div>Cities</div>
          </div>
          <div className="w-px h-8 bg-primary-400/40" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">10K+</div>
            <div>Happy Guests</div>
          </div>
        </div>
      </div>

      <a
        href="#featured-hotels"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-float"
      >
        <ChevronDown className="w-8 h-8" />
      </a>
    </section>
  );
}
