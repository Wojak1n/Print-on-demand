import { Design, Mockup, Order, DailyStat, StockItem, OrderItem } from './types';
import { getCloudinaryUrl } from './config/cloudinary';

// Featured Designs - Only shown on Homepage "Handpicked for You" section
export const FEATURED_DESIGNS: Design[] = [
  {
    id: 'featured-demo-1',
    title: 'Sunset Vibes',
    imageUrl: getCloudinaryUrl('featued-1_ajkopf', 800),
    category: 'Nature',
    popularity: 95,
    price: 29.99,
    description: 'A beautiful sunset design perfect for summer vibes',
    featured: true,
    featuredTag: 'Staff Pick',
    featuredMockup: getCloudinaryUrl('featued-1_ajkopf', 800)
  },
  {
    id: 'featured-demo-2',
    title: 'Urban Street',
    imageUrl: getCloudinaryUrl('featured-2_bdxzwl', 800),
    category: 'Streetwear',
    popularity: 88,
    price: 34.99,
    description: 'Bold urban design for the modern street style',
    featured: true,
    featuredTag: 'Trending',
    featuredMockup: getCloudinaryUrl('featured-2_bdxzwl', 800)
  },
  {
    id: 'featured-demo-3',
    title: 'Minimalist Wave',
    imageUrl: getCloudinaryUrl('featued-3_hutv5n', 800),
    category: 'Minimal',
    popularity: 92,
    price: 27.99,
    description: 'Clean and simple wave design for minimalist lovers',
    featured: true,
    featuredTag: 'New Arrival',
    featuredMockup: getCloudinaryUrl('featued-3_hutv5n', 800)
  }
];

// Regular Designs - Shown in Design Studio (from 'designs' folder)
// Add your designs from Cloudinary 'designs' folder here
export const INITIAL_DESIGNS: Design[] = [
  // Add designs from your 'designs' Cloudinary folder here
  // Example:
  // {
  //   id: 'design-1',
  //   title: 'Cool Design',
  //   imageUrl: getCloudinaryUrl('designs/cool-design_abc123', 800),
  //   category: 'Custom',
  //   popularity: 80,
  //   price: 24.99,
  //   description: 'A cool custom design',
  //   featured: false
  // }
];

