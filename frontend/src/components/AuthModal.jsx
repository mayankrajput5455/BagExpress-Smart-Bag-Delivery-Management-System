import React, { useState } from 'react';
import { X, User, ShieldCheck, Mail, Lock, Phone, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('user'); // 'user' | 'admin'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle1ClickFill = (fillRole) => {
    if (fillRole === 'admin') {
      setEmail('admin@bagexpress.com');
      setPassword('admin123');
      setRole('admin');
      setError('');
    } else {
      setEmail('demo@bagexpress.com');
      setPassword('demo123');
      setRole('user');
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.login(email, password);
        if (res.success) {
          onAuthSuccess(res.user);
          onClose();
        } else {
          setError(res.message || 'Invalid email or password');
        }
      } else {
        const res = await api.register(name, email, password, role, phone);
        if (res.success) {
          onAuthSuccess(res.user);
          onClose();
        } else {
          setError(res.message || 'Registration failed');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 80,
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
          maxWidth: '460px',
          width: '100%',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-xl)',
          padding: '32px',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
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

        {/* 1-Click Quick Demo Bar */}
        <div style={{
          backgroundColor: '#FAF7F2',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-medium)',
          padding: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-kraft-primary)', marginBottom: '8px' }}>
            ⚡ 1-Click Test Login Credentials
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handle1ClickFill('admin')}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#E3EDE7',
                border: '1px solid #B8D4C3',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--color-forest-dark)',
                textAlign: 'left'
              }}
            >
              🛡️ Admin User <br />
              <span style={{ fontSize: '10px', fontWeight: 400, opacity: 0.8 }}>admin@bagexpress.com</span>
            </button>

            <button
              type="button"
              onClick={() => handle1ClickFill('user')}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#F0E6D8',
                border: '1px solid var(--color-kraft-light)',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--color-kraft-dark)',
                textAlign: 'left'
              }}
            >
              🛍️ Retail Buyer <br />
              <span style={{ fontSize: '10px', fontWeight: 400, opacity: 0.8 }}>demo@bagexpress.com</span>
            </button>
          </div>
        </div>

        {/* Mode Switch Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-light)',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            style={{
              flex: 1,
              paddingBottom: '10px',
              fontSize: '14px',
              fontWeight: mode === 'login' ? 700 : 500,
              color: mode === 'login' ? 'var(--color-kraft-primary)' : 'var(--text-muted)',
              borderBottom: mode === 'login' ? '2px solid var(--color-kraft-primary)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            style={{
              flex: 1,
              paddingBottom: '10px',
              fontSize: '14px',
              fontWeight: mode === 'register' ? 700 : 500,
              color: mode === 'register' ? 'var(--color-kraft-primary)' : 'var(--text-muted)',
              borderBottom: mode === 'register' ? '2px solid var(--color-kraft-primary)' : 'none'
            }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FBECE8',
            color: '#9C3D23',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '16px',
            border: '1px solid #F3C4B6'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'register' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Mayank Rajput"
                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Account Role
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    style={{
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      border: role === 'user' ? '2px solid var(--color-kraft-primary)' : '1px solid var(--border-medium)',
                      backgroundColor: role === 'user' ? '#F0E6D8' : '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                  >
                    🛍️ Retail Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    style={{
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      border: role === 'admin' ? '2px solid var(--color-forest)' : '1px solid var(--border-medium)',
                      backgroundColor: role === 'admin' ? '#E3EDE7' : '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                  >
                    🛡️ Administrator
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '13px', outline: 'none' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              backgroundColor: 'var(--color-kraft-primary)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(140, 94, 60, 0.25)',
              marginTop: '8px'
            }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In to Bag Express' : 'Complete Registration'}
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
