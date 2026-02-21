import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import FarmerDashboard from './pages/FarmerDashboard';
import ResearchDashboard from './pages/ResearchDashboard';

function Navigation() {
  const location = useLocation();
  const isFarmer = location.pathname === "/";
  const isResearch = location.pathname === "/research-dashboard";

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-6 shadow-sm">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 m-0 leading-tight">Smart Crop Advisory</h2>
        <span className="text-xs text-gray-500 font-medium">AI-Powered Precision Agriculture System</span>
      </div>
      <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
        <Link
          to="/"
          className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${isFarmer
              ? "bg-white text-primary-green shadow-sm ring-1 ring-gray-200"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
        >
          👨‍🌾 Farmer Mode
        </Link>
        <Link
          to="/research-dashboard"
          className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${isResearch
              ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
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
      <div className="min-h-screen bg-[#f0fdf4] font-sans text-gray-800 pt-20 pb-10">
        <Navigation />
        <main className="max-w-5xl mx-auto px-4 md:px-6 w-full flex flex-col items-center">
          <Routes>
            <Route path="/" element={<FarmerDashboard />} />
            <Route path="/research-dashboard" element={<ResearchDashboard />} />
          </Routes>
          <footer className="mt-16 text-gray-400 text-sm text-center">
            &copy; 2026 Smart Crop Advisory System | Capstone Project
          </footer>
        </main>
      </div>
    </Router>
  );
}

export default App;
