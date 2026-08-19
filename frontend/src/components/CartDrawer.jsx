import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';

export const CartDrawer = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onProceedCheckout
}) => {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const subtotal = items.reduce((acc, item) => {
    const price = Number(item.discount_price || item.price);
    return acc + price * item.quantity;
  }, 0);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ARTISAN10') {
      setDiscountPercent(10);
      setPromoSuccess('Applied 10% Artisan Packaging Discount!');
      setPromoError('');
    } else if (promoCode.trim().toUpperCase() === 'ECOSAVER') {
      setDiscountPercent(15);
      setPromoSuccess('Applied 15% Eco Saver Bulk Discount!');
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try code ARTISAN10');
      setPromoSuccess('');
    }
  };

  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = taxableSubtotal * 0.18; // 18% GST/VAT
  const freeShippingThreshold = 1500;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 150;
  const grandTotal = taxableSubtotal + tax + shippingFee;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      backgroundColor: 'rgba(28, 25, 23, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div
        className="animate-slide-right"
        style={{
          width: '100%',
          maxWidth: '480px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FAF7F2'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="var(--color-kraft-primary)" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Your Bag Basket ({items.reduce((sum, i) => sum + i.quantity, 0)} items)
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div style={{
          padding: '12px 24px',
          backgroundColor: '#F3ECE2',
          borderBottom: '1px solid var(--border-medium)',
          fontSize: '12px'
        }}>
          {subtotal >= freeShippingThreshold ? (
            <div style={{ color: 'var(--color-forest-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🎉 Congratulations! You have unlocked Free Dispatch Freight</span>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                <span>Add <strong>₹{(freeShippingThreshold - subtotal).toFixed(2)}</strong> more for Free Shipping</span>
                <span style={{ fontWeight: 700 }}>{Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#E7DFD5', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                  height: '100%',
                  backgroundColor: 'var(--color-forest)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#F3ECE2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'var(--color-kraft-primary)'
              }}>
                <ShoppingBag size={28} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                Your packaging basket is empty
              </h4>
              <p style={{ fontSize: '13px', maxWidth: '280px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                Select from our 12+ artisanal paper bags tailored for retail, boutique, food, and wine packaging.
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
                Browse Paper Bags
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item) => {
                const itemImg = Array.isArray(item.images)
                  ? (typeof item.images[0] === 'string' ? item.images[0] : item.images[0]?.url || '')
                  : item.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';
                const unitPrice = Number(item.discount_price || item.price);
                const step = item.moq || 25;

                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '14px',
                      padding: '14px',
                      backgroundColor: '#FAF7F2',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <img
                      src={itemImg}
                      alt={item.name}
                      style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          style={{ color: 'var(--text-muted)', padding: '2px' }}
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {item.gsm} GSM • {item.handle_type}
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '12px'
                      }}>
                        {/* Quantity Counter */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-sm)'
                        }}>
                          <button
                            onClick={() => onUpdateQty(item.id, Math.max(step, item.quantity - step))}
                            style={{ padding: '4px 8px', color: 'var(--text-primary)' }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: '12px', fontWeight: 700, padding: '0 8px', minWidth: '40px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.id, item.quantity + step)}
                            style={{ padding: '4px 8px', color: 'var(--text-primary)' }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                            ₹{(unitPrice * item.quantity).toFixed(2)}
                          </span>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            (₹{unitPrice.toFixed(2)} / bag)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: '#FAF7F2'
          }}>
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo Code (e.g. ARTISAN10)"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-medium)',
                  fontSize: '12px',
                  outline: 'none',
                  textTransform: 'uppercase'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-kraft-primary)',
                  color: 'var(--color-kraft-dark)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 700
                }}
              >
                Apply
              </button>
            </form>

            {promoSuccess && <div style={{ fontSize: '11px', color: 'var(--color-forest)', marginBottom: '8px', fontWeight: 600 }}>{promoSuccess}</div>}
            {promoError && <div style={{ fontSize: '11px', color: 'var(--color-terracotta)', marginBottom: '8px', fontWeight: 600 }}>{promoError}</div>}

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              {discountPercent > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-forest)' }}>
                  <span>Discount ({discountPercent}%):</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>GST / Packaging Tax (18%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Shipping Freight:</span>
                <span>{shippingFee === 0 ? <strong style={{ color: 'var(--color-forest)' }}>FREE</strong> : `₹${shippingFee.toFixed(2)}`}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '17px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                borderTop: '1px solid var(--border-medium)',
                paddingTop: '10px',
                marginTop: '4px'
              }}>
                <span>Total Amount:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onProceedCheckout({
                  items,
                  subtotal,
                  discountAmount,
                  tax,
                  shippingFee,
                  grandTotal
                });
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px',
                backgroundColor: 'var(--color-kraft-primary)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(140, 94, 60, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-kraft-dark)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-kraft-primary)'}
            >
              Proceed to Secure Checkout
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
