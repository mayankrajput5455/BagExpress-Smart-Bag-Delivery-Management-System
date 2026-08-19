import React from 'react';
import { CATEGORIES, HANDLE_TYPES } from '../data/products';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const FilterBar = ({
  activeCategory,
  onSelectCategory,
  selectedHandle,
  onSelectHandle,
  sortBy,
  onSelectSort,
  gsmFilter,
  onSelectGsm,
  totalResults
}) => {
  return (
    <div style={{
      maxWidth: '1360px',
      margin: '0 auto 28px',
      padding: '0 24px'
    }}>
      {/* Category Pills */}
      <div style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        paddingBottom: '12px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                backgroundColor: isActive ? 'var(--color-kraft-primary)' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--color-kraft-dark)' : '1px solid var(--border-medium)',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 2px 8px rgba(140, 94, 60, 0.25)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Secondary Controls Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Left: Results Count & Handle Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{totalResults}</strong> paper bag varieties
          </span>

          <div style={{ height: '16px', width: '1px', backgroundColor: 'var(--border-medium)' }} />

          {/* Handle Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Handle:</span>
            <select
              value={selectedHandle}
              onChange={(e) => onSelectHandle(e.target.value)}
              style={{
                fontSize: '12px',
                padding: '5px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-primary)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {HANDLE_TYPES.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* GSM Thickness Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Thickness:</span>
            <select
              value={gsmFilter}
              onChange={(e) => onSelectGsm(e.target.value)}
              style={{
                fontSize: '12px',
                padding: '5px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-primary)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Paper Weights</option>
              <option value="light">Lightweight (60 - 90 GSM)</option>
              <option value="medium">Standard Retail (100 - 150 GSM)</option>
              <option value="heavy">Heavy & Luxury (180 - 280 GSM)</option>
            </select>
          </div>
        </div>

        {/* Right: Sort By */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowUpDown size={14} color="var(--text-muted)" />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSelectSort(e.target.value)}
            style={{
              fontSize: '12px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="featured">Featured & Bestsellers</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="gsm_desc">GSM Thickness (Heaviest First)</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>
    </div>
  );
};
