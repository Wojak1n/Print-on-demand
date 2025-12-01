import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_DESIGNS, MOCKUPS } from '../constants';
import { Design, Mockup, DesignZone } from '../types';
import { Search, ZoomIn, Check, ShoppingCart, Sparkles, Move, RotateCw, Sliders, Loader2, Upload, ImagePlus, Layers, Plus, X, Copy, Eye } from 'lucide-react';
import { generateSVGDesign } from '../services/geminiService';
import { uploadDesignToCloudinary, uploadMockupToCloudinary, fetchImagesFromFolder } from '../services/cloudinaryService';
import { TshirtSVG, HoodieSVG, SweaterSVG, CapSVG, CustomMockup } from '../components/ProductMockups';
import { isAuthenticated, isAdmin } from '../utils/auth';
import useTranslation from '../hooks/useTranslation';
import html2canvas from 'html2canvas';

const DesignStudio: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [selectedMockup, setSelectedMockup] = useState<Mockup>(MOCKUPS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [designs, setDesigns] = useState<Design[]>([]);
  const [allMockups, setAllMockups] = useState<Mockup[]>(MOCKUPS);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const productImageInputRef = useRef<HTMLInputElement>(null);

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);

  // Upload State
  const [isUploadingDesign, setIsUploadingDesign] = useState(false);
  const [isUploadingMockup, setIsUploadingMockup] = useState(false);

  // Cloudinary Fetch State
  const [isLoadingDesigns, setIsLoadingDesigns] = useState(true);
  const [isLoadingMockups, setIsLoadingMockups] = useState(true);

  // Customization State
  const [mockupColor, setMockupColor] = useState('#ffffff');

  // Multi-Zone State
  const [currentZoneIndex, setCurrentZoneIndex] = useState(0);
  const [mockupZones, setMockupZones] = useState<DesignZone[]>([]);
  const [showZoneManager, setShowZoneManager] = useState(false);
  const [showZoneBoundaries, setShowZoneBoundaries] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);

  // Drag state
  const [isDraggingZone, setIsDraggingZone] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Transform Controls (legacy - kept for backward compatibility)
  const [designScale, setDesignScale] = useState(1);
  const [designRotation, setDesignRotation] = useState(0);
  const [designX, setDesignX] = useState(0);
  const [designY, setDesignY] = useState(0);

  // Initialize zones when mockup changes
  useEffect(() => {
    if (selectedMockup.zones && selectedMockup.zones.length > 0) {
      // Deep clone zones to avoid mutating the original
      setMockupZones(JSON.parse(JSON.stringify(selectedMockup.zones)));
      setCurrentZoneIndex(0);
    } else {
      // Create a default zone for backward compatibility
      setMockupZones([{
        id: 'zone-default',
        name: 'Main',
        overlayX: selectedMockup.overlayX,
        overlayY: selectedMockup.overlayY,
        overlayWidth: selectedMockup.overlayWidth,
        designScale: 1,
        designRotation: 0,
        designOffsetX: 0,
        designOffsetY: 0
      }]);
      setCurrentZoneIndex(0);
    }
  }, [selectedMockup]);

  // Load custom data from localStorage on mount + Fetch from Cloudinary
  useEffect(() => {
    const loadData = async () => {
      // 1. Load Custom Mockups and filter out hidden default mockups
      const savedMockups = localStorage.getItem('customMockups');
      const hiddenMockups = JSON.parse(localStorage.getItem('hiddenMockups') || '[]');

      // Filter out hidden default mockups
      const visibleDefaultMockups = MOCKUPS.filter(m => !hiddenMockups.includes(m.id));

      if (savedMockups) {
        try {
          const parsed = JSON.parse(savedMockups);
          setAllMockups([...visibleDefaultMockups, ...parsed]);
        } catch (e) {
          console.error("Failed to parse custom mockups", e);
          setAllMockups(visibleDefaultMockups);
        }
      } else {
        setAllMockups(visibleDefaultMockups);
      }

      // 2. Fetch Mockups from Cloudinary
      setIsLoadingMockups(true);
      try {
        console.log('🔍 Fetching mockups from Cloudinary...');
        const cloudinaryMockups = await fetchImagesFromFolder('mockups');
        console.log('✅ Mockups fetched:', cloudinaryMockups.length, 'images');

        if (cloudinaryMockups.length > 0) {
          const mockupObjects: Mockup[] = cloudinaryMockups.map((img, index) => ({
            id: img.public_id,
            name: img.public_id.split('/').pop()?.replace(/[_-]/g, ' ') || `Mockup ${index + 1}`,
            type: 'custom' as const,
            baseImage: img.secure_url,
            overlayX: 50,
            overlayY: 50,
            overlayWidth: 40,
            cloudinaryId: img.public_id,
          }));

          console.log('✅ Mockup objects created:', mockupObjects);
          setAllMockups(prev => [...prev, ...mockupObjects]);
        } else {
          console.warn('⚠️ No mockups found in Cloudinary mockups/ folder');
        }
      } catch (error) {
        console.error('❌ Failed to fetch mockups from Cloudinary:', error);
      } finally {
        setIsLoadingMockups(false);
      }

      // 3. Load Designs from localStorage
      setIsLoadingDesigns(true);
      try {
        const savedUserDesigns = JSON.parse(localStorage.getItem('customDesigns') || '[]');
        const savedCatalogDesigns = JSON.parse(localStorage.getItem('catalogDesigns') || '[]');

        // 4. Fetch Designs from Cloudinary
        console.log('🔍 Fetching designs from Cloudinary...');
        const cloudinaryDesigns = await fetchImagesFromFolder('designs');
        console.log('✅ Designs fetched:', cloudinaryDesigns.length, 'images');

        const designObjects: Design[] = cloudinaryDesigns.map((img, index) => ({
          id: img.public_id,
          title: img.public_id.split('/').pop()?.replace(/[_-]/g, ' ') || `Design ${index + 1}`,
          imageUrl: img.secure_url,
          category: 'Cloudinary',
          popularity: 0,
          price: 25.00,
          type: 'raster' as const,
          description: 'Design from Cloudinary',
          cloudinaryId: img.public_id,
        }));

        console.log('✅ Design objects created:', designObjects);

        // Merge: User Uploads -> Admin Catalog -> Cloudinary Designs
        const allDesigns = [...savedUserDesigns, ...savedCatalogDesigns, ...designObjects, ...INITIAL_DESIGNS];
        console.log('✅ Total designs loaded:', allDesigns.length);
        setDesigns(allDesigns);

        // Set first design as selected if available
        if (allDesigns.length > 0 && !selectedDesign) {
          setSelectedDesign(allDesigns[0]);
        }
      } catch (e) {
        console.error("❌ Failed to load designs from storage", e);
      } finally {
        setIsLoadingDesigns(false);
      }
    };

    loadData();
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

  // Zone Management Functions
  const getCurrentZone = (): DesignZone | null => {
    return mockupZones[currentZoneIndex] || null;
  };

  const updateCurrentZone = (updates: Partial<DesignZone>) => {
    setMockupZones(prev => {
      const newZones = [...prev];
      newZones[currentZoneIndex] = { ...newZones[currentZoneIndex], ...updates };
      return newZones;
    });
  };

  const addNewZone = () => {
    const newZone: DesignZone = {
      id: `zone-${Date.now()}`,
      name: `Zone ${mockupZones.length + 1}`,
      overlayX: 50,
      overlayY: 50,
      overlayWidth: 30,
      designScale: 1,
      designRotation: 0,
      designOffsetX: 0,
      designOffsetY: 0
    };
    setMockupZones(prev => [...prev, newZone]);
    setCurrentZoneIndex(mockupZones.length);
  };

  const removeZone = (index: number) => {
    if (mockupZones.length <= 1) {
      alert("You must have at least one design zone!");
      return;
    }
    setMockupZones(prev => prev.filter((_, i) => i !== index));
    if (currentZoneIndex >= index && currentZoneIndex > 0) {
      setCurrentZoneIndex(currentZoneIndex - 1);
    }
  };

  const duplicateZone = (index: number) => {
    const zoneToDuplicate = mockupZones[index];
    const newZone: DesignZone = {
      ...zoneToDuplicate,
      id: `zone-${Date.now()}`,
      name: `${zoneToDuplicate.name} Copy`,
      overlayX: zoneToDuplicate.overlayX + 5,
      overlayY: zoneToDuplicate.overlayY + 5
    };
    setMockupZones(prev => [...prev, newZone]);
  };

  const assignDesignToCurrentZone = (design: Design) => {
    updateCurrentZone({ designId: design.id });
  };

  // Add to Cart Modal State
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [capturedProductImage, setCapturedProductImage] = useState<string>('');

  // Capture Product Image
  const captureProductImage = async (): Promise<string> => {
    const productPreview = canvasRef.current;
    if (!productPreview) return '';

    // Temporarily hide zone boundaries and borders
    const previousShowBoundaries = showZoneBoundaries;
    setShowZoneBoundaries(false);

    // Wait for React to re-render without boundaries
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const canvas = await html2canvas(productPreview, {
        backgroundColor: null,
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        logging: false,
        ignoreElements: (element) => {
          // Ignore elements with zone boundaries, borders, and labels
          return element.classList.contains('border-brand-500') ||
                 element.classList.contains('border-brand-300') ||
                 element.classList.contains('border-dashed') ||
                 element.tagName === 'BUTTON';
        }
      });

      const imageData = canvas.toDataURL('image/png');

      // Restore zone boundaries
      setShowZoneBoundaries(previousShowBoundaries);

      return imageData;
    } catch (error) {
      console.error('Error capturing product image:', error);
      // Restore zone boundaries even on error
      setShowZoneBoundaries(previousShowBoundaries);
      return '';
    }
  };

  // Add to Cart Handler
  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      // Store the current design state before redirecting to login
      const designState = {
        selectedDesign,
        selectedMockup,
        mockupColor,
        mockupZones,
        timestamp: Date.now()
      };
      localStorage.setItem('pendingDesign', JSON.stringify(designState));

      // Redirect to login with a return URL
      navigate('/login?redirect=studio&action=addToCart');
      return;
    }

    // Capture the final product image
    const productImage = await captureProductImage();
    setCapturedProductImage(productImage);

    // Show size selection modal
    setShowAddToCartModal(true);
  };

  const confirmAddToCart = () => {
    if (!selectedDesign || !selectedMockup) {
      alert('Please select a design and mockup first!');
      return;
    }

    // Create cart item with captured product image
    const cartItem = {
      id: `${Date.now()}-${Math.random()}`,
      designId: selectedDesign.id,
      designTitle: selectedDesign.title || 'Custom Design',
      mockupType: selectedMockup.type,
      quantity: 1,
      size: selectedSize,
      color: mockupColor,
      price: (selectedDesign.price || 0) + 15, // Design price + base product price
      imageUrl: capturedProductImage || selectedDesign.imageUrl || '', // Use captured product image
    };

    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Add new item
    const updatedCart = [...existingCart, cartItem];

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Dispatch custom event to update cart count in navbar
    window.dispatchEvent(new Event('cartUpdated'));

    // Close modal and show success notification
    setShowAddToCartModal(false);
    setShowSuccessNotification(true);

    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 3000);
  };

  // Zone Templates
  const applyZoneTemplate = (templateName: string) => {
    let newZones: DesignZone[] = [];

    switch (templateName) {
      case 'front-back':
        newZones = [
          {
            id: 'zone-front',
            name: 'Front',
            overlayX: 65,
            overlayY: 50,
            overlayWidth: 25,
            designScale: 1,
            designRotation: 0,
            designOffsetX: 0,
            designOffsetY: 0
          },
          {
            id: 'zone-back',
            name: 'Back',
            overlayX: 35,
            overlayY: 50,
            overlayWidth: 25,
            designScale: 1,
            designRotation: 0,
            designOffsetX: 0,
            designOffsetY: 0
          }
        ];
        break;

      case 'front-back-sleeves':
        newZones = [
          {
            id: 'zone-front',
            name: 'Front',
            overlayX: 65,
            overlayY: 50,
            overlayWidth: 20,
            designScale: 1,
            designRotation: 0,
            designOffsetX: 0,
            designOffsetY: 0
          },
          {
            id: 'zone-back',
            name: 'Back',
            overlayX: 35,
            overlayY: 50,
            overlayWidth: 20,
            designScale: 1,
            designRotation: 0,
            designOffsetX: 0,
            designOffsetY: 0
          },
          {
            id: 'zone-left-sleeve',
            name: 'Left Sleeve',
            overlayX: 20,
            overlayY: 50,
            overlayWidth: 12,
            designScale: 1,
            designRotation: 0,
            designOffsetX: 0,
            designOffsetY: 0
          },
          {
            id: 'zone-right-sleeve',
            name: 'Right Sleeve',
            overlayX: 80,
            overlayY: 50,
            overlayWidth: 12,
            designScale: 1,
            designRotation: 0,
            designOffsetX: 0,
            designOffsetY: 0
          }
        ];
        break;

      case 'single-center':
        newZones = [
          {
            id: 'zone-center',
            name: 'Center',
            overlayX: 50,
            overlayY: 50,
            overlayWidth: 35,
            designScale: 1,
            designRotation: 0,
            designOffsetX: 0,
            designOffsetY: 0
          }
        ];
        break;

      default:
        return;
    }

    setMockupZones(newZones);
    setCurrentZoneIndex(0);
    setShowTemplates(false);
  };

  // Drag handlers for zone positioning
  const handleZoneMouseDown = (e: React.MouseEvent, zoneIndex: number) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation();

    setCurrentZoneIndex(zoneIndex);
    setIsDraggingZone(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingZone || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const deltaX = e.clientX - dragStartPos.x;
    const deltaY = e.clientY - dragStartPos.y;

    // Convert pixel delta to percentage
    const deltaXPercent = (deltaX / rect.width) * 100;
    const deltaYPercent = (deltaY / rect.height) * 100;

    const currentZone = mockupZones[currentZoneIndex];
    if (currentZone) {
      updateCurrentZone({
        overlayX: Math.max(0, Math.min(100, currentZone.overlayX + deltaXPercent)),
        overlayY: Math.max(0, Math.min(100, currentZone.overlayY + deltaYPercent))
      });
    }

    setDragStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleCanvasMouseUp = () => {
    setIsDraggingZone(false);
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploadingDesign(true);

      try {
        // Upload to Cloudinary
        const uploadResult = await uploadDesignToCloudinary(file);

        if (uploadResult) {
          // Create design with Cloudinary URL
          const newDesign: Design = {
            id: uploadResult.publicId,
            title: file.name.split('.')[0],
            category: 'Uploaded',
            popularity: 0,
            price: 25.00,
            type: 'raster',
            imageUrl: uploadResult.url,
            description: 'Admin uploaded design',
            cloudinaryId: uploadResult.publicId
          };

          setDesigns(prev => [newDesign, ...prev]);
          setSelectedDesign(newDesign);

          // Save to catalog designs (admin uploads)
          const savedCatalogDesigns = JSON.parse(localStorage.getItem('catalogDesigns') || '[]');
          const updatedCatalog = [newDesign, ...savedCatalogDesigns];
          localStorage.setItem('catalogDesigns', JSON.stringify(updatedCatalog));

          // Reset transforms
          setDesignScale(1);
          setDesignRotation(0);
          setDesignX(0);
          setDesignY(0);

          alert('Design uploaded to Cloudinary successfully! ✅');
        } else {
          // Fallback to local upload if Cloudinary fails
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              const resultStr = e.target.result as string;

              const newDesign: Design = {
                id: `upload-${Date.now()}`,
                title: file.name.split('.')[0],
                category: 'Uploaded',
                popularity: 0,
                price: 25.00,
                type: 'raster',
                imageUrl: resultStr,
                description: 'Local uploaded design'
              };

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
          alert('Cloudinary upload failed. Using local storage. ⚠️');
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Upload failed. Please try again.');
      } finally {
        setIsUploadingDesign(false);
        event.target.value = '';
      }
    }
  };

  const handleProductImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploadingMockup(true);

      try {
        // Upload to Cloudinary
        const uploadResult = await uploadMockupToCloudinary(file);

        if (uploadResult) {
          // Create mockup with Cloudinary URL
          const newMockup: Mockup = {
            id: uploadResult.publicId,
            name: file.name.split('.')[0],
            type: 'custom',
            baseImage: uploadResult.url,
            overlayX: 50,
            overlayY: 50,
            overlayWidth: 40,
            cloudinaryId: uploadResult.publicId
          };

          // Save to localStorage
          try {
            const currentSaved = JSON.parse(localStorage.getItem('customMockups') || '[]');
            const updated = [newMockup, ...currentSaved];
            localStorage.setItem('customMockups', JSON.stringify(updated));
          } catch (e) {
            console.error("Storage quota exceeded", e);
          }

          setAllMockups(prev => [newMockup, ...prev]);
          setSelectedMockup(newMockup);

          alert('Mockup uploaded to Cloudinary successfully! ✅');
        } else {
          // Fallback to local upload
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

              try {
                const currentSaved = JSON.parse(localStorage.getItem('customMockups') || '[]');
                const updated = [newMockup, ...currentSaved];
                localStorage.setItem('customMockups', JSON.stringify(updated));
              } catch (e) {
                console.error("Storage quota exceeded", e);
              }

              setAllMockups(prev => [newMockup, ...prev]);
              setSelectedMockup(newMockup);
            }
          };
          reader.readAsDataURL(file);
          alert('Cloudinary upload failed. Using local storage. ⚠️');
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Upload failed. Please try again.');
      } finally {
        setIsUploadingMockup(false);
        event.target.value = '';
      }
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
            <h2 className="font-serif font-bold text-xl text-gray-900 mb-4">{t.studio.library}</h2>
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder={t.studio.searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowAiModal(!showAiModal)}
                className="p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 border border-brand-200 transition-colors"
                title={t.studio.generateAI}
              >
                <Sparkles className="w-5 h-5" />
              </button>
              {/* Upload Design Button - Admin Only */}
              {isAdmin() && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingDesign}
                    className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={t.studio.uploadDesign}
                  >
                    {isUploadingDesign ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,.svg"
                    onChange={handleFileUpload}
                  />
                </>
              )}
            </div>

            {/* AI Prompt Area (Conditional) */}
            {showAiModal && (
              <div className="mb-4 p-3 bg-brand-50 rounded-xl border border-brand-100 animate-in slide-in-from-top-2">
                <textarea
                  className="w-full p-2 text-sm border border-brand-200 rounded-lg mb-2 h-20 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  placeholder={t.studio.aiPromptPlaceholder}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button
                  onClick={handleGenerateDesign}
                  disabled={isGenerating || !prompt}
                  className="w-full py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {t.studio.generate}
                </button>
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {isLoadingDesigns ? (
              <div className="text-center py-12 px-4">
                <Loader2 className="w-16 h-16 mx-auto text-brand-600 mb-4 animate-spin" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Loading designs...</h3>
                <p className="text-sm text-gray-500">Fetching designs from Cloudinary</p>
              </div>
            ) : filteredDesigns.length === 0 ? (
              <div className="text-center py-12 px-4">
                <ImagePlus className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t.studio.noDesigns}</h3>
                <p className="text-sm text-gray-500 mb-4">{t.studio.noDesignsDescription}</p>
                {/* Upload Button - Admin Only */}
                {isAdmin() && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-700"
                  >
                    {t.studio.uploadDesign}
                  </button>
                )}
              </div>
            ) : (
              filteredDesigns.map(design => (
                <div
                  key={design.id}
                  onClick={() => {
                    setSelectedDesign(design);
                    assignDesignToCurrentZone(design);
                  }}
                  className={`cursor-pointer group rounded-xl p-2 border-2 transition-all duration-200 flex items-center gap-3 ${selectedDesign?.id === design.id ? 'border-brand-500 bg-brand-50' : 'border-transparent hover:bg-gray-50 border-gray-100'}`}
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
              ))
            )}
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

          {/* Zone Controls - Top Right */}
          <div className="absolute top-6 right-6 z-20 flex gap-2">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-200 hover:bg-white transition-colors flex items-center gap-2 text-sm font-semibold text-gray-700"
              title="Zone Templates"
            >
              <Sliders className="w-4 h-4" />
              Templates
            </button>
            <button
              onClick={() => setShowZoneBoundaries(!showZoneBoundaries)}
              className={`bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border transition-colors flex items-center gap-2 text-sm font-semibold ${
                showZoneBoundaries
                  ? 'border-brand-500 text-brand-600'
                  : 'border-gray-200 text-gray-700 hover:bg-white'
              }`}
              title="Toggle Zone Boundaries"
            >
              <Eye className="w-4 h-4" />
              {showZoneBoundaries ? 'Hide' : 'Show'} Zones
            </button>
            <button
              onClick={() => setShowZoneManager(!showZoneManager)}
              className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-200 hover:bg-white transition-colors flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
              <Layers className="w-4 h-4" />
              Manage ({mockupZones.length})
            </button>
          </div>

          {/* Zone Templates Dropdown */}
          {showTemplates && (
            <div className="absolute top-20 right-6 z-20 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-72">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                Quick Zone Templates
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => applyZoneTemplate('single-center')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-brand-50 border border-gray-200 hover:border-brand-300 transition-all group"
                >
                  <div className="font-semibold text-gray-900 group-hover:text-brand-600">Single Center</div>
                  <div className="text-xs text-gray-500">One design in the center</div>
                </button>
                <button
                  onClick={() => applyZoneTemplate('front-back')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-brand-50 border border-gray-200 hover:border-brand-300 transition-all group"
                >
                  <div className="font-semibold text-gray-900 group-hover:text-brand-600">Front & Back</div>
                  <div className="text-xs text-gray-500">Perfect for jacket/vest with both sides visible</div>
                </button>
                <button
                  onClick={() => applyZoneTemplate('front-back-sleeves')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-brand-50 border border-gray-200 hover:border-brand-300 transition-all group"
                >
                  <div className="font-semibold text-gray-900 group-hover:text-brand-600">Front, Back & Sleeves</div>
                  <div className="text-xs text-gray-500">4 zones for complete coverage</div>
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  💡 Tip: After applying a template, drag zones to adjust positions
                </p>
              </div>
            </div>
          )}

          {/* Canvas */}
          <div
            className="flex-1 flex items-center justify-center p-8 overflow-hidden relative"
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          >
             <div
               ref={canvasRef}
               className="relative w-[600px] h-[600px]"
               style={{ cursor: isDraggingZone ? 'grabbing' : 'default' }}
             >
                {/* 1. Mockup SVG or Image */}
                <div className="w-full h-full relative z-0 flex items-center justify-center">
                  {renderMockupSVG()}
                </div>

                {/* 2. Zone Boundaries (when enabled and no design) */}
                {showZoneBoundaries && (
                  <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
                    {mockupZones.map((zone, index) => {
                      const zoneDesign = zone.designId ? designs.find(d => d.id === zone.designId) : null;
                      const isCurrentZone = index === currentZoneIndex;

                      // Color coding for zones
                      const zoneColors = [
                        'rgba(59, 130, 246, 0.15)', // Blue
                        'rgba(16, 185, 129, 0.15)', // Green
                        'rgba(245, 158, 11, 0.15)', // Orange
                        'rgba(139, 92, 246, 0.15)', // Purple
                        'rgba(236, 72, 153, 0.15)', // Pink
                      ];
                      const borderColors = [
                        'rgb(59, 130, 246)', // Blue
                        'rgb(16, 185, 129)', // Green
                        'rgb(245, 158, 11)', // Orange
                        'rgb(139, 92, 246)', // Purple
                        'rgb(236, 72, 153)', // Pink
                      ];

                      return (
                        <div
                          key={`boundary-${zone.id}`}
                          className="absolute transition-all duration-200"
                          style={{
                            top: `${zone.overlayY}%`,
                            left: `${zone.overlayX}%`,
                            width: `${zone.overlayWidth}%`,
                            height: `${zone.overlayHeight || zone.overlayWidth}%`,
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: isCurrentZone ? 'rgba(194, 165, 116, 0.2)' : zoneColors[index % zoneColors.length],
                            border: `2px dashed ${isCurrentZone ? '#c4a574' : borderColors[index % borderColors.length]}`,
                            borderRadius: '8px'
                          }}
                        >
                          <div
                            className="absolute -top-6 left-0 text-xs font-bold px-2 py-1 rounded-md shadow-sm"
                            style={{
                              backgroundColor: isCurrentZone ? '#c4a574' : borderColors[index % borderColors.length],
                              color: 'white'
                            }}
                          >
                            {zone.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 3. Design Overlay Layers - Render ALL Zones */}
                <div className="absolute inset-0 z-10 overflow-hidden flex items-center justify-center">
                   {mockupZones.map((zone, index) => {
                     // Find the design for this zone
                     const zoneDesign = zone.designId ? designs.find(d => d.id === zone.designId) : null;
                     if (!zoneDesign) return null;

                     const isCurrentZone = index === currentZoneIndex;

                     return (
                       <div
                         key={zone.id}
                         className={`absolute transition-all duration-75 ease-out border-2 ${
                           isCurrentZone
                             ? 'border-brand-500 border-dashed shadow-lg cursor-grab active:cursor-grabbing'
                             : 'border-transparent hover:border-brand-300 hover:border-dashed cursor-pointer'
                         }`}
                         style={{
                           top: `${zone.overlayY}%`,
                           left: `${zone.overlayX}%`,
                           width: `${zone.overlayWidth}%`,
                           height: `${zone.overlayHeight || zone.overlayWidth}%`,
                           transform: `
                             translate(-50%, -50%)
                             translate(${zone.designOffsetX || 0}px, ${zone.designOffsetY || 0}px)
                             rotate(${zone.designRotation || 0}deg)
                             scale(${zone.designScale || 1})
                           `,
                           mixBlendMode: selectedMockup.type === 'custom' ? 'normal' : (mockupColor === '#111827' ? 'normal' : 'multiply'),
                           opacity: isCurrentZone ? 1 : 0.7,
                           pointerEvents: 'auto'
                         }}
                         onClick={() => setCurrentZoneIndex(index)}
                         onMouseDown={(e) => handleZoneMouseDown(e, index)}
                       >
                         {zoneDesign.type === 'vector' && zoneDesign.svgContent ? (
                           <div
                             dangerouslySetInnerHTML={{__html: zoneDesign.svgContent}}
                             className="w-full h-full pointer-events-none"
                           />
                         ) : (
                           <img
                             src={zoneDesign.imageUrl}
                             alt={zoneDesign.title}
                             className="w-full h-full object-contain pointer-events-none"
                           />
                         )}
                         {/* Zone Label */}
                         {isCurrentZone && (
                           <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-brand-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap font-semibold shadow-lg flex items-center gap-2">
                             <Move className="w-3 h-3" />
                             {zone.name} - Drag to move
                           </div>
                         )}
                       </div>
                     );
                   })}
                </div>
             </div>
          </div>

          {/* Bottom Controls: Positioning */}
          <div className="bg-white border-t border-gray-200 p-4 z-20">
            <div className="max-w-full mx-auto flex flex-col gap-4">

               {/* Quick Tips */}
               {mockupZones.length > 1 && (
                 <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                   <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                   <div className="text-xs text-blue-800">
                     <strong>Pro Tip:</strong> Drag zones directly on the canvas to reposition them! Use "Templates" for quick setup of common layouts like Front & Back.
                   </div>
                 </div>
               )}

               {/* Current Zone Info */}
               {getCurrentZone() && (
                 <div className="flex items-center justify-between px-4 py-2 bg-brand-50 rounded-lg border border-brand-200">
                   <div className="flex items-center gap-3">
                     <Layers className="w-4 h-4 text-brand-600" />
                     <span className="text-sm font-semibold text-gray-700">
                       Editing: <span className="text-brand-600">{getCurrentZone()?.name}</span>
                     </span>
                   </div>
                   <div className="flex items-center gap-2">
                     {mockupZones.map((zone, index) => (
                       <button
                         key={zone.id}
                         onClick={() => setCurrentZoneIndex(index)}
                         className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                           index === currentZoneIndex
                             ? 'bg-brand-600 text-white'
                             : 'bg-white text-gray-600 hover:bg-gray-100'
                         }`}
                       >
                         {zone.name}
                       </button>
                     ))}
                   </div>
                 </div>
               )}

               <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                 {/* Transform Controls */}
                 <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-500 flex items-center gap-1"><Move className="w-3 h-3" /> X Pos</label>
                      <input
                        type="range" min="-100" max="100"
                        value={getCurrentZone()?.designOffsetX || 0}
                        onChange={(e) => updateCurrentZone({ designOffsetX: Number(e.target.value) })}
                        className="accent-brand-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-500 flex items-center gap-1"><Move className="w-3 h-3 rotate-90" /> Y Pos</label>
                      <input
                        type="range" min="-100" max="100"
                        value={getCurrentZone()?.designOffsetY || 0}
                        onChange={(e) => updateCurrentZone({ designOffsetY: Number(e.target.value) })}
                        className="accent-brand-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-500 flex items-center gap-1"><ZoomIn className="w-3 h-3" /> Scale</label>
                      <input
                        type="range" min="0.2" max="2" step="0.1"
                        value={getCurrentZone()?.designScale || 1}
                        onChange={(e) => updateCurrentZone({ designScale: Number(e.target.value) })}
                        className="accent-brand-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-500 flex items-center gap-1"><RotateCw className="w-3 h-3" /> Rotate</label>
                      <input
                        type="range" min="0" max="360"
                        value={getCurrentZone()?.designRotation || 0}
                        onChange={(e) => updateCurrentZone({ designRotation: Number(e.target.value) })}
                        className="accent-brand-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                 </div>

                 {/* Buy Button */}
                 <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-500">Total Price</p>
                      <p className="text-xl font-bold text-gray-900">${((selectedDesign?.price || 0) + 15).toFixed(2)}</p>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 flex items-center gap-2 shadow-lg transform active:scale-95 transition-all"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Mockup Selector */}
        <div className="w-24 bg-white border-l border-gray-200 flex flex-col z-10 shadow-lg items-center py-4 gap-4 overflow-y-auto custom-scrollbar">

           {/* Upload Product Image Button - Admin Only */}
           {isAdmin() && (
             <>
               <button
                 onClick={() => productImageInputRef.current?.click()}
                 disabled={isUploadingMockup}
                 className="w-16 h-16 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50 flex-shrink-0 flex items-center justify-center p-2 transition-all hover:bg-brand-100 hover:border-brand-400 group disabled:opacity-50 disabled:cursor-not-allowed"
                 title="Upload Product Image"
               >
                 {isUploadingMockup ? (
                   <Loader2 className="w-6 h-6 text-brand-600 animate-spin" />
                 ) : (
                   <ImagePlus className="w-6 h-6 text-brand-600" />
                 )}
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
             </>
           )}

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

      {/* Zone Manager Modal */}
      {showZoneManager && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layers className="w-6 h-6 text-brand-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Design Zones</h2>
              </div>
              <button
                onClick={() => setShowZoneManager(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Manage multiple design zones on your product. Each zone can have a different design with independent positioning.
              </p>

              {/* Zone List */}
              {mockupZones.map((zone, index) => {
                const zoneDesign = zone.designId ? designs.find(d => d.id === zone.designId) : null;
                return (
                  <div
                    key={zone.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      index === currentZoneIndex
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="text"
                          value={zone.name}
                          onChange={(e) => {
                            const newZones = [...mockupZones];
                            newZones[index] = { ...newZones[index], name: e.target.value };
                            setMockupZones(newZones);
                          }}
                          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        />
                        {zoneDesign && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            → {zoneDesign.title}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentZoneIndex(index)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                            index === currentZoneIndex
                              ? 'bg-brand-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                          }`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => duplicateZone(index)}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Duplicate Zone"
                        >
                          <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        {mockupZones.length > 1 && (
                          <button
                            onClick={() => removeZone(index)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Remove Zone"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Zone Position Controls */}
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="text-gray-600 dark:text-gray-400 mb-1 block">X Position (%)</label>
                        <input
                          type="number"
                          value={zone.overlayX}
                          onChange={(e) => {
                            const newZones = [...mockupZones];
                            newZones[index] = { ...newZones[index], overlayX: Number(e.target.value) };
                            setMockupZones(newZones);
                          }}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-gray-600 dark:text-gray-400 mb-1 block">Y Position (%)</label>
                        <input
                          type="number"
                          value={zone.overlayY}
                          onChange={(e) => {
                            const newZones = [...mockupZones];
                            newZones[index] = { ...newZones[index], overlayY: Number(e.target.value) };
                            setMockupZones(newZones);
                          }}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-gray-600 dark:text-gray-400 mb-1 block">Width (%)</label>
                        <input
                          type="number"
                          value={zone.overlayWidth}
                          onChange={(e) => {
                            const newZones = [...mockupZones];
                            newZones[index] = { ...newZones[index], overlayWidth: Number(e.target.value) };
                            setMockupZones(newZones);
                          }}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add Zone Button */}
              <button
                onClick={addNewZone}
                className="w-full py-3 border-2 border-dashed border-brand-300 dark:border-brand-700 rounded-xl hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all flex items-center justify-center gap-2 text-brand-600 dark:text-brand-400 font-semibold"
              >
                <Plus className="w-5 h-5" />
                Add New Zone
              </button>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowZoneManager(false)}
                className="px-6 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add to Cart Modal */}
      {showAddToCartModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sélectionner la Taille
            </h3>

            {/* Product Preview */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex gap-4">
                <img
                  src={capturedProductImage || selectedDesign?.imageUrl || ''}
                  alt="Product Preview"
                  className="w-24 h-24 object-contain rounded-lg border border-gray-200"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {selectedDesign?.title || 'Custom Design'}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedMockup?.type.charAt(0).toUpperCase() + selectedMockup?.type.slice(1)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Couleur: {mockupColor}
                  </p>
                  <p className="text-lg font-bold text-brand-600 dark:text-brand-400 mt-1">
                    ${((selectedDesign?.price || 0) + 15).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Taille
              </label>
              <div className="grid grid-cols-5 gap-2">
                {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-lg font-semibold transition-all ${
                      selectedSize === size
                        ? 'bg-brand-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddToCartModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmAddToCart}
                className="flex-1 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors shadow-lg"
              >
                Ajouter au Panier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-24 right-6 z-50 animate-slide-in-right">
          <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 max-w-md">
            <div className="bg-white/20 p-2 rounded-full">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg">Ajouté au panier!</p>
              <p className="text-sm text-green-100">Votre article a été ajouté avec succès</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/cart')}
                className="px-4 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors text-sm"
              >
                Voir le Panier
              </button>
              <button
                onClick={() => setShowSuccessNotification(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignStudio;