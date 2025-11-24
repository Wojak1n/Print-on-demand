export interface Design {
  id: string;
  title: string;
  imageUrl?: string; // Optional if svgContent is present
  svgContent?: string; // For AI generated vectors
  category: string;
  popularity: number; // 0-100
  price: number;
  description?: string;
  type?: 'raster' | 'vector';
}

export interface Mockup {
  id: string;
  name: string;
  type: 't-shirt' | 'hoodie' | 'cap' | 'sweater' | 'custom';
  baseImage?: string; // URL for custom uploaded mockups
  overlayX: number; // Default X position %
  overlayY: number; // Default Y position %
  overlayWidth: number; // Default width %
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  items: number;
  orderItems?: OrderItem[];
  shippingAddress?: string;
  trackingNumber?: string;
  paymentMethod?: string;
}

export interface OrderItem {
  id: string;
  designId: string;
  designTitle: string;
  mockupType: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export interface StockItem {
  id: string;
  productType: 't-shirt' | 'hoodie' | 'sweater' | 'cap';
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'One Size';
  color: string;
  quantity: number;
  reorderLevel: number;
  supplier?: string;
  lastRestocked?: string;
}

export interface DailyStat {
  name: string;
  sales: number;
  visitors: number;
}