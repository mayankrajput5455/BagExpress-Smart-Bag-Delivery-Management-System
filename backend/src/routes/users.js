const express = require('express');
const router = express.Router();
const { inMemoryStore, getPool } = require('../db/neon.js');

router.get('/', async (req, res) => {
  const pool = getPool();
  if (pool) {
    const result = await pool.query('SELECT id, name, email, role, phone, created_at FROM users');
    return res.json({ success: true, users: result.rows });
  }
  const safeUsers = inMemoryStore.users.map(({ password, ...rest }) => rest);
  return res.json({ success: true, users: safeUsers });
});

module.exports = router;
