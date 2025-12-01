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
 * Fetch all images from a specific Cloudinary folder using Vercel serverless API
 * @param folderPath - The folder path in Cloudinary (e.g., 'designs', 'mockups')
 * @returns Array of image resources
 */
export const fetchImagesFromFolder = async (folderPath: string): Promise<CloudinaryResource[]> => {
  try {
    // Call Vercel serverless API endpoint
    const apiUrl = `/api/cloudinary/list-images?folder=${encodeURIComponent(folderPath)}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error('Failed to fetch images from Cloudinary:', response.statusText);
      return [];
    }

    const data = await response.json();

    if (data.success && data.images) {
      return data.images.map((img: any) => ({
        public_id: img.publicId,
        secure_url: img.url,
        width: img.width,
        height: img.height,
        format: img.format,
      }));
    }

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

/**
 * Upload design image to Cloudinary
 * Uses unsigned upload preset (needs to be configured in Cloudinary dashboard)
 */
export const uploadDesignToCloudinary = async (file: File): Promise<{ publicId: string; url: string } | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'khayali_designs'); // Create this preset in Cloudinary
    formData.append('folder', 'designs');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();

    return {
      publicId: data.public_id,
      url: data.secure_url,
    };
  } catch (error) {
    console.error('Error uploading design to Cloudinary:', error);
    return null;
  }
};

/**
 * Upload mockup image to Cloudinary
 */
export const uploadMockupToCloudinary = async (file: File): Promise<{ publicId: string; url: string } | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'khayali_mockups'); // Create this preset in Cloudinary
    formData.append('folder', 'mockups');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();

    return {
      publicId: data.public_id,
      url: data.secure_url,
    };
  } catch (error) {
    console.error('Error uploading mockup to Cloudinary:', error);
    return null;
  }
};
