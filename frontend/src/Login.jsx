import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import './Login.css';
import api from './api/api';

const Login = () => {
    const [step, setStep] = useState(1); // 1: Details, 2: OTP
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    // Slider State
    const [sliderValue, setSliderValue] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef(null);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Destination after login (default to home)
    const from = location.state?.from?.pathname || "/";

    const handleSendOtp = () => {
        if (name && mobile.length === 10) {
            setStep(2);
            setError('');
            setSliderValue(0); // Reset slider
            // Simulate sending OTP
            console.log("TOPCART OTP: 1234");
            alert("Topcart OTP: 1234");
        } else {
            setError("Please enter valid Name and 10-digit Mobile Number.");
            setSliderValue(0); // Reset slider on error
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        if (otp === "1234") {
            try {
                const response = await api.post('/api/auth/login', { name, mobile });
                login(response.data);
                navigate(from, { replace: true });
            } catch (err) {
                console.error("Login failed:", err);
                const errorMsg = err.response?.data?.message || err.message || "Login failed. Please try again.";
                setError(errorMsg);
            }
        } else {
            setError("Invalid OTP. Try 1234.");
        }
    };

    // Slider Logic
    const handleMouseDown = (e) => {
        setIsDragging(true);
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !sliderRef.current) return;
        const sliderRect = sliderRef.current.getBoundingClientRect();
        const offsetX = e.clientX - sliderRect.left;
        const percentage = Math.min(Math.max((offsetX / sliderRect.width) * 100, 0), 100);
        setSliderValue(percentage);
    };

    const handleTouchMove = (e) => {
        if (!isDragging || !sliderRef.current) return;
        const sliderRect = sliderRef.current.getBoundingClientRect();
        const offsetX = e.touches[0].clientX - sliderRect.left;
        const percentage = Math.min(Math.max((offsetX / sliderRect.width) * 100, 0), 100);
        setSliderValue(percentage);
    };

    const handleEndDrag = () => {
        setIsDragging(false);
        if (sliderValue > 90) {
            setSliderValue(100);
            handleSendOtp();
        } else {
            setSliderValue(0);
        }
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleEndDrag);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleEndDrag);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleEndDrag);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleEndDrag);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleEndDrag);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleEndDrag);
        };
    }, [isDragging, sliderValue]);

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>{step === 1 ? "Login / Sign Up" : "Verify OTP"}</h2>
                {error && <p className="error-msg">{error}</p>}

                {step === 1 ? (
                    <div className="login-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="input-field"
                            />
                        </div>
                        <div className="form-group">
                            <label>Mobile Number</label>
                            <input
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder="Enter 10-digit mobile"
                                pattern="[0-9]{10}"
                                className="input-field"
                            />
                        </div>

                        {/* Slide to Send OTP */}
                        <div className="slider-container" ref={sliderRef}>
                            <div className="slider-track">
                                <span className="slider-text">Slide to Send OTP <FaArrowRight /></span>
                            </div>
                            <div
                                className="slider-thumb"
                                style={{ left: `${sliderValue}%`, transform: `translateX(-${sliderValue}%)` }}
                                onMouseDown={handleMouseDown}
                                onTouchStart={handleTouchStart}
                            >
                                <FaShoppingCart className="slider-icon" />
                            </div>
                            <div
                                className="slider-fill"
                                style={{ width: `${sliderValue}%` }}
                            ></div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <p className="otp-info">OTP sent to {mobile}</p>
                        <div className="form-group">
                            <label>Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP (1234)"
                                className="input-field"
                                required
                            />
                        </div>
                        <button type="submit" className="login-btn">Verify & Login</button>
                        <button type="button" className="back-btn" onClick={() => setStep(1)}>Back</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
