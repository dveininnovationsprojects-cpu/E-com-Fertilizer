import React from "react";
import logo from "../assets/logo.jpeg";
import founder from "../assets/founder.jpeg";
import "../App.css";

const About = () => {
  return (
    <div className="page">

      {/* ===== NAVBAR ===== */}
      <div className="navbar">
        <div className="nav-left">
          <img src={logo} alt="logo" />
          <h2>Saral-X</h2>
        </div>

        <ul className="nav-links">
          <li>Home</li>
          <li className="active">About</li>
          <li>Shop</li>
          <li>Blog</li>
          <li>Contact</li>
        </ul>
      </div>

      {/* ===== HERO ===== */}
      <div className="hero">
        <div className="hero-overlay">
          <h1>About Us</h1>
          <p>Home &gt; About Us</p>
        </div>
      </div>

      {/* ===== ABOUT ===== */}
      <div className="about">
        <h2>Saraswathy Traders</h2>

        <p>
          Saraswathy Traders, under its brand <span>Saral-X</span>, is a trusted provider of high-quality bio fertilizers, supporting sustainable and productive agriculture.
        </p>

        <p>
          With over <b>25 years of experience</b>, the company was founded by <b>DR. T. Vijayakumar</b> with a vision to deliver reliable and eco-friendly solutions that improve soil health and increase crop yield.
        </p>

        <p>
          We are committed to providing quality products at competitive prices with fast and reliable service. Our strong supply network helps us serve customers across India with timely delivery and consistent support.
        </p>

        <p>
          We are proud to be a trusted supplier to government agricultural and horticulture departments, which reflects our quality standards and reliability.
        </p>

        <p>
          Our associated company <b>SS Enterprise (since 2024)</b> supplies nursery plants, quality seeds, and organic rice products.
        </p>
      </div>

      {/* ===== 3 PREMIUM CARDS ===== */}
      <div className="feature-section">

        <div className="feature-card green">
          <div className="icon-circle">🌿</div>
          <h3>Who We Are</h3>
          <p>
            Trusted provider of bio fertilizers supporting sustainable agriculture.
          </p>
        </div>

        <div className="feature-card blue">
          <div className="icon-circle">📦</div>
          <h3>Our Products</h3>
          <p>
            High-quality fertilizers, seeds, and organic farming solutions.
          </p>
        </div>

        <div className="feature-card brown">
          <div className="icon-circle">⚙️</div>
          <h3>How We Work</h3>
          <p>
            Strong supply chain, fast delivery, and reliable service across India.
          </p>
        </div>

      </div>

      {/* ===== FOUNDER ===== */}
      <div className="founder">
        <img src={founder} alt="founder" />

        <div>
          <h3>Founder</h3>
          <p>
            Founded by <span>DR. T. Vijayakumar</span>, Saraswathy Traders is built on trust, innovation, and sustainable agriculture.
          </p>
        </div>
      </div>

      {/* ===== MISSION ===== */}
      <div className="mission">
        <h2>Our Mission</h2>
        <p>
          At Saraswathy Traders, we focus on building long-term relationships through trust, quality, and service—helping farmers grow with confidence.
        </p>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="footer">
        © 2026 Saraswathy Traders | Saral-X
      </div>

    </div>
  );
};

export default About;