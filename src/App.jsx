import AdminDashboard from "./pages/AdminDashboard"; // Namma create panna dashboard import
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from './pages/ProductDetails';

// Admin path-ah check panna intha layout wrapper
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPath && <Header />}
      {children}
      {!isAdminPath && <Footer />}
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
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
