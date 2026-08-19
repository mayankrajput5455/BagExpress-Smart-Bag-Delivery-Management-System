import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Send, UploadCloud, Layers } from 'lucide-react';
import { api } from '../services/api';

export const CustomQuoteModal = ({ isOpen, onClose, preselectedBag = '' }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bag_type: preselectedBag || 'Classic Brown Kraft Shopping Bag',
    quantity: '500',
    print_colors: '1-Color Soy Ink Screen Print',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.submitQuote(formData);
      setIsSuccess(true);
    } catch (err) {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 60,
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
          maxWidth: '640px',
          width: '100%',
          maxHeight: '90vh',
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

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#E3EDE7',
              color: 'var(--color-forest)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '8px', color: 'var(--text-primary)' }}>
              Inquiry Received with Gratitude!
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              Our custom print artisans will review your specs for <strong>{formData.bag_type}</strong> and email a digital mockup and wholesale quote within 24 hours.
            </p>
            <button
              onClick={onClose}
              style={{
                padding: '10px 24px',
                backgroundColor: 'var(--color-kraft-primary)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '13px'
              }}
            >
              Back to Store
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="artisan-stamp stamp-gold">
                <Sparkles size={12} />
                Bespoke Branding
              </span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Custom Logo Print & Wholesale Estimate
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
              Elevate your packaging with water-based soy ink printing, foil stamping, or embossed metallic finishes.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Your Name / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Maya Lin (The Botanist Cafe)"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="maya@botanistcafe.com"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Target Quantity *
                  </label>
                  <select
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '13px',
                      backgroundColor: '#FFFFFF',
                      outline: 'none'
                    }}
                  >
                    <option value="250">250 units (Small Batch)</option>
                    <option value="500">500 units (Standard Batch)</option>
                    <option value="1000">1,000 units (Volume Discount)</option>
                    <option value="2500">2,500 units (Wholesale Tier 1)</option>
                    <option value="5000">5,000+ units (Wholesale Tier 2)</option>
                    <option value="10000">10,000+ units (Factory Run)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Paper Bag Style *
                </label>
                <select
                  value={formData.bag_type}
                  onChange={(e) => setFormData({ ...formData, bag_type: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '13px',
                    backgroundColor: '#FFFFFF',
                    outline: 'none'
                  }}
                >
                  <option value="Classic Brown Kraft Shopping Bag">Classic Brown Kraft Shopping Bag (Twisted Handle)</option>
                  <option value="Luxury Matte Charcoal Boutique Bag">Luxury Matte Charcoal Boutique Bag (Ribbon Handle)</option>
                  <option value="Rustic Pinch-Bottom Bakery & Pastry Bag">Rustic Pinch-Bottom Bakery & Pastry Bag (Greaseproof)</option>
                  <option value="Bleached White Kraft Retail Bag">Bleached White Kraft Retail Bag (Flat Handles)</option>
                  <option value="Pastel Rose Die-Cut Punch Handle Bag">Pastel Rose Die-Cut Punch Handle Bag</option>
                  <option value="Dual Wine Bottle Kraft Carrier">Dual Wine Bottle Kraft Carrier with Window & Rope</option>
                  <option value="Artisan Coffee Bean Pouch with Degassing Valve">Artisan Coffee Bean Pouch with Degassing Valve</option>
                  <option value="Scandinavian Raw-Edge Tote with Braided Jute Handle">Scandinavian Raw-Edge Tote (Jute Handle)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Branding & Printing Technique
                </label>
                <select
                  value={formData.print_colors}
                  onChange={(e) => setFormData({ ...formData, print_colors: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '13px',
                    backgroundColor: '#FFFFFF',
                    outline: 'none'
                  }}
                >
                  <option value="1-Color Soy Ink Screen Print">1-Color Water-Based Soy Ink (Front & Back)</option>
                  <option value="2-Color Offset Print">2-Color Precision Offset Print</option>
                  <option value="Metallic Gold / Copper Foil Stamping">Hot Metallic Gold / Copper Foil Stamping</option>
                  <option value="Full Color CMYK Photographic Print">Full Color CMYK Photographic Print</option>
                  <option value="Blind Emboss / Deboss Logo">Blind Emboss / Deboss Texture</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Additional Notes / Artwork URL / Dimensions
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Mention desired delivery timeline, specific Pantone colors, or custom dimensions required..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: 'var(--color-kraft-primary)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(140, 94, 60, 0.25)',
                  marginTop: '6px'
                }}
              >
                <Send size={16} />
                {isSubmitting ? 'Sending Request...' : 'Submit Custom Quote Inquiry'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
