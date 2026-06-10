import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Star, Users, IndianRupee, Wifi, Wind, Tv, GlassWater,
  UtensilsCrossed, Car, Coffee, Dumbbell, Check,
  ChevronLeft, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import RoomCard from '../components/RoomCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';
import type { Room } from '../types';

const amenityIcons: Record<string, React.ElementType> = {
  WiFi: Wifi,
  AC: Wind,
  TV: Tv,
  'Mini Bar': GlassWater,
  'Room Service': UtensilsCrossed,
  'Pool Access': Coffee,
  Parking: Car,
  Breakfast: Coffee,
  Gym: Dumbbell,
};

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [similarRooms, setSimilarRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ checkIn: '', checkOut: '', guests: 1 });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (id) {
      api
        .get(`/rooms/${id}`)
        .then((res) => {
          setRoom(res.data);
          return api.get('/rooms', { params: { city: res.data.city } });
        })
        .then((res) => {
          setSimilarRooms(res.data.filter((r: Room) => r.id !== id).slice(0, 3));
        })
        .catch(() => {
          toast.error('Room not found');
          navigate('/rooms');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book a room');
      navigate('/login');
      return;
    }
    if (!booking.checkIn || !booking.checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    if (new Date(booking.checkIn) >= new Date(booking.checkOut)) {
      toast.error('Check-out must be after check-in');
      return;
    }
    if (new Date(booking.checkIn) < new Date(new Date().toDateString())) {
      toast.error('Check-in date cannot be in the past');
      return;
    }
    if (!room) return;

    setBookingLoading(true);
    try {
      await api.post('/bookings', {
        roomId: room.id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
      });
      toast.success('Room booked successfully!');
      navigate('/my-bookings');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <LoadingSpinner size="lg" message="Loading room details..." />
      </div>
    );
  }

  if (!room) return null;

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img
          src={room.image}
          alt={room.roomName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-white/80 hover:text-white text-sm mb-3 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Rooms
            </button>
            <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
              <MapPin className="w-4 h-4" />
              {room.city}
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white">{room.roomName}</h1>
            <p className="text-white/80 mt-1">{room.hotelName}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-primary-50 text-primary-500 rounded-full text-sm font-medium">
                  {room.roomType}
                </span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(room.rating)
                          ? 'text-accent-400 fill-accent-400'
                          : 'text-gray-200 fill-gray-200'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">{room.rating}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    room.availability
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {room.availability ? 'Available' : 'Currently Booked'}
                </span>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Room</h2>
              <p className="text-gray-600 leading-relaxed">{room.description}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {room.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity] || Check;
                  return (
                    <div key={amenity} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="p-1.5 rounded-lg bg-primary-50 text-primary-500">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Room Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <Users className="w-5 h-5 text-primary-500 mb-2" />
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p className="font-semibold text-gray-900">{room.capacity} Guests</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <IndianRupee className="w-5 h-5 text-primary-500 mb-2" />
                  <p className="text-sm text-gray-500">Price per Night</p>
                  <p className="font-semibold text-gray-900">{room.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 sticky top-24">
              <div className="flex items-center gap-1 mb-1">
                <IndianRupee className="w-5 h-5 text-primary-500" />
                <span className="text-2xl font-bold text-primary-500">
                  {room.price.toLocaleString('en-IN')}
                </span>
                <span className="text-gray-400 text-sm">/night</span>
              </div>

              {room.availability ? (
                <form onSubmit={handleBooking} className="mt-5 space-y-4">
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Check-in</label>
                        <input
                          type="date"
                          value={booking.checkIn}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setBooking({ ...booking, checkIn: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Check-out</label>
                        <input
                          type="date"
                          value={booking.checkOut}
                          min={booking.checkIn || new Date().toISOString().split('T')[0]}
                          onChange={(e) => setBooking({ ...booking, checkOut: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Guests</label>
                      <select
                        value={booking.guests}
                        onChange={(e) => setBooking({ ...booking, guests: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                      >
                        {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n} Guest{n > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {booking.checkIn && booking.checkOut && (
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>
                          {room.price.toLocaleString('en-IN')} x{' '}
                          {Math.max(1, Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)))}{' '}
                          night{Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)) > 1 ? 's' : ''}
                        </span>
                        <span>
                          {(room.price * Math.max(1, Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)))).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span>
                          {(room.price * Math.max(1, Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)))).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-all duration-200 disabled:opacity-60 shadow-md"
                  >
                    {bookingLoading ? 'Booking...' : 'Book Now'}
                  </button>
                </form>
              ) : (
                <div className="mt-5 p-4 bg-red-50 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-700 text-sm">Currently Unavailable</p>
                    <p className="text-red-500 text-xs mt-1">This room is booked. Check back later or browse similar rooms below.</p>
                  </div>
                </div>
              )}

              {!user && room.availability && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  <Link to="/login" className="text-primary-500 font-medium hover:underline">
                    Login
                  </Link>{' '}
                  to book this room
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Similar Rooms */}
        {similarRooms.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Rooms in {room.city}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarRooms.map((r) => (
                <RoomCard key={r.id} room={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
