import { Design, Mockup, Order, DailyStat, StockItem, OrderItem } from './types';

export const INITIAL_DESIGNS: Design[] = [
  {
    id: '1',
    title: 'Retro Sunset',
    category: 'Vintage',
    popularity: 95,
    price: 25.00,
    description: 'Classic 80s synthwave sunset aesthetic with palm silhouettes.',
    type: 'vector',
    svgContent: `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sun-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFD700" />
          <stop offset="50%" stop-color="#FF8C00" />
          <stop offset="100%" stop-color="#FF0080" />
        </linearGradient>
      </defs>
      <circle cx="250" cy="250" r="150" fill="url(#sun-grad)" />
      <rect x="100" y="260" width="300" height="10" fill="#ffffff" fill-opacity="0.2" />
      <rect x="100" y="280" width="300" height="10" fill="#ffffff" fill-opacity="0.2" />
      <rect x="100" y="300" width="300" height="10" fill="#ffffff" fill-opacity="0.2" />
      <rect x="100" y="320" width="300" height="10" fill="#ffffff" fill-opacity="0.2" />
      <rect x="100" y="340" width="300" height="10" fill="#ffffff" fill-opacity="0.2" />
      <path d="M150 400 L 180 320 L 200 380 L 220 340 L 250 400 Z" fill="#222" />
      <path d="M280 400 L 310 280 L 340 400 Z" fill="#222" />
    </svg>`
  },
  {
    id: '2',
    title: 'Geometric Wolf',
    category: 'Abstract',
    popularity: 88,
    price: 28.00,
    description: 'Low poly geometric wolf head illustration.',
    type: 'vector',
    svgContent: `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <path d="M250 100 L 320 200 L 250 350 L 180 200 Z" fill="#333" />
      <path d="M180 200 L 120 150 L 160 250 L 250 350 Z" fill="#555" />
      <path d="M320 200 L 380 150 L 340 250 L 250 350 Z" fill="#555" />
      <path d="M250 100 L 250 350" stroke="#fff" stroke-width="2" />
      <circle cx="220" cy="220" r="5" fill="#fff" />
      <circle cx="280" cy="220" r="5" fill="#fff" />
    </svg>`
  },
  {
    id: '3',
    title: 'Urban Spray',
    category: 'Streetwear',
    popularity: 92,
    price: 22.50,
    description: 'Graffiti style drip effect.',
    type: 'vector',
    svgContent: `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <path d="M150 200 Q 250 100 350 200 T 400 300" fill="none" stroke="#00ff00" stroke-width="20" stroke-linecap="round" />
      <path d="M180 250 L 180 350" stroke="#00ff00" stroke-width="10" stroke-linecap="round" />
      <path d="M250 220 L 250 380" stroke="#00ff00" stroke-width="12" stroke-linecap="round" />
      <path d="M320 260 L 320 340" stroke="#00ff00" stroke-width="8" stroke-linecap="round" />
      <text x="250" y="300" font-family="sans-serif" font-size="60" font-weight="bold" fill="#000" text-anchor="middle" transform="rotate(-10 250 300)">FRESH</text>
    </svg>`
  },
  {
    id: '4',
    title: 'Minimalist Leaf',
    category: 'Nature',
    popularity: 75,
    price: 20.00,
    description: 'Clean line art of a monstera leaf.',
    type: 'vector',
    svgContent: `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <path d="M250 400 Q 250 100 250 50" stroke="#2E8B57" stroke-width="4" fill="none" />
      <path d="M250 150 Q 350 100 400 200 Q 300 250 250 250" fill="#2E8B57" fill-opacity="0.6" />
      <path d="M250 200 Q 150 150 100 250 Q 200 300 250 300" fill="#2E8B57" fill-opacity="0.6" />
      <path d="M250 280 Q 350 280 380 350 Q 300 380 250 350" fill="#2E8B57" fill-opacity="0.6" />
    </svg>`
  },
];

