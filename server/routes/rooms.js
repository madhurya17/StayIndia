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

router.get('/', (req, res) => {
  try {
    let rooms = readDB('rooms');
    const { city, search } = req.query;

    if (city && city !== 'All') {
      rooms = rooms.filter(r => r.city.toLowerCase() === city.toLowerCase());
    }

    if (search) {
      const term = search.toLowerCase();
      rooms = rooms.filter(r =>
        r.hotelName.toLowerCase().includes(term) ||
        r.roomName.toLowerCase().includes(term) ||
        r.city.toLowerCase().includes(term) ||
        r.roomType.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term)
      );
    }

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const rooms = readDB('rooms');
    const room = rooms.find(r => r.id === req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { hotelName, roomName, city, description, price, rating, amenities, availability, capacity, roomType, image } = req.body;

    if (!hotelName || !roomName || !city || !description || !price || !roomType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const rooms = readDB('rooms');
    const newRoom = {
      id: generateId(),
      hotelName,
      roomName,
      city,
      description,
      price: Number(price),
      rating: Number(rating) || 4.0,
      amenities: amenities || [],
      availability: availability !== undefined ? availability : true,
      capacity: Number(capacity) || 2,
      roomType,
      image: image || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
      createdAt: new Date().toISOString(),
    };

    rooms.push(newRoom);
    writeDB('rooms', rooms);

    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const rooms = readDB('rooms');
    const index = rooms.findIndex(r => r.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const updatedRoom = {
      ...rooms[index],
      ...req.body,
      price: req.body.price ? Number(req.body.price) : rooms[index].price,
      rating: req.body.rating ? Number(req.body.rating) : rooms[index].rating,
      capacity: req.body.capacity ? Number(req.body.capacity) : rooms[index].capacity,
    };

    rooms[index] = updatedRoom;
    writeDB('rooms', rooms);

    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    let rooms = readDB('rooms');
    const index = rooms.findIndex(r => r.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Room not found' });
    }

    rooms.splice(index, 1);
    writeDB('rooms', rooms);

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
