import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AdminDashboard from "./pages/AdminDashboard"; 
import Home from './pages/Home';
import About from './pages/About';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from "./pages/Login";
import Register from "./pages/Register";

import Cart from './pages/Cart'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import ProductDetails from './pages/ProductDetails';
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import SupportTicket from './pages/SupportTicket';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';


const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const hideHeaderFooter = 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/login') || 
    location.pathname.startsWith('/profile')||
    location.pathname.startsWith('/register');

  return (
    <>
      {!hideHeaderFooter && <Header />}  
      {children}
      {!hideHeaderFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <CartProvider>
    <Router>
      <Toaster 
    position="top-center" 
    reverseOrder={false} 
    toastOptions={{
        // Default options for all toasts
        duration: 2500, // 2.5 seconds-la auto-vah hide aagidum
        style: {
            background: '#fff',
            color: '#333',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            padding: '12px 16px',
        },
        success: {
            duration: 2500, // Success messages (Green)
        },
        error: {
            duration: 3500, // Error messages konjam extra time (Red)
        }
    }} 
/>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          {/* Protected Admin Route - Admin mattum thaan access panna mudiyum */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
  path="/support" 
  element={
    <ProtectedRoute>
      <SupportTicket />
    </ProtectedRoute>
  } 
/>
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order-history" 
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </LayoutWrapper>
    </Router>
    </CartProvider>
  );
}

export default App;