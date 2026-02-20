import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Hero.css';

const Hero = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true
    };

    return (
        <div className="hero-container">
            <Slider {...settings}>
                <div className="hero-slide slide-1">
                    <div className="hero-content">
                        <h1>WELCOME TO TOPCART</h1>
                        <p>Your Ultimate Tech Destination.</p>
                        <Link to="/pc" className="hero-btn">SHOP NOW</Link>
                    </div>
                </div>
                <div className="hero-slide slide-2">
                    <div className="hero-content">
                        <h1>POWERFUL PC STARTING ₹30K</h1>
                        <p>Upgrade Your Setup Today.</p>
                        <Link to="/pc" className="hero-btn">VIEW PCs</Link>
                    </div>
                </div>
                <div className="hero-slide slide-3">
                    <div className="hero-content">
                        <h1>LITE & FAST MOBILES</h1>
                        <p>Change The Way You Connect.</p>
                        <Link to="/mobile" className="hero-btn">VIEW MOBILES</Link>
                    </div>
                </div>
            </Slider>
        </div>
    );
};

export default Hero;
