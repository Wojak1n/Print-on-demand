// Local Image Service - Uses images from public folder instead of Cloudinary

export interface ImageResource {
  id: string;
  url: string;
  width: number;
  height: number;
  format: string;
  title?: string;
  category?: string;
}

/**
 * Local designs stored in public/images/designs/
 * Add your design images to this folder and update this array
 */
export const LOCAL_DESIGNS: ImageResource[] = [
  // Add your designs here
  // Example:
  // {
  //   id: 'design-1',
  //   url: '/images/designs/design-1.png',
  //   width: 800,
  //   height: 800,
  //   format: 'png',
  //   title: 'Cool Design',
  //   category: 'Abstract',
  // },
];

/**
 * Local mockups stored in public/images/mockups/
 * Add your mockup images to this folder and update this array
 */
export const LOCAL_MOCKUPS: ImageResource[] = [
  // Add your mockups here
  // Example:
  // {
  //   id: 'tshirt-black',
  //   url: '/images/mockups/tshirt-black.png',
  //   width: 1200,
  //   height: 1200,
  //   format: 'png',
  //   title: 'Black T-Shirt',
  // },
];

/**
 * Fetch images from a local folder
 * @param folderName - The folder name ('designs' or 'mockups')
 * @returns Array of image resources
 */
export const fetchLocalImages = async (folderName: string): Promise<ImageResource[]> => {
  console.log(`📁 Fetching local images from: ${folderName}`);
  
  switch (folderName) {
    case 'designs':
      console.log(`✅ Found ${LOCAL_DESIGNS.length} designs`);
      return LOCAL_DESIGNS;
    case 'mockups':
      console.log(`✅ Found ${LOCAL_MOCKUPS.length} mockups`);
      return LOCAL_MOCKUPS;
    default:
      console.warn(`⚠️ Unknown folder: ${folderName}`);
      return [];
  }
};

/**
 * Get all featured designs
 */
export const getFeaturedDesigns = () => {
  return LOCAL_DESIGNS.filter(design => design.category).slice(0, 6);
};

/**
 * Get all mockups
 */
export const getMockups = () => {
  return LOCAL_MOCKUPS;
};

/**
 * Add a new design to the local collection
 * Note: This only updates the in-memory array. 
 * To persist, you need to manually add it to LOCAL_DESIGNS array above
 */
export const addLocalDesign = (design: ImageResource) => {
  LOCAL_DESIGNS.push(design);
  console.log(`✅ Added design: ${design.id}`);
};

/**
 * Add a new mockup to the local collection
 */
export const addLocalMockup = (mockup: ImageResource) => {
  LOCAL_MOCKUPS.push(mockup);
  console.log(`✅ Added mockup: ${mockup.id}`);
};

