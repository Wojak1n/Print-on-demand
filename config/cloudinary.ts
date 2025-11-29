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
  LOGO: 'khayali_logo__uam5yg'
};

