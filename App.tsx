import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import DesignStudio from './pages/DesignStudio';
import Admin from './pages/Admin';
import About from './pages/About';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import Press from './pages/Press';
import Help from './pages/Help';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

const AppContent: React.FC = () => {
  const location = useLocation();
  // Hide navbar and footer on login pages and admin page
  const hideNavAndFooter = location.pathname === '/login' || location.pathname === '/admin/login' || location.pathname === '/admin';
  // Hide footer only on studio page to maximize workspace
  const showFooter = location.pathname !== '/studio' && !hideNavAndFooter;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {!hideNavAndFooter && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/studio" element={<DesignStudio />} />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={<Cart />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/press" element={<Press />} />
          <Route path="/help" element={<Help />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;