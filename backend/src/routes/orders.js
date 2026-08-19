const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getPool, inMemoryStore } = require('../db/neon.js');

const JWT_SECRET = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || 'bagexpress_jwt_super_secret_key_2026';

const getOptionalUser = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

// GET /api/orders - Get user's orders or all orders if admin
router.get('/', async (req, res) => {
  try {
    const user = getOptionalUser(req);
    const pool = getPool();

    if (pool) {
      let query = 'SELECT * FROM orders';
      const params = [];

      if (!user || user.role !== 'admin') {
        if (!user) return res.json({ success: true, count: 0, orders: [] });
        query += ' WHERE user_id = $1 OR customer_email = $2';
        params.push(user.id, user.email);
      }

      query += ' ORDER BY created_at DESC';
      const result = await pool.query(query, params);
      return res.json({ success: true, count: result.rows.length, orders: result.rows });
    } else {
      let list = inMemoryStore.orders;
      if (!user || user.role !== 'admin') {
        if (!user) return res.json({ success: true, count: 0, orders: [] });
        list = list.filter(o => o.user_id === user.id || o.customer_email === user.email);
      }
      return res.json({ success: true, count: list.length, orders: list });
    }
  } catch (err) {
    console.error('Fetch orders error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching orders' });
  }
});

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, subtotal, tax, shippingFee, totalAmount, paymentMethod, customerName, customerEmail, customerPhone } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required.' });
    }

    const user = getOptionalUser(req);
    const orderNumber = 'BE-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const pool = getPool();

    const orderData = {
      order_number: orderNumber,
      user_id: user ? user.id : null,
      customer_name: customerName || (user ? user.name : 'Guest Shopper'),
      customer_email: customerEmail || (user ? user.email : 'guest@example.com'),
      customer_phone: customerPhone || '+91 99999 99999',
      items: items,
      shipping_address: shippingAddress || {},
      subtotal: Number(subtotal || 0),
      tax: Number(tax || 0),
      shipping_fee: Number(shippingFee || 0),
      total_amount: Number(totalAmount || 0),
      payment_method: paymentMethod || 'Online Card / UPI',
      payment_status: 'Paid',
      order_status: 'Processing',
      created_at: new Date().toISOString()
    };

    if (pool) {
      const result = await pool.query(`
        INSERT INTO orders (
          order_number, user_id, customer_name, customer_email, customer_phone,
          items, shipping_address, total_amount, subtotal, tax, shipping_fee,
          payment_method, payment_status, order_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `, [
        orderData.order_number, orderData.user_id, orderData.customer_name, orderData.customer_email, orderData.customer_phone,
        JSON.stringify(orderData.items), JSON.stringify(orderData.shipping_address), orderData.total_amount,
        orderData.subtotal, orderData.tax, orderData.shipping_fee, orderData.payment_method, orderData.payment_status, orderData.order_status
      ]);

      return res.status(201).json({ success: true, message: 'Order placed successfully!', order: result.rows[0] });
    } else {
      const newOrder = {
        id: inMemoryStore.orders.length + 101,
        ...orderData
      };
      inMemoryStore.orders.unshift(newOrder);
      return res.status(201).json({ success: true, message: 'Order placed successfully!', order: newOrder });
    }
  } catch (err) {
    console.error('Order creation error:', err);
    return res.status(500).json({ success: false, message: 'Server error placing order' });
  }
});

// PUT /api/orders/:id/status - Update order status (Admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = getOptionalUser(req);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin permissions required' });
    }

    const pool = getPool();
    if (pool) {
      const result = await pool.query('UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *', [status, id]);
      if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, message: `Order status updated to ${status}`, order: result.rows[0] });
    } else {
      const order = inMemoryStore.orders.find(o => String(o.id) === String(id));
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      order.order_status = status;
      return res.json({ success: true, message: `Order status updated to ${status}`, order });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error updating status' });
  }
});

module.exports = router;
