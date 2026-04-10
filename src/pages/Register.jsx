import React, { useState } from "react";
import API from "../api/axios"; // Important: Using centralized API
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const BASE = "http://192.168.1.6:5000/api";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Custom Modal State
  const [errorMessage, setErrorMessage] = useState(""); // Custom Error State
  const navigate = useNavigate();

  const theme = {
    primary: "#9cc43c",
    text: "#333",
    subText: "#666",
    border: "#e1e4e8",
    bg: "#f4f7f6",
    danger: "#e74c3c",
    white: "#ffffff"
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMessage(""); // Clear error when user types
  };

  const passwordMatch = form.confirmPassword === "" ? null : form.password === form.confirmPassword;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!passwordMatch) {
      setErrorMessage("Passwords do not match!");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      // Changed to API instance
      const res = await API.post("auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      
      if (res.data.success || res.status === 201) {
        setShowSuccessModal(true); // Show custom modal instead of alert
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToLogin = () => {
    setShowSuccessModal(false);
    navigate("/login");
  };

  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: theme.bg, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', padding: '20px' },
    card: { backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', boxSizing: 'border-box' },
    title: { textAlign: 'center', color: theme.primary, fontSize: '24px', fontWeight: '700', marginBottom: '30px', margin: 0 },
    form: { display: 'flex', flexDirection: 'column', gap: '18px' },
    inputGroup: { position: 'relative' },
    input: { width: '100%', padding: '15px', borderRadius: '8px', border: `1px solid ${theme.border}`, fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.3s', color: theme.text },
    icon: { position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888', fontSize: '18px' },
    btn: { backgroundColor: theme.primary, color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.3s', marginTop: '10px', opacity: passwordMatch === false ? 0.6 : 1 },
    linkText: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: theme.subText },
    link: { color: theme.primary, fontWeight: '600', cursor: 'pointer', textDecoration: 'none' },
    msgErrorInline: { color: theme.danger, fontSize: '12px', marginTop: '5px', fontWeight: '600' },
    msgSuccessInline: { color: theme.primary, fontSize: '12px', marginTop: '5px', fontWeight: '600' },
    apiErrorBox: { backgroundColor: '#fdeaea', color: theme.danger, padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textAlign: 'center', border: `1px solid ${theme.danger}` },
    
    // Modal Styles
    modalOverlay: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1100,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backdropFilter: 'blur(3px)'
    },
    modalContent: {
      backgroundColor: theme.white,
      padding: '40px 30px',
      borderRadius: '16px',
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    successIconBox: {
      width: '70px',
      height: '70px',
      backgroundColor: '#f0f9f0',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '20px'
    },
    modalTitle: {
      fontSize: '22px',
      fontWeight: '700',
      color: theme.text,
      marginBottom: '10px',
      margin: 0
    },
    modalText: {
      fontSize: '15px',
      color: theme.subText,
      marginBottom: '30px',
      lineHeight: '1.5'
    },
    proceedBtn: {
      backgroundColor: theme.primary,
      color: '#fff',
      border: 'none',
      padding: '14px 24px',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      transition: '0.2s'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account 🌱</h2>
        
        {/* General API Error Message Display */}
        {errorMessage && (
          <div style={styles.apiErrorBox}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleRegister} style={styles.form}>
          
          <input name="name" type="text" placeholder="Full Name" style={styles.input} value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email Address" style={styles.input} value={form.email} onChange={handleChange} required />

          <div style={styles.inputGroup}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              style={styles.input}
              value={form.password}
              onChange={handleChange}
              required
            />
            <span style={styles.icon} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <div style={styles.inputGroup}>
            <input
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              style={{
                ...styles.input, 
                borderColor: passwordMatch === null ? theme.border : passwordMatch ? theme.primary : theme.danger
              }}
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <span style={styles.icon} onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <FiEyeOff /> : <FiEye />}
            </span>
            {passwordMatch === false && <div style={styles.msgErrorInline}>Passwords do not match</div>}
            {passwordMatch === true && <div style={styles.msgSuccessInline}>Passwords match ✓</div>}
          </div>

          <button type="submit" disabled={passwordMatch === false || loading} style={styles.btn}>
            {loading ? "Registering..." : "Register"}
          </button>

        </form>
        <p style={styles.linkText}>
          Already have an account? <span onClick={() => navigate("/login")} style={styles.link}>Login</span>
        </p>
      </div>

      {/* SUCCESS POPUP MODAL */}
      {showSuccessModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.successIconBox}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 style={styles.modalTitle}>Registration Successful!</h3>
            <p style={styles.modalText}>
              Your account has been created securely.<br/>
              Please log in to continue.
            </p>
            <button onClick={handleProceedToLogin} style={styles.proceedBtn}>
              Go to Login
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Register;