export const MOCKUPS: Mockup[] = [
  {
    id: 'm1',
    name: 'Veste Brodée',
    type: 'jacket',
    baseImage: 'https://res.cloudinary.com/dwm9hk3qg/image/upload/v1764411289/mockups/MOCK-1.png',
    cloudinaryId: 'mockups/MOCK-1',
    overlayX: 50,
    overlayY: 45,
    overlayWidth: 25,
    zones: [
      {
        id: 'zone-front',
        name: 'Front',
        overlayX: 50,
        overlayY: 45,
        overlayWidth: 25,
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
        overlayWidth: 25,
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
  // T-Shirts - White
  { id: 'stock-1', productType: 't-shirt', size: 'XS', color: 'White', quantity: 85, reorderLevel: 30, supplier: 'Textile Maroc', lastRestocked: '2024-11-25' },
  { id: 'stock-2', productType: 't-shirt', size: 'S', color: 'White', quantity: 120, reorderLevel: 40, supplier: 'Textile Maroc', lastRestocked: '2024-11-25' },
  { id: 'stock-3', productType: 't-shirt', size: 'M', color: 'White', quantity: 150, reorderLevel: 50, supplier: 'Textile Maroc', lastRestocked: '2024-11-25' },
  { id: 'stock-4', productType: 't-shirt', size: 'L', color: 'White', quantity: 140, reorderLevel: 50, supplier: 'Textile Maroc', lastRestocked: '2024-11-25' },
  { id: 'stock-5', productType: 't-shirt', size: 'XL', color: 'White', quantity: 95, reorderLevel: 35, supplier: 'Textile Maroc', lastRestocked: '2024-11-25' },

  // T-Shirts - Black
  { id: 'stock-6', productType: 't-shirt', size: 'XS', color: 'Black', quantity: 75, reorderLevel: 30, supplier: 'Textile Maroc', lastRestocked: '2024-11-20' },
  { id: 'stock-7', productType: 't-shirt', size: 'S', color: 'Black', quantity: 110, reorderLevel: 40, supplier: 'Textile Maroc', lastRestocked: '2024-11-20' },
  { id: 'stock-8', productType: 't-shirt', size: 'M', color: 'Black', quantity: 145, reorderLevel: 50, supplier: 'Textile Maroc', lastRestocked: '2024-11-20' },
  { id: 'stock-9', productType: 't-shirt', size: 'L', color: 'Black', quantity: 28, reorderLevel: 50, supplier: 'Textile Maroc', lastRestocked: '2024-11-20' },
  { id: 'stock-10', productType: 't-shirt', size: 'XL', color: 'Black', quantity: 88, reorderLevel: 35, supplier: 'Textile Maroc', lastRestocked: '2024-11-20' },

  // T-Shirts - Navy
  { id: 'stock-11', productType: 't-shirt', size: 'S', color: 'Navy', quantity: 65, reorderLevel: 30, supplier: 'Textile Maroc', lastRestocked: '2024-11-18' },
  { id: 'stock-12', productType: 't-shirt', size: 'M', color: 'Navy', quantity: 92, reorderLevel: 40, supplier: 'Textile Maroc', lastRestocked: '2024-11-18' },
  { id: 'stock-13', productType: 't-shirt', size: 'L', color: 'Navy', quantity: 78, reorderLevel: 40, supplier: 'Textile Maroc', lastRestocked: '2024-11-18' },
  { id: 'stock-14', productType: 't-shirt', size: 'XL', color: 'Navy', quantity: 55, reorderLevel: 30, supplier: 'Textile Maroc', lastRestocked: '2024-11-18' },

  // Hoodies - Black
  { id: 'stock-15', productType: 'hoodie', size: 'S', color: 'Black', quantity: 45, reorderLevel: 20, supplier: 'Atlas Apparel', lastRestocked: '2024-11-22' },
  { id: 'stock-16', productType: 'hoodie', size: 'M', color: 'Black', quantity: 68, reorderLevel: 25, supplier: 'Atlas Apparel', lastRestocked: '2024-11-22' },
  { id: 'stock-17', productType: 'hoodie', size: 'L', color: 'Black', quantity: 72, reorderLevel: 25, supplier: 'Atlas Apparel', lastRestocked: '2024-11-22' },
  { id: 'stock-18', productType: 'hoodie', size: 'XL', color: 'Black', quantity: 52, reorderLevel: 20, supplier: 'Atlas Apparel', lastRestocked: '2024-11-22' },

  // Hoodies - Gray
  { id: 'stock-19', productType: 'hoodie', size: 'S', color: 'Gray', quantity: 38, reorderLevel: 20, supplier: 'Atlas Apparel', lastRestocked: '2024-11-15' },
  { id: 'stock-20', productType: 'hoodie', size: 'M', color: 'Gray', quantity: 15, reorderLevel: 25, supplier: 'Atlas Apparel', lastRestocked: '2024-11-15' },
  { id: 'stock-21', productType: 'hoodie', size: 'L', color: 'Gray', quantity: 58, reorderLevel: 25, supplier: 'Atlas Apparel', lastRestocked: '2024-11-15' },
  { id: 'stock-22', productType: 'hoodie', size: 'XL', color: 'Gray', quantity: 42, reorderLevel: 20, supplier: 'Atlas Apparel', lastRestocked: '2024-11-15' },

  // Sweaters - Navy
  { id: 'stock-23', productType: 'sweater', size: 'S', color: 'Navy', quantity: 32, reorderLevel: 15, supplier: 'Casablanca Knits', lastRestocked: '2024-11-10' },
  { id: 'stock-24', productType: 'sweater', size: 'M', color: 'Navy', quantity: 48, reorderLevel: 20, supplier: 'Casablanca Knits', lastRestocked: '2024-11-10' },
  { id: 'stock-25', productType: 'sweater', size: 'L', color: 'Navy', quantity: 44, reorderLevel: 20, supplier: 'Casablanca Knits', lastRestocked: '2024-11-10' },
  { id: 'stock-26', productType: 'sweater', size: 'XL', color: 'Navy', quantity: 35, reorderLevel: 15, supplier: 'Casablanca Knits', lastRestocked: '2024-11-10' },

  // Sweaters - Burgundy
  { id: 'stock-27', productType: 'sweater', size: 'S', color: 'Burgundy', quantity: 28, reorderLevel: 15, supplier: 'Casablanca Knits', lastRestocked: '2024-11-08' },
  { id: 'stock-28', productType: 'sweater', size: 'M', color: 'Burgundy', quantity: 12, reorderLevel: 20, supplier: 'Casablanca Knits', lastRestocked: '2024-11-08' },
  { id: 'stock-29', productType: 'sweater', size: 'L', color: 'Burgundy', quantity: 38, reorderLevel: 20, supplier: 'Casablanca Knits', lastRestocked: '2024-11-08' },
  { id: 'stock-30', productType: 'sweater', size: 'XL', color: 'Burgundy', quantity: 30, reorderLevel: 15, supplier: 'Casablanca Knits', lastRestocked: '2024-11-08' },

  // Caps
  { id: 'stock-31', productType: 'cap', size: 'One Size', color: 'Black', quantity: 95, reorderLevel: 30, supplier: 'Marrakech Caps', lastRestocked: '2024-11-28' },
  { id: 'stock-32', productType: 'cap', size: 'One Size', color: 'White', quantity: 78, reorderLevel: 30, supplier: 'Marrakech Caps', lastRestocked: '2024-11-28' },
  { id: 'stock-33', productType: 'cap', size: 'One Size', color: 'Navy', quantity: 68, reorderLevel: 30, supplier: 'Marrakech Caps', lastRestocked: '2024-11-28' },
  { id: 'stock-34', productType: 'cap', size: 'One Size', color: 'Beige', quantity: 52, reorderLevel: 25, supplier: 'Marrakech Caps', lastRestocked: '2024-11-28' },
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