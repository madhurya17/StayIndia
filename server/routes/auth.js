import express from 'express';
import { readDB, writeDB, generateId } from '../helpers/db.js';

const router = express.Router();

router.post('/register', (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const users = readDB('users');
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newUser = {
      id: generateId(),
      name,
      email,
      phone,
      password,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeDB('users', users);

    const { password: _, ...userWithoutPassword } = newUser;
    const token = Buffer.from(email).toString('base64');

    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const users = readDB('users');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = Buffer.from(email).toString('base64');

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', (req, res) => {
  try {
    const token = req.headers['x-auth-token'];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const email = Buffer.from(token, 'base64').toString();
    const users = readDB('users');
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
