const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getPool, inMemoryStore } = require('../db/neon.js');

const JWT_SECRET = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || 'bagexpress_jwt_super_secret_key_2026';

// Middleware to verify admin
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// GET /api/products - Get all products with filters & search
router.get('/', async (req, res) => {
  try {
    const { category, search, minGsm, maxGsm, handle, sort } = req.query;
    const pool = getPool();

    if (pool) {
      let query = 'SELECT * FROM products WHERE 1=1';
      const params = [];
      let pIdx = 1;

      if (category && category !== 'All') {
        query += ` AND category = $${pIdx}`;
        params.push(category);
        pIdx++;
      }

      if (search) {
        query += ` AND (name ILIKE $${pIdx} OR description ILIKE $${pIdx} OR material ILIKE $${pIdx})`;
        params.push(`%${search}%`);
        pIdx++;
      }

      if (minGsm) {
        query += ` AND gsm >= $${pIdx}`;
        params.push(parseInt(minGsm));
        pIdx++;
      }

      if (maxGsm) {
        query += ` AND gsm <= $${pIdx}`;
        params.push(parseInt(maxGsm));
        pIdx++;
      }

      if (handle) {
        query += ` AND handle_type ILIKE $${pIdx}`;
        params.push(`%${handle}%`);
        pIdx++;
      }

      if (sort === 'price_asc') query += ' ORDER BY price ASC';
      else if (sort === 'price_desc') query += ' ORDER BY price DESC';
      else if (sort === 'gsm_desc') query += ' ORDER BY gsm DESC';
      else if (sort === 'rating') query += ' ORDER BY ratings DESC';
      else query += ' ORDER BY id ASC';

      const result = await pool.query(query, params);
      return res.json({ success: true, count: result.rows.length, products: result.rows });
    } else {
      let items = [...inMemoryStore.products];

      if (category && category !== 'All') {
        items = items.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        items = items.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.material && p.material.toLowerCase().includes(q))
        );
      }
      if (minGsm) items = items.filter(p => p.gsm >= parseInt(minGsm));
      if (maxGsm) items = items.filter(p => p.gsm <= parseInt(maxGsm));
      if (handle) items = items.filter(p => p.handle_type && p.handle_type.toLowerCase().includes(handle.toLowerCase()));

      if (sort === 'price_asc') items.sort((a, b) => a.price - b.price);
      else if (sort === 'price_desc') items.sort((a, b) => b.price - a.price);
      else if (sort === 'gsm_desc') items.sort((a, b) => b.gsm - a.gsm);
      else if (sort === 'rating') items.sort((a, b) => b.ratings - a.ratings);

      return res.json({ success: true, count: items.length, products: items });
    }
  } catch (err) {
    console.error('Fetch products error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching products' });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    if (pool) {
      const isNum = !isNaN(id);
      const query = isNum ? 'SELECT * FROM products WHERE id = $1' : 'SELECT * FROM products WHERE slug = $1';
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.json({ success: true, product: result.rows[0] });
    } else {
      const product = inMemoryStore.products.find(p => String(p.id) === String(id) || p.slug === id);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.json({ success: true, product });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error fetching product' });
  }
});

// POST /api/products - Create product (Admin only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.category || !data.price) {
      return res.status(400).json({ success: false, message: 'Product name, category, and price are required' });
    }

    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Date.now();
    const pool = getPool();

    if (pool) {
      const result = await pool.query(`
        INSERT INTO products (
          name, slug, category, description, price, discount_price, discount_percent,
          gsm, handle_type, material, dimensions, load_capacity, moq, stock,
          ratings, num_reviews, is_featured, is_bestseller, images, tags, bulk_pricing
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        RETURNING *
      `, [
        data.name, slug, data.category, data.description || '', data.price, data.discount_price || null, data.discount_percent || 0,
        data.gsm || 120, data.handle_type || 'Twisted Paper', data.material || 'Kraft Paper', data.dimensions || 'Standard',
        data.load_capacity || '5-8 kg', data.moq || 50, data.stock || 500, data.ratings || 5.0, data.num_reviews || 0,
        data.is_featured || false, data.is_bestseller || false,
        JSON.stringify(data.images || ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80']),
        JSON.stringify(data.tags || ['Custom']),
        JSON.stringify(data.bulk_pricing || [{ minQty: 50, pricePerUnit: data.price }])
      ]);

      return res.status(201).json({ success: true, message: 'Product created successfully', product: result.rows[0] });
    } else {
      const newProduct = {
        id: inMemoryStore.products.length + 1,
        name: data.name,
        slug,
        category: data.category,
        description: data.description || '',
        price: Number(data.price),
        discount_price: data.discount_price ? Number(data.discount_price) : null,
        discount_percent: data.discount_percent || 0,
        gsm: data.gsm || 120,
        handle_type: data.handle_type || 'Twisted Paper',
        material: data.material || 'Kraft Paper',
        dimensions: data.dimensions || 'Standard',
        load_capacity: data.load_capacity || '5-8 kg',
        moq: data.moq || 50,
        stock: data.stock || 500,
        ratings: 5.0,
        num_reviews: 0,
        is_featured: !!data.is_featured,
        is_bestseller: !!data.is_bestseller,
        images: data.images || ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'],
        tags: data.tags || ['Custom'],
        bulk_pricing: data.bulk_pricing || [{ minQty: 50, pricePerUnit: Number(data.price) }],
        created_at: new Date().toISOString()
      };
      inMemoryStore.products.unshift(newProduct);
      return res.status(201).json({ success: true, message: 'Product created successfully', product: newProduct });
    }
  } catch (err) {
    console.error('Create product error:', err);
    return res.status(500).json({ success: false, message: 'Server error creating product' });
  }
});

// PUT /api/products/:id - Update product (Admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const pool = getPool();

    if (pool) {
      const result = await pool.query(`
        UPDATE products SET
          name = COALESCE($1, name),
          category = COALESCE($2, category),
          description = COALESCE($3, description),
          price = COALESCE($4, price),
          discount_price = COALESCE($5, discount_price),
          gsm = COALESCE($6, gsm),
          stock = COALESCE($7, stock),
          is_featured = COALESCE($8, is_featured),
          is_bestseller = COALESCE($9, is_bestseller)
        WHERE id = $10
        RETURNING *
      `, [
        data.name, data.category, data.description, data.price, data.discount_price,
        data.gsm, data.stock, data.is_featured, data.is_bestseller, id
      ]);

      if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.json({ success: true, message: 'Product updated successfully', product: result.rows[0] });
    } else {
      const idx = inMemoryStore.products.findIndex(p => String(p.id) === String(id));
      if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found' });

      inMemoryStore.products[idx] = { ...inMemoryStore.products[idx], ...data };
      return res.json({ success: true, message: 'Product updated successfully', product: inMemoryStore.products[idx] });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error updating product' });
  }
});

// DELETE /api/products/:id - Delete product (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    if (pool) {
      const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.json({ success: true, message: 'Product deleted successfully' });
    } else {
      const idx = inMemoryStore.products.findIndex(p => String(p.id) === String(id));
      if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found' });
      inMemoryStore.products.splice(idx, 1);
      return res.json({ success: true, message: 'Product deleted successfully' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error deleting product' });
  }
});

module.exports = router;
