import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Hero from './Hero';
import ProductList from './ProductList';
import { AuthProvider } from './AuthContext';
import Login from './Login';
import About from './About';
import './App.css';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import ProductDetails from './ProductDetails';
import Cart from './Cart';
import Wishlist from './Wishlist';
import OrderHistory from './OrderHistory';
import ChatBot from './ChatBot';

import AdminDashboard from './AdminDashboard';
import ProtectedRoute from './ProtectedRoute';

// Placeholder Pages for now
const Home = () => (
  <>
    <Hero />
    <ProductList />
  </>
);

const PCPage = () => (
  <>
    <ProductList category="PC Devices" />
  </>
);

const MobilePage = () => (
  <>
    <ProductList category="Mobile Devices" />
  </>
);

const AccessoriesPage = () => (
  <>
    <ProductList category="Accessories" />
  </>
);

const Features = () => <h1 className='page-title'>Features Page (Coming Soon)</h1>;
const Services = () => <h1 className='page-title'>Services Page (Coming Soon)</h1>;
// About page is now in a separate component

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div className="app-container">
              <Navbar />
              <div className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/pc" element={<PCPage />} />
                  <Route path="/mobile" element={<MobilePage />} />
                  <Route path="/accessories" element={<AccessoriesPage />} />
                  <Route path="/admin" element={<ProtectedAdmin />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<ProtectedCart />} />
                  <Route path="/wishlist" element={<ProtectedWishlist />} />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <OrderHistory />
                    </ProtectedRoute>
                  } />
                </Routes>
              </div>
              <Footer />
              <ChatBot />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

// Wrapper components for Protected Routes to use the hook inside Router context (if needed, or just use ProtectedRoute directly)
const ProtectedCart = () => (
  <ProtectedRoute>
    <Cart />
  </ProtectedRoute>
);

const ProtectedWishlist = () => (
  <ProtectedRoute>
    <Wishlist />
  </ProtectedRoute>
);

const ProtectedAdmin = () => (
  <ProtectedRoute>
    <AdminDashboard />
  </ProtectedRoute>
);

export default App;
