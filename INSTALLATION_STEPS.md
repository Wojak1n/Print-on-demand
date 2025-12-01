# 📦 Installation Steps - Cloudinary + Vercel Integration

## 🔧 Step 1: Install Required Package

Run this command to install the Vercel Node.js runtime:

```bash
npm install --save-dev @vercel/node
```

This package is required for the Cloudinary API serverless function.

---

## ✅ Step 2: Verify Installation

After installation, your `package.json` should include:

```json
{
  "devDependencies": {
    "@vercel/node": "^3.0.0",
    ...
  }
}
```

---

## 🚀 Step 3: Test Locally

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open your browser**: http://localhost:5173

3. **Go to Design Studio**

4. **Check the console**:
   - You should see: "Failed to fetch images from Cloudinary" (this is expected locally)
   - The API endpoint only works when deployed to Vercel

---

## 🌐 Step 4: Deploy to Vercel

Follow the instructions in `VERCEL_DEPLOYMENT_GUIDE.md` to deploy your website.

---

## 📝 Summary of Changes

### **Files Created:**
- ✅ `api/cloudinary/list-images.ts` - Serverless API endpoint
- ✅ `vercel.json` - Vercel configuration
- ✅ `VERCEL_DEPLOYMENT_GUIDE.md` - Deployment instructions
- ✅ `INSTALLATION_STEPS.md` - This file

### **Files Modified:**
- ✅ `services/cloudinaryService.ts` - Updated to call Vercel API
- ✅ `pages/DesignStudio.tsx` - Fetches designs/mockups from Cloudinary
- ✅ `types.ts` - Added `cloudinaryId` field

---

## 🎯 How It Works

### **Local Development:**
- API endpoint won't work (requires Vercel serverless environment)
- Designs/mockups from localStorage will still work
- You can still test the UI

### **Production (Vercel):**
- API endpoint fetches images from Cloudinary
- Designs/mockups automatically appear in Design Studio
- No manual configuration needed (after environment variables are set)

---

## 🔄 Workflow

1. **Upload images to Cloudinary** (via Cloudinary dashboard)
2. **Images are stored** in `designs/` and `mockups/` folders
3. **Vercel API fetches** images when users visit Design Studio
4. **Images appear** automatically in the UI

---

**Next Step:** Run `npm install --save-dev @vercel/node` and then follow `VERCEL_DEPLOYMENT_GUIDE.md`

