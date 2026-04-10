import React, { useState, useEffect } from "react";
import axios from "axios";


import logo from "../assets/logo.jpeg";
import founder from "../assets/founder.jpeg";
import slide1 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.jpg";
import slide3 from "../assets/slide3.jpg";
import slide4 from "../assets/slide4.jpg";
import slide5 from "../assets/slide5.jpg";
import slide6 from "../assets/slide6.jpg";

import "../App.css";

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 6 Images Array for the Slider
  const slides = [slide1, slide2, slide3, slide4, slide5, slide6];

  // Auto-slide logic (4 seconds interval)
  useEffect(() => {
    const timer = setInterval((  ) => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Axios Integration Template
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        // const response = await axios.get('http://localhost:5000/api/about');
      } catch (error) {
        console.error("Axios Error:", error);
      }
    };
    fetchCompanyData();
  }, []);

  return (
    <div className="page">

      {/* ===== HERO SLIDER ===== */}
      <div className="hero-slider">
        {slides.map((image, index) => (
          <div
            key={index}
            className={`slide-fade ${index === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${image})` }}
          >
          </div>
        ))}
      </div>

      {/* ===== ABOUT CONTENT ===== */}
      <div className="about-container">
        <h2>Saraswathy Traders</h2>
        <div className="about-text-justified">
          <p>
            Saraswathy Traders, under its brand <span>Saral-X</span>, is a trusted provider of high-quality bio fertilizers, supporting sustainable and productive agriculture.
            With over <b>25 years of experience</b>, the company was founded by <b>DR. T. Vijayakumar</b> with a vision to deliver reliable and eco-friendly solutions that improve soil health and increase crop yield.
            We are committed to providing quality products at competitive prices with fast and reliable service. Our strong supply network helps us serve customers across India with timely delivery and consistent support.
            We are proud to be a trusted supplier to government agricultural and horticulture departments, which reflects our quality standards and reliability.
            Our associated company <b>SS Enterprise (since 2024)</b> supplies nursery plants, quality seeds, and organic rice products.
          </p>
        </div>
      </div>

      {/* ===== 3 PREMIUM CARDS ===== */}
      <div className="feature-section">
        <div className="feature-card green">
          <div className="icon-circle">🌿</div>
          <h3>Who We Are</h3>
          <p>Trusted provider of bio fertilizers supporting sustainable agriculture.</p>
        </div>
        <div className="feature-card blue">
          <div className="icon-circle">📦</div>
          <h3>Our Products</h3>
          <p>High-quality fertilizers, seeds, and organic farming solutions.</p>
        </div>
        <div className="feature-card brown">
          <div className="icon-circle">⚙️</div>
          <h3>How We Work</h3>
          <p>Strong supply chain, fast delivery, and reliable service across India.</p>
        </div>
      </div>

    {/* ===== FOUNDER + MISSION 2 COLUMN ===== */}
    <div className="founder-mission">
      <div className="founder-col">
        <img src={founder} alt="founder" />
        <div className="founder-text">
          <h3>DR. T. Vijayakumar</h3>
          <p>
            Founded by <span>DR. T. Vijayakumar</span>, Saraswathy Traders is built on trust, innovation, and sustainable agriculture.
            With over <b>25 years of experience</b>, he envisioned a company that delivers reliable, eco-friendly fertilizer solutions
            to farmers across India — improving soil health, increasing crop yield, and supporting the nation's agricultural growth.
          </p>
        </div>
      </div>

      <div className="mission-col">
        <h2>Our Mission</h2>
        <p>We are proud to be a trusted supplier to government agricultural and horticulture departments, which reflects our quality standards and reliability. Our associated company, SS Enterprise (since 2024), supplies nursery plants, quality seeds, and organic rice products, supporting a complete and sustainable farming system. At Saraswathy Traders, we focus on building long-term relationships through trust, quality, and service — helping farmers and businesses grow with confidence.</p>
      </div>
    </div>
    </div>
  );
};

export default About;