import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, LogOut, Plus, Pencil, Trash2, IndianRupee,
  Users, CalendarDays, Bed, TrendingUp, X, Save, Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';
import type { Room, Booking, AdminStats } from '../types';

const cities = ['Hyderabad', 'Mumbai', 'Chennai', 'Jaipur', 'Goa', 'Kochi'];
const roomTypes = ['Standard', 'Deluxe', 'Premium', 'Suite'];
const allAmenities = ['WiFi', 'AC', 'TV', 'Mini Bar', 'Room Service', 'Pool Access', 'Parking', 'Breakfast', 'Gym'];

type Tab = 'rooms' | 'users' | 'bookings';

interface RoomForm {
  hotelName: string;
  roomName: string;
  city: string;
  description: string;
  price: string;
  rating: string;
  amenities: string[];
  availability: boolean;
  capacity: string;
  roomType: string;
  image: string;
}

const emptyForm: RoomForm = {
  hotelName: '',
  roomName: '',
  city: 'Hyderabad',
  description: '',
  price: '',
  rating: '4.0',
  amenities: [],
  availability: true,
  capacity: '2',
  roomType: 'Deluxe',
  image: '',
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('rooms');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [form, setForm] = useState<RoomForm>(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; roomId: string }>({
    isOpen: false,
    roomId: '',
  });
  const [cancelDialog, setCancelDialog] = useState<{ isOpen: boolean; bookingId: string }>({
    isOpen: false,
    bookingId: '',
  });
  const [bookingFilter, setBookingFilter] = useState<string>('all');
  const [roomSearch, setRoomSearch] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [statsRes, roomsRes, usersRes, bookingsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/rooms'),
        api.get('/admin/users'),
        api.get('/admin/bookings'),
      ]);
      setStats(statsRes.data);
      setRooms(roomsRes.data);
      setUsers(usersRes.data);
      setBookings(bookingsRes.data);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingRoom(null);
    setForm(emptyForm);
    setShowRoomModal(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setForm({
      hotelName: room.hotelName,
      roomName: room.roomName,
      city: room.city,
      description: room.description,
      price: String(room.price),
      rating: String(room.rating),
      amenities: [...room.amenities],
      availability: room.availability,
      capacity: String(room.capacity),
      roomType: room.roomType,
      image: room.image,
    });
    setShowRoomModal(true);
  };

  const handleAmenityToggle = (amenity: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.hotelName || !form.roomName || !form.city || !form.description || !form.price || !form.roomType) {
      toast.error('Please fill in all required fields');
      return;
    }
    setFormLoading(true);
    try {
      const payload = {
        hotelName: form.hotelName,
        roomName: form.roomName,
        city: form.city,
        description: form.description,
        price: Number(form.price),
        rating: Number(form.rating),
        amenities: form.amenities,
        availability: form.availability,
        capacity: Number(form.capacity),
        roomType: form.roomType,
        image: form.image || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
      };
      if (editingRoom) {
        await api.put(`/rooms/${editingRoom.id}`, payload);
        toast.success('Room updated successfully');
      } else {
        await api.post('/rooms', payload);
        toast.success('Room added successfully');
      }
      setShowRoomModal(false);
      fetchAll();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save room');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await api.delete(`/rooms/${deleteDialog.roomId}`);
      toast.success('Room deleted successfully');
      fetchAll();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete room');
    } finally {
      setDeleteDialog({ isOpen: false, roomId: '' });
    }
  };

  const handleCancelBooking = async () => {
    try {
      await api.put(`/bookings/${cancelDialog.bookingId}/cancel`);
      toast.success('Booking cancelled successfully');
      fetchAll();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelDialog({ isOpen: false, bookingId: '' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredRooms = rooms.filter((r) => {
    if (!roomSearch) return true;
    const term = roomSearch.toLowerCase();
    return (
      r.hotelName.toLowerCase().includes(term) ||
      r.roomName.toLowerCase().includes(term) ||
      r.city.toLowerCase().includes(term)
    );
  });

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'all') return true;
    return b.status === bookingFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-900">
        <LoadingSpinner size="lg" message="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-900">
      {/* Top Bar */}
      <header className="bg-primary-800 border-b border-primary-700 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-7 h-7 text-accent-400" />
            <span className="text-xl font-bold text-white">
              Stay<span className="text-accent-400">India</span>
            </span>
            <span className="hidden sm:inline-block px-3 py-0.5 bg-accent-400/20 text-accent-400 text-xs font-medium rounded-full ml-2">
              Admin Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-primary-300 text-sm hidden sm:block">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary-300 hover:text-white hover:bg-primary-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Rooms', value: stats?.totalRooms || 0, icon: Bed, color: 'bg-secondary-500' },
            { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-green-500' },
            { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: CalendarDays, color: 'bg-primary-400' },
            { label: 'Active Bookings', value: stats?.activeBookings || 0, icon: TrendingUp, color: 'bg-accent-400' },
            { label: 'Revenue', value: `${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'bg-emerald-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-primary-800 rounded-xl p-4 border border-primary-700">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-primary-400 text-xs">{stat.label}</p>
                  <p className="text-white font-bold text-lg">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 bg-primary-800 rounded-xl p-1 inline-flex">
          {(['rooms', 'users', 'bookings'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-accent-400 text-primary-900'
                  : 'text-primary-300 hover:text-white'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Rooms Tab */}
        {tab === 'rooms' && (
          <div className="bg-primary-800 rounded-2xl border border-primary-700 overflow-hidden">
            <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-primary-700">
              <div className="flex items-center gap-3 flex-1">
                <h2 className="text-white font-semibold text-lg">Manage Rooms</h2>
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
                  <input
                    type="text"
                    value={roomSearch}
                    onChange={(e) => setRoomSearch(e.target.value)}
                    placeholder="Search rooms..."
                    className="w-full pl-9 pr-3 py-2 bg-primary-700 border border-primary-600 rounded-lg text-white text-sm placeholder-primary-400 focus:outline-none focus:ring-1 focus:ring-accent-400"
                  />
                </div>
              </div>
              <button
                onClick={openAddModal}
                className="flex items-center gap-1.5 px-4 py-2 bg-accent-400 text-primary-900 rounded-lg text-sm font-semibold hover:bg-accent-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Room
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary-700">
                    <th className="text-left px-4 py-3 text-primary-400 text-xs font-medium uppercase">Room</th>
                    <th className="text-left px-4 py-3 text-primary-400 text-xs font-medium uppercase">Hotel</th>
                    <th className="text-left px-4 py-3 text-primary-400 text-xs font-medium uppercase">City</th>
                    <th className="text-left px-4 py-3 text-primary-400 text-xs font-medium uppercase">Price</th>
                    <th className="text-left px-4 py-3 text-primary-400 text-xs font-medium uppercase">Type</th>
                    <th className="text-left px-4 py-3 text-primary-400 text-xs font-medium uppercase">Available</th>
                    <th className="text-left px-4 py-3 text-primary-400 text-xs font-medium uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.map((room) => (
                    <tr key={room.id} className="border-b border-primary-700/50 hover:bg-primary-700/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={room.image}
                            alt={room.roomName}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <span className="text-white text-sm font-medium">{room.roomName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-primary-300 text-sm">{room.hotelName}</td>
                      <td className="px-4 py-3 text-primary-300 text-sm">{room.city}</td>
                      <td className="px-4 py-3 text-white text-sm font-medium">
                        {room.price.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-primary-600 text-primary-200 text-xs rounded-full">
                          {room.roomType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            room.availability
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {room.availability ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(room)}
                            className="p-1.5 rounded-lg bg-primary-600 text-primary-200 hover:bg-primary-500 hover:text-white transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteDialog({ isOpen: true, roomId: room.id })}
                            className="p-1.5 rounded-lg bg-primary-600 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRooms.length === 0 && (
                <div className="text-center py-8 text-primary-400 text-sm">No rooms found</div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="bg-primary-800 rounded-2xl border border-primary-700 overflow-hidden">
            <div className="p-4 border-b border-primary-700">
              <h2 className="text-white font-semibold text-lg">All Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary-700">
                    <th className="text-left px-4 py-3 text-primary-400 text-xs font-medium uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-primary-400 text-xs font-medium uppercase">Email</th>
                    <th className="text-left px-4 py-3 text-primary-400 text-xs font-medium uppercase">Phone</th>
                    <th className="text-left px-4 py-3 text-primary-400 text-xs font-medium uppercase">Role</th>
                    <th className="text-left px-4 py-3 text-primary-400 text-xs font-medium uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-primary-700/50 hover:bg-primary-700/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-600 text-primary-200 flex items-center justify-center text-sm font-semibold">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-white text-sm">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-primary-300 text-sm">{u.email}</td>
                      <td className="px-4 py-3 text-primary-300 text-sm">{u.phone}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            u.role === 'admin'
                              ? 'bg-accent-400/20 text-accent-400'
                              : 'bg-primary-600 text-primary-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-primary-400 text-sm">
                        {new Date(u.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {tab === 'bookings' && (
          <div className="bg-primary-800 rounded-2xl border border-primary-700 overflow-hidden">
            <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-primary-700">
              <h2 className="text-white font-semibold text-lg">All Bookings</h2>
              <div className="flex items-center gap-2">
                {['all', 'confirmed', 'cancelled'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setBookingFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      bookingFilter === f
                        ? 'bg-accent-400 text-primary-900'
                        : 'bg-primary-700 text-primary-300 hover:text-white'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary-700">
                    <th className="text-left px-4 py-3 text-primary-400 text-xs font-medium uppercase">Guest</th>
                    <th className="text-left px-4 py-3 text-primary-400 text-xs font-medium uppercase">Room</th>
                    <th className="text-left px-4 py-3 text-primary-400 text-xs font-medium uppercase">Hotel</th>
                    <th className="text-left px-4 py-3 text-primary-400 text-xs font-medium uppercase">Check-In</th>
                    <th className="text-left px-4 py-3 text-primary-400 text-xs font-medium uppercase">Check-Out</th>
                    <th className="text-left px-4 py-3 text-primary-400 text-xs font-medium uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-primary-400 text-xs font-medium uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="border-b border-primary-700/50 hover:bg-primary-700/30">
                      <td className="px-4 py-3 text-white text-sm">
                        {b.user?.name || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-primary-300 text-sm">
                        {b.room?.roomName || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-primary-300 text-sm">
                        {b.room?.hotelName || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-primary-400 text-sm">
                        {new Date(b.checkIn).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-primary-400 text-sm">
                        {new Date(b.checkOut).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            b.status === 'confirmed'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => setCancelDialog({ isOpen: true, bookingId: b.id })}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredBookings.length === 0 && (
                <div className="text-center py-8 text-primary-400 text-sm">No bookings found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 z-[90] flex items-start justify-center p-4 pt-20 overflow-y-auto">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRoomModal(false)} />
          <div className="relative bg-primary-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-primary-700 animate-slide-up mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </h2>
              <button
                onClick={() => setShowRoomModal(false)}
                className="p-1.5 rounded-lg text-primary-400 hover:text-white hover:bg-primary-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-200 mb-1.5">Hotel Name *</label>
                  <input
                    type="text"
                    value={form.hotelName}
                    onChange={(e) => setForm({ ...form, hotelName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-primary-700 border border-primary-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-200 mb-1.5">Room Name *</label>
                  <input
                    type="text"
                    value={form.roomName}
                    onChange={(e) => setForm({ ...form, roomName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-primary-700 border border-primary-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-200 mb-1.5">City *</label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2.5 bg-primary-700 border border-primary-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
                  >
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-200 mb-1.5">Room Type *</label>
                  <select
                    value={form.roomType}
                    onChange={(e) => setForm({ ...form, roomType: e.target.value })}
                    className="w-full px-3 py-2.5 bg-primary-700 border border-primary-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
                  >
                    {roomTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-200 mb-1.5">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 bg-primary-700 border border-primary-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-accent-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-200 mb-1.5">Price (INR) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2.5 bg-primary-700 border border-primary-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-200 mb-1.5">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className="w-full px-3 py-2.5 bg-primary-700 border border-primary-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-200 mb-1.5">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    className="w-full px-3 py-2.5 bg-primary-700 border border-primary-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-200 mb-1.5">Image URL</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2.5 bg-primary-700 border border-primary-600 rounded-lg text-white text-sm placeholder-primary-400 focus:outline-none focus:ring-1 focus:ring-accent-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-200 mb-3">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {allAmenities.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        form.amenities.includes(amenity)
                          ? 'bg-accent-400 text-primary-900'
                          : 'bg-primary-700 text-primary-300 hover:bg-primary-600'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-primary-200">Availability</label>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, availability: !form.availability })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    form.availability ? 'bg-green-500' : 'bg-primary-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      form.availability ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-primary-700">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-accent-400 text-primary-900 rounded-lg font-semibold text-sm hover:bg-accent-300 transition-colors disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {formLoading ? 'Saving...' : editingRoom ? 'Update Room' : 'Add Room'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="px-6 py-2.5 bg-primary-700 text-primary-300 rounded-lg text-sm hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Room"
        message="Are you sure you want to delete this room? This action cannot be undone."
        confirmLabel="Yes, Delete"
        cancelLabel="Keep Room"
        onConfirm={handleDeleteRoom}
        onCancel={() => setDeleteDialog({ isOpen: false, roomId: '' })}
      />

      <ConfirmDialog
        isOpen={cancelDialog.isOpen}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? The room will become available again."
        confirmLabel="Yes, Cancel"
        cancelLabel="Keep Booking"
        onConfirm={handleCancelBooking}
        onCancel={() => setCancelDialog({ isOpen: false, bookingId: '' })}
      />
    </div>
  );
}