export const MOCKUPS: Mockup[] = [
  {
    id: 'm1',
    name: 'Classic Cotton Tee',
    type: 't-shirt',
    overlayX: 50,
    overlayY: 42,
    overlayWidth: 35,
    zones: [
      {
        id: 'zone-front',
        name: 'Front',
        overlayX: 50,
        overlayY: 42,
        overlayWidth: 35,
        designScale: 1,
        designRotation: 0,
        designOffsetX: 0,
        designOffsetY: 0
      },
      {
        id: 'zone-back',
        name: 'Back',
        overlayX: 50,
        overlayY: 42,
        overlayWidth: 35,
        designScale: 1,
        designRotation: 0,
        designOffsetX: 0,
        designOffsetY: 0
      }
    ]
  },
  {
    id: 'm2',
    name: 'Premium Heavy Hoodie',
    type: 'hoodie',
    overlayX: 50,
    overlayY: 45,
    overlayWidth: 30,
    zones: [
      {
        id: 'zone-front',
        name: 'Front',
        overlayX: 50,
        overlayY: 45,
        overlayWidth: 30,
        designScale: 1,
        designRotation: 0,
        designOffsetX: 0,
        designOffsetY: 0
      },
      {
        id: 'zone-back',
        name: 'Back',
        overlayX: 50,
        overlayY: 45,
        overlayWidth: 30,
        designScale: 1,
        designRotation: 0,
        designOffsetX: 0,
        designOffsetY: 0
      },
      {
        id: 'zone-hood',
        name: 'Hood',
        overlayX: 50,
        overlayY: 25,
        overlayWidth: 20,
        designScale: 1,
        designRotation: 0,
        designOffsetX: 0,
        designOffsetY: 0
      }
    ]
  },
  {
    id: 'm3',
    name: 'Cozy Knit Sweater',
    type: 'sweater',
    overlayX: 50,
    overlayY: 45,
    overlayWidth: 32,
    zones: [
      {
        id: 'zone-front',
        name: 'Front',
        overlayX: 50,
        overlayY: 45,
        overlayWidth: 32,
        designScale: 1,
        designRotation: 0,
        designOffsetX: 0,
        designOffsetY: 0
      },
      {
        id: 'zone-back',
        name: 'Back',
        overlayX: 50,
        overlayY: 45,
        overlayWidth: 32,
        designScale: 1,
        designRotation: 0,
        designOffsetX: 0,
        designOffsetY: 0
      }
    ]
  },
  {
    id: 'm4',
    name: 'Streetwear Cap',
    type: 'cap',
    overlayX: 50,
    overlayY: 35,
    overlayWidth: 25,
    zones: [
      {
        id: 'zone-front',
        name: 'Front',
        overlayX: 50,
        overlayY: 35,
        overlayWidth: 25,
        designScale: 1,
        designRotation: 0,
        designOffsetX: 0,
        designOffsetY: 0
      }
    ]
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customer: 'Alice Freeman',
    email: 'alice.freeman@email.com',
    total: 54.00,
    status: 'Processing',
    date: '2024-11-20',
    items: 2,
    shippingAddress: '123 Main St, New York, NY 10001',
    trackingNumber: 'TRK-1234567890',
    paymentMethod: 'Credit Card',
    orderItems: [
      { id: 'item-1', designId: '1', designTitle: 'Retro Sunset', mockupType: 't-shirt', quantity: 1, size: 'M', color: 'White', price: 25.00 },
      { id: 'item-2', designId: '2', designTitle: 'Geometric Wolf', mockupType: 'hoodie', quantity: 1, size: 'L', color: 'Black', price: 29.00 }
    ]
  },
  {
    id: 'ORD-002',
    customer: 'Bob Smith',
    email: 'bob.smith@email.com',
    total: 25.00,
    status: 'Shipped',
    date: '2024-11-19',
    items: 1,
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
    trackingNumber: 'TRK-0987654321',
    paymentMethod: 'PayPal',
    orderItems: [
      { id: 'item-3', designId: '3', designTitle: 'Urban Spray', mockupType: 't-shirt', quantity: 1, size: 'L', color: 'Gray', price: 25.00 }
    ]
  },
  {
    id: 'ORD-003',
    customer: 'Charlie Davis',
    email: 'charlie.davis@email.com',
    total: 120.50,
    status: 'Delivered',
    date: '2024-11-15',
    items: 4,
    shippingAddress: '789 Pine Rd, Chicago, IL 60601',
    trackingNumber: 'TRK-5555666677',
    paymentMethod: 'Credit Card',
    orderItems: [
      { id: 'item-4', designId: '1', designTitle: 'Retro Sunset', mockupType: 't-shirt', quantity: 2, size: 'M', color: 'White', price: 50.00 },
      { id: 'item-5', designId: '4', designTitle: 'Minimalist Leaf', mockupType: 'sweater', quantity: 1, size: 'XL', color: 'Green', price: 35.00 },
      { id: 'item-6', designId: '2', designTitle: 'Geometric Wolf', mockupType: 'cap', quantity: 1, size: 'One Size', color: 'Black', price: 35.50 }
    ]
  },
  {
    id: 'ORD-004',
    customer: 'Diana Prince',
    email: 'diana.prince@email.com',
    total: 45.00,
    status: 'Pending',
    date: '2024-11-22',
    items: 1,
    shippingAddress: '321 Elm St, Miami, FL 33101',
    paymentMethod: 'Credit Card',
    orderItems: [
      { id: 'item-7', designId: '3', designTitle: 'Urban Spray', mockupType: 'hoodie', quantity: 1, size: 'M', color: 'Black', price: 45.00 }
    ]
  },
  {
    id: 'ORD-005',
    customer: 'Eve Martinez',
    email: 'eve.martinez@email.com',
    total: 78.00,
    status: 'Processing',
    date: '2024-11-21',
    items: 3,
    shippingAddress: '555 Maple Dr, Seattle, WA 98101',
    trackingNumber: 'TRK-9999888877',
    paymentMethod: 'PayPal',
    orderItems: [
      { id: 'item-8', designId: '1', designTitle: 'Retro Sunset', mockupType: 't-shirt', quantity: 1, size: 'S', color: 'White', price: 25.00 },
      { id: 'item-9', designId: '2', designTitle: 'Geometric Wolf', mockupType: 't-shirt', quantity: 1, size: 'M', color: 'Gray', price: 28.00 },
      { id: 'item-10', designId: '4', designTitle: 'Minimalist Leaf', mockupType: 't-shirt', quantity: 1, size: 'L', color: 'White', price: 25.00 }
    ]
  },
];

