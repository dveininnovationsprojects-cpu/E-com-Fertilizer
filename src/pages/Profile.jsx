import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../App.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPwd: "", confirm: "" });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [supportMsg, setSupportMsg] = useState("");
  const [supportSubject, setSupportSubject] = useState("");
  const [supportSending, setSupportSending] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "", username: "", email: "", phone: "", address: "", gender: "", _id: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser((prev) => ({ ...prev, ...storedUser }));
  }, []);

  useEffect(() => {
    if (activeTab === "orders") fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser?._id) return;
      const res = await API.get(`/orders/${storedUser._id}`);
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      const res = await API.put(`/user/${user._id}`, user);
      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        window.dispatchEvent(new Event("storage"));
        setEditMode(false);
        alert("Profile updated successfully");
      }
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwords.newPwd !== passwords.confirm) return alert("New passwords do not match!");
    try {
      await API.put("/auth/profile", { password: passwords.newPwd });
      alert("Password changed successfully.");
      setPasswords({ current: "", newPwd: "", confirm: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change password.");
    }
  };

  const handleSupportSend = async () => {
    if (!supportSubject.trim()) return alert("Please enter a subject.");
    if (!supportMsg.trim()) return alert("Please write a message.");
    setSupportSending(true);
    try {
      await API.post("/support", {
        user: user._id,
        subject: supportSubject,
        message: supportMsg,
      });
      alert("Message sent successfully!");
      setSupportMsg("");
      setSupportSubject("");
    } catch (err) {
      console.error(err);
      alert("Failed to send message. Try again.");
    } finally {
      setSupportSending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <div className="profile-container">
      {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)}></div>}

      {/* SIDEBAR */}
      <div className="profile-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <h2>Saral-X</h2>
            <p>User Portal</p>
          </div>
          <button className="sidebar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`}></i>
          </button>
        </div>

        <ul className={`sidebar-menu ${menuOpen ? "open" : ""}`}>
          <li className={activeTab === "profile" ? "active" : ""} onClick={() => { setActiveTab("profile"); setMenuOpen(false); }}>
            <i className="fa-regular fa-user"></i> Personal Information
          </li>
          <li onClick={() => { navigate("/order-history"); setMenuOpen(false); }}>
            <i className="fa-solid fa-clock-rotate-left"></i> Order History
          </li>
          <li className={activeTab === "address" ? "active" : ""} onClick={() => { setActiveTab("address"); setMenuOpen(false); }}>
            <i className="fa-solid fa-location-dot"></i> Manage Address
          </li>
          <li className={activeTab === "password" ? "active" : ""} onClick={() => { setActiveTab("password"); setMenuOpen(false); }}>
            <i className="fa-solid fa-lock"></i> Password Manager
          </li>
          <li className={activeTab === "support" ? "active" : ""} onClick={() => { setActiveTab("support"); setMenuOpen(false); }}>
            <i className="fa-solid fa-headset"></i> Support
          </li>
          <li className="sidebar-logout-mobile" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </li>
        </ul>

        <div className="sidebar-footer">
          <p>{user.name}</p>
          <button onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="profile-content">

        {activeTab === "profile" && (
          <div className="profile-card">
            <div className="avatar-section">
              <div className="avatar-placeholder"><i className="fa-regular fa-user"></i></div>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
            <div className="details-section">
              <h3>Account Details</h3>
              <label>Username</label>
              <input name="username" value={user.username} onChange={handleChange} disabled={!editMode} placeholder="Enter username" />
              <label>Full Name</label>
              <input name="name" value={user.name} onChange={handleChange} disabled={!editMode} />
              <label>Email</label>
              <input name="email" value={user.email} onChange={handleChange} disabled={!editMode} />
              <label>Phone</label>
              <input name="phone" value={user.phone || ""} onChange={handleChange} disabled={!editMode} />
              <label>Address</label>
              <input name="address" value={user.address || ""} onChange={handleChange} disabled={!editMode} />
              <label>Gender</label>
              <select name="gender" value={user.gender || ""} onChange={handleChange} disabled={!editMode}
                style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "0.85rem", outline: "none", background: editMode ? "#fff" : "#f9f9f9", color: "#555" }}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {!editMode ? (
                <button onClick={() => setEditMode(true)}>Edit Profile</button>
              ) : (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={handleUpdate}>Save Changes</button>
                  <button onClick={() => setEditMode(false)} style={{ background: "#aaa" }}>Cancel</button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="orders-section">
            <h3>My Orders</h3>
            {ordersLoading ? <p style={{ color: "#888" }}>Loading orders...</p>
              : orders.length === 0 ? <p style={{ color: "#888" }}>No orders found.</p>
              : (
                <table className="orders-table">
                  <thead><tr><th>Order ID</th><th>Date</th><th>Item</th><th>Amount</th><th>Status</th></tr></thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id || o.id}>
                        <td>{o._id || o.id}</td>
                        <td>{new Date(o.createdAt || o.date).toLocaleDateString()}</td>
                        <td>{o.item || o.productName}</td>
                        <td>₹{o.amount || o.totalAmount}</td>
                        <td><span className={`order-status ${(o.status || "").toLowerCase()}`}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
          </div>
        )}

        {activeTab === "support" && (
          <div className="support-section">
            <h3>Support</h3>
            <p>Need help? Reach us at:</p>
            <div className="support-card">
              <p><i className="fa-solid fa-phone"></i> +91 98765 43210</p>
              <p><i className="fa-solid fa-envelope"></i> support@saralx.com</p>
              <p><i className="fa-solid fa-clock"></i> Mon - Sat, 9AM - 6PM</p>
            </div>
            <input type="text" placeholder="Subject" value={supportSubject} onChange={(e) => setSupportSubject(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "16px", fontFamily: "sans-serif", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
            <textarea placeholder="Write your message here..." rows={5} value={supportMsg} onChange={(e) => setSupportMsg(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "10px", fontFamily: "sans-serif", boxSizing: "border-box" }} />
            <button onClick={handleSupportSend} disabled={supportSending}
              style={{ marginTop: "10px", padding: "10px 24px", background: "#79A206", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", opacity: supportSending ? 0.7 : 1 }}>
              {supportSending ? "Sending..." : "Send Message"}
            </button>
          </div>
        )}

        {activeTab === "address" && (
          <div className="support-section">
            <h3>Manage Address</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "500px", marginTop: "16px" }}>
              <div className="pwd-field"><label>Address Line 1 *</label><input type="text" placeholder="House No, Street Name" /></div>
              <div className="pwd-field"><label>Address Line 2 <span style={{ color: "#aaa", fontWeight: 400 }}>(Optional)</span></label><input type="text" placeholder="Apartment, Area, Landmark" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div className="pwd-field"><label>City *</label><input type="text" placeholder="City" /></div>
                <div className="pwd-field"><label>Area *</label><input type="text" placeholder="Area" /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div className="pwd-field"><label>Country *</label><input type="text" placeholder="Country" defaultValue="India" /></div>
                <div className="pwd-field"><label>Pin Code *</label><input type="text" placeholder="Pin Code" maxLength={6} /></div>
              </div>
              <button className="pwd-btn" style={{ marginTop: "6px" }}>Save Address</button>
            </div>
          </div>
        )}

        {activeTab === "password" && (
          <div className="password-section">
            <h3>Password Manager</h3>
            <div className="password-card">
              <div className="pwd-field"><label>Current Password *</label><input type="password" placeholder="Enter current password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} /></div>
              <div className="pwd-field"><label>New Password</label><input type="password" placeholder="Enter new password" value={passwords.newPwd} onChange={(e) => setPasswords({ ...passwords, newPwd: e.target.value })} /></div>
              <div className="pwd-field"><label>Confirm New Password</label><input type="password" placeholder="Enter confirm password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} /></div>
              <button className="pwd-btn" onClick={handlePasswordUpdate}>Update Password</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
