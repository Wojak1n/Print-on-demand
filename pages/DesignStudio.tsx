import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_DESIGNS, MOCKUPS } from '../constants';
import { Design, Mockup } from '../types';
import { Search, ZoomIn, Check, ShoppingCart, Sparkles, Move, RotateCw, Sliders, Loader2, Upload, ImagePlus } from 'lucide-react';
import { generateSVGDesign } from '../services/geminiService';
import { TshirtSVG, HoodieSVG, SweaterSVG, CapSVG, CustomMockup } from '../components/ProductMockups';

const DesignStudio: React.FC = () => {
  const [selectedDesign, setSelectedDesign] = useState<Design>(INITIAL_DESIGNS[0]);
  const [selectedMockup, setSelectedMockup] = useState<Mockup>(MOCKUPS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [designs, setDesigns] = useState<Design[]>(INITIAL_DESIGNS);
  const [allMockups, setAllMockups] = useState<Mockup[]>(MOCKUPS);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const productImageInputRef = useRef<HTMLInputElement>(null);
  
  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);

  // Customization State
  const [mockupColor, setMockupColor] = useState('#ffffff');
  
  // Transform Controls
  const [designScale, setDesignScale] = useState(1);
  const [designRotation, setDesignRotation] = useState(0);
  const [designX, setDesignX] = useState(0);
  const [designY, setDesignY] = useState(0);

  // Load custom data from localStorage on mount
  useEffect(() => {
    // 1. Load Custom Mockups
    const savedMockups = localStorage.getItem('customMockups');
    if (savedMockups) {
      try {
        const parsed = JSON.parse(savedMockups);
        setAllMockups([...MOCKUPS, ...parsed]);
      } catch (e) {
        console.error("Failed to parse custom mockups", e);
      }
    }

    // 2. Load Designs (User Uploads + Admin Catalog + Initial)
    try {
        const savedUserDesigns = JSON.parse(localStorage.getItem('customDesigns') || '[]');
        const savedCatalogDesigns = JSON.parse(localStorage.getItem('catalogDesigns') || '[]');
        
        // Merge: User Uploads -> Admin Catalog -> Initial Defaults
        setDesigns([...savedUserDesigns, ...savedCatalogDesigns, ...INITIAL_DESIGNS]);
    } catch (e) {
        console.error("Failed to load designs from storage", e);
    }
  }, []);

  // Helper to save user designs to local storage
  const saveUserDesignToStorage = (design: Design) => {
    try {
        const currentSaved = JSON.parse(localStorage.getItem('customDesigns') || '[]');
        const updated = [design, ...currentSaved];
        localStorage.setItem('customDesigns', JSON.stringify(updated));
    } catch (e) {
        console.error("Storage quota exceeded", e);
        alert("Design rendered but could not be saved to history (Storage Full).");
    }
  };

  // Filter designs
  const filteredDesigns = designs.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerateDesign = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    const svgContent = await generateSVGDesign(prompt);
    
    const newDesign: Design = {
      id: `ai-${Date.now()}`,
      title: 'AI Custom Design',
      category: 'AI Generated',
      description: prompt,
      popularity: 0,
      price: 30.00,
      type: 'vector',
      svgContent: svgContent
    };

    setDesigns(prev => [newDesign, ...prev]);
    setSelectedDesign(newDesign);
    saveUserDesignToStorage(newDesign);
    
    setIsGenerating(false);
    setShowAiModal(false);
    setPrompt('');
    // Reset transforms for new design
    setDesignScale(1);
    setDesignRotation(0);
    setDesignX(0);
    setDesignY(0);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const isSvg = file.type.includes('svg') || file.name.endsWith('.svg');
          const resultStr = e.target.result as string;

          const newDesign: Design = {
            id: `upload-${Date.now()}`,
            title: file.name.split('.')[0],
            category: 'Uploaded',
            popularity: 0,
            price: 25.00,
            type: 'raster', // Default to raster for simplicity with <img> tags
            imageUrl: resultStr,
            description: 'User uploaded design'
          };

          // Special handling if user uploaded an SVG file -> we can still use it as an image source
          // or try to decode it if we want vector manipulation (complex).
          // For now, treating uploaded SVG as 'raster' type (via img src) is safer for rendering.

          setDesigns(prev => [newDesign, ...prev]);
          setSelectedDesign(newDesign);
          saveUserDesignToStorage(newDesign);

          // Reset transforms
          setDesignScale(1);
          setDesignRotation(0);
          setDesignX(0);
          setDesignY(0);
        }
      };
      reader.readAsDataURL(file);
      // Reset input to allow re-uploading same file if needed
      event.target.value = '';
    }
  };

  const handleProductImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const resultStr = e.target.result as string;

          const newMockup: Mockup = {
            id: `custom-${Date.now()}`,
            name: file.name.split('.')[0],
            type: 'custom',
            baseImage: resultStr,
            overlayX: 50,
            overlayY: 50,
            overlayWidth: 40
          };

          // Save to localStorage
          try {
            const currentSaved = JSON.parse(localStorage.getItem('customMockups') || '[]');
            const updated = [newMockup, ...currentSaved];
            localStorage.setItem('customMockups', JSON.stringify(updated));
          } catch (e) {
            console.error("Storage quota exceeded", e);
            alert("Product image uploaded but could not be saved (Storage Full).");
          }

          setAllMockups(prev => [newMockup, ...prev]);
          setSelectedMockup(newMockup);
        }
      };
      reader.readAsDataURL(file);
      // Reset input to allow re-uploading same file if needed
      event.target.value = '';
    }
  };

  const renderMockupSVG = () => {
    const props = { color: mockupColor, className: "w-full h-full filter drop-shadow-2xl" };
    switch (selectedMockup.type) {
      case 't-shirt': return <TshirtSVG {...props} />;
      case 'hoodie': return <HoodieSVG {...props} />;
      case 'sweater': return <SweaterSVG {...props} />;
      case 'cap': return <CapSVG {...props} />;
      case 'custom': return <CustomMockup {...props} baseImage={selectedMockup.baseImage} />;
      default: return <TshirtSVG {...props} />;
    }
  };

  const colors = ['#ffffff', '#e5e7eb', '#111827', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f472b6'];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT COLUMN: Designs */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col z-10 shadow-lg">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-serif font-bold text-xl text-gray-900 mb-4">Library</h2>
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setShowAiModal(!showAiModal)}
                className="p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 border border-brand-200 transition-colors"
                title="Generate AI Design"
              >
                <Sparkles className="w-5 h-5" />
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors"
                title="Upload Your Design"
              >
                <Upload className="w-5 h-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*,.svg" 
                onChange={handleFileUpload} 
              />
            </div>

            {/* AI Prompt Area (Conditional) */}
            {showAiModal && (
              <div className="mb-4 p-3 bg-brand-50 rounded-xl border border-brand-100 animate-in slide-in-from-top-2">
                <textarea 
                  className="w-full p-2 text-sm border border-brand-200 rounded-lg mb-2 h-20 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  placeholder="Describe your dream design... (e.g. 'A cyberpunk cat in neon colors')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button 
                  onClick={handleGenerateDesign}
                  disabled={isGenerating || !prompt}
                  className="w-full py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate
                </button>
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {filteredDesigns.map(design => (
              <div 
                key={design.id} 
                onClick={() => setSelectedDesign(design)}
                className={`cursor-pointer group rounded-xl p-2 border-2 transition-all duration-200 flex items-center gap-3 ${selectedDesign.id === design.id ? 'border-brand-500 bg-brand-50' : 'border-transparent hover:bg-gray-50 border-gray-100'}`}
              >
                <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-white border border-gray-200 overflow-hidden flex items-center justify-center p-1 shadow-sm">
                   {design.type === 'vector' && design.svgContent ? (
                     <div dangerouslySetInnerHTML={{__html: design.svgContent}} className="w-full h-full" />
                   ) : (
                     <img src={design.imageUrl} alt={design.title} className="h-full w-full object-contain" />
                   )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{design.title}</h3>
                  <p className="text-xs text-gray-500">{design.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE COLUMN: Canvas & Controls */}
        <div className="flex-1 bg-gray-100 flex flex-col relative overflow-hidden">
          
          {/* Top Bar: Color Picker */}
          <div className="absolute top-6 left-0 right-0 flex justify-center z-20 pointer-events-none">
             <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-gray-200 pointer-events-auto flex items-center gap-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Color</span>
                <div className="flex space-x-2">
                  {colors.map(c => (
                    <button
                      key={c}
                      onClick={() => setMockupColor(c)}
                      className={`w-6 h-6 rounded-full border border-gray-300 shadow-sm transition-transform hover:scale-110 ${mockupColor === c ? 'ring-2 ring-offset-2 ring-brand-500 scale-110' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
             </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-hidden relative">
             <div className="relative w-[600px] h-[600px]">
                {/* 1. Mockup SVG or Image */}
                <div className="w-full h-full relative z-0 flex items-center justify-center">
                  {renderMockupSVG()}
                </div>

                {/* 2. Design Overlay Layer */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none overflow-hidden flex items-center justify-center"
                >
                   {/* Positioning Container */}
                   <div
                      className="absolute transition-transform duration-75 ease-out border-2 border-transparent hover:border-brand-300 hover:border-dashed"
                      style={{
                        top: `${selectedMockup.overlayY}%`,
                        left: `${selectedMockup.overlayX}%`,
                        width: `${selectedMockup.overlayWidth}%`,
                        height: `${selectedMockup.overlayWidth}%`, // Aspect square base
                        transform: `
                          translate(-50%, -50%)
                          translate(${designX}px, ${designY}px)
                          rotate(${designRotation}deg)
                          scale(${designScale})
                        `,
                        // Multiply blend mode for realistic ink effect on light garments
                        mixBlendMode: selectedMockup.type === 'custom' ? 'normal' : (mockupColor === '#111827' ? 'normal' : 'multiply')
                      }}
                   >
                      {selectedDesign.type === 'vector' && selectedDesign.svgContent ? (
                        <div
                          dangerouslySetInnerHTML={{__html: selectedDesign.svgContent}}
                          className="w-full h-full"
                        />
                      ) : (
                        <img
                          src={selectedDesign.imageUrl}
                          alt="Print"
                          className="w-full h-full object-contain"
                        />
                      )}
                   </div>
                </div>
             </div>
          </div>

          {/* Bottom Controls: Positioning */}
          <div className="bg-white border-t border-gray-200 p-4 z-20">
            <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
               
               {/* Transform Controls */}
               <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 flex items-center gap-1"><Move className="w-3 h-3" /> X Pos</label>
                    <input 
                      type="range" min="-100" max="100" value={designX} 
                      onChange={(e) => setDesignX(Number(e.target.value))}
                      className="accent-brand-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 flex items-center gap-1"><Move className="w-3 h-3 rotate-90" /> Y Pos</label>
                    <input 
                      type="range" min="-100" max="100" value={designY} 
                      onChange={(e) => setDesignY(Number(e.target.value))}
                      className="accent-brand-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 flex items-center gap-1"><ZoomIn className="w-3 h-3" /> Scale</label>
                    <input 
                      type="range" min="0.2" max="2" step="0.1" value={designScale} 
                      onChange={(e) => setDesignScale(Number(e.target.value))}
                      className="accent-brand-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 flex items-center gap-1"><RotateCw className="w-3 h-3" /> Rotate</label>
                    <input 
                      type="range" min="0" max="360" value={designRotation} 
                      onChange={(e) => setDesignRotation(Number(e.target.value))}
                      className="accent-brand-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
               </div>

               {/* Buy Button */}
               <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-500">Total Price</p>
                    <p className="text-xl font-bold text-gray-900">${(selectedDesign.price + 15).toFixed(2)}</p>
                  </div>
                  <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 flex items-center gap-2 shadow-lg transform active:scale-95 transition-all">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Mockup Selector */}
        <div className="w-24 bg-white border-l border-gray-200 flex flex-col z-10 shadow-lg items-center py-4 gap-4 overflow-y-auto custom-scrollbar">
           <div className="mb-2">
             <Sliders className="w-6 h-6 text-gray-400" />
           </div>

           {/* Upload Product Image Button */}
           <button
             onClick={() => productImageInputRef.current?.click()}
             className="w-16 h-16 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50 flex-shrink-0 flex items-center justify-center p-2 transition-all hover:bg-brand-100 hover:border-brand-400 group"
             title="Upload Product Image"
           >
             <ImagePlus className="w-6 h-6 text-brand-600" />
             <div className="absolute right-full mr-4 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
               Upload Product
             </div>
           </button>
           <input
             type="file"
             ref={productImageInputRef}
             className="hidden"
             accept="image/*"
             onChange={handleProductImageUpload}
           />

           {allMockups.map(mockup => (
             <button 
              key={mockup.id}
              onClick={() => setSelectedMockup(mockup)}
              className={`w-16 h-16 rounded-xl border-2 flex-shrink-0 flex items-center justify-center p-2 transition-all relative group ${selectedMockup.id === mockup.id ? 'border-brand-600 bg-brand-50 text-brand-600' : 'border-gray-200 hover:border-gray-300 text-gray-400'}`}
              title={mockup.name}
             >
                {/* Miniature SVGs or Image for Icons */}
                {mockup.type === 't-shirt' && <TshirtSVG color={selectedMockup.id === mockup.id ? '#7c3aed' : '#9ca3af'} />}
                {mockup.type === 'hoodie' && <HoodieSVG color={selectedMockup.id === mockup.id ? '#7c3aed' : '#9ca3af'} />}
                {mockup.type === 'sweater' && <SweaterSVG color={selectedMockup.id === mockup.id ? '#7c3aed' : '#9ca3af'} />}
                {mockup.type === 'cap' && <CapSVG color={selectedMockup.id === mockup.id ? '#7c3aed' : '#9ca3af'} />}
                {mockup.type === 'custom' && mockup.baseImage && (
                  <img src={mockup.baseImage} alt="custom" className="w-full h-full object-contain rounded-md opacity-75" />
                )}
                {mockup.type === 'custom' && !mockup.baseImage && <ImagePlus className="w-6 h-6" />}
                
                {selectedMockup.id === mockup.id && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-600 rounded-full flex items-center justify-center border border-white">
                    <Check className="w-2 h-2 text-white" />
                  </div>
                )}
                
                {/* Tooltip */}
                <div className="absolute right-full mr-4 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                  {mockup.name}
                </div>
             </button>
           ))}
        </div>

      </div>
    </div>
  );
};

export default DesignStudio;