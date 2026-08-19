import React from 'react';
import { ShoppingBag, Search, User, ShieldCheck, Heart, Sparkles, LogOut, Package } from 'lucide-react';
import { Logo } from './Logo';

export const Navbar = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenAuth,
  onOpenAdmin,
  onOpenUserOrders,
  onOpenQuote,
  currentUser,
  onLogout,
  searchQuery,
  setSearchQuery,
  onSelectCategory,
  activeCategory
}) => {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backgroundColor: 'rgba(251, 249, 245, 0.94)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-light)'
    }}>
      {/* Top Banner */}
      <div style={{
        backgroundColor: 'var(--bg-dark)',
        color: '#DDB892',
        padding: '7px 16px',
        fontSize: '12px',
        fontWeight: 500,
        letterSpacing: '0.04em',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
          <span style={{ color: '#E9D8A6' }}>🌿 100% Recyclable FSC® Certified Virgin & Recycled Kraft</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>Wholesale Bulk Tiers Up To 45% Off</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <button
            onClick={onOpenQuote}
            style={{
              color: '#F4EFEA',
              textDecoration: 'underline',
              fontWeight: 600,
              fontSize: '12px',
              padding: '0 4px'
            }}
          >
            Request Custom Logo Print →
          </button>
        </div>
      </div>

      {/* Main Nav */}
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px'
      }}>
        {/* Brand Logo */}
        <div
          onClick={() => onSelectCategory('All Bags')}
          style={{ cursor: 'pointer' }}
          title="BagExpress Home"
        >
          <Logo size={42} theme="light" />
        </div>

        {/* Search Bar */}
        <div style={{
          flex: 1,
          maxWidth: '460px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search kraft totes, GSM thickness, ribbon handles, bakery bags..."
            style={{
              width: '100%',
              padding: '10px 14px 10px 42px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-kraft-primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(140, 94, 60, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-medium)';
              e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                fontSize: '12px',
                color: 'var(--text-muted)',
                fontWeight: 600
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Custom Quote Button */}
          <button
            onClick={onOpenQuote}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: '#F3ECE2',
              color: 'var(--color-kraft-dark)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            <Sparkles size={14} color="var(--color-gold)" />
            Custom Print
          </button>

          {/* User / Admin Authentication */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {currentUser.role === 'admin' ? (
                <button
                  onClick={onOpenAdmin}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    backgroundColor: 'var(--color-forest)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    fontWeight: 600,
                    boxShadow: '0 2px 6px rgba(43, 66, 54, 0.25)'
                  }}
                >
                  <ShieldCheck size={16} />
                  Admin Panel
                </button>
              ) : (
                <button
                  onClick={onOpenUserOrders}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--text-primary)'
                  }}
                >
                  <Package size={15} color="var(--color-kraft-primary)" />
                  My Orders
                </button>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: currentUser.role === 'admin' ? '#E3EDE7' : '#F0E6D8',
                  color: currentUser.role === 'admin' ? 'var(--color-forest-dark)' : 'var(--color-kraft-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700
                }}>
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {currentUser.name.split(' ')[0]}
                </span>
                <button
                  onClick={onLogout}
                  title="Log out"
                  style={{ color: 'var(--text-muted)', padding: '2px 4px' }}
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: 'var(--color-kraft-primary)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(140, 94, 60, 0.25)'
              }}
            >
              <User size={16} />
              Sign In / Admin
            </button>
          )}

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <ShoppingBag size={20} color="var(--color-kraft-dark)" />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                backgroundColor: 'var(--color-terracotta)',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 800,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(200, 100, 70, 0.4)'
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
