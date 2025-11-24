import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DesignStudio from './pages/DesignStudio';
import Admin from './pages/Admin';
import About from './pages/About';
import Login from './pages/Login';

const AppContent: React.FC = () => {
  const location = useLocation();
  // Hide navbar and footer on login page
  const hideNavAndFooter = location.pathname === '/login';
  // Hide footer only on studio page to maximize workspace
  const showFooter = location.pathname !== '/studio' && !hideNavAndFooter;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-900">
      {!hideNavAndFooter && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/studio" element={<DesignStudio />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;