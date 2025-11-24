import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { STATS_DATA, INITIAL_DESIGNS, MOCK_ORDERS, MOCKUPS, STOCK_ITEMS } from '../constants';
import { Design, Mockup, Order, StockItem } from '../types';
import { Plus, Loader2, Sparkles, Package, DollarSign, Users, Image as ImageIcon, Upload, Palette, TrendingUp, Box, AlertTriangle, Eye, Truck, CheckCircle, XCircle, Edit, Search } from 'lucide-react';
import { generateMarketingCopy } from '../services/geminiService';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'designs' | 'orders' | 'mockups' | 'stock'>('dashboard');
  const [designs, setDesigns] = useState<Design[]>(INITIAL_DESIGNS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [stockItems, setStockItems] = useState<StockItem[]>(STOCK_ITEMS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  
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
  const [isGenerating, setIsGenerating] = useState(false);

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
      price: 25.00
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
    alert('Design added successfully!');
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-gray-900">Admin Panel</h2>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option value="dashboard">Dashboard</option>
            <option value="designs">Designs</option>
            <option value="mockups">Mockups</option>
            <option value="orders">Orders</option>
            <option value="stock">Stock</option>
          </select>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
           <h2 className="font-serif text-2xl font-bold text-gray-900">Admin Panel</h2>
           <p className="text-xs text-gray-500 mt-1">Manage your store</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'designs', label: 'Designs', icon: Palette },
            { id: 'mockups', label: 'Mockups', icon: ImageIcon },
            { id: 'orders', label: 'Orders', icon: Package },
            { id: 'stock', label: 'Stock', icon: Box },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-brand-50 text-brand-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="bg-brand-50 rounded-lg p-4">
            <p className="text-xs font-semibold text-brand-900 mb-1">Need Help?</p>
            <p className="text-xs text-brand-700">Check our documentation</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        
        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-brand-500 to-brand-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-brand-100">Total Revenue</p>
                  <DollarSign className="w-5 h-5 text-brand-200" />
                </div>
                <h3 className="text-3xl font-bold mt-1">$12,450</h3>
                <div className="mt-3 flex items-center text-sm">
                  <span className="text-green-200 font-medium">↑ 12%</span>
                  <span className="ml-2 text-brand-100">from last week</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500">Active Orders</p>
                  <Package className="w-5 h-5 text-yellow-500" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">45</h3>
                <div className="mt-3 flex items-center text-sm">
                  <span className="text-yellow-600 font-medium">12 Pending</span>
                  <span className="ml-2 text-gray-400">• 33 Processing</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500">Total Designs</p>
                  <Palette className="w-5 h-5 text-brand-500" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{designs.length}</h3>
                <div className="mt-3 flex items-center text-sm">
                  <span className="text-brand-600 font-medium">Active Catalog</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500">Total Customers</p>
                  <Users className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">1,284</h3>
                <div className="mt-3 flex items-center text-sm">
                  <span className="text-green-600 font-medium">↑ 8%</span>
                  <span className="ml-2 text-gray-400">this month</span>
                </div>
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
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Design Management</h1>
            </div>

            {/* Add Design Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand-600" /> Add New Design
              </h3>
              <form onSubmit={handleAddDesign} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* List of Designs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Design</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {designs.map((design) => (
                    <tr key={design.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img className="h-10 w-10 rounded-full object-cover" src={design.imageUrl} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{design.title}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{design.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{design.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${design.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mockups View */}
        {activeTab === 'mockups' && (
           <div className="space-y-8">
              <h1 className="text-2xl font-bold text-gray-900">Mockup Management</h1>
              
              {/* Add Mockup Form */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                 <div className="flex flex-col lg:flex-row gap-8">
                    {/* Form Side */}
                    <div className="flex-1 space-y-4">
                       <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Upload className="w-5 h-5 text-brand-600" /> Upload New Product
                       </h3>
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

              {/* Existing Mockups List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                 <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-bold text-gray-700">Active Mockups</h3>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6">
                    {[...MOCKUPS, ...customMockups].map(m => (
                       <div key={m.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex flex-col items-center text-center">
                          <div className="w-16 h-16 mb-2 flex items-center justify-center bg-white rounded-full shadow-sm overflow-hidden">
                             {m.type === 'custom' && m.baseImage ? (
                                <img src={m.baseImage} className="w-full h-full object-cover" />
                             ) : (
                                <span className="text-xs font-bold text-gray-400 uppercase">{m.type}</span>
                             )}
                          </div>
                          <p className="font-bold text-sm text-gray-900">{m.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{m.type}</p>
                       </div>
                    ))}
                 </div>
              </div>
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
      </div>
    </div>
  );
};

export default Admin;