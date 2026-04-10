import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../App.css";

const BASE = "http://192.168.1.6:5000/api";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const passwordMatch = form.confirmPassword === "" ? null : form.password === form.confirmPassword;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!passwordMatch) { alert("Passwords do not match!"); return; }
    try {
      const res = await axios.post(`${BASE}/register`, {
        name: form.name, email: form.email, password: form.password,
      });
      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user || res.data));
        alert("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      alert("Registration failed. Try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="inner-card">
          <h2>Create Account 🌱</h2>
          <form onSubmit={handleRegister}>
            <input name="name" type="text" placeholder="Full Name" value={form.name} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <div className="input-eye">
              <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={handleChange} required />
              <span onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FiEyeOff /> : <FiEye />}</span>
            </div>
            <div className="input-eye">
              <input name="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required
                style={{ borderColor: passwordMatch === null ? "#ddd" : passwordMatch ? "#8AA12F" : "#e53935" }} />
              <span onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? <FiEyeOff /> : <FiEye />}</span>
            </div>
            {passwordMatch === false && <p style={{ color: "#e53935", fontSize: "0.72rem", marginTop: "4px", textAlign: "left" }}>Passwords do not match</p>}
            {passwordMatch === true && <p style={{ color: "#8AA12F", fontSize: "0.72rem", marginTop: "4px", textAlign: "left" }}>Passwords match ✓</p>}
            <button type="submit" disabled={passwordMatch === false}>Register</button>
          </form>
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
