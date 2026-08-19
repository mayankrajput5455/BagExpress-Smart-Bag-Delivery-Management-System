import React, { useState, useEffect } from 'react';
import { X, Package, Clock, CheckCircle2, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const UserOrdersModal = ({ isOpen, onClose, currentUser }) => {
  if (!isOpen) return null;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserOrders = async () => {
      setLoading(true);
      try {
        const list = await api.getOrders();
        setOrders(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen) fetchUserOrders();
  }, [isOpen]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="artisan-stamp stamp-forest">Delivered</span>;
      case 'Shipped':
        return <span className="artisan-stamp stamp-gold">Dispatched & In Transit</span>;
      case 'In Production':
        return <span className="artisan-stamp stamp-kraft">Printing & Crafting</span>;
      default:
        return <span className="artisan-stamp stamp-kraft">Order Processing</span>;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 80,
      backgroundColor: 'rgba(28, 25, 23, 0.7)',
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
          maxWidth: '780px',
          width: '100%',
          maxHeight: '90vh',
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

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="artisan-stamp stamp-forest">Customer Portal</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--text-primary)', marginTop: '4px' }}>
            My Packaging Orders & Shipments
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Logged in as <strong>{currentUser?.name}</strong> ({currentUser?.email})
          </p>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-secondary)' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#F3ECE2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'var(--color-kraft-primary)'
            }}>
              <Package size={28} />
            </div>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', marginBottom: '8px', color: 'var(--text-primary)' }}>
              No orders placed yet
            </h4>
            <p style={{ fontSize: '13px', maxWidth: '320px', margin: '0 auto 20px', lineHeight: 1.5 }}>
              Explore our selection of 12+ paper bag styles and place your first sustainable packaging order.
            </p>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: 'var(--color-kraft-primary)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 600
              }}
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {orders.map((ord) => (
              <div
                key={ord.id}
                style={{
                  backgroundColor: '#FAF7F2',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  padding: '20px'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Order Number</span>
                    <div style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: 700, color: 'var(--color-kraft-primary)' }}>
                      {ord.order_number}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Date Placed</span>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>
                      {new Date(ord.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Status</span>
                    <div>{getStatusBadge(ord.order_status)}</div>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Total</span>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                      ₹{Number(ord.total_amount).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(ord.items || []).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          backgroundColor: '#E7DFD5',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          {item.quantity}x
                        </span>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</span>
                        {item.gsm && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({item.gsm} GSM)</span>}
                      </div>

                      <span style={{ fontWeight: 700 }}>
                        ₹{(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping Destination */}
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-light)', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    📍 Shipping to: <strong>{ord.shipping_address?.addressLine1}, {ord.shipping_address?.city}, {ord.shipping_address?.state} ({ord.shipping_address?.postalCode})</strong>
                  </div>
                  <div>
                    💳 {ord.payment_method}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
