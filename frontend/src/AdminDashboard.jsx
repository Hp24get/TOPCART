import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { FaBox, FaPlus, FaEdit, FaTrash, FaTimes, FaClipboardList, FaUsers, FaCheck, FaTruck, FaImage } from 'react-icons/fa';
import api from './api/api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'users'

    // Data States
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: 'PC Devices',
        stock: '',
        seller: 'TopCart',
        images: [] // Store images array
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [productsRes, ordersRes, usersRes] = await Promise.all([
                api.get('/api/products').catch(e => ({ data: [] })),
                api.get('/api/orders').catch(e => ({ data: [] })),
                api.get('/api/auth/users').catch(e => ({ data: [] }))
            ]);

            setProducts(productsRes.data);
            setOrders(ordersRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Enforce Product Name before upload
        if (!formData.name || formData.name.trim() === '') {
            alert("Please enter the Product Name FIRST, then upload the image.");
            e.target.value = null; // Reset file input
            return;
        }

        const uploadData = new FormData();
        uploadData.append('image', file);
        uploadData.append('productName', formData.name); // Send Product Name for renaming

        setUploading(true);
        try {
            const response = await api.post('/api/products/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Backend returns "/images/slug-name.jpg"
            const imageUrl = response.data;

            // Update formData with the new image URL
            setFormData(prev => ({
                ...prev,
                images: [{ url: imageUrl }]
            }));

            alert("Image uploaded and renamed successfully!");

        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed. See console.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.price) {
            alert("Name and Price are required");
            return;
        }

        const productPayload = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock) || 0,
            rating: 0.0,
            numofReviews: 0
        };

        try {
            if (editingProduct) {
                await api.put(`/api/products/${editingProduct.id}`, productPayload);
                alert("Product Updated!");
            } else {
                await api.post('/api/products', productPayload);
                alert("Product Created!");
            }
            closeModal();
            fetchAllData(); // Refresh all data
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/api/products/${id}`);
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                console.error("Error deleting:", error);
                alert("Delete failed.");
            }
        }
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price,
                description: product.description,
                category: product.category,
                stock: product.stock,
                seller: product.seller,
                images: product.images || []
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                price: '',
                description: '',
                category: 'PC Devices',
                stock: '',
                seller: 'TopCart',
                images: []
            });
        }
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    if (loading) return <div className="admin-loading">Loading Admin Panel...</div>;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Admin Dashboard <span className="beta-badge">BETA</span></h1>

                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <FaBox /> Products
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <FaClipboardList /> Orders
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <FaUsers /> Users
                    </button>
                </div>

                {activeTab === 'products' && (
                    <button className="add-btn" onClick={() => openModal()}>
                        <FaPlus /> Add Product
                    </button>
                )}
            </div>

            <div className="admin-content glass-panel">
                {activeTab === 'products' && (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => {
                                let imageSrc = 'https://via.placeholder.com/50';
                                if (product.images && product.images.length > 0) {
                                    imageSrc = product.images[0].url;
                                } else {
                                    imageSrc = `/images/${product.name.toLowerCase().replace(/\s+/g, '-').replace('.jpg', '')}.jpg`;
                                }

                                return (
                                    <tr key={product.id}>
                                        <td>#{product.id}</td>
                                        <td>
                                            <img
                                                src={imageSrc}
                                                alt={product.name}
                                                className="table-img"
                                                onError={(e) => {
                                                    if (e.target.src.includes('.jpg') && !product.images?.length) {
                                                        e.target.src = e.target.src.replace('.jpg', '.png');
                                                    } else {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/50';
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td className="fw-bold">{product.name}</td>
                                        <td>₹{product.price}</td>
                                        <td><span className="badge-category">{product.category}</span></td>
                                        <td>
                                            <span className={`stock-status ${product.stock > 0 ? 'in' : 'out'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="icon-btn edit" onClick={() => openModal(product)}><FaEdit /></button>
                                            <button className="icon-btn delete" onClick={() => handleDelete(product.id)}><FaTrash /></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                {activeTab === 'orders' && (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr><td colSpan="6" className="text-center">No orders found.</td></tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order.id}>
                                        <td><span className="mono-text">{order.id}</span></td>
                                        <td>{new Date(order.date).toLocaleDateString()}</td>
                                        <td>
                                            <div className="user-info">
                                                <span className="user-name">{order.fullName}</span>
                                                <span className="user-email">{order.email}</span>
                                            </div>
                                        </td>
                                        <td>{order.items?.length || 0} items</td>
                                        <td className="highlight-text">₹{order.total}</td>
                                        <td>
                                            <span className={`status-badge ${order.status?.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}

                {activeTab === 'users' && (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr><td colSpan="4" className="text-center">No users found.</td></tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td className="fw-bold">{user.name}</td>
                                        <td>{user.mobileNumber}</td>
                                        <td>
                                            <span className={`role-badge ${user.roles === 'ADMIN' ? 'admin' : 'user'}`}>
                                                {user.roles}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-modal">
                        <div className="modal-header">
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button className="close-btn" onClick={closeModal}><FaTimes /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group image-upload-group">
                                <label>Product Image</label>
                                <div className="upload-box">
                                    <input
                                        type="file"
                                        id="imageUpload"
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        disabled={uploading}
                                    />
                                    <label htmlFor="imageUpload" className="upload-label">
                                        <FaImage /> {uploading ? "Uploading..." : "Click to Upload Image"}
                                    </label>
                                </div>
                                <small className="hint">Enter Product Name first. Image will be renamed to match.</small>
                            </div>

                            <div className="form-group">
                                <label>Product Name</label>
                                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. iPhone 15" required />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input name="price" type="number" value={formData.price} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input name="stock" type="number" value={formData.stock} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select name="category" value={formData.category} onChange={handleInputChange}>
                                    <option value="PC Devices">PC Devices</option>
                                    <option value="Mobile Devices">Mobile Devices</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3"></textarea>
                            </div>

                            <button type="submit" className="submit-btn" disabled={uploading}>
                                {editingProduct ? 'Update Product' : 'Create Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
