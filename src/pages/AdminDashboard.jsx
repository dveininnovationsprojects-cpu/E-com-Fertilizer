import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminDashboard = () => {
    // --- 1. STATE MANAGEMENT ---
    const [adminUser, setAdminUser] = useState({ name: 'Loading...', email: '' });
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [tickets, setTickets] = useState([]); // New state for Support Tickets
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
    const [showAddModal, setShowAddModal] = useState(false); // Add Product Modal
    const [showLogoutModal, setShowLogoutModal] = useState(false); // Custom Logout Modal
    const [images, setImages] = useState([]);
    
    // Forms State
    const [formData, setFormData] = useState({
        name: '', category: 'Bio Fertilizer', price: '', stock: '', description: ''
    });
    const [profileData, setProfileData] = useState({ name: '', email: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    // --- 2. CLEAN E-COMMERCE THEME ---
    const theme = {
        primary: "#9cc43c",
        primaryHover: "#8ab035",
        bg: "#f9fbf9",
        sidebar: "#ffffff",
        text: "#333333",
        subText: "#666666",
        border: "#eaeaec",
        white: "#ffffff",
        danger: "#e74c3c",
        success: "#2ecc71",
        cardShadow: "0 2px 12px rgba(0, 0, 0, 0.03)"
    };

    // --- 3. LIFECYCLE & DATA FETCHING ---
    useEffect(() => {
        fetchData();
        fetchAdminProfile();
        
        // Dynamic Window Resize Listener for Responsive Toggle
        const handleResize = () => {
            setIsDesktop(window.innerWidth > 1024);
            if (window.innerWidth > 1024) {
                setIsSidebarOpen(false); // Reset sidebar state on desktop
            }
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchAdminProfile = async () => {
        try {
            const res = await API.get('/users/profile');
            setAdminUser(res.data);
            setProfileData({ name: res.data.name, email: res.data.email });
        } catch (err) {
            const fallbackUser = { name: 'System Admin', email: 'admin@saralx.com' };
            setAdminUser(fallbackUser);
            setProfileData(fallbackUser);
        }
    };

    const fetchData = async () => {
        try {
            const [pRes, oRes, tRes] = await Promise.all([
                API.get('/products'),
                API.get('/admin/orders'),
                API.get('/support') // Fetching Support Tickets
            ]);
            setProducts(pRes.data);
            setOrders(oRes.data);
            setTickets(tRes.data || []);
        } catch (err) {
            console.error("Dashboard Sync Error");
        }
    };

    // --- ACTION HANDLERS ---
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        images.forEach(img => data.append('images', img));

        try {
            await API.post('/admin/products', data);
            alert("Inventory updated successfully.");
            setFormData({ name: '', category: 'Bio Fertilizer', price: '', stock: '', description: '' });
            setImages([]);
            setShowAddModal(false); 
            fetchData();
        } catch (err) {
            alert("Sync failed. Check your network or server.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await API.put(`/admin/orders/${id}`, { status });
            fetchData();
        } catch (err) { 
            console.error(err); 
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await API.put('/users/profile', profileData);
            alert("Profile updated successfully.");
            fetchAdminProfile();
        } catch (err) {
            alert("Failed to update profile.");
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return alert("New passwords do not match.");
        }
        try {
            await API.put('/users/profile/password', passwordData);
            alert("Password changed successfully.");
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            alert("Failed to change password.");
        }
    };

    // Custom Logout Logic
    const handleLogoutClick = () => {
        setShowLogoutModal(true); // Open custom modal instead of browser alert
    };

    const confirmLogout = async () => {
        try {
            await API.post('/users/logout');
            window.location.href = '/'; // Direct to home page
        } catch (err) {
            // Force redirect even if API fails
            window.location.href = '/';
        }
    };

    // --- 4. DYNAMIC STYLES ---
    const s = {
        container: { 
            display: 'flex', 
            minHeight: '100vh', 
            backgroundColor: theme.bg, 
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            overflowX: 'hidden',
            color: theme.text
        },

        // SIDEBAR
        sidebar: {
            width: '260px',
            backgroundColor: theme.sidebar,
            borderRight: `1px solid ${theme.border}`,
            position: 'fixed',
            height: '100vh',
            left: isSidebarOpen || isDesktop ? '0' : '-260px',
            top: 0,
            transition: 'all 0.3s ease',
            zIndex: 1000,
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: isDesktop ? 'none' : '4px 0 15px rgba(0,0,0,0.05)'
        },

        sidebarHeader: {
            padding: '30px 25px',
            borderBottom: `1px solid ${theme.border}`
        },

        brandTitle: {
            fontSize: '18px',
            fontWeight: '700',
            color: theme.primary,
            letterSpacing: '0.5px',
            margin: 0
        },

        sidebarMenu: {
            flex: 1,
            padding: '20px 15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            overflowY: 'auto'
        },

        navItem: (active) => ({
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: active ? '#f4f7f0' : 'transparent',
            color: active ? theme.primary : theme.subText,
            fontWeight: active ? '600' : '500',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            transition: 'background-color 0.2s',
            border: '1px solid transparent',
            borderColor: active ? '#eaf0df' : 'transparent'
        }),

        sidebarFooter: {
            padding: '20px 25px',
            borderTop: `1px solid ${theme.border}`,
            backgroundColor: '#fafafa'
        },

        logoutBtn: {
            width: '100%',
            padding: '10px',
            marginTop: '15px',
            backgroundColor: 'transparent',
            border: `1px solid ${theme.danger}`,
            color: theme.danger,
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.2s'
        },

        // MOBILE HEADER
        mobileHeader: {
            display: isDesktop ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '15px 20px',
            backgroundColor: theme.white,
            borderBottom: `1px solid ${theme.border}`,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 900
        },

        toggleBtn: {
            background: 'transparent',
            color: theme.text,
            border: `1px solid ${theme.border}`,
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
        },

        // MAIN CONTENT
        main: {
            flex: 1,
            padding: isDesktop ? '40px 5%' : '100px 5% 50px 5%',
            transition: 'all 0.3s ease',
            marginLeft: isDesktop ? '260px' : '0',
            maxWidth: isDesktop ? 'calc(100% - 260px)' : '100%',
            boxSizing: 'border-box'
        },

        headerAction: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px',
            flexWrap: 'wrap',
            gap: '15px'
        },

        pageTitle: {
            fontSize: '22px',
            fontWeight: '600',
            color: theme.text,
            margin: 0
        },

        addBtn: {
            background: theme.primary,
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'background-color 0.2s'
        },

        // CARDS & GRIDS
        card: {
            backgroundColor: theme.white,
            padding: '25px',
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            boxShadow: theme.cardShadow,
            marginBottom: '25px'
        },

        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
        },

        statLabel: {
            fontSize: '13px',
            color: theme.subText,
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },

        statValue: {
            fontSize: '26px',
            fontWeight: '600',
            marginTop: '8px',
            color: theme.text
        },

        // MODAL STYLES
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
            padding: '30px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            position: 'relative'
        },
        closeBtn: {
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: theme.subText,
            lineHeight: '1'
        },
        modalActionRow: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '25px'
        },
        cancelBtn: {
            background: '#f1f3f0',
            color: theme.text,
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
        },
        dangerBtn: {
            background: theme.danger,
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
        },

        // FORMS
        formGroup: {
            marginBottom: '18px'
        },

        label: {
            display: 'block',
            fontSize: '13px',
            color: theme.text,
            fontWeight: '500',
            marginBottom: '8px'
        },

        input: {
            width: '100%',
            padding: '12px 15px',
            borderRadius: '6px',
            border: `1px solid ${theme.border}`,
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
            backgroundColor: '#fff',
            color: theme.text,
            transition: 'border-color 0.2s'
        },

        submitBtn: {
            background: theme.primary,
            color: '#fff',
            border: 'none',
            padding: '14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            width: '100%',
            marginTop: '10px',
            transition: 'background-color 0.2s'
        },

        // TABLES
        tableContainer: {
            overflowX: 'auto'
        },

        table: {
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '600px'
        },

        th: {
            textAlign: 'left',
            padding: '15px',
            color: theme.subText,
            fontSize: '13px',
            fontWeight: '500',
            borderBottom: `1px solid ${theme.border}`,
            backgroundColor: '#fcfcfc'
        },

        td: {
            padding: '15px',
            fontSize: '14px',
            borderBottom: `1px solid ${theme.border}`,
            verticalAlign: 'middle'
        },

        statusBadge: (status) => ({
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: status === 'Delivered' ? '#eefaf3' : '#fdf6e9',
            color: status === 'Delivered' ? theme.success : '#f39c12',
            display: 'inline-block'
        })
    };

    // --- 5. RENDER COMPONENTS ---
    return (
        <div style={s.container}>
            
            {/* MOBILE TOP BAR */}
            <div style={s.mobileHeader}>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={s.toggleBtn}>
                    {isSidebarOpen ? 'Close' : 'Menu'}
                </button>
                <div style={{fontWeight: '600', color: theme.primary, fontSize: '16px'}}>Saral-X Admin</div>
                <div style={{width: '50px'}}></div> 
            </div>

            {/* SIDEBAR NAVIGATION */}
            <aside style={s.sidebar}>
                <div style={s.sidebarHeader}>
                    <h1 style={s.brandTitle}>Saral-X</h1>
                    <div style={{fontSize: '12px', color: theme.subText, marginTop: '4px'}}>By Saraswathy Traders</div>
                </div>
                
                <div style={s.sidebarMenu}>
                    <div onClick={() => {setActiveTab('dashboard'); setIsSidebarOpen(false)}} style={s.navItem(activeTab === 'dashboard')}>
                        Dashboard
                    </div>
                    <div onClick={() => {setActiveTab('products'); setIsSidebarOpen(false)}} style={s.navItem(activeTab === 'products')}>
                        Inventory
                    </div>
                    <div onClick={() => {setActiveTab('orders'); setIsSidebarOpen(false)}} style={s.navItem(activeTab === 'orders')}>
                        Orders
                    </div>
                    <div onClick={() => {setActiveTab('support'); setIsSidebarOpen(false)}} style={s.navItem(activeTab === 'support')}>
                        Support Tickets
                    </div>
                    <div onClick={() => {setActiveTab('profile'); setIsSidebarOpen(false)}} style={s.navItem(activeTab === 'profile')}>
                        Profile & Settings
                    </div>
                    <div onClick={() => {setActiveTab('company'); setIsSidebarOpen(false)}} style={s.navItem(activeTab === 'company')}>
                        Company Info
                    </div>
                </div>

                <div style={s.sidebarFooter}>
                    <div style={{fontSize: '11px', color: theme.subText}}>Logged in as</div>
                    <div style={{fontSize: '13px', fontWeight: '600', color: theme.text, marginTop: '4px'}}>
                        {adminUser.name}
                    </div>
                    <button onClick={handleLogoutClick} style={s.logoutBtn}>
                        Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main style={s.main}>
                
                {/* --- DASHBOARD OVERVIEW --- */}
                {activeTab === 'dashboard' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <div style={s.headerAction}>
                            <h2 style={s.pageTitle}>System Overview</h2>
                        </div>
                        
                        {/* Dynamic Welcome Banner */}
                        <div style={{...s.card, backgroundColor: theme.primary, color: '#fff', border: 'none', padding: '35px', display: 'flex', flexDirection: 'column', gap: '8px'}}>
                            <h2 style={{margin: '0', fontSize: '24px', fontWeight: '600'}}>Welcome back, {adminUser.name}</h2>
                            <p style={{margin: 0, opacity: 0.9, fontSize: '15px', fontWeight: '400'}}>Here is the latest performance overview of your Saral-X business today.</p>
                        </div>
                        
                        <div style={s.statsGrid}>
                            <div style={s.card}>
                                <div style={s.statLabel}>Total Revenue</div>
                                <div style={s.statValue}>₹{orders.reduce((a, b) => a + b.totalAmount, 0).toLocaleString('en-IN')}</div>
                            </div>
                            <div style={s.card}>
                                <div style={s.statLabel}>Active Orders</div>
                                <div style={s.statValue}>{orders.length}</div>
                            </div>
                            <div style={s.card}>
                                <div style={s.statLabel}>Total Products</div>
                                <div style={s.statValue}>{products.length}</div>
                            </div>
                        </div>

                        <div style={s.card}>
                            <h3 style={{fontSize: '16px', fontWeight: '600', marginBottom: '20px'}}>Recent Order Activity</h3>
                            <div style={s.tableContainer}>
                                <table style={s.table}>
                                    <thead>
                                        <tr>
                                            <th style={s.th}>Order ID</th>
                                            <th style={s.th}>Customer</th>
                                            <th style={s.th}>Amount</th>
                                            <th style={s.th}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.slice(0, 8).map(o => (
                                            <tr key={o._id}>
                                                <td style={{...s.td, color: theme.subText}}>#{o._id.slice(-5).toUpperCase()}</td>
                                                <td style={s.td}>{o.user?.name || 'Guest User'}</td>
                                                <td style={{...s.td, fontWeight: '500'}}>₹{o.totalAmount.toLocaleString('en-IN')}</td>
                                                <td style={s.td}>
                                                    <span style={s.statusBadge(o.status)}>{o.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                        {orders.length === 0 && (
                                            <tr>
                                                <td colSpan="4" style={{textAlign: 'center', padding: '30px', color: theme.subText}}>No orders found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- INVENTORY MANAGEMENT --- */}
                {activeTab === 'products' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        
                        <div style={s.headerAction}>
                            <h2 style={s.pageTitle}>Inventory Management</h2>
                            <button onClick={() => setShowAddModal(true)} style={s.addBtn}>+ Add Fertilizer</button>
                        </div>

                        {/* Product List */}
                        <div style={s.card}>
                            <h3 style={{fontSize: '16px', fontWeight: '600', marginBottom: '20px'}}>Available Stock</h3>
                            <div style={s.tableContainer}>
                                <table style={s.table}>
                                    <thead>
                                        <tr>
                                            <th style={s.th}>Product</th>
                                            <th style={s.th}>Category</th>
                                            <th style={s.th}>Stock</th>
                                            <th style={s.th}>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(p => (
                                            <tr key={p._id}>
                                                <td style={s.td}>
                                                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                                        <img src={p.imageUrl} width="40" height="40" style={{borderRadius: '4px', objectFit: 'cover', border: `1px solid ${theme.border}`}} alt={p.name} />
                                                        <span style={{fontSize: '14px', fontWeight: '500'}}>{p.name}</span>
                                                    </div>
                                                </td>
                                                <td style={{...s.td, color: theme.subText}}>{p.category}</td>
                                                <td style={s.td}>{p.stock}</td>
                                                <td style={{...s.td, fontWeight: '500'}}>₹{p.price.toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}
                                        {products.length === 0 && (
                                            <tr>
                                                <td colSpan="4" style={{textAlign: 'center', padding: '40px', color: theme.subText}}>Catalog is empty. Click "+ Add Fertilizer" to start.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Add Product Modal Popup */}
                        {showAddModal && (
                            <div style={s.modalOverlay}>
                                <div style={s.modalContent}>
                                    <button onClick={() => setShowAddModal(false)} style={s.closeBtn}>&times;</button>
                                    <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '20px'}}>Add New Fertilizer</h3>
                                    
                                    <form onSubmit={handleProductSubmit}>
                                        <div style={s.formGroup}>
                                            <label style={s.label}>Product Name</label>
                                            <input 
                                                style={s.input} 
                                                placeholder="e.g., Saral-X Bio Mix" 
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                                required 
                                            />
                                        </div>

                                        <div style={{display: 'flex', gap: '15px'}}>
                                            <div style={{...s.formGroup, flex: 1}}>
                                                <label style={s.label}>Price (₹)</label>
                                                <input 
                                                    type="number" 
                                                    style={s.input} 
                                                    placeholder="0.00" 
                                                    value={formData.price}
                                                    onChange={e => setFormData({...formData, price: e.target.value})} 
                                                    required 
                                                />
                                            </div>
                                            <div style={{...s.formGroup, flex: 1}}>
                                                <label style={s.label}>Initial Stock</label>
                                                <input 
                                                    type="number" 
                                                    style={s.input} 
                                                    placeholder="Qty" 
                                                    value={formData.stock}
                                                    onChange={e => setFormData({...formData, stock: e.target.value})} 
                                                    required 
                                                />
                                            </div>
                                        </div>

                                        <div style={s.formGroup}>
                                            <label style={s.label}>Category</label>
                                            <select 
                                                style={s.input}
                                                value={formData.category}
                                                onChange={e => setFormData({...formData, category: e.target.value})}
                                            >
                                                <option>Bio Fertilizer</option>
                                                <option>Organic Manure</option>
                                                <option>Nursery Plants</option>
                                                <option>Quality Seeds</option>
                                            </select>
                                        </div>

                                        <div style={s.formGroup}>
                                            <label style={s.label}>Description</label>
                                            <textarea 
                                                style={{...s.input, height: '80px', resize: 'vertical'}} 
                                                placeholder="Enter product details..." 
                                                value={formData.description}
                                                onChange={e => setFormData({...formData, description: e.target.value})} 
                                            />
                                        </div>

                                        <div style={s.formGroup}>
                                            <label style={s.label}>Product Images (Max 5)</label>
                                            <input 
                                                type="file" 
                                                multiple 
                                                style={{fontSize: '13px', color: theme.subText, marginTop: '5px', width: '100%'}}
                                                onChange={e => setImages([...e.target.files])} 
                                            />
                                        </div>

                                        <button type="submit" disabled={loading} style={s.submitBtn}>
                                            {loading ? 'Uploading Details...' : 'Save Product'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- ORDER MANAGEMENT --- */}
                {activeTab === 'orders' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <div style={s.headerAction}>
                            <h2 style={s.pageTitle}>Order Fulfillment</h2>
                        </div>
                        
                        {orders.length > 0 ? (
                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
                                {orders.map(o => (
                                    <div key={o._id} style={{...s.card, marginBottom: '0'}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${theme.border}`, paddingBottom: '12px', marginBottom: '15px'}}>
                                            <span style={{fontSize: '13px', color: theme.subText}}>Order ID: #{o._id.slice(-6).toUpperCase()}</span>
                                            <span style={s.statusBadge(o.status)}>{o.status}</span>
                                        </div>
                                        
                                        <div style={{fontSize: '15px', fontWeight: '600', marginBottom: '4px'}}>{o.user?.name || "Customer"}</div>
                                        <div style={{fontSize: '13px', color: theme.subText, lineHeight: '1.4'}}>{o.shippingAddress}</div>
                                        
                                        <div style={{fontSize: '20px', fontWeight: '600', color: theme.text, marginTop: '20px'}}>
                                            ₹{o.totalAmount.toLocaleString('en-IN')}
                                        </div>
                                        
                                        <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                                            <button 
                                                onClick={() => handleStatusUpdate(o._id, 'Shipped')} 
                                                style={{flex: 1, padding: '10px', borderRadius: '4px', border: `1px solid ${theme.border}`, backgroundColor: '#fff', color: theme.text, fontSize: '13px', fontWeight: '500', cursor: 'pointer'}}
                                            >
                                                Mark Shipped
                                            </button>
                                            <button 
                                                onClick={() => handleStatusUpdate(o._id, 'Delivered')} 
                                                style={{flex: 1, padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: theme.primary, color: '#fff', fontSize: '13px', fontWeight: '500', cursor: 'pointer'}}
                                            >
                                                Mark Delivered
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{...s.card, padding: '80px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <div style={{width: '80px', height: '80px', backgroundColor: '#f4f7f0', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px'}}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                    </svg>
                                </div>
                                <h3 style={{fontSize: '20px', fontWeight: '600', color: theme.text, marginBottom: '10px'}}>No Pending Orders</h3>
                                <p style={{fontSize: '14px', color: theme.subText, maxWidth: '400px', lineHeight: '1.6'}}>
                                    You're all caught up! New customer orders will automatically appear here for you to process, ship, and deliver.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* --- SUPPORT TICKETS (NEW MODULE) --- */}
                {activeTab === 'support' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <div style={s.headerAction}>
                            <h2 style={s.pageTitle}>Support Tickets</h2>
                        </div>
                        
                        <div style={s.card}>
                            <h3 style={{fontSize: '16px', fontWeight: '600', marginBottom: '20px'}}>Customer Inquiries</h3>
                            <div style={s.tableContainer}>
                                <table style={s.table}>
                                    <thead>
                                        <tr>
                                            <th style={s.th}>Customer Name</th>
                                            <th style={s.th}>Subject</th>
                                            <th style={s.th}>Message Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.map(t => (
                                            <tr key={t._id}>
                                                <td style={{...s.td, fontWeight: '500'}}>{t.user?.name || 'Guest User'}</td>
                                                <td style={s.td}>{t.subject}</td>
                                                <td style={{...s.td, color: theme.subText, maxWidth: '300px', lineHeight: '1.5'}}>
                                                    {t.message}
                                                </td>
                                            </tr>
                                        ))}
                                        {tickets.length === 0 && (
                                            <tr>
                                                <td colSpan="3" style={{textAlign: 'center', padding: '40px', color: theme.subText}}>
                                                    No support tickets found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- PROFILE & SETTINGS --- */}
                {activeTab === 'profile' && (
                    <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: '800px' }}>
                        <div style={s.headerAction}>
                            <h2 style={s.pageTitle}>Profile & Settings</h2>
                        </div>

                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px'}}>
                            
                            {/* Edit Profile Details */}
                            <div style={s.card}>
                                <h3 style={{fontSize: '16px', fontWeight: '600', marginBottom: '20px'}}>Update Details</h3>
                                <form onSubmit={handleProfileUpdate}>
                                    <div style={s.formGroup}>
                                        <label style={s.label}>Full Name</label>
                                        <input 
                                            style={s.input} 
                                            value={profileData.name}
                                            onChange={e => setProfileData({...profileData, name: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div style={s.formGroup}>
                                        <label style={s.label}>Email Address</label>
                                        <input 
                                            type="email"
                                            style={s.input} 
                                            value={profileData.email}
                                            onChange={e => setProfileData({...profileData, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <button type="submit" style={s.submitBtn}>Save Profile Changes</button>
                                </form>
                            </div>

                            {/* Change Password */}
                            <div style={s.card}>
                                <h3 style={{fontSize: '16px', fontWeight: '600', marginBottom: '20px'}}>Change Password</h3>
                                <form onSubmit={handlePasswordChange}>
                                    <div style={s.formGroup}>
                                        <label style={s.label}>Current Password</label>
                                        <input 
                                            type="password"
                                            style={s.input} 
                                            value={passwordData.currentPassword}
                                            onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div style={s.formGroup}>
                                        <label style={s.label}>New Password</label>
                                        <input 
                                            type="password"
                                            style={s.input} 
                                            value={passwordData.newPassword}
                                            onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div style={s.formGroup}>
                                        <label style={s.label}>Confirm New Password</label>
                                        <input 
                                            type="password"
                                            style={s.input} 
                                            value={passwordData.confirmPassword}
                                            onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <button type="submit" style={{...s.submitBtn, backgroundColor: theme.text}}>Update Password</button>
                                </form>
                            </div>

                        </div>
                    </div>
                )}

                {/* --- COMPANY PROFILE (STATIC INFO) --- */}
                {activeTab === 'company' && (
                    <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: '100%' }}>
                        <div style={s.headerAction}>
                            <h2 style={s.pageTitle}>Company Profile</h2>
                        </div>
                        
                        <div style={{...s.card, borderTop: `4px solid ${theme.primary}`, padding: '40px'}}>
                            <h3 style={{fontSize: '28px', fontWeight: '700', color: theme.text, marginBottom: '10px'}}>Saraswathy Traders</h3>
                            <p style={{fontSize: '16px', color: theme.primary, fontWeight: '600', marginBottom: '25px'}}>Home of Saral-X | 25+ Years of Excellence</p>
                            <p style={{fontSize: '15px', color: theme.subText, lineHeight: '1.8', marginBottom: '0', textAlign: 'justify'}}>
                                Saraswathy Traders, under its premium brand <strong>Saral-X</strong>, is a trusted provider of high-quality bio fertilizers, dedicated to supporting sustainable and productive agriculture across India. We are committed to providing quality products at competitive prices with fast and reliable service. Our strong supply network helps us serve customers across India with timely delivery and consistent support.
                            </p>
                        </div>

                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '30px'}}>
                            <div style={{...s.card, padding: '35px'}}>
                                <h4 style={{fontSize: '18px', fontWeight: '600', color: theme.text, marginBottom: '20px', borderBottom: `1px solid ${theme.border}`, paddingBottom: '12px'}}>Leadership & Vision</h4>
                                <p style={{fontSize: '15px', color: theme.subText, lineHeight: '1.8', textAlign: 'justify'}}>
                                    Founded by <strong>DR. T. Vijayakumar</strong>, our vision is to deliver reliable and eco-friendly agricultural solutions. We focus on products that fundamentally improve soil health and exponentially increase crop yield, ensuring a sustainable future for the next generation of farmers.
                                </p>
                            </div>

                            <div style={{...s.card, padding: '35px'}}>
                                <h4 style={{fontSize: '18px', fontWeight: '600', color: theme.text, marginBottom: '20px', borderBottom: `1px solid ${theme.border}`, paddingBottom: '12px'}}>Network & Trust</h4>
                                <p style={{fontSize: '15px', color: theme.subText, lineHeight: '1.8', textAlign: 'justify'}}>
                                    We are proud to be a trusted supplier to government agricultural and horticulture departments. Our robust supply network ensures timely delivery and consistent support at competitive prices, building long-term relationships through trust, quality, and service.
                                </p>
                            </div>
                        </div>

                        <div style={{...s.card, backgroundColor: '#fafafa', padding: '35px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
                            <h4 style={{fontSize: '18px', fontWeight: '600', color: theme.text, marginBottom: '15px'}}>Associated Ventures</h4>
                            <p style={{fontSize: '15px', color: theme.subText, lineHeight: '1.8', maxWidth: '800px', textAlign: 'center'}}>
                                <strong>SS Enterprise (Established 2024)</strong><br/>
                                Expanding our commitment to a complete and sustainable farming system, SS Enterprise supplies premium nursery plants, quality seeds, and organic rice products.
                            </p>
                        </div>
                    </div>
                )}

            </main>

            {/* CUSTOM LOGOUT MODAL */}
            {showLogoutModal && (
                <div style={s.modalOverlay}>
                    <div style={{...s.modalContent, maxWidth: '400px', padding: '25px'}}>
                        <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '15px', color: theme.text}}>Confirm Logout</h3>
                        <p style={{fontSize: '14px', color: theme.subText, marginBottom: '25px', lineHeight: '1.5'}}>
                            Are you sure you want to log out of the Saral-X admin panel?
                        </p>
                        <div style={s.modalActionRow}>
                            <button onClick={() => setShowLogoutModal(false)} style={s.cancelBtn}>Cancel</button>
                            <button onClick={confirmLogout} style={s.dangerBtn}>Logout</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MOBILE OVERLAY */}
            {isSidebarOpen && !isDesktop && (
                <div 
                    onClick={() => setIsSidebarOpen(false)} 
                    style={{
                        position: 'fixed', 
                        top: 0, left: 0, right: 0, bottom: 0, 
                        backgroundColor: 'rgba(0,0,0,0.4)', 
                        zIndex: 950,
                        backdropFilter: 'blur(2px)'
                    }}
                />
            )}
        </div>
    );
};

export default AdminDashboard;