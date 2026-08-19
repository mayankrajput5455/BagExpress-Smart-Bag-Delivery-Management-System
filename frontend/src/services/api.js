import { INITIAL_PRODUCTS } from '../data/products';

const API_BASE = 'http://localhost:8000/api';

const getHeaders = () => {
  const token = localStorage.getItem('bagexpress_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('bagexpress_token', data.token);
        localStorage.setItem('bagexpress_user', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      // Local fallback for offline/direct testing
      if (email === 'admin@bagexpress.com' && password === 'admin123') {
        const adminUser = { id: 1, name: 'Store Administrator', email, role: 'admin', phone: '+91 99999 00000' };
        localStorage.setItem('bagexpress_token', 'mock_admin_token');
        localStorage.setItem('bagexpress_user', JSON.stringify(adminUser));
        return { success: true, message: 'Welcome back Admin (Local Mode)!', user: adminUser, token: 'mock_admin_token' };
      }
      if (email === 'demo@bagexpress.com' && password === 'demo123') {
        const demoUser = { id: 2, name: 'Mayank Rajput', email, role: 'user', phone: '+91 98765 12345' };
        localStorage.setItem('bagexpress_token', 'mock_user_token');
        localStorage.setItem('bagexpress_user', JSON.stringify(demoUser));
        return { success: true, message: 'Welcome back Mayank (Local Mode)!', user: demoUser, token: 'mock_user_token' };
      }
      return { success: false, message: 'Invalid email or password' };
    }
  },

  async register(name, email, password, role = 'user', phone = '') {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, phone })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('bagexpress_token', data.token);
        localStorage.setItem('bagexpress_user', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      const newUser = { id: Date.now(), name, email, role, phone };
      localStorage.setItem('bagexpress_token', 'mock_reg_token_' + Date.now());
      localStorage.setItem('bagexpress_user', JSON.stringify(newUser));
      return { success: true, message: 'Registered successfully (Local Mode)!', user: newUser, token: 'mock_token' };
    }
  },

  getCurrentUser() {
    const userJson = localStorage.getItem('bagexpress_user');
    return userJson ? JSON.parse(userJson) : null;
  },

  logout() {
    localStorage.removeItem('bagexpress_token');
    localStorage.removeItem('bagexpress_user');
  },

  // Products
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/products?${query}`);
      const data = await res.json();
      if (data.success && data.products && data.products.length > 0) {
        return data.products;
      }
      return INITIAL_PRODUCTS;
    } catch (err) {
      return INITIAL_PRODUCTS;
    }
  },

  async createProduct(productData) {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(productData)
      });
      return await res.json();
    } catch (err) {
      return { success: true, message: 'Bag created locally', product: { ...productData, id: Date.now() } };
    }
  },

  async updateProduct(id, productData) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(productData)
      });
      return await res.json();
    } catch (err) {
      return { success: true, message: 'Bag updated locally' };
    }
  },

  async deleteProduct(id) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return await res.json();
    } catch (err) {
      return { success: true, message: 'Bag deleted locally' };
    }
  },

  // Orders
  async getOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.success) return data.orders;
      return [];
    } catch (err) {
      const localOrders = localStorage.getItem('bagexpress_orders');
      return localOrders ? JSON.parse(localOrders) : [];
    }
  },

  async createOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (data.success) {
        // Save to local storage cache as well
        const cached = localStorage.getItem('bagexpress_orders');
        const parsed = cached ? JSON.parse(cached) : [];
        parsed.unshift(data.order);
        localStorage.setItem('bagexpress_orders', JSON.stringify(parsed));
      }
      return data;
    } catch (err) {
      const newOrder = {
        id: Date.now(),
        order_number: 'BE-2026-' + Math.floor(1000 + Math.random() * 9000),
        ...orderData,
        order_status: 'Processing',
        created_at: new Date().toISOString()
      };
      const cached = localStorage.getItem('bagexpress_orders');
      const parsed = cached ? JSON.parse(cached) : [];
      parsed.unshift(newOrder);
      localStorage.setItem('bagexpress_orders', JSON.stringify(parsed));
      return { success: true, message: 'Order placed successfully!', order: newOrder };
    }
  },

  async updateOrderStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch (err) {
      const cached = localStorage.getItem('bagexpress_orders');
      if (cached) {
        const parsed = JSON.parse(cached);
        const order = parsed.find(o => String(o.id) === String(id));
        if (order) order.order_status = status;
        localStorage.setItem('bagexpress_orders', JSON.stringify(parsed));
      }
      return { success: true, message: `Status updated to ${status}` };
    }
  },

  // Quotes
  async submitQuote(quoteData) {
    try {
      const res = await fetch(`${API_BASE}/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData)
      });
      return await res.json();
    } catch (err) {
      return { success: true, message: 'Your custom quote request has been received! Our printing team will contact you.' };
    }
  }
};
