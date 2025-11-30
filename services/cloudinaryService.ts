// Cloudinary API Service to fetch images from folders

const CLOUD_NAME = 'dwm9hk3qg';
const API_KEY = '544387832215932';

interface CloudinaryResource {
  public_id: string;
  format: string;
  width: number;
  height: number;
  url: string;
  secure_url: string;
  created_at: string;
}

interface CloudinaryResponse {
  resources: CloudinaryResource[];
  next_cursor?: string;
}

/**
 * Fetch all images from a specific Cloudinary folder
 * @param folderPath - The folder path in Cloudinary (e.g., 'designs', 'mockups/tshirts')
 * @returns Array of image resources
 */
export const fetchImagesFromFolder = async (folderPath: string): Promise<CloudinaryResource[]> => {
  try {
    // Note: This requires the Cloudinary Admin API which needs server-side implementation
    // For client-side, you'll need to manually list the public IDs or use a backend
    
    // For now, we'll return a manual list based on folder structure
    // In production, you'd want to implement this on a backend server
    
    console.warn('Client-side Cloudinary folder fetching requires backend implementation');
    return [];
  } catch (error) {
    console.error('Error fetching images from Cloudinary:', error);
    return [];
  }
};

/**
 * Generate Cloudinary URL for an image
 * @param publicId - The public ID of the image (can include folder path)
 * @param transformations - Optional transformations (width, height, quality, etc.)
 */
export const getCloudinaryUrl = (
  publicId: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
    crop?: string;
  }
): string => {
  const baseUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
  
  if (!transformations) {
    return `${baseUrl}/${publicId}`;
  }

  const transforms: string[] = [];
  
  if (transformations.width) transforms.push(`w_${transformations.width}`);
  if (transformations.height) transforms.push(`h_${transformations.height}`);
  if (transformations.quality) transforms.push(`q_${transformations.quality}`);
  if (transformations.format) transforms.push(`f_${transformations.format}`);
  if (transformations.crop) transforms.push(`c_${transformations.crop}`);
  
  const transformString = transforms.join(',');
  
  return `${baseUrl}/${transformString}/${publicId}`;
};

/**
 * Manually defined list of designs from Cloudinary folders
 * Update this list when you add new images to Cloudinary
 */
export const CLOUDINARY_DESIGNS = {
  featured: [
    {
      publicId: 'featured/design-1',
      title: 'Sunset Vibes',
      category: 'Nature',
      price: 29.99,
    },
    {
      publicId: 'featured/design-2',
      title: 'Urban Street',
      category: 'Streetwear',
      price: 34.99,
    },
    {
      publicId: 'featured/design-3',
      title: 'Minimalist Wave',
      category: 'Minimal',
      price: 27.99,
    },
  ],
  mockups: [
    {
      publicId: 'mockups/tshirt-black',
      name: 'Black T-Shirt',
    },
    {
      publicId: 'mockups/tshirt-white',
      name: 'White T-Shirt',
    },
    {
      publicId: 'mockups/hoodie-black',
      name: 'Black Hoodie',
    },
  ],
};

/**
 * Get all featured designs with Cloudinary URLs
 */
export const getFeaturedDesigns = () => {
  return CLOUDINARY_DESIGNS.featured.map(design => ({
    ...design,
    imageUrl: getCloudinaryUrl(design.publicId, {
      width: 800,
      quality: 'auto',
      format: 'auto',
    }),
    thumbnailUrl: getCloudinaryUrl(design.publicId, {
      width: 400,
      quality: 'auto',
      format: 'auto',
    }),
  }));
};

/**
 * Get all mockups with Cloudinary URLs
 */
export const getMockups = () => {
  return CLOUDINARY_DESIGNS.mockups.map(mockup => ({
    ...mockup,
    imageUrl: getCloudinaryUrl(mockup.publicId, {
      width: 1200,
      quality: 'auto',
      format: 'auto',
    }),
  }));
};

