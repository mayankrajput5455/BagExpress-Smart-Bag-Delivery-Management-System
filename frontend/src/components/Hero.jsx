import React from 'react';
import { Leaf, Award, Truck, ShieldCheck, ArrowRight } from 'lucide-react';

export const Hero = ({ onOpenQuote, onExploreCatalog }) => {
  return (
    <section style={{
      maxWidth: '1360px',
      margin: '24px auto',
      padding: '0 24px'
    }}>
      <div style={{
        backgroundColor: '#F4ECE1',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-medium)',
        padding: '48px 40px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '40px',
        alignItems: 'center'
      }}>
        {/* Left Content */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span className="artisan-stamp stamp-forest">
              <Leaf size={12} />
              100% Biodegradable & Compostable
            </span>
            <span className="artisan-stamp stamp-kraft">
              <Award size={12} />
              FSC® Certified Pulp
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '38px',
            lineHeight: '1.2',
            color: 'var(--text-primary)',
            marginBottom: '16px',
            fontWeight: 700
          }}>
            Tactile, Sustainable Paper Bags <br />
            <span style={{ color: 'var(--color-kraft-primary)', fontStyle: 'italic' }}>
              Crafted for Conscious Brands
            </span>
          </h1>

          <p style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            maxWidth: '560px',
            marginBottom: '28px'
          }}>
            From 60 GSM greaseproof artisan bakery bags to 280 GSM luxury ribbon-handled boutique carriers. Precision-folded, reinforced bases, and bespoke soy-ink logo printing starting at just 25 units.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={onExploreCatalog}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: 'var(--color-forest)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(43, 66, 54, 0.25)'
              }}
            >
              Explore 12+ Bag Varieties
              <ArrowRight size={16} />
            </button>

            <button
              onClick={onOpenQuote}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 22px',
                backgroundColor: '#FFFFFF',
                color: 'var(--color-kraft-dark)',
                border: '1px solid var(--color-kraft-primary)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: 600
              }}
            >
              Custom Logo Printing Quote
            </button>
          </div>
        </div>

        {/* Right Feature Showcase Box */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '28px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{
            fontSize: '13px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--color-kraft-primary)',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '10px'
          }}>
            Why Retailers & Cafes Choose Bag Express
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#E3EDE7',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: 'var(--color-forest)'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Heavy Burst & Load Capacity</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Reinforced bottom turn-tops and multi-ply kraft options holding up to 25 kg.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#F0E6D8',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: 'var(--color-kraft-dark)'
            }}>
              <Truck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Fast Dispatch & Free Freight</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Stock items ship in 24-48 hours. Free freight on wholesale orders over ₹1,500.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#FEF6E4',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#8C6212'
            }}>
              <Award size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Transparent Bulk Tier Pricing</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Automatic bulk discounts from 50 to 10,000+ units calculated live in cart.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
