import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { STATS_DATA, FEATURED_DESIGNS, MOCK_ORDERS, MOCKUPS, STOCK_ITEMS } from '../constants';
import { Design, Mockup, Order, StockItem } from '../types';
import { Plus, Loader2, Sparkles, Package, DollarSign, Users, Image as ImageIcon, Upload, Palette, TrendingUp, Box, AlertTriangle, Eye, Truck, CheckCircle, XCircle, Edit, Search, UserCheck, Mail, Calendar, ShoppingCart, Ban, CheckCircle2, Trash2, Save, X as XIcon, LayoutDashboard, Settings, LogOut, Bell, Menu } from 'lucide-react';
import { generateMarketingCopy } from '../services/geminiService';
import { FAKE_USERS, User } from '../utils/auth';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'designs' | 'orders' | 'mockups' | 'stock' | 'users'>('dashboard');
  const [users, setUsers] = useState<User[]>(FAKE_USERS);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [stockItems, setStockItems] = useState<StockItem[]>(STOCK_ITEMS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Stock Update Modal State
  const [stockUpdateModal, setStockUpdateModal] = useState<{isOpen: boolean; item: StockItem | null; mode: 'update' | 'add'}>({
    isOpen: false,
    item: null,
    mode: 'update'
  });
  const [stockUpdateQuantity, setStockUpdateQuantity] = useState<string>('');
  
  // Mockup State
  const [customMockups, setCustomMockups] = useState<Mockup[]>([]);
  const [hiddenMockups, setHiddenMockups] = useState<string[]>([]);
  const [hiddenDesigns, setHiddenDesigns] = useState<string[]>([]);
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

    // Load Hidden Mockups
    const savedHiddenMockups = localStorage.getItem('hiddenMockups');
    if (savedHiddenMockups) {
      setHiddenMockups(JSON.parse(savedHiddenMockups));
    }

    // Load Hidden Designs
    const savedHiddenDesigns = localStorage.getItem('hiddenDesigns');
    if (savedHiddenDesigns) {
      setHiddenDesigns(JSON.parse(savedHiddenDesigns));
    }

    // Load Catalog Designs
    const savedCatalog = localStorage.getItem('catalogDesigns');
    const hiddenDesignIds = JSON.parse(localStorage.getItem('hiddenDesigns') || '[]');

    // Filter out hidden featured designs from FEATURED_DESIGNS
    const visibleFeaturedDesigns = FEATURED_DESIGNS.filter((d: Design) => !hiddenDesignIds.includes(d.id));

    if (savedCatalog) {
       const parsed = JSON.parse(savedCatalog);
       setDesigns([...parsed, ...visibleFeaturedDesigns]);
    } else {
       setDesigns(visibleFeaturedDesigns);
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

  const handleBulkDesignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    let processedCount = 0;
    const newDesigns: Design[] = [];

    fileArray.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const design: Design = {
            id: `design-${Date.now()}-${index}`,
            title: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
            category: 'Uploaded',
            description: `Uploaded design: ${file.name}`,
            imageUrl: ev.target.result as string,
            popularity: 0,
            price: 25.00
          };
          newDesigns.push(design);
          processedCount++;

          // When all files are processed
          if (processedCount === fileArray.length) {
            const updatedDesigns = [...newDesigns, ...designs];
            setDesigns(updatedDesigns);

            // Persist to Local Storage (Catalog)
            try {
              const currentCatalog = JSON.parse(localStorage.getItem('catalogDesigns') || '[]');
              const updatedCatalog = [...newDesigns, ...currentCatalog];
              localStorage.setItem('catalogDesigns', JSON.stringify(updatedCatalog));
            } catch (err) {
              console.error("Failed to save designs to catalog storage", err);
            }

            alert(`${newDesigns.length} design(s) uploaded successfully!`);

            // Clear the file input
            e.target.value = '';
          }
        }
      };
      reader.readAsDataURL(file);
    });
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
    // Check if it's a featured design from FEATURED_DESIGNS
    const isFeaturedDesign = FEATURED_DESIGNS.some((d: Design) => d.id === designId);

    if (isFeaturedDesign) {
      // Add to hidden designs list
      const updatedHiddenDesigns = [...hiddenDesigns, designId];
      setHiddenDesigns(updatedHiddenDesigns);
      localStorage.setItem('hiddenDesigns', JSON.stringify(updatedHiddenDesigns));

      // Remove from current designs state
      const updatedDesigns = designs.filter(d => d.id !== designId);
      setDesigns(updatedDesigns);
    } else {
      // It's a custom design - remove from catalog
      const updatedDesigns = designs.filter(d => d.id !== designId);
      setDesigns(updatedDesigns);

      try {
        const catalogDesigns = JSON.parse(localStorage.getItem('catalogDesigns') || '[]');
        const updatedCatalog = catalogDesigns.filter((d: Design) => d.id !== designId);
        localStorage.setItem('catalogDesigns', JSON.stringify(updatedCatalog));
      } catch (err) {
        console.error("Failed to delete design from storage", err);
      }
    }
  };

  const handleMockupImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Handle multiple files
    const fileArray = Array.from(files);
    let processedCount = 0;
    const newMockups: Mockup[] = [];

    fileArray.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const mockup: Mockup = {
            id: `custom-${Date.now()}-${index}`,
            name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
            type: 'custom',
            baseImage: ev.target.result as string,
            overlayX: 50,
            overlayY: 42,
            overlayWidth: 35
          };
          newMockups.push(mockup);
          processedCount++;

          // When all files are processed
          if (processedCount === fileArray.length) {
            const updatedMockups = [...customMockups, ...newMockups];
            setCustomMockups(updatedMockups);
            localStorage.setItem('customMockups', JSON.stringify(updatedMockups));
            alert(`${newMockups.length} mockup(s) uploaded successfully!`);

            // Clear the file input
            e.target.value = '';
          }
        }
      };
      reader.readAsDataURL(file);
    });
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
    // Check if it's a custom mockup
    const isCustom = customMockups.some(m => m.id === mockupId);

    if (isCustom) {
      const updatedMockups = customMockups.filter(m => m.id !== mockupId);
      setCustomMockups(updatedMockups);
      localStorage.setItem('customMockups', JSON.stringify(updatedMockups));
    } else {
      // It's a default mockup - add to hidden list
      const updatedHiddenMockups = [...hiddenMockups, mockupId];
      setHiddenMockups(updatedHiddenMockups);
      localStorage.setItem('hiddenMockups', JSON.stringify(updatedHiddenMockups));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center px-5 py-8 border-b border-gray-200 dark:border-gray-800 relative">
            <img src="./images/khayali logo.png" alt="KHAYALI" className="h-20" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Main Menu</p>
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
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200 group relative ${
                activeTab === item.id
                  ? 'bg-brand-600 dark:bg-brand-500 text-white shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${
                  activeTab === item.id
                    ? 'text-white'
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-400'
                }`} />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {item.badge !== null && (
                <span className={`text-xs font-semibold ${
                  activeTab === item.id
                    ? 'text-white/90'
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="px-3 pt-3 mt-3 border-t border-gray-200 dark:border-gray-800 space-y-0.5">
            <p className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Account</p>
            <button
              onClick={() => {
                setActiveTab('settings');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                activeTab === 'settings'
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Settings className={`w-5 h-5 ${
                activeTab === 'settings'
                  ? 'text-white'
                  : 'text-gray-400 dark:text-gray-500 group-hover:text-brand-600 dark:group-hover:text-brand-400'
              }`} />
              <span className="font-medium text-sm">Settings</span>
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userType');
                window.location.href = '#/admin-login';
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all group"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <div className="bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-950/30 dark:to-brand-900/30 rounded-lg p-3 border border-brand-200 dark:border-brand-800">
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 bg-brand-600 dark:bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-900 dark:text-brand-100 mb-0.5">Need Help?</p>
                <p className="text-xs text-brand-700 dark:text-brand-300 leading-relaxed">Documentation</p>
              </div>
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
      <div className="flex-1 min-h-screen flex flex-col lg:ml-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Spacer for desktop */}
            <div className="hidden lg:block"></div>

            {/* View Website Button */}
            <a
              href="/#/"
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Website
            </a>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
        
        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">Welcome back, Hafsa! 👋</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Here's what's happening with your store today</p>
                </div>
                <div className="hidden lg:block">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Last updated</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Revenue Card */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded">
                    ↑ 12%
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">$12,450</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">from last week</p>
              </div>

              {/* Orders Card */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded">
                    {orders.length}
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Active Orders</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">45</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">12 pending • 33 processing</p>
              </div>

              {/* Designs Card */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center">
                    <Palette className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <span className="px-2 py-0.5 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs font-semibold rounded">
                    Active
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Total Designs</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{designs.length}</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">in catalog</p>
              </div>

              {/* Customers Card */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold rounded">
                    ↑ 8%
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">registered accounts</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Sales Chart */}
              <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Sales Analytics</h3>
                  <select className="text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-2 py-1 focus:ring-2 focus:ring-brand-500 focus:border-transparent">
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
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      id="bulk-design-upload"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleBulkDesignUpload}
                    />
                    <label
                      htmlFor="bulk-design-upload"
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium text-sm shadow-sm cursor-pointer flex items-center gap-2 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Bulk Upload
                    </label>
                    <div className="px-4 py-2 bg-brand-600 text-white rounded-lg font-semibold text-sm shadow-md">
                      {designs.length} Total
                    </div>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
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
                          {design.featured ? (
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 inline-flex items-center gap-1 text-xs font-bold rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border border-orange-200">
                                <Sparkles className="w-3 h-3" />
                                Featured
                              </span>
                              {design.featuredTag && (
                                <span className="text-xs text-gray-500">{design.featuredTag}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Design Image URL</label>
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

                    {/* Featured Section */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            Featured Collection
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">Showcase this design on homepage as a promotional product</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={editingDesign.featured || false}
                            onChange={(e) => setEditingDesign({...editingDesign, featured: e.target.checked})}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                        </label>
                      </div>

                      {editingDesign.featured && (
                        <div className="space-y-4 bg-brand-50 p-4 rounded-lg border border-brand-200">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Featured Tag
                              <span className="ml-2 text-xs text-gray-500 font-normal">(e.g., "Staff Pick", "Trending", "New Arrival")</span>
                            </label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                              value={editingDesign.featuredTag || ''}
                              onChange={(e) => setEditingDesign({...editingDesign, featuredTag: e.target.value})}
                            >
                              <option value="">No Tag</option>
                              <option value="Staff Pick">⭐ Staff Pick</option>
                              <option value="Trending">🔥 Trending</option>
                              <option value="New Arrival">✨ New Arrival</option>
                              <option value="Limited Edition">💎 Limited Edition</option>
                              <option value="Best Seller">🏆 Best Seller</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Featured Product Mockup URL
                              <span className="ml-2 text-xs text-gray-500 font-normal">(Full product photo for homepage showcase)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                              value={editingDesign.featuredMockup || ''}
                              onChange={(e) => setEditingDesign({...editingDesign, featuredMockup: e.target.value})}
                              placeholder="https://example.com/product-mockup.jpg"
                            />
                            {editingDesign.featuredMockup && (
                              <div className="mt-2">
                                <img src={editingDesign.featuredMockup} alt="Featured Preview" className="w-full max-w-xs h-auto object-cover rounded-lg border-2 border-brand-300 shadow-lg" />
                              </div>
                            )}
                          </div>
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
                                multiple
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
                             {MOCKUPS.filter(m => !hiddenMockups.includes(m.id)).length + customMockups.length} visible mockups
                          </p>
                       </div>
                       <div className="flex items-center gap-3">
                          <input
                            type="file"
                            id="bulk-mockup-upload"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleMockupImageUpload}
                          />
                          <label
                            htmlFor="bulk-mockup-upload"
                            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium text-sm shadow-sm cursor-pointer flex items-center gap-2 transition-colors"
                          >
                            <Upload className="w-4 h-4" />
                            Bulk Upload
                          </label>
                          <div className="px-3 py-1.5 bg-brand-100 text-brand-700 rounded-lg font-semibold text-sm">
                             {customMockups.length} Custom
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                    {/* Default Mockups (Now Deletable) */}
                    {MOCKUPS.filter(m => !hiddenMockups.includes(m.id)).map(m => (
                       <div key={m.id} className="bg-white rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-shadow">
                          <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                             <span className="text-xs font-bold text-gray-400 uppercase">{m.type}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-gray-900 dark:text-white">{m.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{m.type}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleDeleteMockup(m.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                              title="Delete Mockup"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                       </div>
                    ))}

                    {/* Custom Mockups (Editable) */}
                    {customMockups.map(m => (
                       <div key={m.id} className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-shadow">
                          <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                             {m.baseImage ? (
                                <img src={m.baseImage} className="w-full h-full object-cover" alt={m.name} />
                             ) : (
                                <span className="text-xs font-bold text-gray-400 uppercase">{m.type}</span>
                             )}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-gray-900 dark:text-white">{m.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{m.type}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleEditMockup(m)}
                              className="p-2 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 rounded-lg transition-colors"
                              title="Edit Mockup"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMockup(m.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
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
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock Management</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor and manage your inventory levels</p>
              </div>
              <button className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Stock Item
              </button>
            </div>

            {/* Stock Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 p-5 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold">Total Items</p>
                  <Box className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stockItems.length}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Product variants</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 p-5 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-purple-700 dark:text-purple-300 font-semibold">Total Units</p>
                  <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stockItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">In warehouse</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-700 p-5 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-red-700 dark:text-red-300 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Low Stock
                  </p>
                </div>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                  {stockItems.filter(item => item.quantity <= item.reorderLevel).length}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">Needs reorder</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 p-5 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-green-700 dark:text-green-300 font-semibold">Well Stocked</p>
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {stockItems.filter(item => item.quantity > item.reorderLevel).length}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">Healthy levels</p>
              </div>
            </div>

            {/* Stock Filters & Search */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
                <select className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                  <option value="">All Products</option>
                  <option value="t-shirt">T-Shirts</option>
                  <option value="hoodie">Hoodies</option>
                  <option value="sweater">Sweaters</option>
                  <option value="cap">Caps</option>
                </select>
                <select className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                  <option value="">All Sizes</option>
                  <option value="S">Small</option>
                  <option value="M">Medium</option>
                  <option value="L">Large</option>
                  <option value="XL">X-Large</option>
                  <option value="XXL">XX-Large</option>
                </select>
                <select className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                  <option value="">All Status</option>
                  <option value="low">Low Stock</option>
                  <option value="good">Well Stocked</option>
                </select>
              </div>
            </div>

            {/* Stock Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    Inventory Overview
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{stockItems.length} items</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-750">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Color</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Reorder Level</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Supplier</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Last Restocked</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {stockItems.map((item) => {
                      const isLowStock = item.quantity <= item.reorderLevel;
                      const isCritical = item.quantity <= item.reorderLevel / 2;
                      return (
                        <tr key={item.id} className={`hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${isLowStock ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isLowStock ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                <Box className={`w-5 h-5 ${isLowStock ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`} />
                              </div>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{item.productType.replace('-', ' ')}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-semibold">{item.size}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                                style={{backgroundColor: item.color.toLowerCase()}}
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{item.color}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className={`text-lg font-bold ${isCritical ? 'text-red-700 dark:text-red-400' : isLowStock ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}>
                                {item.quantity}
                              </span>
                              {isCritical && <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 animate-pulse" />}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{item.reorderLevel}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isCritical ? (
                              <span className="px-3 py-1.5 inline-flex items-center gap-1.5 text-xs font-bold rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Critical
                              </span>
                            ) : isLowStock ? (
                              <span className="px-3 py-1.5 inline-flex items-center gap-1.5 text-xs font-bold rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Low Stock
                              </span>
                            ) : (
                              <span className="px-3 py-1.5 inline-flex items-center gap-1.5 text-xs font-bold rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
                                <CheckCircle className="w-3.5 h-3.5" />
                                In Stock
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{item.supplier}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.lastRestocked}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setStockUpdateModal({isOpen: true, item, mode: 'update'});
                                  setStockUpdateQuantity(item.quantity.toString());
                                }}
                                className="p-2 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                                title="Update quantity"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setStockUpdateModal({isOpen: true, item, mode: 'add'});
                                  setStockUpdateQuantity('50');
                                }}
                                className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                title="Add stock"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
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
              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-l-4 border-red-500 dark:border-red-600 p-6 rounded-xl shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-red-900 dark:text-red-100">Low Stock Alert</h3>
                      <span className="px-3 py-1 bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 rounded-full text-xs font-bold">
                        {stockItems.filter(item => item.quantity <= item.reorderLevel).length} Items
                      </span>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                      The following items are running low on stock. Consider reordering soon to avoid stockouts.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {stockItems
                        .filter(item => item.quantity <= item.reorderLevel)
                        .slice(0, 6)
                        .map(item => {
                          const isCritical = item.quantity <= item.reorderLevel / 2;
                          return (
                            <div key={item.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-red-200 dark:border-red-800">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-600 animate-pulse' : 'bg-orange-500'}`}></div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                                    {item.productType.replace('-', ' ')} - {item.size}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.color}</p>
                                </div>
                              </div>
                              <span className={`text-sm font-bold ${isCritical ? 'text-red-700 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                {item.quantity} left
                              </span>
                            </div>
                          );
                        })}
                    </div>
                    {stockItems.filter(item => item.quantity <= item.reorderLevel).length > 6 && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-3">
                        + {stockItems.filter(item => item.quantity <= item.reorderLevel).length - 6} more items need attention
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stock Update Modal */}
            {stockUpdateModal.isOpen && stockUpdateModal.item && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
                  {/* Modal Header */}
                  <div className={`px-6 py-5 border-b border-gray-200 dark:border-gray-700 ${
                    stockUpdateModal.mode === 'add'
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
                      : 'bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-900/20 dark:to-purple-900/20'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          stockUpdateModal.mode === 'add'
                            ? 'bg-green-100 dark:bg-green-900/40'
                            : 'bg-brand-100 dark:bg-brand-900/40'
                        }`}>
                          {stockUpdateModal.mode === 'add' ? (
                            <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
                          ) : (
                            <Edit className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {stockUpdateModal.mode === 'add' ? 'Add Stock' : 'Update Stock'}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {stockUpdateModal.item.productType.replace('-', ' ')} - {stockUpdateModal.item.size}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setStockUpdateModal({isOpen: false, item: null, mode: 'update'})}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <XIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="px-6 py-6 space-y-5">
                    {/* Product Info */}
                    <div className="bg-gray-50 dark:bg-gray-750 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Product</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                            {stockUpdateModal.item.productType.replace('-', ' ')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Size</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {stockUpdateModal.item.size}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Color</p>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600"
                              style={{backgroundColor: stockUpdateModal.item.color.toLowerCase()}}
                            />
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {stockUpdateModal.item.color}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Current Stock</p>
                          <p className="text-sm font-bold text-brand-600 dark:text-brand-400">
                            {stockUpdateModal.item.quantity} units
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {stockUpdateModal.mode === 'add' ? 'Quantity to Add' : 'New Quantity'}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={stockUpdateQuantity}
                          onChange={(e) => setStockUpdateQuantity(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl text-lg font-bold focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                          placeholder="Enter quantity"
                          min="0"
                          autoFocus
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500 font-medium">
                          units
                        </div>
                      </div>
                      {stockUpdateModal.mode === 'add' && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          New total: <span className="font-bold text-brand-600 dark:text-brand-400">
                            {stockUpdateModal.item.quantity + (parseInt(stockUpdateQuantity) || 0)} units
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Quick Actions */}
                    {stockUpdateModal.mode === 'add' && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">Quick Add</p>
                        <div className="flex gap-2">
                          {[10, 25, 50, 100].map(qty => (
                            <button
                              key={qty}
                              onClick={() => setStockUpdateQuantity(qty.toString())}
                              className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold transition-all"
                            >
                              +{qty}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Modal Footer */}
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl flex gap-3">
                    <button
                      onClick={() => setStockUpdateModal({isOpen: false, item: null, mode: 'update'})}
                      className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        const qty = parseInt(stockUpdateQuantity);
                        if (!isNaN(qty) && qty >= 0) {
                          setStockItems(stockItems.map(s =>
                            s.id === stockUpdateModal.item!.id
                              ? {
                                  ...s,
                                  quantity: stockUpdateModal.mode === 'add' ? s.quantity + qty : qty,
                                  lastRestocked: new Date().toISOString().split('T')[0]
                                }
                              : s
                          ));
                          setStockUpdateModal({isOpen: false, item: null, mode: 'update'});
                        }
                      }}
                      className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all ${
                        stockUpdateModal.mode === 'add'
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                          : 'bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700'
                      }`}
                    >
                      {stockUpdateModal.mode === 'add' ? 'Add Stock' : 'Update Stock'}
                    </button>
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

        {/* Settings View */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your admin preferences and account settings</p>
              </div>
            </div>

            {/* Settings Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Account Settings */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-brand-600" />
                  Account Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Admin Email</label>
                    <input
                      type="email"
                      value="hafsa@admin.com"
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                    <input
                      type="text"
                      value="Administrator"
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <button className="w-full px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors">
                    Change Password
                  </button>
                </div>
              </div>

              {/* Appearance Settings */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-brand-600" />
                  Appearance
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                    <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      <option>Light</option>
                      <option>Dark</option>
                      <option>System</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                    <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      <option>English</option>
                      <option>French</option>
                      <option>Arabic</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Notifications
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Email notifications</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-600 rounded" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Order updates</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-600 rounded" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">New user registrations</span>
                    <input type="checkbox" className="w-4 h-4 text-brand-600 rounded" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Low stock alerts</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-600 rounded" />
                  </label>
                </div>
              </div>

              {/* Store Settings */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Store Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Store Name</label>
                    <input
                      type="text"
                      defaultValue="KHAYALI"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currency</label>
                    <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>MAD (DH)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  );
};

export default Admin;