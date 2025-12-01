# ⚡ Quick Start - Cloudinary + Vercel Integration

## 🎯 Goal
Display images from Cloudinary folders automatically in your Design Studio.

---

## 🚀 3-Step Setup

### **Step 1: Install Package** (2 minutes)

```bash
npm install --save-dev @vercel/node
```

---

### **Step 2: Deploy to Vercel** (5 minutes)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add Cloudinary fetch integration"
   git push origin main
   ```

2. **Go to Vercel**: https://vercel.com/new

3. **Import your repository**

4. **Add Environment Variables** (Settings → Environment Variables):
   - `CLOUDINARY_CLOUD_NAME` = `dwm9hk3qg`
   - `CLOUDINARY_API_KEY` = `544387832215932`
   - `CLOUDINARY_API_SECRET` = `ZEK1zGOXkP6wfx02jrFtwFnmb9c` ⚠️ (get from Cloudinary dashboard)

5. **Deploy!**

---

### **Step 3: Upload Images to Cloudinary** (3 minutes)

1. **Go to**: https://cloudinary.com/console/media_library

2. **Upload Designs**:
   - Click "Upload"
   - Select your design images
   - Set folder: `designs`
   - Upload

3. **Upload Mockups**:
   - Click "Upload"
   - Select your mockup images
   - Set folder: `mockups`
   - Upload

---

## ✅ Done!

Visit your Vercel URL → Go to Design Studio → See your designs! 🎉

---

## 📚 Detailed Guides

- **Full Deployment Guide**: `VERCEL_DEPLOYMENT_GUIDE.md`
- **How It Works**: `CLOUDINARY_FETCH_SUMMARY.md`
- **Installation Details**: `INSTALLATION_STEPS.md`

---

## 🆘 Need Help?

**Problem**: Where do I get the API Secret?  
**Solution**: Cloudinary Dashboard → Settings → API Keys → Copy "API Secret"

**Problem**: No designs showing up?  
**Solution**: Make sure images are in `designs/` folder (not root)

**Problem**: API error?  
**Solution**: Check environment variables are set in Vercel

---

## 🎯 What You Get

✅ Upload to Cloudinary → Automatically appears on website  
✅ No code changes needed to add new designs  
✅ Unlimited designs and mockups  
✅ Fast CDN delivery  
✅ Easy management  

---

**Total Time: ~10 minutes** ⏱️

