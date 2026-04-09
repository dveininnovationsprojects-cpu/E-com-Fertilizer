import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default path and About path both pointing to About for now */}
        <Route path="/" element={<About />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;