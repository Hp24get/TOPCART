import React, { useContext } from 'react';
import { WishlistContext } from './WishlistContext';
import { CartContext } from './CartContext';
import { Link } from 'react-router-dom';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);

    const handleMoveToCart = (product) => {
        addToCart(product);
        removeFromWishlist(product.id);
        alert(`Moved ${product.name} to Cart`);
    };

    if (wishlistItems.length === 0) {
        return (
            <div className="empty-wishlist">
                <h2>Your Wishlist is Empty</h2>
                <p>Looks like you haven't saved any items yet.</p>
                <Link to="/" className="continue-shopping">Browse Products</Link>
            </div>
        );
    }

    return (
        <div className="wishlist-container">
            <h1 className="page-title">My Wishlist</h1>
            <div className="wishlist-grid">
                {wishlistItems.map((item) => (
                    <div key={item.id} className="wishlist-card">
                        <Link to={`/product/${item.id}`} className="wishlist-img-link">
                            <img
                                src={item.images && item.images.length > 0 ? item.images[0].url : `/images/${item.name.toLowerCase().replace(/\s+/g, '-').replace('.jpg', '')}.jpg`}
                                alt={item.name}
                                className="wishlist-image"
                                onError={(e) => {
                                    if (e.target.src.includes('.jpg') && (!item.images || item.images.length === 0)) {
                                        e.target.src = e.target.src.replace('.jpg', '.png');
                                    } else {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                    }
                                }}
                            />
                        </Link>
                        <div className="wishlist-details">
                            <h3 className="wishlist-name">{item.name}</h3>
                            <p className="wishlist-price">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price)}
                            </p>
                            <div className="wishlist-actions">
                                <button className="move-cart-btn" onClick={() => handleMoveToCart(item)}>
                                    <FaShoppingCart /> Move to Cart
                                </button>
                                <button className="remove-btn" onClick={() => removeFromWishlist(item.id)} title="Remove">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
