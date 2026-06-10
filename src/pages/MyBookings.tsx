import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Users, IndianRupee, XCircle, Bed } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';
import type { Booking } from '../types';

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialog, setCancelDialog] = useState<{ isOpen: boolean; bookingId: string }>({
    isOpen: false,
    bookingId: '',
  });

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await api.get(`/bookings/my/${user?.id}`);
      setBookings(res.data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      await api.put(`/bookings/${cancelDialog.bookingId}/cancel`);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelDialog({ isOpen: false, bookingId: '' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <LoadingSpinner size="lg" message="Loading your bookings..." />
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <section className="bg-primary-500 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">My Bookings</h1>
          <p className="text-primary-200 mt-1">View and manage your hotel reservations</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Bed className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-500 text-sm mb-6">Start exploring and book your first stay!</p>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
            >
              Browse Rooms
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row">
                  {booking.room && (
                    <div className="sm:w-56 h-40 sm:h-auto">
                      <img
                        src={booking.room.image}
                        alt={booking.room.roomName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-3 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed'
                                ? 'bg-green-50 text-green-600'
                                : 'bg-red-50 text-red-600'
                            }`}
                          >
                            {booking.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}
                          </span>
                        </div>
                        {booking.room && (
                          <>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {booking.room.roomName}
                            </h3>
                            <p className="text-gray-500 text-sm">{booking.room.hotelName}</p>
                            <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                              <MapPin className="w-3 h-3" />
                              {booking.room.city}
                            </div>
                          </>
                        )}
                      </div>

                      {booking.room && (
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-primary-500 font-bold">
                            <IndianRupee className="w-4 h-4" />
                            {(
                              booking.room.price *
                              Math.max(
                                1,
                                Math.ceil(
                                  (new Date(booking.checkOut).getTime() -
                                    new Date(booking.checkIn).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )
                              )
                            ).toLocaleString('en-IN')}
                          </div>
                          <p className="text-gray-400 text-xs">
                            {Math.max(
                              1,
                              Math.ceil(
                                (new Date(booking.checkOut).getTime() -
                                  new Date(booking.checkIn).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )
                            )}{' '}
                            night
                            {Math.ceil(
                              (new Date(booking.checkOut).getTime() -
                                new Date(booking.checkIn).getTime()) /
                                (1000 * 60 * 60 * 24)
                            ) > 1
                              ? 's'
                              : ''}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {new Date(booking.checkIn).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        -{' '}
                        {new Date(booking.checkOut).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                      </div>
                    </div>

                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => setCancelDialog({ isOpen: true, bookingId: booking.id })}
                        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={cancelDialog.isOpen}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? The room will become available for other guests."
        confirmLabel="Yes, Cancel"
        cancelLabel="Keep Booking"
        onConfirm={handleCancel}
        onCancel={() => setCancelDialog({ isOpen: false, bookingId: '' })}
      />
    </div>
  );
}
