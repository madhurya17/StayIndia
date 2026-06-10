import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import RoomCard from '../components/RoomCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';
import type { Room } from '../types';

const cities = ['All', 'Hyderabad', 'Mumbai', 'Chennai', 'Jaipur', 'Goa', 'Kochi'];

export default function Rooms() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCity, setActiveCity] = useState(searchParams.get('city') || 'All');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    fetchRooms();
  }, [activeCity, search]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (activeCity && activeCity !== 'All') params.city = activeCity;
      if (search.trim()) params.search = search.trim();
      const res = await api.get('/rooms', { params });
      setRooms(res.data);
    } catch {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (city: string) => {
    setActiveCity(city);
    const params = new URLSearchParams(searchParams);
    if (city && city !== 'All') {
      params.set('city', city);
    } else {
      params.delete('city');
    }
    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search.trim()) {
      params.set('search', search.trim());
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-primary-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">Browse Rooms</h1>
          <p className="text-primary-200">Find your perfect stay across India</p>

          <form onSubmit={handleSearch} className="mt-6 flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hotels, rooms, or room types..."
                className="w-full pl-10 pr-4 py-3 bg-white/95 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-accent-400 text-primary-900 rounded-xl font-medium text-sm hover:bg-accent-300 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* City Filters */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => handleCityChange(city)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCity === city
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" message="Loading rooms..." />
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No rooms found</h3>
            <p className="text-gray-500 text-sm mb-6">Try adjusting your search or city filter</p>
            <button
              onClick={() => {
                setActiveCity('All');
                setSearch('');
                setSearchParams({});
              }}
              className="px-5 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-6">
              Showing {rooms.length} room{rooms.length !== 1 ? 's' : ''}
              {activeCity !== 'All' && ` in ${activeCity}`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
