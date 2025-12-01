import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Package, ShoppingCart, DollarSign, LogOut, Edit, Shield, MapPin, CreditCard, Settings, Heart, Clock, Save, X, Trash2, Plus, Eye } from 'lucide-react';
import { getCurrentUser, logout, FAKE_USERS } from '../utils/auth';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // State
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'designs' | 'addresses' | 'settings'>('overview');
  const [editedName, setEditedName] = useState(currentUser?.name || '');
  const [editedEmail, setEditedEmail] = useState(currentUser?.email || '');
  const [orders, setOrders] = useState<any[]>([]);
  const [savedDesigns, setSavedDesigns] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  // Load data from localStorage
  useEffect(() => {
    // Load orders
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders.filter((order: any) => order.userEmail === currentUser.email));

    // Load saved designs
    const customDesigns = JSON.parse(localStorage.getItem('customDesigns') || '[]');
    setSavedDesigns(customDesigns);

    // Load addresses
    const savedAddresses = JSON.parse(localStorage.getItem('addresses') || '[]');
    setAddresses(savedAddresses.filter((addr: any) => addr.userEmail === currentUser.email));
  }, [currentUser.email]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = () => {
    // Update user in localStorage
    localStorage.setItem('userName', editedName);
    localStorage.setItem('userEmail', editedEmail);
    setShowEditModal(false);
    window.location.reload(); // Reload to reflect changes
  };

  const handleDeleteAddress = (index: number) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
    localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
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
              <button
                onClick={() => setShowEditModal(true)}
                className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors"
              >
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

        {/* Tabs Navigation */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 dark:border-brand-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <User className="w-5 h-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 dark:border-brand-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Package className="w-5 h-5" />
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('designs')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'designs'
                  ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 dark:border-brand-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Heart className="w-5 h-5" />
              Saved Designs ({savedDesigns.length})
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'addresses'
                  ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 dark:border-brand-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <MapPin className="w-5 h-5" />
              Addresses ({addresses.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 dark:border-brand-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">Order #{order.id}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <span className="text-brand-600 dark:text-brand-400 font-bold">${order.total}</span>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">No orders yet. Start creating!</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => navigate('/studio')}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-brand-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      <Package className="w-6 h-6" />
                      <div className="text-left">
                        <p className="font-bold">Create Design</p>
                        <p className="text-sm opacity-90">Start designing now</p>
                      </div>
                    </button>
                    <button
                      onClick={() => navigate('/cart')}
                      className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      <ShoppingCart className="w-6 h-6" />
                      <div className="text-left">
                        <p className="font-bold">View Cart</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Review your items</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Order History</h3>
                </div>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">Order #{order.id}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {order.status || 'Processing'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="flex items-center gap-3">
                            <img src={item.imageUrl} alt={item.designTitle} className="w-12 h-12 object-cover rounded" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.designTitle}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Size: {item.size} • Qty: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-gray-900 dark:text-white">${item.price}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                        <p className="text-lg font-bold text-brand-600 dark:text-brand-400">${order.total}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No orders yet</p>
                    <button
                      onClick={() => navigate('/studio')}
                      className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Saved Designs Tab */}
            {activeTab === 'designs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Saved Designs</h3>
                  <button
                    onClick={() => navigate('/studio')}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create New
                  </button>
                </div>
                {savedDesigns.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedDesigns.map((design, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <img src={design.imageUrl} alt={design.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                          <p className="font-bold text-gray-900 dark:text-white mb-1">{design.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{design.category}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate('/studio')}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No saved designs yet</p>
                    <button
                      onClick={() => navigate('/studio')}
                      className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Create Your First Design
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Saved Addresses</h3>
                  <button
                    onClick={() => setShowAddAddressModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Address
                  </button>
                </div>
                {addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                            <p className="font-bold text-gray-900 dark:text-white">{address.label || 'Address'}</p>
                          </div>
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs font-semibold rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{address.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{address.street}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {address.city}, {address.state} {address.zip}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{address.phone}</p>
                        <div className="flex gap-2">
                          <button className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-semibold rounded-lg transition-colors">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(index)}
                            className="px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No saved addresses</p>
                    <button
                      onClick={() => setShowAddAddressModal(true)}
                      className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Add Your First Address
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Email Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive order updates via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Marketing Emails</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive promotional offers</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Privacy</h3>
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 dark:text-white">Change Password</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Update your password</p>
                      </div>
                      <Edit className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 dark:text-white">Download My Data</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Export your account data</p>
                      </div>
                      <Save className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                      <div className="text-left">
                        <p className="font-semibold text-red-700 dark:text-red-400">Delete Account</p>
                        <p className="text-sm text-red-600 dark:text-red-500">Permanently delete your account</p>
                      </div>
                      <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
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

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 px-4 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

