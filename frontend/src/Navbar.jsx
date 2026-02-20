import React, { useState, useContext, useEffect } from 'react';
import api from './api/api';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaBars, FaTimes, FaUser, FaUserShield, FaHeart } from 'react-icons/fa';
import { AuthContext } from './AuthContext';
import { CartContext } from './CartContext';
import { WishlistContext } from './WishlistContext';
import './Navbar.css';
import logo from './assets/logo.png';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { getCartCount } = useContext(CartContext);
    const { wishlistItems } = useContext(WishlistContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        api.get('/api/products')
            .then(res => setAllProducts(res.data))
            .catch(err => console.error("Search data fetch error:", err));
    }, []);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim().length > 0) {
            const filtered = allProducts.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.category.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(filtered);
            setShowResults(true);
        } else {
            setShowResults(false);
        }
    };

    const handleResultClick = (id) => {
        navigate(`/product/${id}`);
        setShowResults(false);
        setSearchQuery('');
    };

    // ... handleLogout same as before ... 
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        // ... structure same as before ... 
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    {location.pathname !== '/about' && (
                        <Link to="/" className="navbar-logo">
                            <img src={logo} alt="TopCart" className="navbar-logo-img" />
                        </Link>
                    )}
                    <ul className="nav-menu">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-links">
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/pc" className="nav-links">
                                PC Devices
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/mobile" className="nav-links">
                                Mobile
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/accessories" className="nav-links">
                                Accessories
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/about" className="nav-links">
                                About Me
                            </NavLink>
                        </li>
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <NavLink to="/orders" className="nav-links">
                                        My Orders
                                    </NavLink>
                                </li>
                                <li className="nav-item" onClick={handleLogout}>
                                    <span className="nav-links" style={{ cursor: 'pointer', color: '#e74c3c' }}>
                                        Logout ({user.name.split(' ')[0]})
                                    </span>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link to="/login" className="nav-links">
                                    Login
                                </Link>
                            </li>
                        )}
                    </ul>
                    <div className="nav-icons">
                        <div className="search-container" style={{ position: 'relative' }}>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                if (searchQuery.trim()) {
                                    navigate(`/?search=${searchQuery}`);
                                    setShowResults(false);
                                }
                            }} className="search-form">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={() => { if (searchQuery) setShowResults(true); }}
                                    onBlur={() => setTimeout(() => setShowResults(false), 200)} // Delay to allow click
                                    className="search-input"
                                />
                                <button type="submit" className="search-btn">
                                    <FaSearch className="icon" />
                                </button>
                            </form>

                            {showResults && searchResults.length > 0 && (
                                <div className="search-results-dropdown">
                                    {searchResults.slice(0, 5).map(product => (
                                        <div
                                            key={product.id}
                                            className="search-result-item"
                                            onClick={() => handleResultClick(product.id)}
                                        >
                                            <img
                                                src={product.images && product.images.length > 0 ? product.images[0].url : `/images/${product.name.toLowerCase().replace(/\s+/g, '-').replace('.jpg', '')}.jpg`}
                                                alt={product.name}
                                                className="search-result-img"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                                            />
                                            <div className="search-result-info">
                                                <span className="search-result-name">{product.name}</span>
                                                <span className="search-result-price">
                                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link to="/admin" className="nav-icon-link">
                            <FaUserShield className="icon" />
                        </Link>
                        <Link to="/wishlist" className="nav-icon-link" style={{ position: 'relative' }} title="Wishlist">
                            <FaHeart className="icon" />
                            {wishlistItems && wishlistItems.length > 0 && <span className="cart-badge">{wishlistItems.length}</span>}
                        </Link>
                        <Link to="/cart" className="nav-icon-link" style={{ position: 'relative' }} title="Cart">
                            <FaShoppingCart className="icon" />
                            {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
