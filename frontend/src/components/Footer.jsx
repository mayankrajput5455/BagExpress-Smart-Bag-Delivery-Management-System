import React from 'react';
import { ShoppingBag, Leaf, ShieldCheck, Mail, Phone, MapPin, Award } from 'lucide-react';
import { Logo } from './Logo';

export const Footer = ({ onSelectCategory, onOpenQuote }) => {
  return (
    <footer style={{
      backgroundColor: '#1E2421',
      color: '#FAF7F2',
      marginTop: '60px',
      borderTop: '3px solid #8C5E3C'
    }}>
      {/* Top Value Promise Band */}
      <div style={{
        borderBottom: '1px solid #2F3B35',
        padding: '28px 24px'
      }}>
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#2B4236', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DDB892' }}>
              <Leaf size={20} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>100% Eco-Conscious</div>
              <div style={{ fontSize: '11px', color: '#A3B1A9' }}>Zero plastic, 100% biodegradable kraft</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#2B4236', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DDB892' }}>
              <Award size={20} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>FSC® Certified Mills</div>
              <div style={{ fontSize: '11px', color: '#A3B1A9' }}>Responsibly harvested virgin wood pulp</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#2B4236', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DDB892' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Heavy Duty Tested</div>
              <div style={{ fontSize: '11px', color: '#A3B1A9' }}>Rigorous burst factor & weight tests</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '48px 24px',
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr',
        gap: '40px'
      }}>
        {/* Brand Story */}
        <div>
          <div style={{ marginBottom: '16px' }}>
            <Logo size={36} theme="dark" />
          </div>

          <p style={{ fontSize: '13px', color: '#B3BEB7', lineHeight: 1.6, marginBottom: '18px' }}>
            Specialized artisan manufacturers of sustainable paper carriers, luxury boutique gift bags, food-grade bakery bags, and heavy-duty industrial multi-wall sacks.
          </p>

          <div style={{ fontSize: '12px', color: '#A3B1A9' }}>
            © 2026 Bag Express Packaging Atelier. All rights reserved.
          </div>
        </div>

        {/* Paper Bag Categories */}
        <div>
          <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: '#DDB892', marginBottom: '14px' }}>
            Packaging Lines
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#B3BEB7' }}>
            <li><button onClick={() => onSelectCategory('Retail & Shopping')} style={{ color: 'inherit' }}>Retail Kraft Shoppers</button></li>
            <li><button onClick={() => onSelectCategory('Luxury & Boutique')} style={{ color: 'inherit' }}>Luxury Ribbon Handled</button></li>
            <li><button onClick={() => onSelectCategory('Food & Bakery')} style={{ color: 'inherit' }}>Greaseproof Bakery & Takeout</button></li>
            <li><button onClick={() => onSelectCategory('Beverage & Gifts')} style={{ color: 'inherit' }}>Wine & Spirits Carriers</button></li>
            <li><button onClick={() => onSelectCategory('Industrial & Bulk')} style={{ color: 'inherit' }}>3-Ply Industrial Sacks</button></li>
          </ul>
        </div>

        {/* Bespoke Services */}
        <div>
          <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: '#DDB892', marginBottom: '14px' }}>
            Bespoke Services
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#B3BEB7' }}>
            <li><button onClick={onOpenQuote} style={{ color: 'inherit' }}>Soy-Ink Screen Printing</button></li>
            <li><button onClick={onOpenQuote} style={{ color: 'inherit' }}>Hot Gold & Copper Foil</button></li>
            <li><button onClick={onOpenQuote} style={{ color: 'inherit' }}>Custom Bag Dimensions</button></li>
            <li><button onClick={onOpenQuote} style={{ color: 'inherit' }}>Wholesale Container Orders</button></li>
          </ul>
        </div>

        {/* Contact & Factory */}
        <div>
          <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: '#DDB892', marginBottom: '14px' }}>
            Atelier & Factory
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#B3BEB7' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <MapPin size={16} color="var(--color-kraft-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Plot 42, Eco-Craft Industrial Park, Phase II, Mumbai, India</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Phone size={16} color="var(--color-kraft-light)" style={{ flexShrink: 0 }} />
              <span>+91 98765 43210 / 1800-BAG-EXPRESS</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Mail size={16} color="var(--color-kraft-light)" style={{ flexShrink: 0 }} />
              <span>support@bagexpress.com</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
