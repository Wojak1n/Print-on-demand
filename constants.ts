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
    name: 'Pantalon Classique',
    type: 'pants',
    overlayX: 50,
    overlayY: 55,
    overlayWidth: 20,
    zones: [
      {
        id: 'zone-front-left',
        name: 'Front Left Leg',
        overlayX: 45,
        overlayY: 55,
        overlayWidth: 15,
        designScale: 1,
        designRotation: 0,
        designOffsetX: 0,
        designOffsetY: 0
      },
      {
        id: 'zone-front-right',
        name: 'Front Right Leg',
        overlayX: 55,
        overlayY: 55,
        overlayWidth: 15,
        designScale: 1,
        designRotation: 0,
        designOffsetX: 0,
        designOffsetY: 0
      },
      {
        id: 'zone-back',
        name: 'Back Pocket',
        overlayX: 50,
        overlayY: 45,
        overlayWidth: 12,
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
  // Vestes (Jackets) - Black
  { id: 'stock-1', productType: 'jacket', size: 'XS', color: 'Black', quantity: 45, reorderLevel: 15, supplier: 'Atlas Apparel', lastRestocked: '2024-11-25' },
  { id: 'stock-2', productType: 'jacket', size: 'S', color: 'Black', quantity: 68, reorderLevel: 20, supplier: 'Atlas Apparel', lastRestocked: '2024-11-25' },
  { id: 'stock-3', productType: 'jacket', size: 'M', color: 'Black', quantity: 85, reorderLevel: 25, supplier: 'Atlas Apparel', lastRestocked: '2024-11-25' },
  { id: 'stock-4', productType: 'jacket', size: 'L', color: 'Black', quantity: 72, reorderLevel: 25, supplier: 'Atlas Apparel', lastRestocked: '2024-11-25' },
  { id: 'stock-5', productType: 'jacket', size: 'XL', color: 'Black', quantity: 52, reorderLevel: 20, supplier: 'Atlas Apparel', lastRestocked: '2024-11-25' },
  { id: 'stock-6', productType: 'jacket', size: 'XXL', color: 'Black', quantity: 38, reorderLevel: 15, supplier: 'Atlas Apparel', lastRestocked: '2024-11-25' },

  // Vestes (Jackets) - Navy
  { id: 'stock-7', productType: 'jacket', size: 'XS', color: 'Navy', quantity: 42, reorderLevel: 15, supplier: 'Atlas Apparel', lastRestocked: '2024-11-20' },
  { id: 'stock-8', productType: 'jacket', size: 'S', color: 'Navy', quantity: 58, reorderLevel: 20, supplier: 'Atlas Apparel', lastRestocked: '2024-11-20' },
  { id: 'stock-9', productType: 'jacket', size: 'M', color: 'Navy', quantity: 75, reorderLevel: 25, supplier: 'Atlas Apparel', lastRestocked: '2024-11-20' },
  { id: 'stock-10', productType: 'jacket', size: 'L', color: 'Navy', quantity: 18, reorderLevel: 25, supplier: 'Atlas Apparel', lastRestocked: '2024-11-20' },
  { id: 'stock-11', productType: 'jacket', size: 'XL', color: 'Navy', quantity: 48, reorderLevel: 20, supplier: 'Atlas Apparel', lastRestocked: '2024-11-20' },
  { id: 'stock-12', productType: 'jacket', size: 'XXL', color: 'Navy', quantity: 32, reorderLevel: 15, supplier: 'Atlas Apparel', lastRestocked: '2024-11-20' },

  // Vestes (Jackets) - Gray
  { id: 'stock-13', productType: 'jacket', size: 'S', color: 'Gray', quantity: 52, reorderLevel: 20, supplier: 'Atlas Apparel', lastRestocked: '2024-11-18' },
  { id: 'stock-14', productType: 'jacket', size: 'M', color: 'Gray', quantity: 68, reorderLevel: 25, supplier: 'Atlas Apparel', lastRestocked: '2024-11-18' },
  { id: 'stock-15', productType: 'jacket', size: 'L', color: 'Gray', quantity: 62, reorderLevel: 25, supplier: 'Atlas Apparel', lastRestocked: '2024-11-18' },
  { id: 'stock-16', productType: 'jacket', size: 'XL', color: 'Gray', quantity: 45, reorderLevel: 20, supplier: 'Atlas Apparel', lastRestocked: '2024-11-18' },

  // Pantalons (Pants) - Black
  { id: 'stock-17', productType: 'pants', size: 'XS', color: 'Black', quantity: 55, reorderLevel: 20, supplier: 'Textile Maroc', lastRestocked: '2024-11-22' },
  { id: 'stock-18', productType: 'pants', size: 'S', color: 'Black', quantity: 78, reorderLevel: 25, supplier: 'Textile Maroc', lastRestocked: '2024-11-22' },
  { id: 'stock-19', productType: 'pants', size: 'M', color: 'Black', quantity: 95, reorderLevel: 30, supplier: 'Textile Maroc', lastRestocked: '2024-11-22' },
  { id: 'stock-20', productType: 'pants', size: 'L', color: 'Black', quantity: 88, reorderLevel: 30, supplier: 'Textile Maroc', lastRestocked: '2024-11-22' },
  { id: 'stock-21', productType: 'pants', size: 'XL', color: 'Black', quantity: 65, reorderLevel: 25, supplier: 'Textile Maroc', lastRestocked: '2024-11-22' },
  { id: 'stock-22', productType: 'pants', size: 'XXL', color: 'Black', quantity: 48, reorderLevel: 20, supplier: 'Textile Maroc', lastRestocked: '2024-11-22' },

  // Pantalons (Pants) - Navy
  { id: 'stock-23', productType: 'pants', size: 'XS', color: 'Navy', quantity: 48, reorderLevel: 20, supplier: 'Textile Maroc', lastRestocked: '2024-11-15' },
  { id: 'stock-24', productType: 'pants', size: 'S', color: 'Navy', quantity: 68, reorderLevel: 25, supplier: 'Textile Maroc', lastRestocked: '2024-11-15' },
  { id: 'stock-25', productType: 'pants', size: 'M', color: 'Navy', quantity: 12, reorderLevel: 30, supplier: 'Textile Maroc', lastRestocked: '2024-11-15' },
  { id: 'stock-26', productType: 'pants', size: 'L', color: 'Navy', quantity: 75, reorderLevel: 30, supplier: 'Textile Maroc', lastRestocked: '2024-11-15' },
  { id: 'stock-27', productType: 'pants', size: 'XL', color: 'Navy', quantity: 58, reorderLevel: 25, supplier: 'Textile Maroc', lastRestocked: '2024-11-15' },
  { id: 'stock-28', productType: 'pants', size: 'XXL', color: 'Navy', quantity: 42, reorderLevel: 20, supplier: 'Textile Maroc', lastRestocked: '2024-11-15' },

  // Pantalons (Pants) - Khaki
  { id: 'stock-29', productType: 'pants', size: 'S', color: 'Khaki', quantity: 52, reorderLevel: 20, supplier: 'Textile Maroc', lastRestocked: '2024-11-10' },
  { id: 'stock-30', productType: 'pants', size: 'M', color: 'Khaki', quantity: 68, reorderLevel: 25, supplier: 'Textile Maroc', lastRestocked: '2024-11-10' },
  { id: 'stock-31', productType: 'pants', size: 'L', color: 'Khaki', quantity: 62, reorderLevel: 25, supplier: 'Textile Maroc', lastRestocked: '2024-11-10' },
  { id: 'stock-32', productType: 'pants', size: 'XL', color: 'Khaki', quantity: 45, reorderLevel: 20, supplier: 'Textile Maroc', lastRestocked: '2024-11-10' },
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