import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AdminDashboard from "./pages/AdminDashboard"; 
import Home from './pages/Home';
import About from './pages/About';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from './components/ProtectedRoute'; // Security-kaga namma add panna puthu import

// Header & Footer conditionally render pandra wrapper
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  
  // Intha 3 paths-la iruntha Header & Footer hide aaganum
  const hideHeaderFooter = 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/login') || 
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
          {/* Public Routes - Yaar venaalum paarkalam */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Admin Route - Admin mattum thaan access panna mudiyum */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;