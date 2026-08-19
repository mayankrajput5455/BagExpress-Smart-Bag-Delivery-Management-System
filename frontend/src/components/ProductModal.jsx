import React, { useState } from 'react';
import { X, Star, Check, ShieldCheck, Leaf, Package, Layers, Sparkles } from 'lucide-react';

export const ProductModal = ({ product, isOpen, onClose, onAddToCart, onOpenQuote }) => {
  if (!isOpen || !product) return null;

  const images = Array.isArray(product.images)
    ? product.images.map(img => (typeof img === 'string' ? img : img.url || ''))
    : ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'];

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedQty, setSelectedQty] = useState(product.moq || 50);
  const [customQty, setCustomQty] = useState(product.moq || 50);

  const bulkTiers = product.bulk_pricing || [
    { minQty: 50, pricePerUnit: Number(product.discount_price || product.price) },
    { minQty: 250, pricePerUnit: Number(product.discount_price || product.price) * 0.85 },
    { minQty: 1000, pricePerUnit: Number(product.discount_price || product.price) * 0.72 },
    { minQty: 5000, pricePerUnit: Number(product.discount_price || product.price) * 0.58 }
  ];

  // Calculate unit price according to quantity
  const getUnitPrice = (qty) => {
    let unitPrice = Number(product.discount_price || product.price);
    for (let tier of bulkTiers) {
      if (qty >= tier.minQty) {
        unitPrice = tier.pricePerUnit;
      }
    }
    return unitPrice;
  };

  const currentUnitPrice = getUnitPrice(selectedQty);
  const totalPrice = (currentUnitPrice * selectedQty).toFixed(2);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      backgroundColor: 'rgba(28, 25, 23, 0.65)',
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
          maxWidth: '960px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#F3ECE2',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '32px', padding: '36px' }}>
          {/* Left Column: Gallery & Badges */}
          <div>
            <div style={{
              height: '360px',
              backgroundColor: '#F9F6F0',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--border-light)',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={images[activeImgIndex] || images[0]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: activeImgIndex === idx ? '2px solid var(--color-kraft-primary)' : '1px solid var(--border-medium)',
                      opacity: activeImgIndex === idx ? 1 : 0.65
                    }}
                  >
                    <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Eco Certifications & Guarantees */}
            <div style={{
              backgroundColor: '#FBF9F5',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--color-forest-dark)' }}>
                <Leaf size={16} color="var(--color-forest)" />
                <span>100% Recyclable, Biodegradable & Compostable</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--color-kraft-dark)' }}>
                <ShieldCheck size={16} color="var(--color-kraft-primary)" />
                <span>FSC® Certified Sustainably Harvested Wood Pulp</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#8C6212' }}>
                <Check size={16} color="var(--color-gold)" />
                <span>Food Safe & Non-Toxic Water-Based Adhesives</span>
              </div>
            </div>
          </div>

          {/* Right Column: Specs & Bulk Order Selector */}
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <span className="artisan-stamp stamp-kraft">{product.gsm} GSM Weight</span>
              <span className="artisan-stamp stamp-forest">{product.category}</span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.2,
              marginBottom: '10px'
            }}>
              {product.name}
            </h2>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#C69234" color="#C69234" />
                ))}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#8C6212' }}>{product.ratings || 4.9}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({product.num_reviews || 114} verified customer reviews)</span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
              {product.description}
            </p>

            {/* Technical Specs Table */}
            <div style={{
              backgroundColor: '#F8F5EE',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)',
              padding: '14px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-kraft-primary)', marginBottom: '8px' }}>
                Technical Packaging Specifications
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                <div><strong>Paper Substance:</strong> {product.gsm} GSM Kraft</div>
                <div><strong>Handle Type:</strong> {product.handle_type}</div>
                <div><strong>Dimensions:</strong> {product.dimensions || '32 x 24 x 11 cm'}</div>
                <div><strong>Max Load:</strong> {product.load_capacity || '8 kg'}</div>
                <div><strong>Material:</strong> {product.material || 'Virgin Pulp'}</div>
                <div><strong>Stock Status:</strong> {product.stock > 0 ? `In Stock (${product.stock} pcs)` : 'Made to Order'}</div>
              </div>
            </div>

            {/* Bulk Tier Selector */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)' }}>
                  Select Quantity Tier (Bulk Wholesale Discounts)
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-kraft-primary)', fontWeight: 600 }}>
                  Unit: ₹{currentUnitPrice.toFixed(2)}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {bulkTiers.map((tier) => {
                  const isSelected = selectedQty === tier.minQty;
                  return (
                    <button
                      key={tier.minQty}
                      onClick={() => {
                        setSelectedQty(tier.minQty);
                        setCustomQty(tier.minQty);
                      }}
                      style={{
                        padding: '10px 6px',
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'center',
                        backgroundColor: isSelected ? '#F0E6D8' : '#FFFFFF',
                        border: isSelected ? '2px solid var(--color-kraft-primary)' : '1px solid var(--border-medium)',
                        boxShadow: isSelected ? '0 2px 6px rgba(140, 94, 60, 0.15)' : 'none'
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {tier.minQty} pcs
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-kraft-dark)', fontWeight: 600 }}>
                        ₹{tier.pricePerUnit.toFixed(2)}/pc
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Quantity Input & Total Bar */}
            <div style={{
              padding: '16px',
              backgroundColor: '#F3ECE2',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Pack Cost ({selectedQty} units):</span>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  ₹{totalPrice}
                </div>
              </div>

              <button
                onClick={() => {
                  onAddToCart(product, selectedQty);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
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
                <Package size={16} />
                Add {selectedQty} Bags to Cart
              </button>
            </div>

            {/* Custom Print Quote Prompt */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px dashed var(--color-kraft-primary)',
              backgroundColor: '#FFFFFF'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="var(--color-gold)" />
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Want your brand logo hot-stamped or screen printed?</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenQuote(product.name);
                }}
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--color-kraft-dark)',
                  textDecoration: 'underline'
                }}
              >
                Get Custom Quote →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
