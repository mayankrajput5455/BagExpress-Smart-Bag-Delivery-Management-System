const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool, inMemoryStore } = require('../db/neon.js');

const JWT_SECRET = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || 'bagexpress_jwt_super_secret_key_2026';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id || user._id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const assignedRole = (role === 'admin') ? 'admin' : 'user';
    const pool = getPool();

    if (pool) {
      const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertRes = await pool.query(
        'INSERT INTO users (name, email, password, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, phone, created_at',
        [name.trim(), email.toLowerCase().trim(), hashedPassword, assignedRole, phone || '']
      );
      const user = insertRes.rows[0];
      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone }
      });
    } else {
      // In-memory fallback
      const existing = inMemoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: inMemoryStore.users.length + 1,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: assignedRole,
        phone: phone || '',
        created_at: new Date().toISOString()
      };
      inMemoryStore.users.push(newUser);
      const token = generateToken(newUser);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, phone: newUser.phone }
      });
    }
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const pool = getPool();
    let user = null;

    if (pool) {
      const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
      if (userRes.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
      user = userRes.rows[0];
    } else {
      user = inMemoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error during login' });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const pool = getPool();
    let user = null;

    if (pool) {
      const result = await pool.query('SELECT id, name, email, role, phone, created_at FROM users WHERE id = $1', [decoded.id]);
      if (result.rows.length > 0) user = result.rows[0];
    } else {
      user = inMemoryStore.users.find(u => u.id === decoded.id);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
});

module.exports = router;
