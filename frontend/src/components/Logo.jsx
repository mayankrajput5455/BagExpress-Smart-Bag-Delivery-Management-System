import React from 'react';

export const Logo = ({ size = 42, theme = 'light', showText = true, subtitle = 'Artisan Paper & Packaging' }) => {
  const isDark = theme === 'dark';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', userSelect: 'none' }}>
      {/* Dynamic Emblem */}
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          position: 'relative',
          borderRadius: `${Math.max(10, size * 0.28)}px`,
          background: 'linear-gradient(135deg, #2D4438 0%, #15241C 100%)',
          border: '1.5px solid rgba(221, 184, 146, 0.45)',
          boxShadow: isDark
            ? '0 4px 14px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
            : '0 4px 12px rgba(43, 66, 54, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
          cursor: 'pointer'
        }}
        className="bagexpress-logo-icon"
      >
        <svg
          viewBox="0 0 64 64"
          width={size * 0.85}
          height={size * 0.85}
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id={`kraftGrad-${size}-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F0C38D" />
              <stop offset="50%" stopColor="#C88E5B" />
              <stop offset="100%" stopColor="#966035" />
            </linearGradient>
            <linearGradient id={`foldGrad-${size}-${theme}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#754721" />
              <stop offset="100%" stopColor="#966035" />
            </linearGradient>
            <linearGradient id={`goldGrad-${size}-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF0C2" />
              <stop offset="50%" stopColor="#E5B25D" />
              <stop offset="100%" stopColor="#BA8328" />
            </linearGradient>
          </defs>

          {/* Bag Handle */}
          <path
            d="M26 23 C 26 13, 38 13, 38 23"
            fill="none"
            stroke={`url(#goldGrad-${size}-${theme})`}
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Main Bag Body */}
          <g>
            <path
              d="M17 22 L47 22 L44 51 C44 52.5 42.8 53.5 41.3 53.5 L22.7 53.5 C21.2 53.5 20 52.5 20 51 Z"
              fill={`url(#kraftGrad-${size}-${theme})`}
            />
            {/* 3D Gusset Shadow */}
            <path
              d="M37 22 L47 22 L44 51 C44 52.5 42.8 53.5 41.3 53.5 L36 53.5 Z"
              fill={`url(#foldGrad-${size}-${theme})`}
              opacity="0.45"
            />
            {/* Bag Lip Top Edge */}
            <path d="M16 22 L48 22 L47 25.5 L17 25.5 Z" fill="#5F3616" opacity="0.65" />
            
            {/* Express Dynamic Bolt Mark */}
            <path
              d="M28 33 L37 33 L32 41 L38 41 L27 50 L30 41 L25 41 Z"
              fill={`url(#goldGrad-${size}-${theme})`}
            />
          </g>

          {/* Eco Leaf Badge */}
          <circle cx="48" cy="14" r="4" fill="#34D399" />
          <path d="M48 11.2 C 50.5 13, 50.5 15, 48 16.8 C 45.5 15, 45.5 13, 48 11.2 Z" fill="#13231B" />
        </svg>
      </div>

      {/* Typography */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: `${Math.round(size * 0.52)}px`,
            fontWeight: 800,
            letterSpacing: '0.04em',
            color: isDark ? '#FAF7F2' : 'var(--text-primary)',
            lineHeight: 1.1,
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <span>BAG</span>
            <span style={{
              color: isDark ? '#DDB892' : 'var(--color-kraft-primary)',
              position: 'relative'
            }}>
              EXPRESS
            </span>
          </div>

          {subtitle && (
            <div style={{
              fontSize: `${Math.max(9, Math.round(size * 0.23))}px`,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: isDark ? '#A3B1A9' : 'var(--color-kraft-primary)',
              marginTop: '1px'
            }}>
              {subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
