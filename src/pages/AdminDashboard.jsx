import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [adminUser, setAdminUser] = useState({ name: 'Loading...', email: '' });
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [tickets, setTickets] = useState([]); 
    const [customers, setCustomers] = useState([]); 
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
    
    // Modals & Edit States
    const [showAddModal, setShowAddModal] = useState(false); 
    const [showLogoutModal, setShowLogoutModal] = useState(false); 
    const [editMode, setEditMode] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [images, setImages] = useState([]);
    
    // Pagination, Filters & Toggles States
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Shows pagination only if items > 6
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [paymentToggles, setPaymentToggles] = useState({}); // Tracks "Verified" checkbox


const [formData, setFormData] = useState({
    name: '', 
    category: 'Bio Fertilizer', 
    price: '', 
    stock: '', 
    description: ''
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
        
        const handleResize = () => {
            setIsDesktop(window.innerWidth > 1024);
            if (window.innerWidth > 1024) setIsSidebarOpen(false); 
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterCategory, filterStatus]);

    const fetchAdminProfile = async () => {
        try {
            const res = await API.get('auth/profile');
            const userData = res.data.user || res.data;
            setAdminUser(userData);
            setProfileData({ name: userData.name, email: userData.email });
        } catch (err) {
            const storedUserStr = localStorage.getItem('user');
            if (storedUserStr) {
                try {
                    const storedUser = JSON.parse(storedUserStr);
                    const name = storedUser.name || storedUser.user?.name || 'System Admin';
                    const email = storedUser.email || storedUser.user?.email || 'admin@saralx.com';
                    setAdminUser({ name, email });
                    setProfileData({ name, email });
                    return;
                } catch(e) {}
            }
            const fallbackUser = { name: 'System Admin', email: 'admin@saralx.com' };
            setAdminUser(fallbackUser);
            setProfileData(fallbackUser);
        }
    };

    const fetchData = async () => {
        try {
            const [pRes, oRes, tRes, cRes] = await Promise.all([
                API.get('/products').catch(() => ({ data: [] })),
                API.get('/admin/orders').catch(() => ({ data: [] })),
                API.get('/support').catch(() => ({ data: [] })),
                API.get('/admin/users').catch(() => ({ data: [] }))
            ]);
            setProducts(pRes.data);
            setOrders(oRes.data);
            setTickets(tRes.data || []);
            const usersList = cRes.data || [];
            setCustomers(usersList.filter(user => user.role !== 'admin'));
        } catch (err) {
            console.error("Dashboard Sync Error");
        }
    };

    // --- HELPER FUNCTION TO GET PRODUCT NAME ---
    // Finds product name from state if backend only sends ID
    const getProductName = (productRef) => {
        if (!productRef) return "Unknown Product";
        if (productRef.name) return productRef.name; // If backend already populated it
        
        // If it's an ID string/object, find it in our products state
        const foundProduct = products.find(p => p._id === productRef || p._id === productRef.toString());
        return foundProduct ? foundProduct.name : `Product ID: ${productRef}`;
    };

    // --- TAB SWITCHING HANDLER ---
    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        setIsSidebarOpen(false);
        setCurrentPage(1);
        setSearchQuery("");
        setFilterCategory("All");
        setFilterStatus("All");
    };

    // --- ACTION HANDLERS ---
    const openAddModal = () => {
        setEditMode(false);
        setEditProductId(null);
        setFormData({ name: '', category: 'Organic', price: '', stock: '', description: '' });
        setImages([]);
        setShowAddModal(true);
    };

    const openEditModal = (product) => {
        setEditMode(true);
        setEditProductId(product._id);
        setFormData({
            name: product.name,
            category: product.category || 'Organic',
            price: product.price,
            stock: product.stock,
            description: product.description || ''
        });
        setImages([]);
        setShowAddModal(true);
    };
    const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
};

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));

        try {
            if (editMode) {
    // Edit pannum pothu images iruntha, loop panni 'images' key-la append pannunga
    if (images.length > 0) {
        images.forEach(img => data.append('images', img));
    }
    await API.put(`/admin/products/${editProductId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    toast.success("Product updated successfully.");
} else {
                if (images.length > 0) {
                    images.forEach(img => data.append('images', img));
                } else {
                    alert("Please select at least one image.");
                    setLoading(false);
                    return;
                }
                await API.post('/admin/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success(editMode ? "Product updated!" : "Product added!");
            }
            setFormData({ name: '', category: 'Organic', price: '', stock: '', description: '' });
            setImages([]);
            setShowAddModal(false); 
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await API.delete(`/admin/products/${id}`);
                toast.success("Product deleted successfully.");
                fetchData(); // Refresh the product list
            } catch (err) {
                alert(err.response?.data?.message || "Failed to delete product.");
            }
        }
    };

    const handleStatusUpdate = async (order, status) => {
        try {
            const isVerified = paymentToggles[order._id] !== undefined 
                ? paymentToggles[order._id] 
                : order.paymentStatus === 'Verified';
            
            const finalPaymentStatus = isVerified ? 'Verified' : 'Pending';

            await API.put(`/admin/orders/${order._id}`, { 
                status: status, 
                paymentStatus: finalPaymentStatus 
            });
            fetchData();
        } catch (err) { 
            console.error(err); 
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await API.put('auth/profile', profileData);
            toast.success("Profile updated successfully!");
            setAdminUser(prev => ({ ...prev, name: profileData.name, email: profileData.email }));
            
            const storedUserStr = localStorage.getItem('user');
            if(storedUserStr) {
                let storedUser = JSON.parse(storedUserStr);
                if(storedUser.user) {
                    storedUser.user.name = profileData.name;
                    storedUser.user.email = profileData.email;
                } else {
                    storedUser.name = profileData.name;
                    storedUser.email = profileData.email;
                }
                localStorage.setItem('user', JSON.stringify(storedUser));
            }
            fetchAdminProfile();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update profile.");
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) return alert("New passwords do not match.");
        try {
            await API.put('auth/profile', { password: passwordData.newPassword });
            toast.success("Password changed successfully!");;
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            alert (err.response?.data?.message || "Failed to change password.");
        }
    };

    const handleLogoutClick = () => setShowLogoutModal(true); 

    const confirmLogout = async () => {
        try {
            await API.post('auth/logout'); 
            localStorage.removeItem('user');
            window.location.href = '/'; 
        } catch (err) {
            localStorage.removeItem('user');
            window.location.href = '/';
        }
    };

    // --- FILTERING & PAGINATION LOGIC ---
    const getPaginatedData = (array) => {
        const indexOfLast = currentPage * itemsPerPage;
        const indexOfFirst = indexOfLast - itemsPerPage;
        return array.slice(indexOfFirst, indexOfLast);
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === "All" || p.category === filterCategory;
        return matchesSearch && matchesCategory;
    });
    const currentProducts = getPaginatedData(filteredProducts);
    const totalProductPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const filteredOrders = orders.filter(o => {
        const searchTarget = (o.user?.name || "") + " " + o._id;
        const matchesSearch = searchTarget.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "All" || o.status === filterStatus;
        return matchesSearch && matchesStatus;
    });
    const currentOrders = getPaginatedData(filteredOrders);
    const totalOrderPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const filteredCustomers = customers.filter(c => {
        const searchTarget = (c.name || "") + " " + (c.email || "");
        return searchTarget.toLowerCase().includes(searchQuery.toLowerCase());
    });
    const currentCustomers = getPaginatedData(filteredCustomers);
    const totalCustomerPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    const filteredTickets = tickets.filter(t => {
        const searchTarget = (t.user?.name || "") + " " + (t.subject || "");
        return searchTarget.toLowerCase().includes(searchQuery.toLowerCase());
    });
    const currentTickets = getPaginatedData(filteredTickets);
    const totalTicketPages = Math.ceil(filteredTickets.length / itemsPerPage);

    const renderPagination = (totalPages) => {
        if (totalPages <= 1) return null; 
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '25px', marginBottom: '15px'}}>
                <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{ padding: '6px 12px', border: `1px solid ${theme.border}`, backgroundColor: '#fff', color: currentPage === 1 ? '#ccc' : theme.text, borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: '600' }}
                >
                    &laquo; Prev
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                    <button 
                        key={index} 
                        onClick={() => setCurrentPage(index + 1)}
                        style={{
                            padding: '6px 12px',
                            border: `1px solid ${currentPage === index + 1 ? theme.primary : theme.border}`,
                            backgroundColor: currentPage === index + 1 ? theme.primary : '#fff',
                            color: currentPage === index + 1 ? '#fff' : theme.text,
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px',
                            transition: '0.2s'
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
                
                <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{ padding: '6px 12px', border: `1px solid ${theme.border}`, backgroundColor: '#fff', color: currentPage === totalPages ? '#ccc' : theme.text, borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: '600' }}
                >
                    Next &raquo;
                </button>
            </div>
        );
    };

    // --- 4. DYNAMIC STYLES ---
    const s = {
        container: { display: 'flex', minHeight: '100vh', backgroundColor: theme.bg, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', overflowX: 'hidden', color: theme.text },
        sidebar: { width: '260px', backgroundColor: theme.sidebar, borderRight: `1px solid ${theme.border}`, position: 'fixed', height: '100vh', left: isSidebarOpen || isDesktop ? '0' : '-260px', top: 0, transition: 'all 0.3s ease', zIndex: 1000, padding: '0', display: 'flex', flexDirection: 'column', boxShadow: isDesktop ? 'none' : '4px 0 15px rgba(0,0,0,0.05)' },
        sidebarHeader: { padding: '30px 25px', borderBottom: `1px solid ${theme.border}` },
        brandTitle: { fontSize: '18px', fontWeight: '700', color: theme.primary, letterSpacing: '0.5px', margin: 0 },
        sidebarMenu: { flex: 1, padding: '20px 15px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' },
        navItem: (active) => ({ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', backgroundColor: active ? '#f4f7f0' : 'transparent', color: active ? theme.primary : theme.subText, fontWeight: active ? '600' : '500', fontSize: '14px', display: 'flex', alignItems: 'center', transition: 'background-color 0.2s', border: '1px solid transparent', borderColor: active ? '#eaf0df' : 'transparent' }),
        sidebarFooter: { padding: '20px 25px', borderTop: `1px solid ${theme.border}`, backgroundColor: '#fafafa' },
        logoutBtn: { width: '100%', padding: '10px', marginTop: '15px', backgroundColor: 'transparent', border: `1px solid ${theme.danger}`, color: theme.danger, borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' },
        mobileHeader: { display: isDesktop ? 'none' : 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', backgroundColor: theme.white, borderBottom: `1px solid ${theme.border}`, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900 },
        toggleBtn: { background: 'transparent', color: theme.text, border: `1px solid ${theme.border}`, padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
        main: { flex: 1, padding: isDesktop ? '40px 5%' : '100px 5% 50px 5%', transition: 'all 0.3s ease', marginLeft: isDesktop ? '260px' : '0', maxWidth: isDesktop ? 'calc(100% - 260px)' : '100%', boxSizing: 'border-box' },
        headerAction: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' },
        pageTitle: { fontSize: '22px', fontWeight: '600', color: theme.text, margin: 0 },
        addBtn: { background: theme.primary, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'background-color 0.2s' },
        filterContainer: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' },
        filterInput: { padding: '10px 15px', borderRadius: '6px', border: `1px solid ${theme.border}`, fontSize: '14px', outline: 'none', width: '250px', backgroundColor: theme.white },
        filterSelect: { padding: '10px 15px', borderRadius: '6px', border: `1px solid ${theme.border}`, fontSize: '14px', outline: 'none', backgroundColor: theme.white, cursor: 'pointer' },
        card: { backgroundColor: theme.white, padding: '25px', borderRadius: '12px', border: `1px solid ${theme.border}`, boxShadow: theme.cardShadow, marginBottom: '25px' },
        statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' },
        statLabel: { fontSize: '13px', color: theme.subText, fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' },
        statValue: { fontSize: '26px', fontWeight: '600', marginTop: '8px', color: theme.text },
        modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(3px)' },
        modalContent: { backgroundColor: theme.white, padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', position: 'relative' },
        closeBtn: { position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: theme.subText, lineHeight: '1' },
        modalActionRow: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '25px' },
        cancelBtn: { background: '#f1f3f0', color: theme.text, padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
        dangerBtn: { background: theme.danger, color: '#fff', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
        formGroup: { marginBottom: '18px' },
        label: { display: 'block', fontSize: '13px', color: theme.text, fontWeight: '500', marginBottom: '8px' },
        input: { width: '100%', padding: '12px 15px', borderRadius: '6px', border: `1px solid ${theme.border}`, fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff', color: theme.text, transition: 'border-color 0.2s' },
        submitBtn: { background: theme.primary, color: '#fff', border: 'none', padding: '14px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', width: '100%', marginTop: '10px', transition: 'background-color 0.2s' },
        tableContainer: { overflowX: 'auto' },
        table: { width: '100%', borderCollapse: 'collapse', minWidth: '600px' },
        th: { textAlign: 'left', padding: '15px', color: theme.subText, fontSize: '13px', fontWeight: '500', borderBottom: `1px solid ${theme.border}`, backgroundColor: '#fcfcfc' },
        td: { padding: '15px', fontSize: '14px', borderBottom: `1px solid ${theme.border}`, verticalAlign: 'middle' },
        editTextBtn: { background: 'transparent', border: 'none', color: '#3498db', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px' },
        deleteTextBtn: { background: 'transparent', border: 'none', color: theme.danger, fontWeight: '600', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px' },
        statusBadge: (status) => {
            let bgColor = '#fdf6e9';
            let txtColor = '#f39c12';
            if (status === 'Delivered') { bgColor = '#eefaf3'; txtColor = theme.success; }
            if (status === 'Cancelled') { bgColor = '#fdeaea'; txtColor = theme.danger; }
            if (status === 'Shipped') { bgColor = '#eaf4ff'; txtColor = '#3498db'; }
            if (status === 'Delivery Processed') { bgColor = '#f4eaff'; txtColor = '#9b59b6'; }
            return { padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', backgroundColor: bgColor, color: txtColor, display: 'inline-block' };
        }
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
                    <div onClick={() => handleTabSwitch('dashboard')} style={s.navItem(activeTab === 'dashboard')}>Dashboard</div>
                    <div onClick={() => handleTabSwitch('products')} style={s.navItem(activeTab === 'products')}>Inventory</div>
                    <div onClick={() => handleTabSwitch('orders')} style={s.navItem(activeTab === 'orders')}>Orders</div>
                    <div onClick={() => handleTabSwitch('customers')} style={s.navItem(activeTab === 'customers')}>Customers</div>
                    <div onClick={() => handleTabSwitch('support')} style={s.navItem(activeTab === 'support')}>Support Tickets</div>
                    <div onClick={() => handleTabSwitch('profile')} style={s.navItem(activeTab === 'profile')}>Profile & Settings</div>
                    <div onClick={() => handleTabSwitch('company')} style={s.navItem(activeTab === 'company')}>Company Info</div>
                </div>

                <div style={s.sidebarFooter}>
                    <div style={{fontSize: '11px', color: theme.subText}}>Logged in as</div>
                    <div style={{fontSize: '13px', fontWeight: '600', color: theme.text, marginTop: '4px'}}>
                        {adminUser.name}
                    </div>
                    <button onClick={handleLogoutClick} style={s.logoutBtn}>Logout</button>
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
                        
                        <div style={{...s.card, backgroundColor: theme.primary, color: '#fff', border: 'none', padding: '35px', display: 'flex', flexDirection: 'column', gap: '8px'}}>
                            <h2 style={{margin: '0', fontSize: '24px', fontWeight: '600'}}>Welcome back, {adminUser.name}</h2>
                            <p style={{margin: 0, opacity: 0.9, fontSize: '15px', fontWeight: '400'}}>Here is the latest performance overview of your Saral-X business today.</p>
                        </div>
                        
                        <div style={s.statsGrid}>
                            <div style={s.card}>
                                <div style={s.statLabel}>Total Revenue (Delivered)</div>
                                <div style={s.statValue}>₹{orders.filter(o => o.status === 'Delivered').reduce((a, b) => a + b.totalAmount, 0).toLocaleString('en-IN')}</div>
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
                                        {/* Dashboard shows only 5 recent orders */}
                                        {orders.slice(0, 5).map(o => (
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
                            <button onClick={openAddModal} style={s.addBtn}>+ Add Fertilizer</button>
                        </div>

                        {/* Filters */}
                        <div style={s.filterContainer}>
                            <input 
                                type="text" 
                                placeholder="Search products..." 
                                style={s.filterInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <select style={s.filterSelect} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                                <option value="All">All Categories</option>
                                <option value="Organic">Organic</option>
                                <option value="Chemical">Chemical</option>
                                <option value="Tools">Tools</option>
                                <option value="Seeds">Seeds</option>
                            </select>
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
                                            <th style={s.th}>Product Details</th>
                                            <th style={s.th}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentProducts.map(p => (
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
                                                <td style={{...s.td, color: theme.subText, maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} title={p.description}>
                                                    {p.description || 'N/A'}
                                                </td>
                                                <td style={s.td}>
                                                    <div style={{display: 'flex', gap: '12px'}}>
                                                        <button onClick={() => openEditModal(p)} style={s.editTextBtn}>Edit</button>
                                                        <button onClick={() => handleDeleteProduct(p._id)} style={s.deleteTextBtn}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {currentProducts.length === 0 && (
                                            <tr>
                                                <td colSpan="6" style={{textAlign: 'center', padding: '40px', color: theme.subText}}>
                                                    No products found matching your criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination Component */}
                            {renderPagination(totalProductPages)}
                        </div>

                        {/* Add/Edit Product Modal Popup */}
                        {showAddModal && (
                            <div style={s.modalOverlay}>
                                <div style={s.modalContent}>
                                    <button onClick={() => setShowAddModal(false)} style={s.closeBtn}>&times;</button>
                                    <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '20px'}}>
                                        {editMode ? 'Edit Product' : 'Add New Fertilizer'}
                                    </h3>
                                    
                                    <form onSubmit={handleProductSubmit}>
                                        <div style={s.formGroup}>
                                            <label style={s.label}>Product Name</label>
                                            <input style={s.input} placeholder="e.g., Saral-X Bio Mix" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                        </div>

                                        <div style={{display: 'flex', gap: '15px'}}>
                                            <div style={{...s.formGroup, flex: 1}}>
                                                <label style={s.label}>Price (₹)</label>
                                                <input type="number" style={s.input} placeholder="0.00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                                            </div>
                                            <div style={{...s.formGroup, flex: 1}}>
                                                <label style={s.label}>Stock Quantity</label>
                                                <input type="number" style={s.input} placeholder="Qty" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
                                            </div>
                                        </div>

                                        <div style={s.formGroup}>
                                            <label style={s.label}>Category</label>
                                           <select 
    style={s.input} 
    value={formData.category} 
    onChange={e => setFormData({...formData, category: e.target.value})}
>
    <option value="Bio Fertilizer">Bio Fertilizer</option>
    <option value="Organic Manure">Organic Manure</option>
    <option value="Nursery Plants">Nursery Plants</option>
    <option value="Quality Seeds">Quality Seeds</option>
</select>
                                        </div>

                                        <div style={s.formGroup}>
                                            <label style={s.label}>Description</label>
                                            <textarea style={{...s.input, height: '80px', resize: 'vertical'}} placeholder="Enter product details..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                                        </div>

                                        <div style={s.formGroup}>
    <label style={s.label}>Product Images (Max 5)</label>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginTop: '10px' }}>
        {/* Generate 5 Upload Boxes */}
        {[0, 1, 2, 3, 4].map((index) => (
            <div key={index} style={{ position: 'relative', width: '100%', aspectRatio: '1/1', border: `2px dashed ${theme.border}`, borderRadius: '8px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa' }}>
                {images[index] ? (
                    <>
                        <img 
                            src={URL.createObjectURL(images[index])} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            alt="preview" 
                        />
                        <button 
                            type="button"
                            onClick={() => removeImage(index)}
                            style={{ position: 'absolute', top: '2px', right: '2px', background: theme.danger, color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', zIndex: 10 }}
                        >
                            &times;
                        </button>
                    </>
                ) : (
                    <label style={{ cursor: 'pointer', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <i className="fa-solid fa-plus" style={{ color: theme.subText, fontSize: '18px' }}></i>
                        <input 
                            type="file" 
                            style={{ display: 'none' }} 
                            onChange={(e) => {
                                if (e.target.files[0]) {
                                    const newImages = [...images];
                                    newImages[index] = e.target.files[0];
                                    setImages(newImages.filter(Boolean)); // filter nulls
                                }
                            }} 
                        />
                    </label>
                )}
            </div>
        ))}
    </div>
</div>

                                        <button type="submit" disabled={loading} style={s.submitBtn}>
                                            {loading ? 'Saving Data...' : (editMode ? 'Update Product' : 'Save Product')}
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
                        
                        {/* Filters */}
                        <div style={s.filterContainer}>
                            <input 
                                type="text" 
                                placeholder="Search order ID or customer..." 
                                style={s.filterInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <select style={s.filterSelect} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="All">All Statuses</option>
                                <option value="Placed">Placed</option>
                                <option value="Delivery Processed">Delivery Processed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        {currentOrders.length > 0 ? (
                            <>
                                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px'}}>
                                    {currentOrders.map(o => (
                                        <div key={o._id} style={{...s.card, marginBottom: '0'}}>
                                            <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${theme.border}`, paddingBottom: '12px', marginBottom: '15px'}}>
                                                <span style={{fontSize: '13px', color: theme.subText, fontWeight: '600'}}>ID: #{o._id.slice(-6).toUpperCase()}</span>
                                                <span style={s.statusBadge(o.status)}>{o.status}</span>
                                            </div>
                                            
                                            <div style={{fontSize: '15px', fontWeight: '600', marginBottom: '4px'}}>{o.user?.name || "Customer"}</div>
                                            <div style={{fontSize: '13px', color: theme.subText, lineHeight: '1.4', marginBottom: '8px'}}>{o.shippingAddress}</div>
                                            
                                            {/* CHECKBOX FOR PAYMENT VERIFICATION */}
                                            <div style={{fontSize: '13px', color: theme.subText, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                <input 
                                                    type="checkbox" 
                                                    id={`pay-${o._id}`}
                                                    checked={paymentToggles[o._id] !== undefined ? paymentToggles[o._id] : o.paymentStatus === 'Verified'}
                                                    onChange={(e) => setPaymentToggles({...paymentToggles, [o._id]: e.target.checked})}
                                                    disabled={o.paymentStatus === 'Verified'} 
                                                    style={{cursor: o.paymentStatus === 'Verified' ? 'not-allowed' : 'pointer'}}
                                                />
                                                <label htmlFor={`pay-${o._id}`} style={{cursor: o.paymentStatus === 'Verified' ? 'not-allowed' : 'pointer', fontWeight: '500'}}>
                                                    Mark Payment as <span style={{color: theme.success}}>Verified</span>
                                                </label>
                                            </div>
                                            
                                            <div style={{fontSize: '13px', color: theme.subText, marginBottom: '8px'}}>
                                                WhatsApp Update: <span style={{fontWeight: '600'}}>{o.whatsappSent ? 'Sent' : 'Pending'}</span>
                                            </div>
                                            
                                            {/* ORDER ITEMS LIST WITH PRODUCT NAME FIXED */}
                                            <div style={{ backgroundColor: '#f4f7f0', padding: '12px', borderRadius: '8px', margin: '12px 0', maxHeight: '120px', overflowY: 'auto', border: `1px solid ${theme.border}` }}>
                                                <div style={{ fontSize: '12px', fontWeight: '600', color: theme.subText, marginBottom: '8px' }}>ORDERED ITEMS:</div>
                                                {o.orderItems && o.orderItems.length > 0 ? (
                                                    o.orderItems.map((item, idx) => (
                                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', borderBottom: idx !== o.orderItems.length - 1 ? '1px dashed #ddd' : 'none', paddingBottom: '4px' }}>
                                                            <span style={{ fontWeight: '500', color: theme.text }}>
                                                                {getProductName(item.product)}
                                                            </span>
                                                            <span style={{ fontWeight: '600', color: theme.primary }}>x{item.quantity}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div style={{fontSize: '13px', color: theme.subText}}>No items found.</div>
                                                )}
                                            </div>
                                            
                                            <div style={{fontSize: '20px', fontWeight: '700', color: theme.text, marginTop: '15px'}}>
                                                ₹{o.totalAmount.toLocaleString('en-IN')}
                                            </div>
                                            
                                            {/* Dynamic Order Action Flow */}
                                            {o.status !== 'Delivered' && o.status !== 'Cancelled' ? (
                                                <div style={{display: 'flex', gap: '8px', marginTop: '20px'}}>
                                                    {o.status === 'Placed' && (
                                                        <button onClick={() => handleStatusUpdate(o, 'Delivery Processed')} style={{flex: 1, padding: '8px', borderRadius: '4px', border: `1px solid ${theme.primary}`, backgroundColor: '#fff', color: theme.primary, fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>
                                                            Process Order
                                                        </button>
                                                    )}
                                                    {o.status === 'Delivery Processed' && (
                                                        <button onClick={() => handleStatusUpdate(o, 'Shipped')} style={{flex: 1, padding: '8px', borderRadius: '4px', border: 'none', backgroundColor: '#3498db', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>
                                                            Ship Item
                                                        </button>
                                                    )}
                                                    {o.status === 'Shipped' && (
                                                        <button onClick={() => handleStatusUpdate(o, 'Delivered')} style={{flex: 1, padding: '8px', borderRadius: '4px', border: 'none', backgroundColor: theme.success, color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>
                                                            Mark Delivered
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div style={{marginTop: '20px', padding: '10px', backgroundColor: o.status === 'Delivered' ? '#eefaf3' : '#fdeaea', color: o.status === 'Delivered' ? theme.success : theme.danger, borderRadius: '6px', textAlign: 'center', fontWeight: '600', fontSize: '13px'}}>
                                                    {o.status === 'Delivered' ? '✓ Order Completed' : '✕ Order Cancelled'}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {/* Pagination Component */}
                                {renderPagination(totalOrderPages)}
                            </>
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
                                <h3 style={{fontSize: '20px', fontWeight: '600', color: theme.text, marginBottom: '10px'}}>No Orders Found</h3>
                                <p style={{fontSize: '14px', color: theme.subText, maxWidth: '400px', lineHeight: '1.6'}}>
                                    You're all caught up! Adjust filters or wait for new customer orders.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* --- CUSTOMERS LIST --- */}
                {activeTab === 'customers' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <div style={s.headerAction}>
                            <h2 style={s.pageTitle}>Customer Directory</h2>
                        </div>
                        
                        <div style={s.filterContainer}>
                            <input 
                                type="text" 
                                placeholder="Search customer name or email..." 
                                style={s.filterInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div style={s.card}>
                            <h3 style={{fontSize: '16px', fontWeight: '600', marginBottom: '20px'}}>Registered Customers</h3>
                            <div style={s.tableContainer}>
                                <table style={s.table}>
                                    <thead>
                                        <tr>
                                            <th style={s.th}>Name</th>
                                            <th style={s.th}>Email Address</th>
                                            <th style={s.th}>Phone Number</th>
                                            <th style={s.th}>Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentCustomers.map(c => (
                                            <tr key={c._id}>
                                                <td style={{...s.td, fontWeight: '500'}}>{c.name}</td>
                                                <td style={{...s.td, color: theme.subText}}>{c.email}</td>
                                                <td style={{...s.td, color: theme.subText}}>{c.phone || 'Not Provided'}</td>
                                                <td style={{...s.td, color: theme.subText}}>{c.address || 'Not Provided'}</td>
                                            </tr>
                                        ))}
                                        {currentCustomers.length === 0 && (
                                            <tr>
                                                <td colSpan="4" style={{textAlign: 'center', padding: '40px', color: theme.subText}}>
                                                    No registered customers found. Please ensure the GET /api/admin/users route exists in your backend.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {renderPagination(totalCustomerPages)}
                        </div>
                    </div>
                )}

                {/* --- SUPPORT TICKETS --- */}
                {activeTab === 'support' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <div style={s.headerAction}>
                            <h2 style={s.pageTitle}>Support Tickets</h2>
                        </div>

                        <div style={s.filterContainer}>
                            <input 
                                type="text" 
                                placeholder="Search customer or subject..." 
                                style={s.filterInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
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
                                            <th style={s.th}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentTickets.map(t => (
                                            <tr key={t._id}>
                                                <td style={{...s.td, fontWeight: '500'}}>{t.user?.name || 'Guest User'}</td>
                                                <td style={s.td}>{t.subject}</td>
                                                <td style={{...s.td, color: theme.subText, maxWidth: '300px', lineHeight: '1.5'}}>
                                                    {t.message}
                                                </td>
                                                <td style={s.td}>
                                                    {t.user?.email && (
                                                        <a 
                                                            href={`mailto:${t.user.email}?subject=Re: ${t.subject}`}
                                                            style={{
                                                                padding: '8px 16px', 
                                                                backgroundColor: theme.primary, 
                                                                color: '#fff', 
                                                                textDecoration: 'none', 
                                                                borderRadius: '6px', 
                                                                fontSize: '13px', 
                                                                fontWeight: '600',
                                                                display: 'inline-block'
                                                            }}
                                                        >
                                                            Reply via Email
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {currentTickets.length === 0 && (
                                            <tr>
                                                <td colSpan="4" style={{textAlign: 'center', padding: '40px', color: theme.subText}}>
                                                    No support tickets found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {renderPagination(totalTicketPages)}
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
                                        <input style={s.input} value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} required />
                                    </div>
                                    <div style={s.formGroup}>
                                        <label style={s.label}>Email Address</label>
                                        <input type="email" style={s.input} value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} required />
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
                                        <input type="password" style={s.input} value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} required />
                                    </div>
                                    <div style={s.formGroup}>
                                        <label style={s.label}>New Password</label>
                                        <input type="password" style={s.input} value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} required />
                                    </div>
                                    <div style={s.formGroup}>
                                        <label style={s.label}>Confirm New Password</label>
                                        <input type="password" style={s.input} value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} required />
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