export const STOCK_ITEMS: StockItem[] = [
  // T-Shirts
  { id: 'stock-1', productType: 't-shirt', size: 'S', color: 'White', quantity: 150, reorderLevel: 50, supplier: 'Cotton Co.', lastRestocked: '2024-11-15' },
  { id: 'stock-2', productType: 't-shirt', size: 'M', color: 'White', quantity: 200, reorderLevel: 50, supplier: 'Cotton Co.', lastRestocked: '2024-11-15' },
  { id: 'stock-3', productType: 't-shirt', size: 'L', color: 'White', quantity: 180, reorderLevel: 50, supplier: 'Cotton Co.', lastRestocked: '2024-11-15' },
  { id: 'stock-4', productType: 't-shirt', size: 'XL', color: 'White', quantity: 120, reorderLevel: 40, supplier: 'Cotton Co.', lastRestocked: '2024-11-15' },
  { id: 'stock-5', productType: 't-shirt', size: 'S', color: 'Black', quantity: 140, reorderLevel: 50, supplier: 'Cotton Co.', lastRestocked: '2024-11-10' },
  { id: 'stock-6', productType: 't-shirt', size: 'M', color: 'Black', quantity: 190, reorderLevel: 50, supplier: 'Cotton Co.', lastRestocked: '2024-11-10' },
  { id: 'stock-7', productType: 't-shirt', size: 'L', color: 'Black', quantity: 35, reorderLevel: 50, supplier: 'Cotton Co.', lastRestocked: '2024-11-10' },
  { id: 'stock-8', productType: 't-shirt', size: 'XL', color: 'Black', quantity: 110, reorderLevel: 40, supplier: 'Cotton Co.', lastRestocked: '2024-11-10' },
  { id: 'stock-9', productType: 't-shirt', size: 'M', color: 'Gray', quantity: 25, reorderLevel: 50, supplier: 'Cotton Co.', lastRestocked: '2024-11-05' },
  { id: 'stock-10', productType: 't-shirt', size: 'L', color: 'Gray', quantity: 160, reorderLevel: 50, supplier: 'Cotton Co.', lastRestocked: '2024-11-05' },

  // Hoodies
  { id: 'stock-11', productType: 'hoodie', size: 'S', color: 'Black', quantity: 80, reorderLevel: 30, supplier: 'Fleece Factory', lastRestocked: '2024-11-12' },
  { id: 'stock-12', productType: 'hoodie', size: 'M', color: 'Black', quantity: 95, reorderLevel: 30, supplier: 'Fleece Factory', lastRestocked: '2024-11-12' },
  { id: 'stock-13', productType: 'hoodie', size: 'L', color: 'Black', quantity: 88, reorderLevel: 30, supplier: 'Fleece Factory', lastRestocked: '2024-11-12' },
  { id: 'stock-14', productType: 'hoodie', size: 'XL', color: 'Black', quantity: 70, reorderLevel: 25, supplier: 'Fleece Factory', lastRestocked: '2024-11-12' },
  { id: 'stock-15', productType: 'hoodie', size: 'M', color: 'Gray', quantity: 15, reorderLevel: 30, supplier: 'Fleece Factory', lastRestocked: '2024-11-08' },
  { id: 'stock-16', productType: 'hoodie', size: 'L', color: 'Gray', quantity: 75, reorderLevel: 30, supplier: 'Fleece Factory', lastRestocked: '2024-11-08' },

  // Sweaters
  { id: 'stock-17', productType: 'sweater', size: 'S', color: 'White', quantity: 60, reorderLevel: 20, supplier: 'Knit Masters', lastRestocked: '2024-11-18' },
  { id: 'stock-18', productType: 'sweater', size: 'M', color: 'White', quantity: 72, reorderLevel: 20, supplier: 'Knit Masters', lastRestocked: '2024-11-18' },
  { id: 'stock-19', productType: 'sweater', size: 'L', color: 'White', quantity: 65, reorderLevel: 20, supplier: 'Knit Masters', lastRestocked: '2024-11-18' },
  { id: 'stock-20', productType: 'sweater', size: 'XL', color: 'Green', quantity: 45, reorderLevel: 15, supplier: 'Knit Masters', lastRestocked: '2024-11-14' },

  // Caps
  { id: 'stock-21', productType: 'cap', size: 'One Size', color: 'Black', quantity: 120, reorderLevel: 40, supplier: 'Cap World', lastRestocked: '2024-11-16' },
  { id: 'stock-22', productType: 'cap', size: 'One Size', color: 'White', quantity: 95, reorderLevel: 40, supplier: 'Cap World', lastRestocked: '2024-11-16' },
  { id: 'stock-23', productType: 'cap', size: 'One Size', color: 'Navy', quantity: 88, reorderLevel: 40, supplier: 'Cap World', lastRestocked: '2024-11-16' },
];

export const STATS_DATA: DailyStat[] = [
  { name: 'Mon', sales: 400, visitors: 2400 },
  { name: 'Tue', sales: 300, visitors: 1398 },
  { name: 'Wed', sales: 200, visitors: 9800 },
  { name: 'Thu', sales: 278, visitors: 3908 },
  { name: 'Fri', sales: 189, visitors: 4800 },
  { name: 'Sat', sales: 239, visitors: 3800 },
  { name: 'Sun', sales: 349, visitors: 4300 },
];