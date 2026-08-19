import React, { useState, useEffect } from 'react';
import { X, Package, ShoppingBag, Plus, Trash2, Edit, RefreshCw, CheckCircle, Clock, Truck, Layers, DollarSign, Archive } from 'lucide-react';
import { api } from '../services/api';
import { CATEGORIES, HANDLE_TYPES } from '../data/products';

export const AdminDashboardModal = ({ isOpen, onClose, onRefreshProducts }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'add'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Add/Edit Bag State
  const [newBag, setNewBag] = useState({
    name: '',
    category: 'Retail & Shopping',
    description: '',
    price: '24.00',
    discount_price: '19.50',
    gsm: 130,
    handle_type: 'Twisted Paper Cord',
    material: 'Virgin Brown Kraft',
    dimensions: '30cm x 22cm x 10cm',
    load_capacity: '7 kg',
    moq: 50,
    stock: 5000,
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'],
    is_featured: false,
    is_bestseller: false
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prods, ords] = await Promise.all([
        api.getProducts(),
        api.getOrders()
      ]);
      setProducts(prods);
      setOrders(ords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen]);

  const handleCreateBag = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.createProduct({
        ...newBag,
        price: Number(newBag.price),
        discount_price: newBag.discount_price ? Number(newBag.discount_price) : null,
        gsm: Number(newBag.gsm),
        moq: Number(newBag.moq),
        stock: Number(newBag.stock)
      });
      setStatusMessage('Paper Bag created in catalog successfully!');
      setTimeout(() => setStatusMessage(''), 3500);
      setActiveTab('products');
      fetchData();
      if (onRefreshProducts) onRefreshProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBag = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bag from the store?')) return;
    try {
      await api.deleteProduct(id);
      fetchData();
      if (onRefreshProducts) onRefreshProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const totalRevenue = orders.reduce((acc, o) => acc + Number(o.total_amount || 0), 0);
  const totalItemsSold = orders.reduce((acc, o) => {
    const items = o.items || [];
    return acc + items.reduce((s, i) => s + (i.quantity || 0), 0);
  }, 0);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 80,
      backgroundColor: 'rgba(28, 25, 23, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div
        className="animate-fade-in"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '1040px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-xl)',
          padding: '32px',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#F3ECE2',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>

        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="artisan-stamp stamp-forest">Administrator Atelier</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--text-primary)', marginTop: '4px' }}>
              Bag Express Store & Warehouse Management
            </h2>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ backgroundColor: '#FAF7F2', padding: '8px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Total Revenue</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-forest-dark)', fontFamily: 'var(--font-display)' }}>
                ₹{totalRevenue.toFixed(2)}
              </div>
            </div>
            <div style={{ backgroundColor: '#FAF7F2', padding: '8px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Bags Sold</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-kraft-dark)', fontFamily: 'var(--font-display)' }}>
                {totalItemsSold.toLocaleString()} pcs
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 700,
              backgroundColor: activeTab === 'products' ? 'var(--color-kraft-primary)' : '#FAF7F2',
              color: activeTab === 'products' ? '#FFFFFF' : 'var(--text-secondary)'
            }}
          >
            <ShoppingBag size={15} />
            Bag Catalog ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 700,
              backgroundColor: activeTab === 'orders' ? 'var(--color-forest)' : '#FAF7F2',
              color: activeTab === 'orders' ? '#FFFFFF' : 'var(--text-secondary)'
            }}
          >
            <Truck size={15} />
            Customer Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('add')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 700,
              backgroundColor: activeTab === 'add' ? '#8C6212' : '#FAF7F2',
              color: activeTab === 'add' ? '#FFFFFF' : 'var(--text-secondary)'
            }}
          >
            <Plus size={15} />
            Add New Paper Bag
          </button>
        </div>

        {statusMessage && (
          <div style={{ backgroundColor: '#E3EDE7', color: 'var(--color-forest-dark)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
            {statusMessage}
          </div>
        )}

        {/* Tab 1: Products Catalog Manager */}
        {activeTab === 'products' && (
          <div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F3ECE2', textAlign: 'left', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)' }}>Bag Name & Category</th>
                    <th style={{ padding: '10px 12px' }}>Substance / GSM</th>
                    <th style={{ padding: '10px 12px' }}>Handle Style</th>
                    <th style={{ padding: '10px 12px' }}>Price</th>
                    <th style={{ padding: '10px 12px' }}>Stock</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const price = Number(p.discount_price || p.price);
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--color-kraft-primary)' }}>{p.category}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span className="artisan-stamp stamp-kraft">{p.gsm} GSM</span>
                        </td>
                        <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{p.handle_type}</td>
                        <td style={{ padding: '12px', fontWeight: 700 }}>₹{price.toFixed(2)}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: p.stock < 1000 ? '#FBECE8' : '#E3EDE7',
                            color: p.stock < 1000 ? '#9C3D23' : 'var(--color-forest-dark)',
                            fontWeight: 700
                          }}>
                            {p.stock} pcs
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDeleteBag(p.id)}
                            style={{ padding: '4px 8px', color: '#9C3D23' }}
                            title="Delete bag"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Orders Fulfillment Manager */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                No customer orders placed yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#FAF7F2',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '14px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <strong style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--color-kraft-primary)' }}>
                          {ord.order_number}
                        </strong>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {new Date(ord.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                        {ord.customer_name} • {ord.customer_email} ({ord.customer_phone})
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {(ord.items || []).map(i => `${i.name} (${i.quantity} pcs)`).join(', ')}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                          ₹{Number(ord.total_amount).toFixed(2)}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ord.payment_method}</div>
                      </div>

                      {/* Status Dropdown */}
                      <select
                        value={ord.order_status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '12px',
                          fontWeight: 700,
                          backgroundColor: ord.order_status === 'Delivered' ? '#E3EDE7' :
                                           ord.order_status === 'Shipped' ? '#E0F2FE' : '#FEF3C7',
                          color: ord.order_status === 'Delivered' ? 'var(--color-forest-dark)' :
                                 ord.order_status === 'Shipped' ? '#0369A1' : '#92400E',
                          border: '1px solid var(--border-medium)',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Processing">Processing</option>
                        <option value="In Production">In Production</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Add New Bag Form */}
        {activeTab === 'add' && (
          <form onSubmit={handleCreateBag} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Paper Bag Title *
                </label>
                <input
                  type="text"
                  required
                  value={newBag.name}
                  onChange={(e) => setNewBag({ ...newBag, name: e.target.value })}
                  placeholder="e.g. Copper Foil Metallic Gift Bag"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Category *
                </label>
                <select
                  value={newBag.category}
                  onChange={(e) => setNewBag({ ...newBag, category: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px', backgroundColor: '#FFFFFF' }}
                >
                  {CATEGORIES.filter(c => c !== 'All Bags').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Description
              </label>
              <textarea
                rows={3}
                value={newBag.description}
                onChange={(e) => setNewBag({ ...newBag, description: e.target.value })}
                placeholder="Details regarding paper quality, handle reinforcement, and recommended retail applications..."
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Unit Price (₹) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newBag.price}
                  onChange={(e) => setNewBag({ ...newBag, price: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Paper Weight (GSM) *</label>
                <input
                  type="number"
                  required
                  value={newBag.gsm}
                  onChange={(e) => setNewBag({ ...newBag, gsm: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Min Order (MOQ)</label>
                <input
                  type="number"
                  value={newBag.moq}
                  onChange={(e) => setNewBag({ ...newBag, moq: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Available Stock</label>
                <input
                  type="number"
                  value={newBag.stock}
                  onChange={(e) => setNewBag({ ...newBag, stock: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Handle Type
                </label>
                <select
                  value={newBag.handle_type}
                  onChange={(e) => setNewBag({ ...newBag, handle_type: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px', backgroundColor: '#FFFFFF' }}
                >
                  {HANDLE_TYPES.filter(h => h !== 'All Handles').map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Image URL
                </label>
                <input
                  type="url"
                  value={newBag.images[0]}
                  onChange={(e) => setNewBag({ ...newBag, images: [e.target.value] })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={newBag.is_featured}
                  onChange={(e) => setNewBag({ ...newBag, is_featured: e.target.checked })}
                />
                Mark as Featured
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={newBag.is_bestseller}
                  onChange={(e) => setNewBag({ ...newBag, is_bestseller: e.target.checked })}
                />
                Mark as Bestseller
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('products')}
                style={{ padding: '10px 18px', borderRadius: 'var(--radius-md)', fontSize: '13px', border: '1px solid var(--border-medium)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: 700,
                  backgroundColor: 'var(--color-kraft-primary)',
                  color: '#FFFFFF'
                }}
              >
                Save Paper Bag to Store
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
