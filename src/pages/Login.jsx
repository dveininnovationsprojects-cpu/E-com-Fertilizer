import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

const BASE = "http://192.168.1.6:5000/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE}/login`, { email, password });
      if (res.data.success) {
        const { success, ...userData } = res.data;
        localStorage.setItem("user", JSON.stringify(userData));
        window.dispatchEvent(new Event('storage'));
        navigate("/");
      }
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="inner-card">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
          </form>
          <p style={{ marginTop: "1rem" }}>
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")} style={{ cursor: "pointer", color: "#5c7a00" }}>Register</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
