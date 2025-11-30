# 📁 Cloudinary Folder Organization Guide

## 🎯 How to Organize Your Images in Cloudinary

### Step 1: Create Folders in Cloudinary

1. Go to [Cloudinary Media Library](https://console.cloudinary.com/console/media_library)
2. Click **"Create Folder"** button
3. Create these folders:
   - `featured/` - Featured product designs
   - `designs/` - All design artwork
   - `mockups/` - Product mockups (t-shirts, hoodies, etc.)
   - `logos/` - Brand logos
   - `banners/` - Hero banners and promotional images

### Step 2: Upload Images to Folders

1. Click on a folder (e.g., `featured/`)
2. Click **"Upload"** button
3. Select your images
4. After upload, the Public ID will be: `featured/image-name`

**Example:**
- Upload `sunset-design.jpg` to `featured/` folder
- Public ID becomes: `featured/sunset-design`

### Step 3: Update Your Code

#### Option A: Manual List (Simple, No Backend Needed)

Edit `services/cloudinaryService.ts` and update the `CLOUDINARY_DESIGNS` object:

```typescript
export const CLOUDINARY_DESIGNS = {
  featured: [
    {
      publicId: 'featured/sunset-vibes',  // ← Your Cloudinary Public ID
      title: 'Sunset Vibes',
      category: 'Nature',
      price: 29.99,
    },
    {
      publicId: 'featured/urban-street',
      title: 'Urban Street',
      category: 'Streetwear',
      price: 34.99,
    },
  ],
};
```

#### Option B: Dynamic Fetch (Requires Backend)

To automatically fetch all images from a folder, you need:
1. A backend server (Node.js, Python, etc.)
2. Cloudinary Admin API credentials
3. API endpoint to fetch folder contents

**Why?** Cloudinary Admin API requires API Secret which should NEVER be exposed in frontend code.

---

## 🔧 Using Cloudinary Images in Your App

### Current Setup (config/cloudinary.ts)

```typescript
export const IMAGES = {
  HERO: 'khayali-hero_eochpa',
  LOGO: 'khayali_logo__uam5yg'
};
```

### With Folders

```typescript
export const IMAGES = {
  HERO: 'banners/hero-image',
  LOGO: 'logos/khayali-logo',
  FEATURED: {
    DESIGN1: 'featured/sunset-vibes',
    DESIGN2: 'featured/urban-street',
    DESIGN3: 'featured/minimal-wave',
  }
};
```

---

## 📝 Recommended Folder Structure

```
cloudinary/
├── banners/
│   ├── hero-main
│   └── promo-banner
├── logos/
│   ├── khayali-logo
│   └── khayali-icon
├── featured/
│   ├── sunset-vibes
│   ├── urban-street
│   └── minimal-wave
├── designs/
│   ├── nature/
│   │   ├── sunset-1
│   │   └── ocean-2
│   ├── streetwear/
│   │   ├── urban-1
│   │   └── graffiti-2
│   └── minimal/
│       ├── wave-1
│       └── geometric-2
└── mockups/
    ├── tshirts/
    │   ├── black-tshirt
    │   └── white-tshirt
    └── hoodies/
        ├── black-hoodie
        └── gray-hoodie
```

---

## 🚀 Quick Start

### 1. Upload Your Designs

1. Go to Cloudinary Media Library
2. Create folder: `featured`
3. Upload 3 design images
4. Note the Public IDs (e.g., `featured/design-1`)

### 2. Update config/cloudinary.ts

```typescript
export const IMAGES = {
  HERO: 'khayali-hero_eochpa',
  LOGO: 'khayali_logo__uam5yg',
  FEATURED_DESIGNS: [
    'featured/design-1',
    'featured/design-2',
    'featured/design-3',
  ]
};
```

### 3. Use in Your Components

```typescript
import { cld, IMAGES } from '../config/cloudinary';

// Generate image
const img = cld.image(IMAGES.FEATURED_DESIGNS[0])
  .format('auto')
  .quality('auto')
  .resize(auto().width(800));

// Or use direct URL
const url = `https://res.cloudinary.com/dwm9hk3qg/image/upload/w_800,f_auto,q_auto/${IMAGES.FEATURED_DESIGNS[0]}`;
```

---

## 💡 Pro Tips

1. **Use descriptive names**: `featured/sunset-vibes` instead of `featured/img1`
2. **Organize by category**: `designs/nature/sunset` instead of `designs/sunset`
3. **Keep a list**: Maintain a list of all Public IDs in your code
4. **Use transformations**: Always add `f_auto,q_auto` for optimization
5. **Backup your list**: Keep a spreadsheet of all uploaded images and their Public IDs

---

## ⚠️ Important Notes

- **API Secret**: Never expose your API Secret in frontend code
- **Public IDs**: Include folder path in Public ID (e.g., `featured/design-1`)
- **Manual Updates**: You need to manually update your code when adding new images
- **Backend Solution**: For automatic fetching, implement a backend API

---

## 🔗 Useful Links

- [Cloudinary Media Library](https://console.cloudinary.com/console/media_library)
- [Cloudinary Transformations](https://cloudinary.com/documentation/image_transformations)
- [Cloudinary React SDK](https://cloudinary.com/documentation/react_integration)

