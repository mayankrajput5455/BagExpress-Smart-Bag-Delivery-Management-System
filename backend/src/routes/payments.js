const express = require('express');
const router = express.Router();

router.post('/create-intent', (req, res) => {
  res.json({ success: true, clientSecret: 'mock_stripe_secret_' + Date.now() });
});

router.post('/webhook', (req, res) => {
  res.json({ received: true });
});

module.exports = router;
