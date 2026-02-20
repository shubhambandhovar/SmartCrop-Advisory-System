import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import FarmerDashboard from './pages/FarmerDashboard';
import ResearchDashboard from './pages/ResearchDashboard';

function Navigation() {
  const location = useLocation();
  return (
    <nav className="navbar">
      <div>
        <h2>Smart Crop Advisory</h2>
        <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>AI-Powered Precision Agriculture System</span>
      </div>
      <div className="nav-links">
        <Link
          to="/"
          className={location.pathname === "/" ? "active" : ""}
        >
          👨‍🌾 Farmer Mode
        </Link>
        <Link
          to="/research-dashboard"
          className={location.pathname === "/research-dashboard" ? "active" : ""}
        >
          🔬 Research Mode
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navigation />
      <div className="container" style={{ paddingTop: 0 }}>
        <Routes>
          <Route path="/" element={<FarmerDashboard />} />
          <Route path="/research-dashboard" element={<ResearchDashboard />} />
        </Routes>
        <footer style={{ marginTop: '4rem', color: '#999', textAlign: 'center', paddingBottom: '2rem' }}>
          &copy; 2026 Smart Crop Advisory System | Capstone Project
        </footer>
      </div>
    </Router>
  );
}

export default App;
