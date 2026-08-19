const express = require('express');
const router = express.Router();
const { getPool, inMemoryStore } = require('../db/neon.js');

// POST /api/quotes - Submit bulk custom print quote inquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, bag_type, quantity, print_colors, notes } = req.body;
    if (!name || !email || !bag_type || !quantity) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, bag type and quantity.' });
    }

    const pool = getPool();
    if (pool) {
      const result = await pool.query(`
        INSERT INTO quotes (name, email, phone, bag_type, quantity, print_colors, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [name, email, phone || '', bag_type, parseInt(quantity), print_colors || 'Single Color', notes || '']);
      return res.status(201).json({ success: true, message: 'Your custom quote request has been received! Our artisan printing team will reach out within 24 hours.', quote: result.rows[0] });
    } else {
      const newQuote = {
        id: inMemoryStore.quotes.length + 1,
        name, email, phone: phone || '', bag_type, quantity: parseInt(quantity),
        print_colors: print_colors || 'Single Color', notes: notes || '',
        status: 'Pending',
        created_at: new Date().toISOString()
      };
      inMemoryStore.quotes.unshift(newQuote);
      return res.status(201).json({ success: true, message: 'Your custom quote request has been received! Our artisan printing team will reach out within 24 hours.', quote: newQuote });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error processing quote request' });
  }
});

// GET /api/quotes - Admin view quotes
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const result = await pool.query('SELECT * FROM quotes ORDER BY created_at DESC');
      return res.json({ success: true, count: result.rows.length, quotes: result.rows });
    } else {
      return res.json({ success: true, count: inMemoryStore.quotes.length, quotes: inMemoryStore.quotes });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error fetching quotes' });
  }
});

module.exports = router;
