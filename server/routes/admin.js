import express from 'express';
import { readDB } from '../helpers/db.js';

const router = express.Router();

function adminMiddleware(req, res, next) {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    const email = Buffer.from(token, 'base64').toString();
    const users = readDB('users');
    const user = users.find(u => u.email === email);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

router.get('/stats', adminMiddleware, (req, res) => {
  try {
    const rooms = readDB('rooms');
    const users = readDB('users');
    const bookings = readDB('bookings');

    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
    const totalRevenue = confirmedBookings.reduce((sum, b) => {
      const room = rooms.find(r => r.id === b.roomId);
      if (room) {
        const nights = Math.max(1, Math.ceil((new Date(b.checkOut) - new Date(b.checkIn)) / (1000 * 60 * 60 * 24)));
        return sum + room.price * nights;
      }
      return sum;
    }, 0);

    res.json({
      totalRooms: rooms.length,
      totalUsers: users.filter(u => u.role !== 'admin').length,
      totalBookings: bookings.length,
      activeBookings: confirmedBookings.length,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users', adminMiddleware, (req, res) => {
  try {
    const users = readDB('users');
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/bookings', adminMiddleware, (req, res) => {
  try {
    const bookings = readDB('bookings');
    const rooms = readDB('rooms');
    const users = readDB('users');

    const allBookings = bookings.map(booking => {
      const room = rooms.find(r => r.id === booking.roomId);
      const user = users.find(u => u.id === booking.userId);
      return {
        ...booking,
        room: room || null,
        user: user ? { id: user.id, name: user.name, email: user.email, phone: user.phone } : null,
      };
    });

    res.json(allBookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
