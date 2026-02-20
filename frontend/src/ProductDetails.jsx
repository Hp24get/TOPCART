import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './api/api';
import { CartContext } from './CartContext';
import { WishlistContext } from './WishlistContext';
import { AuthContext } from './AuthContext';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import './ProductDetails.css';
import './WishlistButton.css';
import './ProductReviews.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const { toggleWishlist, isItemInWishlist } = useContext(WishlistContext);
    const { user } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchProductAndReviews = async () => {
            try {
                const [productRes, reviewsRes] = await Promise.all([
                    api.get(`/api/products/${id}`),
                    api.get(`/api/reviews/product/${id}`)
                ]);
                setProduct(productRes.data);
                setReviews(reviewsRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching product details or reviews:", err);
                setError('Failed to fetch product details.');
                setLoading(false);
            }
        };

        fetchProductAndReviews();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        alert(`Added ${product.name} to Cart!`);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to submit a review.");
            return;
        }

        setSubmittingReview(true);
        try {
            const payload = {
                productId: product.id,
                userId: user.id,
                rating: reviewForm.rating,
                comment: reviewForm.comment
            };
            const response = await api.post(`/api/reviews/add`, payload);
            setReviews([...reviews, response.data]);
            setReviewForm({ rating: 5, comment: '' });
            alert("Review submitted successfully!");
        } catch (err) {
            console.error("Failed to submit review:", err);
            alert("Failed to submit review.");
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return <div className="loading">Loading details...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!product) return <div className="error">Product not found</div>;

    // Image fallback logic same as ProductList
    const imageUrl = product.images && product.images.length > 0
        ? product.images[0].url
        : `/images/${product.name.toLowerCase().replace(/\s+/g, '-').replace('.jpg', '')}.jpg`;

    return (
        <div className="product-details-container">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <div className="details-wrapper">
                <div className="details-image-section">
                    <div className="product-image-container" style={{ borderRadius: '12px' }}>
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="details-image"
                            onError={(e) => {
                                if (e.target.src.includes('.jpg') && (!product.images || product.images.length === 0)) {
                                    e.target.src = e.target.src.replace('.jpg', '.png');
                                } else {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                                }
                            }}
                        />
                        <button
                            className="wishlist-btn"
                            onClick={() => toggleWishlist(product.id)}
                            title="Toggle Wishlist"
                            style={{ width: '50px', height: '50px', top: '20px', right: '20px' }}
                        >
                            {isItemInWishlist(product.id) ? <FaHeart className="heart-filled" style={{ fontSize: '1.8rem' }} /> : <FaRegHeart className="heart-outline" style={{ fontSize: '1.8rem' }} />}
                        </button>
                    </div>
                </div>
                <div className="details-info-section">
                    <h1 className="details-name">{product.name}</h1>
                    <p className="details-category">{product.category}</p>
                    <p className="details-description">{product.description}</p>
                    <div className="details-price">
                        {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR'
                        }).format(product.price)}
                    </div>

                    <div className="details-actions">
                        <button className="add-to-cart-btn-large" onClick={handleAddToCart}>
                            Add to Cart
                        </button>
                    </div>

                    <div className="details-meta">
                        <p>Brand: {product.brand}</p>
                        <p>Stock: {product.stock > 0 ? "In Stock" : "Out of Stock"}</p>
                        <p>Rating: ⭐ {product.rating}</p>
                    </div>
                </div>
            </div>

            <div className="reviews-section">
                <h2>Product Reviews</h2>
                <div className="reviews-list">
                    {reviews.length === 0 ? (
                        <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
                    ) : (
                        reviews.map((review, index) => (
                            <div key={index} className="review-card">
                                <div className="review-header">
                                    <span className="review-author">{review.user ? review.user.username : 'Anonymous User'}</span>
                                    <span className="review-rating">
                                        {[...Array(5)].map((star, i) => (
                                            <FaStar key={i} color={i < review.rating ? "#ffc107" : "#e4e5e9"} />
                                        ))}
                                    </span>
                                </div>
                                <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
                                <p className="review-comment">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>

                {user ? (
                    <div className="write-review-section">
                        <h3>Write a Review</h3>
                        <form onSubmit={handleReviewSubmit} className="review-form">
                            <div className="form-group">
                                <label>Rating:</label>
                                <select
                                    value={reviewForm.rating}
                                    onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                                >
                                    <option value="5">5 - Excellent</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="3">3 - Good</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="1">1 - Poor</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Comment:</label>
                                <textarea
                                    rows="4"
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                    placeholder="Share your experience with this product..."
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-review-btn" disabled={submittingReview}>
                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="login-prompt">
                        <p>Please <button className="text-link" onClick={() => navigate('/login')}>login</button> to write a review.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
