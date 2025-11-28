import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { authenticateUser, login, isAuthenticated, getCurrentUser } from '../utils/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  // Get redirect parameters
  const redirectTo = searchParams.get('redirect');
  const action = searchParams.get('action');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        // Check if there's a redirect parameter
        if (redirectTo === 'studio') {
          navigate('/studio');
        } else if (redirectTo === 'cart') {
          navigate('/cart');
        } else {
          navigate('/studio');
        }
      }
    }
  }, [navigate, redirectTo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login logic
      const user = authenticateUser(formData.email, formData.password);

      if (user) {
        login(user);
        // Redirect based on role or redirect parameter
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (redirectTo === 'studio' && action === 'addToCart') {
          // User was trying to add to cart, redirect back to studio
          navigate('/studio');
          // Show a message that they can now add to cart
          setTimeout(() => {
            alert('You are now logged in! Click "Add to Cart" again to add your design.');
          }, 500);
        } else if (redirectTo === 'cart' && action === 'checkout') {
          // User was trying to checkout, redirect back to cart
          navigate('/cart');
          setTimeout(() => {
            alert('You are now logged in! You can proceed with checkout.');
          }, 500);
        } else {
          navigate('/studio');
        }
      } else {
        setError('Invalid email or password');
      }
    } else {
      // Signup logic
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // For demo purposes, just create a session
      const newUser = {
        id: `user-${Date.now()}`,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: 'user' as const,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active' as const,
        designCount: 0,
        orderCount: 0,
        totalSpent: 0
      };

      login(newUser);

      // Redirect to studio (or back to where they came from)
      if (redirectTo === 'studio' && action === 'addToCart') {
        navigate('/studio');
        setTimeout(() => {
          alert('Account created! Click "Add to Cart" again to add your design.');
        }, 500);
      } else if (redirectTo === 'cart' && action === 'checkout') {
        navigate('/cart');
        setTimeout(() => {
          alert('Account created! You can now proceed with checkout.');
        }, 500);
      } else {
        navigate('/studio');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img src="./images/khayali logo.png" alt="KHAYALI" className="h-44 mx-auto" />
          </Link>
          <h2 className="mt-6 text-3xl font-serif font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? 'Sign in to your account' : 'Join our creative community'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name field (only for signup) */}
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 focus:border-brand-500 dark:focus:border-brand-400 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 focus:border-brand-500 dark:focus:border-brand-400 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 focus:border-brand-500 dark:focus:border-brand-400 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password field (only for signup) */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required={!isLogin}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 focus:border-brand-500 dark:focus:border-brand-400 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}



            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-lg text-white bg-gradient-to-r from-brand-600 to-brand-500 dark:from-brand-500 dark:to-brand-400 hover:from-brand-500 hover:to-brand-400 dark:hover:from-brand-400 dark:hover:to-brand-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-brand-500 dark:focus:ring-brand-400 font-bold text-lg transition-all transform hover:-translate-y-0.5"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          {/* Forgot Password (only for login) */}
          {isLogin && (
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                Forgot your password?
              </button>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Floating Admin Button (WhatsApp style - only show on login page) */}
        {isLogin && (
          <Link
            to="/admin/login"
            className="group fixed bottom-6 right-6 z-50"
          >
            {/* Pulsing Ring Animation */}
            <div className="absolute inset-0 rounded-full bg-purple-500 dark:bg-purple-600 animate-ping opacity-75"></div>

            {/* Main Button */}
            <div className="relative w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 rounded-full shadow-lg hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group-hover:rotate-12">
              <ShieldCheck className="w-7 h-7 text-white animate-pulse" />
            </div>

            {/* Tooltip */}
            <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-gray-900 dark:bg-gray-800 text-white text-sm font-medium px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
                Admin Login
                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-900 dark:border-l-gray-800"></div>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Login;

