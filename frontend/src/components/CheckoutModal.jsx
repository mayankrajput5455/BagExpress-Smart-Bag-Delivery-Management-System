import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, Truck, ShieldCheck, MapPin, Building, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export const CheckoutModal = ({
  isOpen,
  onClose,
  checkoutData,
  currentUser,
  onOrderSuccess
}) => {
  if (!isOpen || !checkoutData) return null;

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const [formData, setFormData] = useState({
    fullName: currentUser ? currentUser.name : '',
    email: currentUser ? currentUser.email : '',
    phone: currentUser?.phone || '+91 98765 43210',
    businessName: '',
    addressLine1: '45 Artisan Boulevard, Design District',
    addressLine2: 'Suite 300',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India',
    paymentMethod: 'card', // card | upi | cod | invoice
    cardNumber: '4242 •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '888',
    upiId: 'artisan@okaxis'
  });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderPayload = {
      items: checkoutData.items.map(i => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        price: Number(i.discount_price || i.price),
        gsm: i.gsm,
        handle_type: i.handle_type,
        image: Array.isArray(i.images) ? (typeof i.images[0] === 'string' ? i.images[0] : i.images[0]?.url || '') : i.image
      })),
      shippingAddress: {
        fullName: formData.fullName,
        phone: formData.phone,
        businessName: formData.businessName,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country
      },
      customerName: formData.fullName,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      subtotal: checkoutData.subtotal,
      tax: checkoutData.tax,
      shippingFee: checkoutData.shippingFee,
      totalAmount: checkoutData.grandTotal,
      paymentMethod: formData.paymentMethod === 'card' ? 'Online Card (Visa/MasterCard)' :
                     formData.paymentMethod === 'upi' ? 'UPI Instant Payment' :
                     formData.paymentMethod === 'invoice' ? 'Corporate Net-30 Invoice' : 'Cash on Delivery'
    };

    try {
      const res = await api.createOrder(orderPayload);
      if (res.success) {
        setCreatedOrder(res.order);
        setStep(3);
        onOrderSuccess();
      }
    } catch (err) {
      console.error('Order placement failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 70,
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
          maxHeight: '92vh',
          overflowY: 'auto',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-xl)',
          padding: '36px',
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

        {/* Step 3: Order Confirmation */}
        {step === 3 && createdOrder && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '68px',
              height: '68px',
              backgroundColor: '#E3EDE7',
              color: 'var(--color-forest)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={40} />
            </div>

            <div style={{ display: 'inline-block', marginBottom: '8px' }}>
              <span className="artisan-stamp stamp-forest">Packaging Order Confirmed</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--text-primary)', marginBottom: '6px' }}>
              Thank You for Your Order!
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Order Reference: <strong style={{ color: 'var(--color-kraft-primary)', fontFamily: 'monospace', fontSize: '15px' }}>{createdOrder.order_number}</strong>
            </p>

            {/* Summary Box */}
            <div style={{
              backgroundColor: '#FAF7F2',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              padding: '20px',
              textAlign: 'left',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                Delivery & Fulfillment Details
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Customer:</span>
                  <div style={{ fontWeight: 600 }}>{createdOrder.customer_name} ({createdOrder.customer_email})</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
                  <div style={{ fontWeight: 600 }}>{createdOrder.payment_method}</div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Shipping To:</span>
                  <div style={{ fontWeight: 600 }}>
                    {createdOrder.shipping_address?.addressLine1}, {createdOrder.shipping_address?.city}, {createdOrder.shipping_address?.state} - {createdOrder.shipping_address?.postalCode}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Total Paid Amount:</span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-kraft-dark)', fontFamily: 'var(--font-display)' }}>
                  ₹{Number(createdOrder.total_amount).toFixed(2)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '12px 28px',
                  backgroundColor: 'var(--color-kraft-primary)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '14px'
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* Step 1 & 2 Form */}
        {step !== 3 && (
          <div>
            {/* Header Stepper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 700,
                color: step === 1 ? 'var(--color-kraft-primary)' : 'var(--color-forest)'
              }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: step === 1 ? 'var(--color-kraft-primary)' : '#E3EDE7',
                  color: step === 1 ? '#FFFFFF' : 'var(--color-forest-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}>1</span>
                Shipping Address
              </div>

              <div style={{ width: '32px', height: '1px', backgroundColor: 'var(--border-medium)' }} />

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 700,
                color: step === 2 ? 'var(--color-kraft-primary)' : 'var(--text-muted)'
              }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: step === 2 ? 'var(--color-kraft-primary)' : '#F3ECE2',
                  color: step === 2 ? '#FFFFFF' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}>2</span>
                Payment & Review
              </div>
            </div>

            <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handlePlaceOrder}>
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Mayank Rajput"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Email Address (for tracking & invoice) *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="demo@bagexpress.com"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Company / Store Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="e.g. Atelier Botanica"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Street Address & Warehouse / Unit *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                      placeholder="Street address or P.O. Box"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>City *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>State *</label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>PIN / Postal Code *</label>
                      <input
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        backgroundColor: 'var(--color-kraft-primary)',
                        color: '#FFFFFF',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '14px',
                        fontWeight: 700
                      }}
                    >
                      Continue to Payment
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Choose Payment Method
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { id: 'card', label: 'Card / Debit', icon: <CreditCard size={18} /> },
                      { id: 'upi', label: 'UPI / NetBanking', icon: <span>⚡ UPI</span> },
                      { id: 'cod', label: 'Cash on Delivery', icon: <Truck size={18} /> }
                    ].map(method => (
                      <button
                        type="button"
                        key={method.id}
                        onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                        style={{
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          border: formData.paymentMethod === method.id ? '2px solid var(--color-kraft-primary)' : '1px solid var(--border-medium)',
                          backgroundColor: formData.paymentMethod === method.id ? '#F0E6D8' : '#FFFFFF',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: 'var(--text-primary)'
                        }}
                      >
                        {method.icon}
                        {method.label}
                      </button>
                    ))}
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <div style={{ backgroundColor: '#FAF7F2', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Card Number</label>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px' }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Expiry (MM/YY)</label>
                          <input
                            type="text"
                            value={formData.cardExpiry}
                            onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>CVC</label>
                          <input
                            type="text"
                            value={formData.cardCvc}
                            onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'upi' && (
                    <div style={{ backgroundColor: '#FAF7F2', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Virtual Payment Address (VPA / UPI ID)</label>
                      <input
                        type="text"
                        value={formData.upiId}
                        onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                        placeholder="yourname@okhdfcbank"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px' }}
                      />
                    </div>
                  )}

                  {/* Order Total Highlight */}
                  <div style={{
                    padding: '14px 18px',
                    backgroundColor: '#F3ECE2',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 700 }}>Grand Total Payable:</span>
                    <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-kraft-dark)', fontFamily: 'var(--font-display)' }}>
                      ₹{checkoutData.grandTotal.toFixed(2)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}
                    >
                      ← Back to Address
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        padding: '12px 28px',
                        backgroundColor: 'var(--color-forest)',
                        color: '#FFFFFF',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '14px',
                        fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(43, 66, 54, 0.25)'
                      }}
                    >
                      {isSubmitting ? 'Placing Order...' : `Pay ₹${checkoutData.grandTotal.toFixed(2)} & Place Order`}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
