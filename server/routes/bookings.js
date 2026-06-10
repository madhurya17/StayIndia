import express from 'express';
import { readDB, writeDB, generateId } from '../helpers/db.js';

const router = express.Router();

function authMiddleware(req, res, next) {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    const email = Buffer.from(token, 'base64').toString();
    const users = readDB('users');
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

router.post('/', authMiddleware, (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests } = req.body;

    if (!roomId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ message: 'All booking fields are required' });
    }

    const rooms = readDB('rooms');
    const room = rooms.find(r => r.id === roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.availability) {
      return res.status(400).json({ message: 'Room is not available for booking' });
    }

    const bookings = readDB('bookings');
    const newBooking = {
      id: generateId(),
      userId: req.user.id,
      roomId,
      checkIn,
      checkOut,
      guests: Number(guests),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    bookings.push(newBooking);
    writeDB('bookings', bookings);

    const roomIndex = rooms.findIndex(r => r.id === roomId);
    rooms[roomIndex].availability = false;
    writeDB('rooms', rooms);

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my/:userId', authMiddleware, (req, res) => {
  try {
    const bookings = readDB('bookings');
    const rooms = readDB('rooms');
    const userId = req.params.userId;

    const userBookings = bookings
      .filter(b => b.userId === userId)
      .map(booking => {
        const room = rooms.find(r => r.id === booking.roomId);
        return {
          ...booking,
          room: room || null,
        };
      });

    res.json(userBookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', authMiddleware, adminMiddleware, (req, res) => {
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

router.put('/:id/cancel', authMiddleware, (req, res) => {
  try {
    const bookings = readDB('bookings');
    const index = bookings.findIndex(b => b.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (bookings[index].userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (bookings[index].status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    bookings[index].status = 'cancelled';
    writeDB('bookings', bookings);

    const rooms = readDB('rooms');
    const roomIndex = rooms.findIndex(r => r.id === bookings[index].roomId);
    if (roomIndex !== -1) {
      rooms[roomIndex].availability = true;
      writeDB('rooms', rooms);
    }

    res.json({ ...bookings[index], message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
