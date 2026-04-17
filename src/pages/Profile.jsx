import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../App.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPwd: "", confirm: "" });
  const [orders, setOrders] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // To get product names and images
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [supportMsg, setSupportMsg] = useState("");
  const [supportSubject, setSupportSubject] = useState("");
  const [supportSending, setSupportSending] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "", username: "", email: "", phone: "", address: "", gender: "", _id: "",
  });

  // State specifically for the Manage Address Tab
  const [addressForm, setAddressForm] = useState({
    line1: "", line2: "", city: "", area: "", country: "India", pinCode: ""
  });

  useEffect(() => {
    fetchProfile();
    fetchAllProducts(); // Fetch products to show images/names in orders
  }, []);

  useEffect(() => {
    if (activeTab === "orders") fetchOrders();
  }, [activeTab]);

  // Fetch fresh profile data
  const fetchProfile = async () => {
    try {
      const res = await API.get('/auth/profile');
      const fetchedUser = res.data.user || res.data;
      setUser((prev) => ({ ...prev, ...fetchedUser }));
      localStorage.setItem("user", JSON.stringify(fetchedUser));
      
      if(fetchedUser.address) {
        setAddressForm(prev => ({...prev, line1: fetchedUser.address}));
      }
    } catch (error) {
      console.error("Failed to fetch fresh profile data", error);
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) setUser((prev) => ({ ...prev, ...storedUser }));
    }
  };

  // Fetch all products to map IDs to Images/Names
  const fetchAllProducts = async () => {
    try {
      const res = await API.get('/products');
      setAllProducts(res.data);
    } catch(err) {
      console.error("Failed to fetch products for order mapping", err);
    }
  };

  // Fetch user orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await API.get('/orders/myorders');
      const fetchedOrders = res.data.orders || res.data || [];
      setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Helper to get Product Name and Image from ID
  const getProductDetails = (prodRef) => {
    const fallbackImage = "https://via.placeholder.com/80?text=Product";
    if (!prodRef) return { name: "Unknown Product", image: fallbackImage };
    if (prodRef.name) return { name: prodRef.name, image: prodRef.imageUrl || fallbackImage };
    
    const found = allProducts.find(p => p._id === prodRef || p._id === prodRef.toString());
    return found 
      ? { name: found.name, image: found.imageUrl || fallbackImage } 
      : { name: `Product ID: ${prodRef}`, image: fallbackImage };
  };

  // Cancel Order API Call
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      await API.put(`/orders/${orderId}/cancel`);
      alert("Order cancelled successfully!");
      fetchOrders(); // Refresh the list after cancellation
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order.");
    }
  };

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
  const handleAddressChange = (e) => setAddressForm({ ...addressForm, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      const res = await API.put(`/auth/profile`, user);
      if (res.data.success || res.status === 200) {
        const updatedUser = res.data.user || res.data;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        window.dispatchEvent(new Event("storage"));
        setEditMode(false);
        alert("Profile updated successfully");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleAddressSave = async () => {
    if(!addressForm.line1 || !addressForm.city || !addressForm.pinCode) {
      return alert("Please fill the mandatory address fields (*).");
    }
    const combinedAddress = `${addressForm.line1}, ${addressForm.line2 ? addressForm.line2 + ', ' : ''}${addressForm.area ? addressForm.area + ', ' : ''}${addressForm.city}, ${addressForm.country} - ${addressForm.pinCode}`;
    
    try {
      const payload = { ...user, address: combinedAddress };
      const res = await API.put(`/auth/profile`, payload);
      
      if (res.data.success || res.status === 200) {
        const updatedUser = res.data.user || res.data;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        alert("Address saved successfully!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save address");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.newPwd) return alert("Please enter a new password");
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
        subject: supportSubject,
        message: supportMsg,
      });
      alert("Message sent successfully!");
      setSupportMsg("");
      setSupportSubject("");
    } catch (err) {
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
          <li className={activeTab === "orders" ? "active" : ""} onClick={() => { setActiveTab("orders"); setMenuOpen(false); }}>
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
      </div>

      {/* CONTENT */}
      <div className="profile-content">

        {/* --- PERSONAL INFORMATION --- */}
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
              <input name="username" value={user.username || ""} onChange={handleChange} disabled={!editMode} placeholder="Enter username" />
              
              <label>Full Name</label>
              <input name="name" value={user.name || ""} onChange={handleChange} disabled={!editMode} />
              
              <label>Email</label>
              <input name="email" type="email" value={user.email || ""} onChange={handleChange} disabled={!editMode} />
              
              <label>Phone</label>
              <input name="phone" value={user.phone || ""} onChange={handleChange} disabled={!editMode} placeholder="Phone Number" />
              
              <label>Current Saved Address</label>
              <input name="address" value={user.address || ""} onChange={handleChange} disabled={!editMode} placeholder="Your full address" />
              
              <label>Gender</label>
              <select name="gender" value={user.gender || ""} onChange={handleChange} disabled={!editMode}
                style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "0.85rem", outline: "none", background: editMode ? "#fff" : "#f9f9f9", color: "#555", width: '100%' }}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              
              <div style={{marginTop: '20px'}}>
                {!editMode ? (
                  <button onClick={() => setEditMode(true)}>Edit Profile</button>
                ) : (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={handleUpdate}>Save Changes</button>
                    <button onClick={() => {setEditMode(false); fetchProfile();}} style={{ background: "#aaa" }}>Cancel</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- ORDERS (FLIPKART STYLE) --- */}
        {activeTab === "orders" && (
          <div className="orders-section">
            <h3 style={{marginBottom: '20px', color: '#333'}}>My Orders</h3>
            
            {ordersLoading ? <p style={{ color: "#888" }}>Loading your orders...</p>
              : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f9fbf9', borderRadius: '12px', border: '1px dashed #ddd' }}>
                    <div style={{fontSize: '40px', color: '#ccc', marginBottom: '10px'}}><i className="fa-solid fa-box-open"></i></div>
                    <h3 style={{fontSize: '18px', color: '#333', margin: '0 0 10px 0'}}>No Orders Found</h3>
                    <p style={{ color: "#888", fontSize: '14px', margin: 0 }}>Looks like you haven't shopped with us yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {orders.map((o) => (
                        <div key={o._id} style={{ backgroundColor: '#fff', border: '1px solid #eaeaec', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                            
                            {/* Order Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                                <div>
                                    <span style={{ fontWeight: '700', color: '#333', marginRight: '15px' }}>Order #{o._id ? o._id.slice(-8).toUpperCase() : 'N/A'}</span>
                                    <span style={{ color: '#888', fontSize: '13px' }}><i className="fa-regular fa-calendar" style={{marginRight: '5px'}}></i> {new Date(o.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div style={{ fontWeight: '700', color: '#333', fontSize: '16px' }}>
                                    Total: ₹{o.totalAmount?.toLocaleString('en-IN') || 0}
                                </div>
                            </div>

                            {/* Order Items (Products) */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                                {o.orderItems && o.orderItems.map((item, idx) => {
                                    const prodInfo = getProductDetails(item.product);
                                    return (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ width: '70px', height: '70px', borderRadius: '8px', border: '1px solid #eee', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f9f9f9' }}>
                                                <img src={prodInfo.image} alt={prodInfo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#333', fontWeight: '600' }}>{prodInfo.name}</h4>
                                                <div style={{ color: '#666', fontSize: '13px' }}>Qty: <span style={{fontWeight: '600', color: '#333'}}>{item.quantity}</span>  |  Price: <span style={{fontWeight: '600', color: '#333'}}>₹{item.price?.toLocaleString('en-IN')}</span></div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Order Footer / Actions */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid #f0f0f0', flexWrap: 'wrap', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Status:</span>
                                    <span 
                                        style={{
                                            padding: '6px 12px', 
                                            borderRadius: '20px', 
                                            fontSize: '12px', 
                                            fontWeight: '600', 
                                            backgroundColor: o.status === 'Delivered' ? '#eefaf3' : o.status === 'Cancelled' ? '#fdeaea' : '#fdf6e9', 
                                            color: o.status === 'Delivered' ? '#2ecc71' : o.status === 'Cancelled' ? '#e74c3c' : '#f39c12'
                                        }}
                                    >
                                        <i className={`fa-solid ${o.status === 'Delivered' ? 'fa-check-circle' : o.status === 'Cancelled' ? 'fa-times-circle' : 'fa-truck-fast'}`} style={{marginRight: '5px'}}></i>
                                        {o.status || "Pending"}
                                    </span>
                                </div>
                                
                                {/* Cancel Order Button - Only shows before shipping */}
                                {['Placed', 'Delivery Processed', 'Pending'].includes(o.status) && (
                                    <button 
                                        onClick={() => handleCancelOrder(o._id)} 
                                        style={{ 
                                            backgroundColor: '#fff', 
                                            color: '#e74c3c', 
                                            border: '1px solid #e74c3c', 
                                            padding: '8px 16px', 
                                            borderRadius: '6px', 
                                            fontSize: '13px', 
                                            fontWeight: '600', 
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseOver={(e) => { e.target.style.backgroundColor = '#fdeaea' }}
                                        onMouseOut={(e) => { e.target.style.backgroundColor = '#fff' }}
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
              )}
          </div>
        )}

        {/* --- SUPPORT TICKETS --- */}
        {activeTab === "support" && (
          <div className="support-section">
            <h3>Support</h3>
            <p>Need help? Reach us at:</p>
            <div className="support-card">
              <p><i className="fa-solid fa-phone"></i> +91 98765 43210</p>
              <p><i className="fa-solid fa-envelope"></i> support@saralx.com</p>
              <p><i className="fa-solid fa-clock"></i> Mon - Sat, 9AM - 6PM</p>
            </div>
            
            <div style={{marginTop: '25px', backgroundColor: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaec', boxShadow: '0 2px 10px rgba(0,0,0,0.03)'}}>
                <h4 style={{marginTop: 0, marginBottom: '15px', color: '#333'}}>Send us a message</h4>
                <input type="text" placeholder="Subject" value={supportSubject} onChange={(e) => setSupportSubject(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontFamily: "sans-serif", fontSize: "0.85rem", outline: "none", boxSizing: "border-box", marginBottom: '15px' }} />
                
                <textarea placeholder="Write your message here..." rows={5} value={supportMsg} onChange={(e) => setSupportMsg(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontFamily: "sans-serif", boxSizing: "border-box", resize: 'vertical' }} />
                
                <button onClick={handleSupportSend} disabled={supportSending}
                style={{ marginTop: "15px", padding: "12px 24px", background: "#9cc43c", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: '600', width: '100%', opacity: supportSending ? 0.7 : 1 }}>
                {supportSending ? "Sending..." : "Send Message"}
                </button>
            </div>
          </div>
        )}

        {/* --- MANAGE ADDRESS --- */}
        {activeTab === "address" && (
          <div className="support-section">
            <h3>Manage Address</h3>
            <p style={{color: '#666', fontSize: '14px', marginBottom: '20px'}}>Update your primary delivery address below.</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px", backgroundColor: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaec' }}>
              
              <div className="pwd-field">
                  <label style={{display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600'}}>Address Line 1 *</label>
                  <input type="text" name="line1" value={addressForm.line1} onChange={handleAddressChange} placeholder="House No, Street Name" style={{width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box'}}/>
              </div>
              
              <div className="pwd-field">
                  <label style={{display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600'}}>Address Line 2 <span style={{ color: "#aaa", fontWeight: 400 }}>(Optional)</span></label>
                  <input type="text" name="line2" value={addressForm.line2} onChange={handleAddressChange} placeholder="Apartment, Area, Landmark" style={{width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box'}}/>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="pwd-field">
                    <label style={{display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600'}}>City *</label>
                    <input type="text" name="city" value={addressForm.city} onChange={handleAddressChange} placeholder="City" style={{width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box'}}/>
                </div>
                <div className="pwd-field">
                    <label style={{display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600'}}>Area / District</label>
                    <input type="text" name="area" value={addressForm.area} onChange={handleAddressChange} placeholder="Area" style={{width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box'}}/>
                </div>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="pwd-field">
                    <label style={{display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600'}}>Country *</label>
                    <input type="text" name="country" value={addressForm.country} onChange={handleAddressChange} placeholder="Country" style={{width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box'}}/>
                </div>
                <div className="pwd-field">
                    <label style={{display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600'}}>Pin Code *</label>
                    <input type="text" name="pinCode" value={addressForm.pinCode} onChange={handleAddressChange} placeholder="Pin Code" maxLength={6} style={{width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box'}}/>
                </div>
              </div>
              
              <button className="pwd-btn" onClick={handleAddressSave} style={{ marginTop: "10px", width: '100%', padding: '14px', backgroundColor: '#9cc43c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  Save Address
              </button>
            </div>
          </div>
        )}

        {/* --- PASSWORD MANAGER --- */}
        {activeTab === "password" && (
          <div className="password-section">
            <h3>Password Manager</h3>
            <p style={{color: '#666', fontSize: '14px', marginBottom: '20px'}}>Keep your account secure by updating your password regularly.</p>
            
            <div className="password-card" style={{maxWidth: '500px', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #eaeaec'}}>
              <div className="pwd-field" style={{marginBottom: '15px'}}>
                  <label style={{display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600'}}>Current Password *</label>
                  <input type="password" placeholder="Enter current password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} style={{width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box'}}/>
              </div>
              
              <div className="pwd-field" style={{marginBottom: '15px'}}>
                  <label style={{display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600'}}>New Password</label>
                  <input type="password" placeholder="Enter new password" value={passwords.newPwd} onChange={(e) => setPasswords({ ...passwords, newPwd: e.target.value })} style={{width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box'}}/>
              </div>
              
              <div className="pwd-field" style={{marginBottom: '25px'}}>
                  <label style={{display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600'}}>Confirm New Password</label>
                  <input type="password" placeholder="Enter confirm password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} style={{width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box'}}/>
              </div>
              
              <button className="pwd-btn" onClick={handlePasswordUpdate} style={{ width: '100%', padding: '14px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  Update Password
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;