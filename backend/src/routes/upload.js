const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.json({
    success: true,
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    public_id: 'sample_upload'
  });
});

module.exports = router;
