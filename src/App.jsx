import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard"; // Namma create panna dashboard import

function App() {
  return (
    <Router>
      <Routes>
        {/* User Side Routes */}
        <Route path="/" element={<About />} />
        <Route path="/about" element={<About />} />
        
        {/* Future User Routes - Ippo dummy ha vaikalam */}
        <Route path="/shop" element={<div>Shop Page (Coming Soon)</div>} />

        {/* Admin Side Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;