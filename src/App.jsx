import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AdminDashboard from "./pages/AdminDashboard"; 
import Home from './pages/Home';
import About from './pages/About';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from "./pages/Login";
import Register from "./pages/Register";

import Cart from './pages/Cart'; // PUDHUSA ADD PANNATHU: Cart import
import ProtectedRoute from './components/ProtectedRoute'; // Security component
import ProductDetails from './pages/ProductDetails';
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";

// Header & Footer conditionally render pandra wrapper
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  
  // Intha 3 paths-la iruntha Header & Footer hide aaganum
  const hideHeaderFooter = 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/login') || 
    location.pathname.startsWith('/profile')||
    location.pathname.startsWith('/register');

  return (
    <>
      {/* hideHeaderFooter false-ah iruntha mattum thaan Header varum */}
      {!hideHeaderFooter && <Header />}
      
      {children}
      
      {/* hideHeaderFooter false-ah iruntha mattum thaan Footer varum */}
      {!hideHeaderFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
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

          {/* Protected User Routes - Log in panna normal users mattum paarkalam */}
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
  );
}

export default App;