# Local Images Setup

This folder contains all images used in the Print-on-Demand application.

## 📁 Folder Structure

```
public/images/
├── designs/     # Design images (patterns, artwork, graphics)
├── mockups/     # Product mockup images (t-shirts, hoodies, etc.)
└── README.md    # This file
```

---

## 🎨 How to Add Design Images

1. **Add your design image** to `public/images/designs/`
   - Example: `public/images/designs/cool-pattern.png`

2. **Update the code** in `services/localImageService.ts`
   - Open `services/localImageService.ts`
   - Find the `LOCAL_DESIGNS` array
   - Add your design:

```typescript
export const LOCAL_DESIGNS: ImageResource[] = [
  {
    id: 'cool-pattern',
    url: '/images/designs/cool-pattern.png',
    width: 800,
    height: 800,
    format: 'png',
    title: 'Cool Pattern',
    category: 'Abstract',
  },
  // Add more designs here...
];
```

---

## 👕 How to Add Mockup Images

1. **Add your mockup image** to `public/images/mockups/`
   - Example: `public/images/mockups/tshirt-black.png`

2. **Update the code** in `services/localImageService.ts`
   - Open `services/localImageService.ts`
   - Find the `LOCAL_MOCKUPS` array
   - Add your mockup:

```typescript
export const LOCAL_MOCKUPS: ImageResource[] = [
  {
    id: 'tshirt-black',
    url: '/images/mockups/tshirt-black.png',
    width: 1200,
    height: 1200,
    format: 'png',
    title: 'Black T-Shirt',
  },
  // Add more mockups here...
];
```

---

## ✅ Recommended Image Specifications

### Design Images
- **Format**: PNG (with transparency) or JPG
- **Size**: 800x800px to 2000x2000px
- **Resolution**: 300 DPI for print quality
- **File size**: < 5MB

### Mockup Images
- **Format**: PNG (with transparency preferred)
- **Size**: 1200x1200px to 2400x2400px
- **Resolution**: 300 DPI
- **File size**: < 10MB

---

## 🚀 Deployment

When you push to GitHub, Vercel will automatically deploy your changes including all images in the `public/` folder.

**No Cloudinary needed!** All images are served directly from your Vercel deployment.

---

## 📝 Example

After adding images and updating the code:

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add new designs and mockups"
   git push origin main
   ```

2. **Vercel will automatically deploy** your changes

3. **Your images will be available** at:
   - `https://your-app.vercel.app/images/designs/cool-pattern.png`
   - `https://your-app.vercel.app/images/mockups/tshirt-black.png`

