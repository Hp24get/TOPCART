import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useContext(CartContext);
    const [showCheckout, setShowCheckout] = React.useState(false);
    const [step, setStep] = React.useState(1); // 1: Shipping, 2: Payment
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [paymentError, setPaymentError] = React.useState(null);

    const [formData, setFormData] = React.useState({
        name: '',
        address: '',
        mobile: '',
        email: ''
    });

    const [paymentData, setPaymentData] = React.useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        cardholderName: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePaymentChange = (e) => {
        setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // --- Company / Seller Details ---
        doc.setFontSize(22);
        doc.setTextColor(44, 62, 80); // Dark Blue
        doc.text("Hariprasath R", 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Java Fullstack Developer | India", 14, 26);
        doc.text("Email: hariprsath24r@gmail.com | Phone: +91 8015894119", 14, 31);

        doc.setDrawColor(200);
        doc.line(14, 35, 196, 35); // Horizontal Line

        // --- Customer / Receiver Details ---
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Bill To:", 14, 45);

        doc.setFontSize(11);
        doc.text(`Name:    ${formData.name}`, 14, 52);
        doc.text(`Mobile:  ${formData.mobile}`, 14, 58);
        doc.text(`Email:   ${formData.email}`, 14, 64);

        // Handle Multi-line Address
        const splitAddress = doc.splitTextToSize(`Address: ${formData.address}`, 100);
        doc.text(splitAddress, 14, 70);

        // --- Order Table ---
        const tableColumn = ["Item", "Quantity", "Price", "Total"];
        const tableRows = [];

        cartItems.forEach(item => {
            const itemData = [
                item.name,
                item.quantity,
                `Rs. ${item.price.toLocaleString('en-IN')}`,
                `Rs. ${(item.price * item.quantity).toLocaleString('en-IN')}`
            ];
            tableRows.push(itemData);
        });

        // Start table below address (dynamically calculate Y based on address length)
        const startY = 70 + (splitAddress.length * 6) + 10;

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: startY,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] }, // Blue Header
            styles: { fontSize: 10 }
        });

        // --- Grand Total ---
        const finalY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : startY) + 10;
        doc.setFontSize(14);
        doc.text(`Grand Total: Rs. ${getCartTotal().toLocaleString('en-IN')}`, 14, finalY);

        // --- Slogan & Footer ---
        doc.setFontSize(12);
        doc.setTextColor(44, 62, 80);
        doc.text("Thank you for shopping with TopCart!", 105, finalY + 20, { align: "center" });

        doc.setFontSize(10);
        doc.setTextColor(127, 140, 141); // Grey
        doc.setFont("helvetica", "italic");
        doc.text("Elevate Your Digital Life.", 105, finalY + 26, { align: "center" });

        doc.save("TopCart_Order_Receipt.pdf");
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setPaymentError(null);

        // Standardize the amount without formatting strings
        const amount = getCartTotal();

        try {
            // Test simulated payment via local backend
            const response = await api.post('/api/payment/process', {
                amount,
                cardNumber: paymentData.cardNumber,
                cardholderName: paymentData.cardholderName
            });

            if (response.data && response.data.success) {
                // Payment was successful, proceed to generating receipt
                try {
                    generatePDF();
                } catch (err) {
                    console.error("PDF Generation Failed", err);
                }

                alert(`Payment Success! Txn ID: ${response.data.transactionId}. Your order will be processed shortly.`);

                clearCart();
                setShowCheckout(false);
                setStep(1);

            } else {
                setPaymentError(response.data.message || "Payment declined");
            }

        } catch (err) {
            console.error("Payment API error", err);
            setPaymentError("Payment Gateway Error. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0 && !showCheckout) {
        return (
            <div className="empty-cart-container">
                <h2>Your Cart is Empty</h2>
                <p>Go add some cool stuff!</p>
                <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1 className="page-title">Your Cart</h1>

            {!showCheckout ? (
                <>
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-image">
                                    <img
                                        src={item.images && item.images.length > 0 ? item.images[0].url : `/images/${item.name.toLowerCase().replace(/\s+/g, '-').replace('.jpg', '')}.jpg`}
                                        alt={item.name}
                                        onError={(e) => {
                                            if (e.target.src.includes('.jpg') && (!item.images || item.images.length === 0)) {
                                                e.target.src = e.target.src.replace('.jpg', '.png');
                                            } else {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                                            }
                                        }}
                                    />
                                </div>
                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>
                                    <p>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price)}</p>
                                </div>
                                <div className="cart-item-actions">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                    <span className="quantity">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Total: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getCartTotal())}</h2>
                        <div className="cart-buttons">
                            <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
                            <button className="checkout-btn" onClick={() => setShowCheckout(true)}>Proceed to Checkout</button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="checkout-form-container">
                    {step === 1 ? (
                        <>
                            <h2>Checkout Details (Step 1/2)</h2>
                            <form onSubmit={handleNextStep} className="checkout-form">
                                <div className="form-group">
                                    <label>Receiver Name</label>
                                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Mobile Number</label>
                                    <input type="tel" name="mobile" required pattern="[0-9]{10}" value={formData.mobile} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Delivery Address</label>
                                    <textarea name="address" required value={formData.address} onChange={handleInputChange}></textarea>
                                </div>

                                <div className="checkout-actions">
                                    <button type="button" className="back-btn-small" onClick={() => setShowCheckout(false)}>Back to Cart</button>
                                    <button type="submit" className="place-order-btn">Proceed to Payment</button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <h2>Payment Gateway Simulation (Step 2/2)</h2>
                            {paymentError && <div className="payment-error-alert">{paymentError}</div>}
                            <form onSubmit={handlePlaceOrder} className="checkout-form payment-form">
                                <div className="form-group">
                                    <label>Cardholder Name</label>
                                    <input type="text" name="cardholderName" required value={paymentData.cardholderName} onChange={handlePaymentChange} />
                                </div>
                                <div className="form-group">
                                    <label>Credit/Debit Card Number</label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        required
                                        pattern="[0-9\s]{13,19}"
                                        placeholder="xxxx xxxx xxxx xxxx"
                                        value={paymentData.cardNumber}
                                        onChange={handlePaymentChange}
                                        title="Mock hint: Ending in 0000 will fail"
                                    />
                                    <small className="hint-text">Note: Submitting '0000' as the ending sequence simulates card decline.</small>
                                </div>
                                <div className="form-row">
                                    <div className="form-group half-width">
                                        <label>Expiry (MM/YY)</label>
                                        <input type="text" name="expiry" required pattern="(0[1-9]|1[0-2])\/?([0-9]{2})" placeholder="MM/YY" value={paymentData.expiry} onChange={handlePaymentChange} />
                                    </div>
                                    <div className="form-group half-width">
                                        <label>CVV</label>
                                        <input type="text" name="cvv" required pattern="[0-9]{3,4}" placeholder="123" value={paymentData.cvv} onChange={handlePaymentChange} />
                                    </div>
                                </div>

                                <div className="checkout-actions flex-end">
                                    <button type="button" className="back-btn-small" onClick={() => setStep(1)} disabled={isProcessing}>Back</button>
                                    <button type="submit" className={`place-order-btn ${isProcessing ? 'processing' : ''}`} disabled={isProcessing}>
                                        {isProcessing ? 'Processing Transaction...' : `Pay ₹${getCartTotal().toLocaleString('en-IN')}`}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Cart;
