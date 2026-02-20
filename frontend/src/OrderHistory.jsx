import React, { useState, useEffect, useContext } from 'react';
import api from './api/api';
import { AuthContext } from './AuthContext';
import { FaBoxOpen, FaCalendarAlt, FaMoneyBillWave, FaTruck, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './OrderHistory.css';

const OrderHistory = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.email) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            // In a real app, the token would handle identification. 
            // Here we pass email as a query param for the mock endpoint.
            const response = await api.get(`/api/orders/my-orders?email=${user.email}`);
            // Sort by date descending (newest first)
            const sortedOrders = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setOrders(sortedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="orders-loading">Loading your orders...</div>;

    if (orders.length === 0) {
        return (
            <div className="empty-orders-container">
                <FaBoxOpen className="empty-icon" />
                <h2>No Orders Yet</h2>
                <p>Looks like you haven't placed any orders yet.</p>
                <Link to="/" className="start-shopping-btn">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="order-history-container">
            <h1 className="page-title"><FaShoppingBag /> My Orders</h1>

            <div className="orders-list">
                {orders.map(order => (
                    <div key={order.id} className="order-card glass-panel">
                        <div className="order-header">
                            <div className="order-id">
                                <span className="label">Order ID:</span>
                                <span className="value">#{order.id}</span>
                            </div>
                            <div className="order-date">
                                <FaCalendarAlt /> {new Date(order.date).toLocaleDateString()}
                            </div>
                            <div className={`order-status ${order.status?.toLowerCase()}`}>
                                {order.status === 'Pending' && <FaBoxOpen />}
                                {order.status === 'Shipped' && <FaTruck />}
                                {order.status}
                            </div>
                        </div>

                        <div className="order-items">
                            {order.items && order.items.map((item, index) => (
                                <div key={index} className="order-item">
                                    <div className="item-details">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-qty">x{item.quantity}</span>
                                    </div>
                                    <span className="item-price">₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="order-footer">
                            <div className="order-total">
                                <span className="label">Total Amount:</span>
                                <span className="value">₹{order.total}</span>
                            </div>
                            {/* Future: Add "View Details" or "Track Order" button */}
                        </div>
                    </div>
                ))}
            </div>
            <Link to="/" className="back-link"><FaArrowLeft /> Back to Shop</Link>
        </div>
    );
};

export default OrderHistory;
