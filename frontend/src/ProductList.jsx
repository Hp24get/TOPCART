import React, { useState, useEffect, useContext } from 'react';
import api from './api/api';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaTh, FaList, FaHeart, FaRegHeart } from 'react-icons/fa';
import { AuthContext } from './AuthContext';
import { CartContext } from './CartContext';
import { WishlistContext } from './WishlistContext';
import './ProductList.css';
import './WishlistButton.css';

const ProductList = ({ category }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    const { user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const { toggleWishlist, isItemInWishlist } = useContext(WishlistContext);
    const navigate = useNavigate(); // Added navigate here
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');

    // Filter States
    const [sortOption, setSortOption] = useState('default');
    const [selectedCategory, setSelectedCategory] = useState(category || '');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [applyFilters, setApplyFilters] = useState(false);

    useEffect(() => {
        setLoading(true);

        let url = '/api/products';
        const params = new URLSearchParams();

        // Advanced Search Logic
        if (searchQuery || selectedCategory || minPrice || maxPrice) {
            url = '/api/products/search';
            if (searchQuery) params.append('name', searchQuery);
            if (selectedCategory) params.append('category', selectedCategory);
            if (minPrice) params.append('minPrice', minPrice);
            if (maxPrice) params.append('maxPrice', maxPrice);
        }

        const fetchUrl = params.toString() ? `${url}?${params.toString()}` : url;

        api.get(fetchUrl)
            .then(response => {
                let data = response.data;
                // Home Page: Custom Sorting if no filters applied and no category passed (1 PC, 1 Mobile, 1 Accessory, 6 Random)
                if (!searchQuery && !selectedCategory && !minPrice && !maxPrice && !category) {
                    const pc = data.find(p => p.category === 'PC Devices');
                    const mobile = data.find(p => p.category === 'Mobile Devices');
                    const accessory = data.find(p => p.category === 'Accessories');

                    let remaining = data.filter(p => p !== pc && p !== mobile && p !== accessory);
                    const shuffled = remaining.sort(() => 0.5 - Math.random());
                    const random6 = shuffled.slice(0, 6);

                    data = [pc, mobile, accessory, ...random6].filter(Boolean);
                }
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Ensure backend is running.");
                setLoading(false);
            });
    }, [category, searchQuery, applyFilters]);

    const handleApplyFilters = () => {
        setApplyFilters(!applyFilters);
    };

    const handleClearFilters = () => {
        setSelectedCategory('');
        setMinPrice('');
        setMaxPrice('');
        setApplyFilters(!applyFilters);
    };

    const handleAddToCart = (product) => {
        if (!user) {
            alert("Please Login to Add to Cart");
            navigate('/login');
            return;
        }
        addToCart(product);
        alert(`Added ${product.name} to Cart!`);
    };

    // Sorting Logic
    const getSortedProducts = () => {
        let sorted = [...products];
        if (sortOption === 'price-low-high') {
            sorted.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-high-low') {
            sorted.sort((a, b) => b.price - a.price);
        }
        return sorted;
    };

    if (loading) {
        return (
            <div className="product-list-container">
                <div className="product-header">
                    <h1 className="page-title desktop-title">Loading Products...</h1>
                </div>
                <div className="product-layout">
                    <aside className="filters-sidebar">
                        <div className="skeleton-card" style={{ height: '300px' }}>
                            <div className="shimmer-wrapper"></div>
                        </div>
                    </aside>
                    <div className="product-main-content">
                        <div className="product-skeleton-grid">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="skeleton-card">
                                    <div className="skeleton-image"></div>
                                    <div className="skeleton-text"></div>
                                    <div className="skeleton-text short"></div>
                                    <div className="skeleton-text price"></div>
                                    <div className="shimmer-wrapper"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (error) return <div className="error">{error}</div>;

    const displayedProducts = getSortedProducts();

    return (
        <div className="product-list-container">
            <div className="product-header">
                <h1 className="page-title desktop-title">
                    {searchQuery ? `Search Results for "${searchQuery}"` : (category ? category : "Featured Products")}
                </h1>

                <div className="controls-right">
                    <select
                        className="sort-dropdown"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="default">Sort By: Default</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
                    </select>

                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Grid View"
                        >
                            <FaTh />
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            title="List View"
                        >
                            <FaList />
                        </button>
                    </div>
                </div>
            </div>

            <div className="product-layout">
                {/* Filters Sidebar */}
                <aside className="filters-sidebar">
                    <h3>Advanced Filters</h3>

                    <div className="filter-group">
                        <label>Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="PC Devices">PC Devices</option>
                            <option value="Mobile Devices">Mobile Devices</option>
                            <option value="Accessories">Accessories</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Min Price (₹)</label>
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            min="0"
                        />
                    </div>

                    <div className="filter-group">
                        <label>Max Price (₹)</label>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            min="0"
                        />
                    </div>

                    <div className="filter-actions">
                        <button className="apply-btn" onClick={handleApplyFilters}>Apply</button>
                        <button className="clear-btn" onClick={handleClearFilters}>Clear</button>
                    </div>
                </aside>

                <div className="product-main-content">
                    {displayedProducts.length === 0 ? (
                        <div className="no-results">
                            <h3>No products found under this criterion.</h3>
                            <Link to="/" className="back-btn">Go Back Home</Link>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid' ? "product-grid" : "product-list-view"}>
                            {displayedProducts.map(product => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image-container">
                                        <Link to={`/product/${product.id}`} className="product-card-link">
                                            <img
                                                src={product.images && product.images.length > 0 ? product.images[0].url : `/images/${product.name.toLowerCase().replace(/\s+/g, '-').replace('.jpg', '')}.jpg`}
                                                alt={product.name}
                                                className="product-image"
                                                onError={(e) => {
                                                    if (e.target.src.includes('.jpg') && (!product.images || product.images.length === 0)) {
                                                        e.target.src = e.target.src.replace('.jpg', '.png');
                                                    } else {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                                    }
                                                }}
                                            />
                                        </Link>
                                        <button className="wishlist-btn" onClick={() => toggleWishlist(product.id)} title="Toggle Wishlist">
                                            {isItemInWishlist(product.id) ? <FaHeart className="heart-filled" /> : <FaRegHeart className="heart-outline" />}
                                        </button>
                                    </div>
                                    <div className="product-details">
                                        <Link to={`/product/${product.id}`} className="product-title-link">
                                            <h3 className="product-name">{product.name}</h3>
                                        </Link>
                                        <p className="product-category">{product.category}</p>
                                        <p className="product-description">{product.description}</p>
                                        <div className="product-footer">
                                            <span className="product-price">
                                                {new Intl.NumberFormat('en-IN', {
                                                    style: 'currency',
                                                    currency: 'INR'
                                                }).format(product.price)}
                                            </span>
                                            <button
                                                className="add-to-cart-btn"
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
