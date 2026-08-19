import React from 'react';
import { Star, ShoppingBag, Eye, ShieldAlert, Award } from 'lucide-react';

export const ProductCard = ({ product, onQuickView, onAddToCart }) => {
  const images = Array.isArray(product.images)
    ? product.images.map(img => (typeof img === 'string' ? img : img.url || ''))
    : ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'];

  const mainImage = images[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';
  const effectivePrice = Number(product.discount_price || product.price);
  const originalPrice = Number(product.price);
  const hasDiscount = originalPrice > effectivePrice;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s, border-color 0.2s',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        e.currentTarget.style.borderColor = 'var(--color-kraft-light)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--border-light)';
      }}
    >
      {/* Top Badges */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 2,
        pointerEvents: 'none'
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {product.is_bestseller && (
            <span className="artisan-stamp stamp-terracotta" style={{ pointerEvents: 'auto' }}>
              Bestseller
            </span>
          )}
          {product.is_featured && !product.is_bestseller && (
            <span className="artisan-stamp stamp-forest" style={{ pointerEvents: 'auto' }}>
              Featured
            </span>
          )}
        </div>

        <span className="artisan-stamp stamp-kraft" style={{ pointerEvents: 'auto' }}>
          {product.gsm} GSM
        </span>
      </div>

      {/* Image Gallery Box */}
      <div
        onClick={() => onQuickView(product)}
        style={{
          position: 'relative',
          height: '240px',
          backgroundColor: '#F9F6F0',
          cursor: 'pointer',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img
          src={mainImage}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />

        {/* Overlay Action Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            color: 'var(--text-primary)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            border: '1px solid var(--border-medium)'
          }}
        >
          <Eye size={13} />
          Specs & Tiers
        </button>
      </div>

      {/* Product Content Details */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Category & Rating */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700,
            color: 'var(--color-kraft-primary)'
          }}>
            {product.category}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', fontWeight: 600, color: '#8C6212' }}>
            <Star size={13} fill="#C69234" color="#C69234" />
            <span>{product.ratings || 4.9}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({product.num_reviews || 42})</span>
          </div>
        </div>

        {/* Bag Title */}
        <h3
          onClick={() => onQuickView(product)}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            marginBottom: '8px',
            cursor: 'pointer'
          }}
        >
          {product.name}
        </h3>

        {/* Bag Specs Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          marginBottom: '14px',
          fontSize: '11px',
          color: 'var(--text-secondary)'
        }}>
          <span style={{
            backgroundColor: '#F3ECE2',
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)'
          }}>
            {product.handle_type}
          </span>
          <span style={{
            backgroundColor: '#F3ECE2',
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)'
          }}>
            MOQ: {product.moq || 50} pcs
          </span>
          {product.load_capacity && (
            <span style={{
              backgroundColor: '#EBF3EE',
              color: 'var(--color-forest-dark)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)'
            }}>
              Max {product.load_capacity}
            </span>
          )}
        </div>

        {/* Price & Add to Cart Footer */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '14px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{
                fontSize: '19px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)'
              }}>
                ₹{effectivePrice.toFixed(2)}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ bag</span>
            </div>

            {hasDiscount && (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{originalPrice.toFixed(2)}
              </div>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product, product.moq || 50)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              backgroundColor: 'var(--color-kraft-primary)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(140, 94, 60, 0.25)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-kraft-dark)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-kraft-primary)'}
          >
            <ShoppingBag size={14} />
            Add {product.moq || 50}
          </button>
        </div>
      </div>
    </div>
  );
};
