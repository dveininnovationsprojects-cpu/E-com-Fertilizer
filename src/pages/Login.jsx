import React, { useState } from "react";
import API from "../api/axios"; // Important: Using centralized API
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Custom Modal States
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");

  const theme = {
    primary: "#9cc43c",
    text: "#333",
    subText: "#666",
    border: "#e1e4e8",
    bg: "#f4f7f6",
    white: "#ffffff"
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });

      if (res.data.success || res.status === 200) {
        // Save user details correctly based on backend response
        localStorage.setItem("user", JSON.stringify(res.data));
        
        // Setup Modal Data using robust property checking
        const role = res.data.role || res.data.user?.role; 
        const name = res.data.name || res.data.user?.name || "User";
        
        setUserRole(role);
        setUserName(name);
        
        // FIX: Route admins to '/admin' and all normal users to '/profile'
        setRedirectPath(role === 'admin' ? '/admin' : '/profile');
        
        // Show Success Popup
        setShowSuccessModal(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    setShowSuccessModal(false);
    navigate(redirectPath);
  };

  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: theme.bg, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
    card: { backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', boxSizing: 'border-box' },
    title: { textAlign: 'center', color: theme.primary, fontSize: '28px', fontWeight: '700', marginBottom: '30px', margin: 0 },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { position: 'relative' },
    input: { width: '100%', padding: '15px', borderRadius: '8px', border: `1px solid ${theme.border}`, fontSize: '15px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.3s', color: theme.text },
    icon: { position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888', fontSize: '18px' },
    btn: { backgroundColor: theme.primary, color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.3s', marginTop: '10px' },
    linkText: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: theme.subText },
    link: { color: theme.primary, fontWeight: '600', cursor: 'pointer', textDecoration: 'none' },
    
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
        <h2 style={styles.title}>Saral-X Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          
          <input
            type="email"
            placeholder="Email Address"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div style={styles.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span style={styles.icon} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Authenticating..." : "Login"}
          </button>

        </form>
        <p style={styles.linkText}>
          Don't have an account? <span onClick={() => navigate("/register")} style={styles.link}>Register</span>
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
            <h3 style={styles.modalTitle}>Login Successful</h3>
            <p style={styles.modalText}>
              Welcome back, <strong>{userName}</strong>!<br/>
              Redirecting you to the {userRole === 'admin' ? 'Admin Dashboard' : 'Profile'}...
            </p>
            <button onClick={handleProceed} style={styles.proceedBtn}>
              Continue to {userRole === 'admin' ? 'Dashboard' : 'Profile'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;