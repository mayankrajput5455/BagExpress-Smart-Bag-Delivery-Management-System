import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CustomQuoteModal } from './components/CustomQuoteModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { UserOrdersModal } from './components/UserOrdersModal';
import { Footer } from './components/Footer';
import { api } from './services/api';
import { Check, ShoppingBag, ArrowUp } from 'lucide-react';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [activeCategory, setActiveCategory] = useState('All Bags');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHandle, setSelectedHandle] = useState('All Handles');
  const [gsmFilter, setGsmFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteBagName, setQuoteBagName] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isUserOrdersOpen, setIsUserOrdersOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');

  // Current User Auth State
  const [currentUser, setCurrentUser] = useState(() => api.getCurrentUser());

  // Cart State (Persisted in localStorage)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('bagexpress_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('bagexpress_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Load Products
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Cart Actions
  const handleAddToCart = (product, quantity) => {
    const qty = quantity || product.moq || 50;
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += qty;
        return updated;
      } else {
        return [...prev, { ...product, quantity: qty }];
      }
    });
    showToast(`Added ${qty} units of ${product.name} to basket!`);
  };

  const handleUpdateCartQty = (id, newQty) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveCartItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Auth Handlers
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`);
    if (user.role === 'admin') {
      setIsAdminModalOpen(true);
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    showToast('Logged out successfully.');
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category Filter
    if (activeCategory !== 'All Bags') {
      list = list.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.material && p.material.toLowerCase().includes(q)) ||
        (p.handle_type && p.handle_type.toLowerCase().includes(q))
      );
    }

    // Handle Type Filter
    if (selectedHandle !== 'All Handles') {
      list = list.filter(p => p.handle_type && p.handle_type.toLowerCase().includes(selectedHandle.toLowerCase()));
    }

    // GSM Filter
    if (gsmFilter === 'light') {
      list = list.filter(p => p.gsm <= 90);
    } else if (gsmFilter === 'medium') {
      list = list.filter(p => p.gsm >= 100 && p.gsm <= 150);
    } else if (gsmFilter === 'heavy') {
      list = list.filter(p => p.gsm >= 180);
    }

    // Sort By
    if (sortBy === 'price_asc') {
      list.sort((a, b) => Number(a.discount_price || a.price) - Number(b.discount_price || b.price));
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => Number(b.discount_price || b.price) - Number(a.discount_price || a.price));
    } else if (sortBy === 'gsm_desc') {
      list.sort((a, b) => Number(b.gsm) - Number(a.gsm));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => Number(b.ratings || 0) - Number(a.ratings || 0));
    } else {
      // Default: Featured and bestsellers first
      list.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0));
    }

    return list;
  }, [products, activeCategory, searchQuery, selectedHandle, gsmFilter, sortBy]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999,
            backgroundColor: 'var(--bg-dark)',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            fontWeight: 600,
            border: '1px solid var(--color-kraft-primary)'
          }}
        >
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--color-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={13} color="#FFFFFF" strokeWidth={3} />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        cartCount={cartItems.length}
        wishlistCount={0}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenUserOrders={() => setIsUserOrdersOpen(true)}
        onOpenQuote={() => {
          setQuoteBagName('');
          setIsQuoteModalOpen(true);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchQuery('');
        }}
      />

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <Hero
          onOpenQuote={() => {
            setQuoteBagName('');
            setIsQuoteModalOpen(true);
          }}
          onExploreCatalog={() => {
            const el = document.getElementById('catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Catalog Section */}
        <section id="catalog-section" style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 24px' }}>
          {/* Filter Bar */}
          <FilterBar
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            selectedHandle={selectedHandle}
            onSelectHandle={setSelectedHandle}
            sortBy={sortBy}
            onSelectSort={setSortBy}
            gsmFilter={gsmFilter}
            onSelectGsm={setGsmFilter}
            totalResults={filteredProducts.length}
          />

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: '#F3ECE2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
                color: 'var(--color-kraft-primary)'
              }}>
                <ShoppingBag size={26} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', marginBottom: '6px' }}>
                No matching paper bags found
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                Try resetting your search query or selecting another thickness or handle filter.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('All Bags');
                  setSearchQuery('');
                  setSelectedHandle('All Handles');
                  setGsmFilter('all');
                }}
                style={{
                  padding: '9px 18px',
                  backgroundColor: 'var(--color-kraft-primary)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '40px'
            }}>
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onQuickView={(p) => {
                    setSelectedProduct(p);
                    setIsProductModalOpen(true);
                  }}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onOpenQuote={() => {
          setQuoteBagName('');
          setIsQuoteModalOpen(true);
        }}
      />

      {/* Modals & Slide-overs */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        onAddToCart={handleAddToCart}
        onOpenQuote={(bagName) => {
          setQuoteBagName(bagName);
          setIsQuoteModalOpen(true);
        }}
      />

      <CustomQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        preselectedBag={quoteBagName}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedCheckout={(data) => {
          setCheckoutData(data);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        checkoutData={checkoutData}
        currentUser={currentUser}
        onOrderSuccess={() => {
          handleClearCart();
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onRefreshProducts={loadProducts}
      />

      <UserOrdersModal
        isOpen={isUserOrdersOpen}
        onClose={() => setIsUserOrdersOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}

export default App;
