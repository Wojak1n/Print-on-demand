import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, LayoutDashboard, User, Moon, Sun, LogOut, ChevronDown } from 'lucide-react';
import { IMAGES } from '../config/cloudinary';
import { useTheme } from '../contexts/ThemeContext';
import { getCurrentUser, isAdmin, logout } from '../utils/auth';
import useTranslation from '../hooks/useTranslation';


const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [userIsAdmin, setUserIsAdmin] = useState(isAdmin());
  const [cartCount, setCartCount] = useState(0);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Update cart count
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(totalItems);
    };

    updateCartCount();

    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  // Update user state when location changes (after login/logout)
  useEffect(() => {
    setCurrentUser(getCurrentUser());
    setUserIsAdmin(isAdmin());
  }, [location]);

  // Listen for storage changes (login/logout events)
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(getCurrentUser());
      setUserIsAdmin(isAdmin());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setUserIsAdmin(false);
    setShowUserMenu(false);
    setIsOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.studio, path: '/studio' },
    { name: t.nav.about, path: '/about' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <img
                src={`https://res.cloudinary.com/dwm9hk3qg/image/upload/w_200,f_auto,q_auto/${IMAGES.LOGO}`}
                alt="KHAYALI"
                className="h-48 w-auto object-contain"
                onError={(e) => console.error('Logo failed to load:', e)}
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30'
                    : 'text-gray-500 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-400 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link to="/cart" className="p-2 rounded-full text-gray-400 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors relative">
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold rounded-full ring-2 ring-white dark:ring-gray-800 bg-brand-500 text-white">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Admin Dashboard Link (only for admins) */}
            {userIsAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </Link>
            )}

            {/* User Menu / Login Button */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <User className="w-4 h-4" />
                  {currentUser.name}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {t.nav.profile}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.nav.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 transition-colors"
              >
                <User className="w-4 h-4" />
                {t.nav.login}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-500 text-brand-700 dark:text-brand-400'
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Shopping Cart */}
            <div className="px-3 py-2">
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative"
              >
                <ShoppingBag className="h-4 w-4" />
                {t.nav.cart}
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full ring-2 ring-white dark:ring-gray-800 bg-brand-500"></span>
              </Link>
            </div>

            {/* Mobile Dark Mode Toggle */}
            <div className="px-3 py-2">
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDarkMode ? t.nav.lightMode : t.nav.darkMode}
              </button>
            </div>

            {/* Mobile Admin Link (only for admins) */}
            {userIsAdmin && (
              <div className="px-3 py-2">
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t.nav.admin}
                </Link>
              </div>
            )}

            {/* Mobile User Section */}
            <div className="px-3 py-2">
              {currentUser ? (
                <div className="space-y-2">
                  {/* User Info */}
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 font-medium px-2 py-1">
                    <User className="w-4 h-4" />
                    {currentUser.name}
                  </div>

                  {/* Profile Button */}
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    {t.nav.profile}
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {t.nav.logout}
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 transition-colors"
                >
                  <User className="w-4 h-4" />
                  {t.nav.login}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
