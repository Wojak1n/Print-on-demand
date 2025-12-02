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
  featured?: boolean; // Mark as featured/promotional
  featuredMockup?: string; // Full product mockup image for featured section
  featuredTag?: string; // e.g., "Staff Pick", "Trending", "New Arrival", "Limited Edition"
  cloudinaryId?: string; // Cloudinary public_id for uploaded images
}

export interface DesignZone {
  id: string;
  name: string; // e.g., "Front", "Back", "Left Sleeve", "Right Sleeve"
  overlayX: number; // X position %
  overlayY: number; // Y position %
  overlayWidth: number; // Width %
  overlayHeight?: number; // Height % (optional, defaults to width for square)
  designId?: string; // Which design is placed in this zone
  designScale?: number; // Scale for this zone
  designRotation?: number; // Rotation for this zone
  designOffsetX?: number; // Fine-tune X offset
  designOffsetY?: number; // Fine-tune Y offset
}

export interface Mockup {
  id: string;
  name: string;
  type: 'jacket' | 'pants' | 'custom';
  baseImage?: string; // URL for custom uploaded mockups
  overlayX: number; // Default X position % (for backward compatibility)
  overlayY: number; // Default Y position % (for backward compatibility)
  overlayWidth: number; // Default width % (for backward compatibility)
  zones?: DesignZone[]; // Multiple design zones for this mockup
  cloudinaryId?: string; // Cloudinary public_id for uploaded mockups
  price?: number; // Price for this mockup
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
  productType: 'jacket' | 'pants';
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