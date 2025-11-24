import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Package, ShoppingCart, DollarSign, LogOut, Edit, Shield } from 'lucide-react';
import { getCurrentUser, logout } from '../utils/auth';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-brand-500 via-brand-600 to-purple-600"></div>
          
          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-6">
              <div className="flex items-end gap-4">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center shadow-lg">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                
                {/* Name and Role */}
                <div className="mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {currentUser.name}
                    {currentUser.role === 'admin' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full">
                        <Shield className="w-3 h-3" />
                        Admin
                      </span>
                    )}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    {currentUser.email}
                  </p>
                </div>
              </div>
              
              {/* Edit Profile Button */}
              <button className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentUser.designCount || 0}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Designs</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentUser.orderCount || 0}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Orders</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">${currentUser.totalSpent?.toFixed(2) || '0.00'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Calendar className="w-5 h-5" />
                <span>Member since {new Date(currentUser.joinDate || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <User className="w-5 h-5" />
                <span>Account Status: <span className="font-semibold text-green-600 dark:text-green-400">{currentUser.status || 'Active'}</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/studio')}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all text-left group"
          >
            <Package className="w-8 h-8 text-brand-600 dark:text-brand-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">My Designs</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">View and manage your custom designs</p>
          </button>

          <button
            onClick={() => navigate('/cart')}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all text-left group"
          >
            <ShoppingCart className="w-8 h-8 text-brand-600 dark:text-brand-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Shopping Cart</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Review your cart and checkout</p>
          </button>
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

