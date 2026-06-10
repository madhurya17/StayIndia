import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Calendar, CalendarCheck, IndianRupee } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useEffect, useState } from 'react';
import type { Booking } from '../types';
import api from '../api/axios';

export default function Profile() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api
        .get(`/bookings/my/${user.id}`)
        .then((res) => setBookings(res.data))
        .catch(() => {})
        .finally(() => setBookingsLoading(false));
    }
  }, [user]);

  if (loading || bookingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <LoadingSpinner size="lg" message="Loading profile..." />
      </div>
    );
  }

  if (!user) return null;

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const totalSpent = bookings
    .filter((b) => b.status === 'confirmed' && b.room)
    .reduce((sum, b) => {
      const nights = Math.max(
        1,
        Math.ceil(
          (new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) / (1000 * 60 * 60 * 24)
        )
      );
      return sum + (b.room?.price || 0) * nights;
    }, 0);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <section className="bg-primary-500 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-primary-200 mt-1">Manage your account information</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <span
                className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'admin'
                    ? 'bg-accent-50 text-accent-600'
                    : 'bg-primary-50 text-primary-500'
                }`}
              >
                {user.role === 'admin' ? 'Administrator' : 'Member'}
              </span>
            </div>
          </div>

          {/* Info + Stats */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <User className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-xs text-gray-500">Member Since</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                <CalendarCheck className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                <p className="text-xs text-gray-500 mt-1">Total Bookings</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                <CalendarCheck className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{confirmedBookings.length}</p>
                <p className="text-xs text-gray-500 mt-1">Active Bookings</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                <IndianRupee className="w-6 h-6 text-accent-400 mx-auto mb-2" />
                <p className="text-lg font-bold text-gray-900">{totalSpent.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500 mt-1">Total Spent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
