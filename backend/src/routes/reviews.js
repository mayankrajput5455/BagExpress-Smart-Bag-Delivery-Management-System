const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, reviews: [] });
});

router.post('/', (req, res) => {
  res.status(201).json({ success: true, message: 'Review submitted for approval' });
});

module.exports = router;
