import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { STATS_DATA, INITIAL_DESIGNS, MOCK_ORDERS, MOCKUPS, STOCK_ITEMS } from '../constants';
import { Design, Mockup, Order, StockItem } from '../types';
import { Plus, Loader2, Sparkles, Package, DollarSign, Users, Image as ImageIcon, Upload, Palette, TrendingUp, Box, AlertTriangle, Eye, Truck, CheckCircle, XCircle, Edit, Search, UserCheck, Mail, Calendar, ShoppingCart, Ban, CheckCircle2, Trash2, Save, X as XIcon, LayoutDashboard, Settings, LogOut, Bell, Menu } from 'lucide-react';
import { generateMarketingCopy } from '../services/geminiService';
import { FAKE_USERS, User } from '../utils/auth';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'designs' | 'orders' | 'mockups' | 'stock' | 'users'>('dashboard');
  const [users, setUsers] = useState<User[]>(FAKE_USERS);
  const [designs, setDesigns] = useState<Design[]>(INITIAL_DESIGNS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [stockItems, setStockItems] = useState<StockItem[]>(STOCK_ITEMS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Mockup State
  const [customMockups, setCustomMockups] = useState<Mockup[]>([]);
  const [newMockupName, setNewMockupName] = useState('');
  const [newMockupImage, setNewMockupImage] = useState<string>('');
  const [newMockupX, setNewMockupX] = useState(50);
  const [newMockupY, setNewMockupY] = useState(50);
  const [newMockupWidth, setNewMockupWidth] = useState(30);
  const mockupFileInputRef = useRef<HTMLInputElement>(null);

  // New Design Form State
  const [newDesignTitle, setNewDesignTitle] = useState('');
  const [newDesignCategory, setNewDesignCategory] = useState('');
  const [newDesignDesc, setNewDesignDesc] = useState('');
  const [newDesignPrice, setNewDesignPrice] = useState(25);
  const [isGenerating, setIsGenerating] = useState(false);

  // Edit Design State
  const [editingDesign, setEditingDesign] = useState<Design | null>(null);
  const [showEditDesignModal, setShowEditDesignModal] = useState(false);

  // Edit Mockup State
  const [editingMockup, setEditingMockup] = useState<Mockup | null>(null);
  const [showEditMockupModal, setShowEditMockupModal] = useState(false);

  useEffect(() => {
    // Load Custom Mockups
    const savedMockups = localStorage.getItem('customMockups');
    if (savedMockups) {
      setCustomMockups(JSON.parse(savedMockups));
    }

    // Load Catalog Designs
    const savedCatalog = localStorage.getItem('catalogDesigns');
    if (savedCatalog) {
       // Merge previously saved catalog items with initial items for the view
       const parsed = JSON.parse(savedCatalog);
       setDesigns([...parsed, ...INITIAL_DESIGNS]);
    }
  }, []);

  const handleGenerateDescription = async () => {
    if (!newDesignTitle || !newDesignCategory) {
      alert("Please enter a title and category first.");
      return;
    }
    setIsGenerating(true);
    const desc = await generateMarketingCopy(newDesignTitle, newDesignCategory);
    setNewDesignDesc(desc);
    setIsGenerating(false);
  };

  const handleAddDesign = (e: React.FormEvent) => {
    e.preventDefault();
    const newDesign: Design = {
      id: Date.now().toString(),
      title: newDesignTitle,
      category: newDesignCategory,
      description: newDesignDesc,
      imageUrl: `https://picsum.photos/seed/${Date.now()}/600/600`,
      popularity: 0,
      price: newDesignPrice
    };

    // Update Local State
    setDesigns([newDesign, ...designs]);

    // Persist to Local Storage (Catalog)
    try {
        const currentCatalog = JSON.parse(localStorage.getItem('catalogDesigns') || '[]');
        const updatedCatalog = [newDesign, ...currentCatalog];
        localStorage.setItem('catalogDesigns', JSON.stringify(updatedCatalog));
    } catch (err) {
        console.error("Failed to save design to catalog storage", err);
    }

    setNewDesignTitle('');
    setNewDesignCategory('');
    setNewDesignDesc('');
    setNewDesignPrice(25);
    alert('Design added successfully!');
  };

  const handleEditDesign = (design: Design) => {
    setEditingDesign(design);
    setShowEditDesignModal(true);
  };

  const handleUpdateDesign = () => {
    if (!editingDesign) return;

    const updatedDesigns = designs.map(d =>
      d.id === editingDesign.id ? editingDesign : d
    );
    setDesigns(updatedDesigns);

    // Update localStorage
    try {
      const catalogDesigns = JSON.parse(localStorage.getItem('catalogDesigns') || '[]');
      const updatedCatalog = catalogDesigns.map((d: Design) =>
        d.id === editingDesign.id ? editingDesign : d
      );
      localStorage.setItem('catalogDesigns', JSON.stringify(updatedCatalog));
    } catch (err) {
      console.error("Failed to update design in storage", err);
    }

    setShowEditDesignModal(false);
    setEditingDesign(null);
    alert('Design updated successfully!');
  };

  const handleDeleteDesign = (designId: string) => {
    if (!confirm('Are you sure you want to delete this design?')) return;

    const updatedDesigns = designs.filter(d => d.id !== designId);
    setDesigns(updatedDesigns);

    // Update localStorage
    try {
      const catalogDesigns = JSON.parse(localStorage.getItem('catalogDesigns') || '[]');
      const updatedCatalog = catalogDesigns.filter((d: Design) => d.id !== designId);
      localStorage.setItem('catalogDesigns', JSON.stringify(updatedCatalog));
    } catch (err) {
      console.error("Failed to delete design from storage", err);
    }

    alert('Design deleted successfully!');
  };

  const handleMockupImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setNewMockupImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMockup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMockupName || !newMockupImage) {
      alert("Please provide a name and an image.");
      return;
    }

    const newMockup: Mockup = {
      id: `custom-${Date.now()}`,
      name: newMockupName,
      type: 'custom',
      baseImage: newMockupImage,
      overlayX: newMockupX,
      overlayY: newMockupY,
      overlayWidth: newMockupWidth
    };

    const updatedMockups = [...customMockups, newMockup];
    setCustomMockups(updatedMockups);
    localStorage.setItem('customMockups', JSON.stringify(updatedMockups));

    // Reset form
    setNewMockupName('');
    setNewMockupImage('');
    setNewMockupX(50);
    setNewMockupY(50);
    setNewMockupWidth(30);
    alert("Mockup added! Refresh Design Studio to see changes.");
  };

  const handleEditMockup = (mockup: Mockup) => {
    setEditingMockup(mockup);
    setShowEditMockupModal(true);
  };

  const handleUpdateMockup = () => {
    if (!editingMockup) return;

    const updatedMockups = customMockups.map(m =>
      m.id === editingMockup.id ? editingMockup : m
    );
    setCustomMockups(updatedMockups);
    localStorage.setItem('customMockups', JSON.stringify(updatedMockups));

    setShowEditMockupModal(false);
    setEditingMockup(null);
    alert('Mockup updated successfully!');
  };

  const handleDeleteMockup = (mockupId: string) => {
    if (!confirm('Are you sure you want to delete this mockup?')) return;

    const updatedMockups = customMockups.filter(m => m.id !== mockupId);
    setCustomMockups(updatedMockups);
    localStorage.setItem('customMockups', JSON.stringify(updatedMockups));

    alert('Mockup deleted successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200 bg-gradient-to-r from-brand-600 to-brand-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
              <LayoutDashboard className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">KHAYALI</h2>
              <p className="text-xs text-brand-100">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Main Menu</p>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
            { id: 'designs', label: 'Designs', icon: Palette, badge: designs.length },
            { id: 'mockups', label: 'Mockups', icon: ImageIcon, badge: MOCKUPS.length + customMockups.length },
            { id: 'orders', label: 'Orders', icon: Package, badge: orders.length },
            { id: 'stock', label: 'Stock', icon: Box, badge: stockItems.length },
            { id: 'users', label: 'Users', icon: Users, badge: users.length },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-brand-600'}`} />
                <span className="font-semibold">{item.label}</span>
              </div>
              {item.badge !== null && (
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                  activeTab === item.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600 group-hover:bg-brand-100 group-hover:text-brand-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-6 mt-6 border-t border-gray-200">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Account</p>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all group">
              <Settings className="w-5 h-5 text-gray-400 group-hover:text-brand-600" />
              <span className="font-semibold">Settings</span>
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userType');
                window.location.href = '#/admin-login';
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all group"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-xl p-4 border border-brand-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-900 mb-1">Need Help?</p>
                <p className="text-xs text-brand-700 leading-relaxed">Access documentation and support</p>
                <button className="mt-2 text-xs font-semibold text-brand-600 hover:text-brand-700 underline">
                  Learn More →
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen flex flex-col lg:ml-72">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-40 p-3 bg-white hover:bg-gray-100 rounded-lg shadow-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8">
        
        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h2>
                  <p className="text-brand-100 text-lg">Here's what's happening with your store today</p>
                </div>
                <div className="hidden lg:block">
                  <div className="text-right">
                    <p className="text-sm text-brand-100">Last updated</p>
                    <p className="text-lg font-semibold">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Revenue Card */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      ↑ 12%
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                  <h3 className="text-3xl font-bold text-gray-900">$12,450</h3>
                  <p className="text-xs text-gray-400 mt-2">from last week</p>
                </div>
                <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
              </div>

              {/* Orders Card */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                      {orders.length}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Active Orders</p>
                  <h3 className="text-3xl font-bold text-gray-900">45</h3>
                  <p className="text-xs text-gray-400 mt-2">12 pending • 33 processing</p>
                </div>
                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              </div>

              {/* Designs Card */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-brand-100 text-brand-700 text-xs font-bold rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Designs</p>
                  <h3 className="text-3xl font-bold text-gray-900">{designs.length}</h3>
                  <p className="text-xs text-gray-400 mt-2">in catalog</p>
                </div>
                <div className="h-1 bg-gradient-to-r from-brand-500 to-brand-600"></div>
              </div>

              {/* Customers Card */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                      ↑ 8%
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                  <h3 className="text-3xl font-bold text-gray-900">{users.length}</h3>
                  <p className="text-xs text-gray-400 mt-2">registered accounts</p>
                </div>
                <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Sales Analytics</h3>
                  <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={STATS_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#7c3aed"
                        strokeWidth={3}
                        dot={{r: 4, fill: '#7c3aed'}}
                        activeDot={{r: 6}}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Visitors Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Visitor Traffic</h3>
                  <span className="text-sm text-gray-500">Daily Average: 342</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={STATS_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="visitors"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{r: 4, fill: '#10b981'}}
                        activeDot={{r: 6}}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-500 mb-4">Top Selling Product</h4>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Classic T-Shirt</p>
                    <p className="text-sm text-gray-500">342 units sold</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-500 mb-4">Conversion Rate</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">3.2%</p>
                    <p className="text-sm text-green-600 font-medium mt-1">↑ 0.4% increase</p>
                  </div>
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-500 mb-4">Average Order Value</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">$48.50</p>
                    <p className="text-sm text-gray-500 mt-1">Per transaction</p>
                  </div>
                  <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center">
                    <DollarSign className="w-8 h-8 text-brand-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Designs View */}
        {activeTab === 'designs' && (
          <div className="space-y-6">
            {/* Add Design Form */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-brand-50 to-brand-100 px-6 py-4 border-b border-brand-200">
                <h3 className="text-lg font-bold text-brand-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  Add New Design
                </h3>
                <p className="text-sm text-brand-700 mt-1">Create a new design for your catalog</p>
              </div>
              <div className="p-6">
              <form onSubmit={handleAddDesign} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      value={newDesignTitle}
                      onChange={(e) => setNewDesignTitle(e.target.value)}
                      placeholder="e.g. Cosmic Butterfly"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      value={newDesignCategory}
                      onChange={(e) => setNewDesignCategory(e.target.value)}
                      placeholder="e.g. Abstract"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      value={newDesignPrice}
                      onChange={(e) => setNewDesignPrice(Number(e.target.value))}
                      placeholder="25.00"
                    />
                  </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">
                     Description 
                     <span className="ml-2 text-xs text-gray-400 font-normal">(Use AI to generate a creative description)</span>
                   </label>
                   <div className="flex gap-2">
                     <textarea 
                        required
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent h-24 resize-none"
                        value={newDesignDesc}
                        onChange={(e) => setNewDesignDesc(e.target.value)}
                        placeholder="Enter description manually or click the magic wand..."
                     />
                     <button 
                        type="button"
                        onClick={handleGenerateDescription}
                        disabled={isGenerating}
                        className="px-4 bg-brand-50 text-brand-700 border border-brand-200 rounded-lg hover:bg-brand-100 transition-colors flex flex-col items-center justify-center gap-1 disabled:opacity-50"
                        title="Generate with AI"
                     >
                        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        <span className="text-xs font-medium">AI</span>
                     </button>
                   </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium shadow-sm">
                    Publish Design
                  </button>
                </div>
              </form>
              </div>
            </div>

            {/* List of Designs */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">All Designs</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{designs.length} designs in catalog</p>
                  </div>
                  <div className="px-4 py-2 bg-brand-600 text-white rounded-lg font-semibold text-sm shadow-md">
                    {designs.length} Total
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Design</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {designs.map((design) => (
                      <tr key={design.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img className="h-10 w-10 rounded-lg object-cover" src={design.imageUrl} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{design.title}</div>
                              <div className="text-xs text-gray-500 truncate max-w-[200px]">{design.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-brand-100 text-brand-700 rounded-full">
                            {design.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${design.price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditDesign(design)}
                              className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                              title="Edit Design"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDesign(design.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Design"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Edit Design Modal */}
            {showEditDesignModal && editingDesign && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Edit className="w-6 h-6 text-brand-600" />
                      <h2 className="text-2xl font-bold text-gray-900">Edit Design</h2>
                    </div>
                    <button
                      onClick={() => setShowEditDesignModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <XIcon className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                          value={editingDesign.title}
                          onChange={(e) => setEditingDesign({...editingDesign, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                          value={editingDesign.category}
                          onChange={(e) => setEditingDesign({...editingDesign, category: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        value={editingDesign.price}
                        onChange={(e) => setEditingDesign({...editingDesign, price: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent h-32 resize-none"
                        value={editingDesign.description}
                        onChange={(e) => setEditingDesign({...editingDesign, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        value={editingDesign.imageUrl}
                        onChange={(e) => setEditingDesign({...editingDesign, imageUrl: e.target.value})}
                      />
                      {editingDesign.imageUrl && (
                        <div className="mt-2">
                          <img src={editingDesign.imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                    <button
                      onClick={() => setShowEditDesignModal(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateDesign}
                      className="px-6 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mockups View */}
        {activeTab === 'mockups' && (
           <div className="space-y-6">
              {/* Add Mockup Form */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                 <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
                    <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                       <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Upload className="w-5 h-5 text-white" />
                       </div>
                       Upload New Product Mockup
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">Add a new product template to your catalog</p>
                 </div>
                 <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                       {/* Form Side */}
                       <div className="flex-1 space-y-4">
                       <div className="space-y-4">
                          <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                             <input 
                                type="text" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                placeholder="e.g. Coffee Mug, Tote Bag"
                                value={newMockupName}
                                onChange={(e) => setNewMockupName(e.target.value)}
                             />
                          </div>
                          <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                             <input 
                                type="file" 
                                ref={mockupFileInputRef}
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                accept="image/*"
                                onChange={handleMockupImageUpload}
                             />
                          </div>
                          
                          {/* Sliders for Print Area */}
                          {newMockupImage && (
                             <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <p className="text-xs font-bold text-gray-500 uppercase">Define Print Area</p>
                                <div>
                                   <label className="flex justify-between text-xs text-gray-600"><span>Horizontal Position (X)</span> <span>{newMockupX}%</span></label>
                                   <input type="range" min="0" max="100" value={newMockupX} onChange={(e) => setNewMockupX(Number(e.target.value))} className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-brand-600"/>
                                </div>
                                <div>
                                   <label className="flex justify-between text-xs text-gray-600"><span>Vertical Position (Y)</span> <span>{newMockupY}%</span></label>
                                   <input type="range" min="0" max="100" value={newMockupY} onChange={(e) => setNewMockupY(Number(e.target.value))} className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-brand-600"/>
                                </div>
                                <div>
                                   <label className="flex justify-between text-xs text-gray-600"><span>Print Width</span> <span>{newMockupWidth}%</span></label>
                                   <input type="range" min="5" max="90" value={newMockupWidth} onChange={(e) => setNewMockupWidth(Number(e.target.value))} className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-brand-600"/>
                                </div>
                             </div>
                          )}

                          <button 
                            onClick={handleAddMockup}
                            disabled={!newMockupName || !newMockupImage}
                            className="w-full py-3 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                             Save Mockup
                          </button>
                       </div>
                    </div>

                    {/* Preview Side */}
                    <div className="flex-1 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center p-4 min-h-[400px]">
                       {newMockupImage ? (
                          <div className="relative w-[300px] h-[300px] shadow-xl bg-white">
                             <img src={newMockupImage} className="w-full h-full object-contain" alt="Preview" />
                             
                             {/* Print Area Indicator */}
                             <div 
                                className="absolute border-2 border-brand-500 bg-brand-500/20 flex items-center justify-center text-brand-700 text-xs font-bold pointer-events-none"
                                style={{
                                   top: `${newMockupY}%`,
                                   left: `${newMockupX}%`,
                                   width: `${newMockupWidth}%`,
                                   height: `${newMockupWidth}%`, // Assuming square print area for indicator
                                   transform: 'translate(-50%, -50%)'
                                }}
                             >
                                Print Area
                             </div>
                          </div>
                       ) : (
                          <div className="text-center text-gray-400">
                             <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                             <p>Upload an image to preview print area</p>
                          </div>
                       )}
                    </div>
                 </div>
                 </div>
              </div>

              {/* Existing Mockups List */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                 <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center justify-between">
                       <div>
                          <h3 className="font-bold text-gray-900 text-lg">Active Mockups</h3>
                          <p className="text-sm text-gray-500 mt-0.5">
                             {MOCKUPS.length} default templates + {customMockups.length} custom uploads
                          </p>
                       </div>
                       <div className="flex gap-2">
                          <div className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm">
                             {MOCKUPS.length} Default
                          </div>
                          <div className="px-3 py-1.5 bg-brand-100 text-brand-700 rounded-lg font-semibold text-sm">
                             {customMockups.length} Custom
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                    {/* Default Mockups (Read-only) */}
                    {MOCKUPS.map(m => (
                       <div key={m.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center gap-4">
                          <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-white rounded-lg shadow-sm overflow-hidden">
                             <span className="text-xs font-bold text-gray-400 uppercase">{m.type}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-gray-900">{m.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{m.type}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                              Default
                            </span>
                          </div>
                       </div>
                    ))}

                    {/* Custom Mockups (Editable) */}
                    {customMockups.map(m => (
                       <div key={m.id} className="bg-white rounded-lg p-4 border-2 border-brand-200 flex items-center gap-4 hover:shadow-md transition-shadow">
                          <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg shadow-sm overflow-hidden">
                             {m.baseImage ? (
                                <img src={m.baseImage} className="w-full h-full object-cover" alt={m.name} />
                             ) : (
                                <span className="text-xs font-bold text-gray-400 uppercase">{m.type}</span>
                             )}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-gray-900">{m.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{m.type}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold bg-brand-100 text-brand-700 rounded-full">
                              Custom
                            </span>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleEditMockup(m)}
                              className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                              title="Edit Mockup"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMockup(m.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Mockup"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                       </div>
                    ))}

                    {/* Empty State */}
                    {customMockups.length === 0 && (
                      <div className="col-span-full text-center py-8 text-gray-400">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No custom mockups yet. Upload one above!</p>
                      </div>
                    )}
                 </div>
              </div>

              {/* Edit Mockup Modal */}
              {showEditMockupModal && editingMockup && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Edit className="w-6 h-6 text-brand-600" />
                        <h2 className="text-2xl font-bold text-gray-900">Edit Mockup</h2>
                      </div>
                      <button
                        onClick={() => setShowEditMockupModal(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <XIcon className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                          value={editingMockup.name}
                          onChange={(e) => setEditingMockup({...editingMockup, name: e.target.value})}
                        />
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        <p className="text-xs font-bold text-gray-500 uppercase">Print Area Settings</p>
                        <div>
                          <label className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Horizontal Position (X)</span>
                            <span>{editingMockup.overlayX}%</span>
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={editingMockup.overlayX}
                            onChange={(e) => setEditingMockup({...editingMockup, overlayX: Number(e.target.value)})}
                            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-brand-600"
                          />
                        </div>
                        <div>
                          <label className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Vertical Position (Y)</span>
                            <span>{editingMockup.overlayY}%</span>
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={editingMockup.overlayY}
                            onChange={(e) => setEditingMockup({...editingMockup, overlayY: Number(e.target.value)})}
                            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-brand-600"
                          />
                        </div>
                        <div>
                          <label className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Print Width</span>
                            <span>{editingMockup.overlayWidth}%</span>
                          </label>
                          <input
                            type="range"
                            min="5"
                            max="90"
                            value={editingMockup.overlayWidth}
                            onChange={(e) => setEditingMockup({...editingMockup, overlayWidth: Number(e.target.value)})}
                            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-brand-600"
                          />
                        </div>
                      </div>

                      {/* Preview */}
                      {editingMockup.baseImage && (
                        <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center">
                          <div className="relative w-[300px] h-[300px] shadow-xl bg-white">
                            <img src={editingMockup.baseImage} className="w-full h-full object-contain" alt="Preview" />

                            {/* Print Area Indicator */}
                            <div
                              className="absolute border-2 border-brand-500 bg-brand-500/20 flex items-center justify-center text-brand-700 text-xs font-bold pointer-events-none"
                              style={{
                                top: `${editingMockup.overlayY}%`,
                                left: `${editingMockup.overlayX}%`,
                                width: `${editingMockup.overlayWidth}%`,
                                height: `${editingMockup.overlayWidth}%`,
                                transform: 'translate(-50%, -50%)'
                              }}
                            >
                              Print Area
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                      <button
                        onClick={() => setShowEditMockupModal(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateMockup}
                        className="px-6 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
           </div>
        )}

        {/* Orders View */}
        {activeTab === 'orders' && (
           <div className="space-y-8">
             <div className="flex justify-between items-center">
               <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
               <div className="flex gap-2">
                 <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                   <Upload className="w-4 h-4" />
                   Export CSV
                 </button>
                 <button className="px-4 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 flex items-center gap-2">
                   <Plus className="w-4 h-4" />
                   New Order
                 </button>
               </div>
             </div>

             {/* Order Stats */}
             <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
               <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                 <p className="text-sm text-yellow-700 font-medium">Pending</p>
                 <p className="text-2xl font-bold text-yellow-900 mt-1">{orders.filter(o => o.status === 'Pending').length}</p>
               </div>
               <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                 <p className="text-sm text-blue-700 font-medium">Processing</p>
                 <p className="text-2xl font-bold text-blue-900 mt-1">{orders.filter(o => o.status === 'Processing').length}</p>
               </div>
               <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                 <p className="text-sm text-purple-700 font-medium">Shipped</p>
                 <p className="text-2xl font-bold text-purple-900 mt-1">{orders.filter(o => o.status === 'Shipped').length}</p>
               </div>
               <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                 <p className="text-sm text-green-700 font-medium">Delivered</p>
                 <p className="text-2xl font-bold text-green-900 mt-1">{orders.filter(o => o.status === 'Delivered').length}</p>
               </div>
               <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                 <p className="text-sm text-red-700 font-medium">Cancelled</p>
                 <p className="text-2xl font-bold text-red-900 mt-1">{orders.filter(o => o.status === 'Cancelled').length}</p>
               </div>
             </div>

             {/* Orders Table */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-700">All Orders ({orders.length})</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search by customer or order ID..."
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent w-64"
                      />
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders
                        .filter(order =>
                          order.customer.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                          order.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                          order.email.toLowerCase().includes(orderSearchQuery.toLowerCase())
                        )
                        .map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-600">#{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                {order.customer.charAt(0)}
                              </div>
                              <span className="ml-3 text-sm text-gray-900 font-medium">{order.customer}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items} items</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as Order['status'];
                                setOrders(orders.map(o => o.id === order.id ? {...o, status: newStatus} : o));
                              }}
                              className={`px-3 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer
                                ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                  order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                                  order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">${order.total.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>

             {/* Order Detail Modal */}
             {selectedOrder && (
               <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
                 <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                   <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                     <div>
                       <h2 className="text-2xl font-bold text-gray-900">Order #{selectedOrder.id}</h2>
                       <p className="text-sm text-gray-500 mt-1">Placed on {selectedOrder.date}</p>
                     </div>
                     <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                       <XCircle className="w-6 h-6" />
                     </button>
                   </div>

                   <div className="p-6 space-y-6">
                     {/* Customer Info */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="bg-gray-50 p-4 rounded-lg">
                         <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                           <Users className="w-5 h-5 text-brand-600" />
                           Customer Information
                         </h3>
                         <div className="space-y-2 text-sm">
                           <p><span className="font-medium text-gray-700">Name:</span> {selectedOrder.customer}</p>
                           <p><span className="font-medium text-gray-700">Email:</span> {selectedOrder.email}</p>
                           <p><span className="font-medium text-gray-700">Payment:</span> {selectedOrder.paymentMethod}</p>
                         </div>
                       </div>

                       <div className="bg-gray-50 p-4 rounded-lg">
                         <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                           <Truck className="w-5 h-5 text-brand-600" />
                           Shipping Information
                         </h3>
                         <div className="space-y-2 text-sm">
                           <p><span className="font-medium text-gray-700">Address:</span> {selectedOrder.shippingAddress}</p>
                           {selectedOrder.trackingNumber && (
                             <p><span className="font-medium text-gray-700">Tracking:</span> {selectedOrder.trackingNumber}</p>
                           )}
                           <p><span className="font-medium text-gray-700">Status:</span>
                             <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full
                               ${selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                 selectedOrder.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                 selectedOrder.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                                 selectedOrder.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                               {selectedOrder.status}
                             </span>
                           </p>
                         </div>
                       </div>
                     </div>

                     {/* Order Items */}
                     <div>
                       <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                         <Package className="w-5 h-5 text-brand-600" />
                         Order Items
                       </h3>
                       <div className="border border-gray-200 rounded-lg overflow-hidden">
                         <table className="min-w-full divide-y divide-gray-200">
                           <thead className="bg-gray-50">
                             <tr>
                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Design</th>
                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                             </tr>
                           </thead>
                           <tbody className="bg-white divide-y divide-gray-200">
                             {selectedOrder.orderItems?.map((item) => (
                               <tr key={item.id}>
                                 <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.designTitle}</td>
                                 <td className="px-4 py-3 text-sm text-gray-500 capitalize">{item.mockupType}</td>
                                 <td className="px-4 py-3 text-sm text-gray-500">{item.size}</td>
                                 <td className="px-4 py-3 text-sm text-gray-500">{item.color}</td>
                                 <td className="px-4 py-3 text-sm text-gray-500">{item.quantity}</td>
                                 <td className="px-4 py-3 text-sm font-bold text-gray-900">${item.price.toFixed(2)}</td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       </div>

                       <div className="mt-4 flex justify-end">
                         <div className="bg-gray-50 p-4 rounded-lg">
                           <div className="flex justify-between items-center gap-8">
                             <span className="text-lg font-bold text-gray-900">Total:</span>
                             <span className="text-2xl font-bold text-brand-600">${selectedOrder.total.toFixed(2)}</span>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             )}
           </div>
        )}

        {/* Stock Management View */}
        {activeTab === 'stock' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
              <button className="px-4 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Stock Item
              </button>
            </div>

            {/* Stock Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <p className="text-sm text-gray-500 font-medium">Total Items</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stockItems.length}</p>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <p className="text-sm text-gray-500 font-medium">Total Stock</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stockItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
              </div>
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-sm text-red-700 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Low Stock
                </p>
                <p className="text-2xl font-bold text-red-900 mt-1">
                  {stockItems.filter(item => item.quantity <= item.reorderLevel).length}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-sm text-green-700 font-medium">Well Stocked</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {stockItems.filter(item => item.quantity > item.reorderLevel).length}
                </p>
              </div>
            </div>

            {/* Stock Filters */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex flex-wrap gap-4">
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500">
                  <option value="">All Products</option>
                  <option value="t-shirt">T-Shirts</option>
                  <option value="hoodie">Hoodies</option>
                  <option value="sweater">Sweaters</option>
                  <option value="cap">Caps</option>
                </select>
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500">
                  <option value="">All Sizes</option>
                  <option value="S">Small</option>
                  <option value="M">Medium</option>
                  <option value="L">Large</option>
                  <option value="XL">X-Large</option>
                  <option value="XXL">XX-Large</option>
                </select>
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500">
                  <option value="">All Status</option>
                  <option value="low">Low Stock</option>
                  <option value="good">Well Stocked</option>
                </select>
              </div>
            </div>

            {/* Stock Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-bold text-gray-700">Inventory ({stockItems.length} items)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Restocked</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stockItems.map((item) => {
                      const isLowStock = item.quantity <= item.reorderLevel;
                      return (
                        <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${isLowStock ? 'bg-red-50/30' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Box className="w-5 h-5 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900 capitalize">{item.productType.replace('-', ' ')}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.size}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{backgroundColor: item.color.toLowerCase()}}
                              />
                              <span className="text-sm text-gray-500">{item.color}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-bold ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.reorderLevel}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isLowStock ? (
                              <span className="px-3 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                <AlertTriangle className="w-3 h-3" />
                                Low Stock
                              </span>
                            ) : (
                              <span className="px-3 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3" />
                                In Stock
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.supplier}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.lastRestocked}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => {
                                const newQty = prompt(`Update quantity for ${item.productType} (${item.size}, ${item.color}):`, item.quantity.toString());
                                if (newQty) {
                                  setStockItems(stockItems.map(s =>
                                    s.id === item.id ? {...s, quantity: parseInt(newQty), lastRestocked: new Date().toISOString().split('T')[0]} : s
                                  ));
                                }
                              }}
                              className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                            >
                              <Edit className="w-4 h-4" />
                              Update
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low Stock Alert */}
            {stockItems.filter(item => item.quantity <= item.reorderLevel).length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-bold text-red-800">Low Stock Alert</h3>
                    <p className="text-sm text-red-700 mt-1">
                      {stockItems.filter(item => item.quantity <= item.reorderLevel).length} items are running low on stock.
                      Consider reordering soon to avoid stockouts.
                    </p>
                    <div className="mt-3 space-y-1">
                      {stockItems
                        .filter(item => item.quantity <= item.reorderLevel)
                        .slice(0, 5)
                        .map(item => (
                          <p key={item.id} className="text-xs text-red-600">
                            • {item.productType.replace('-', ' ')} - {item.size} - {item.color}: {item.quantity} units left
                          </p>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Management View */}
        {activeTab === 'users' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-500 mt-1">Manage customer accounts and permissions</p>
              </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {users.filter(u => u.status === 'active').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Admins</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {users.filter(u => u.role === 'admin').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      ${users.reduce((sum, u) => sum + (u.totalSpent || 0), 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-brand-50 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-brand-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">All Users</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designs</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                              alt={user.name}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role === 'admin' && <UserCheck className="w-3 h-3" />}
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : user.status === 'inactive'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {user.joinDate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {user.designCount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          <div className="flex items-center gap-1">
                            <ShoppingCart className="w-4 h-4 text-gray-400" />
                            {user.orderCount || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                          ${(user.totalSpent || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin || 'Never'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  );
};

export default Admin;