import { Cloudinary } from '@cloudinary/url-gen';

// Initialize Cloudinary instance
export const cld = new Cloudinary({
  cloud: {
    cloudName: 'dwm9hk3qg'
  }
});

// Image Public IDs
export const IMAGES = {
  HERO: 'khayali-hero_eochpa',
  LOGO: 'khayali_logo__uam5yg',

  // Featured Designs from Cloudinary
  FEATURED: [
    'featued-1_ajkopf',
    'featured-2_bdxzwl',
    'featued-3_hutv5n',
  ]
};

// Cloudinary Folders
export const CLOUDINARY_FOLDERS = {
  FEATURED: 'featured',
  DESIGNS: 'designs',
  MOCKUPS: 'mockups',
};

/**
 * Helper function to generate Cloudinary URL
 * @param publicId - The public ID (can include folder path like 'featured/design-1')
 * @param width - Optional width for responsive images
 */
export const getCloudinaryUrl = (publicId: string, width?: number): string => {
  const baseUrl = `https://res.cloudinary.com/dwm9hk3qg/image/upload`;
  const transforms = width ? `w_${width},f_auto,q_auto` : 'f_auto,q_auto';
  return `${baseUrl}/${transforms}/${publicId}`;
};

