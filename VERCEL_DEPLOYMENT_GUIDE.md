# 🚀 Vercel Deployment Guide - Cloudinary Integration

This guide will help you deploy your Print-on-Demand website to Vercel with Cloudinary integration.

---

## 📋 Prerequisites

- Vercel account (free): https://vercel.com/signup
- Cloudinary account (Cloud Name: `dwm9hk3qg`)
- GitHub repository (optional but recommended)

---

## 🔑 Step 1: Get Your Cloudinary API Secret

1. **Go to Cloudinary Dashboard**: https://cloudinary.com/console
2. **Navigate to**: Dashboard → Settings (gear icon) → API Keys
3. **Copy these values**:
   - **Cloud Name**: `dwm9hk3qg` ✅ (already configured)
   - **API Key**: `544387832215932` ✅ (already configured)
   - **API Secret**: `XXXXXXXXXXXXXXXXXXXXXXXX` ⚠️ (you need to copy this)

**⚠️ IMPORTANT:** Keep your API Secret private! Never commit it to Git.

---

## 🚀 Step 2: Deploy to Vercel

### **Option A: Deploy from GitHub (Recommended)**

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Add Cloudinary integration"
   git push origin main
   ```

2. **Go to Vercel**: https://vercel.com/new
3. **Import your GitHub repository**
4. **Configure the project**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Click "Deploy"**

### **Option B: Deploy with Vercel CLI**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

---

## 🔧 Step 3: Configure Environment Variables

After deployment, you need to add your Cloudinary API Secret:

1. **Go to your Vercel project dashboard**
2. **Navigate to**: Settings → Environment Variables
3. **Add these variables**:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `CLOUDINARY_CLOUD_NAME` | `dwm9hk3qg` | Production, Preview, Development |
| `CLOUDINARY_API_KEY` | `544387832215932` | Production, Preview, Development |
| `CLOUDINARY_API_SECRET` | `YOUR_API_SECRET_HERE` | Production, Preview, Development |

4. **Click "Save"**
5. **Redeploy** your project (Vercel will automatically redeploy when you save environment variables)

---

## 📁 Step 4: Upload Images to Cloudinary

Now upload your designs and mockups to Cloudinary:

### **Upload Designs:**

1. **Go to Cloudinary Media Library**: https://cloudinary.com/console/media_library
2. **Click "Upload"**
3. **Select your design images** (PNG, JPG, SVG, etc.)
4. **Set folder**: `designs`
5. **Upload**

### **Upload Mockups:**

1. **Click "Upload"** again
2. **Select your product mockup images**
3. **Set folder**: `mockups`
4. **Upload**

---

## ✅ Step 5: Test Your Deployment

1. **Visit your Vercel URL**: `https://your-project.vercel.app`
2. **Go to Design Studio**
3. **Wait for designs to load** (you should see a loading spinner)
4. **Verify**:
   - ✅ Designs from Cloudinary `designs/` folder appear
   - ✅ Mockups from Cloudinary `mockups/` folder appear
   - ✅ No console errors

---

## 🧪 Test the API Endpoint

You can test the Cloudinary API directly:

**Test Designs:**
```
https://your-project.vercel.app/api/cloudinary/list-images?folder=designs
```

**Test Mockups:**
```
https://your-project.vercel.app/api/cloudinary/list-images?folder=mockups
```

**Expected Response:**
```json
{
  "success": true,
  "folder": "designs",
  "count": 5,
  "images": [
    {
      "publicId": "designs/design-1",
      "url": "https://res.cloudinary.com/...",
      "width": 1000,
      "height": 1000,
      "format": "png",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## 🔍 Troubleshooting

### **Problem: "Cloudinary API secret not configured"**

**Solution:**
- Make sure you added `CLOUDINARY_API_SECRET` to Vercel environment variables
- Redeploy your project after adding the variable

### **Problem: No designs showing up**

**Solution:**
- Check that images are uploaded to the correct folders (`designs/` and `mockups/`)
- Test the API endpoint directly (see above)
- Check browser console for errors

### **Problem: API returns 401 Unauthorized**

**Solution:**
- Verify your API Key and API Secret are correct
- Make sure the API Secret is set in Vercel environment variables

### **Problem: CORS errors**

**Solution:**
- The API endpoint already has CORS headers configured
- If you still see CORS errors, check Vercel logs

---

## 📂 Cloudinary Folder Structure

Your Cloudinary should have this structure:

```
dwm9hk3qg/
├── featured/          # Featured designs (homepage)
│   ├── featued-1_ajkopf
│   ├── featured-2_bdxzwl
│   └── featued-3_hutv5n
├── designs/           # Design Studio designs (fetched by API)
│   ├── design-1.png
│   ├── design-2.png
│   └── design-3.svg
└── mockups/           # Product mockups (fetched by API)
    ├── tshirt-black.png
    ├── tshirt-white.png
    └── hoodie-black.png
```

---

## 🎉 Success Checklist

- ✅ Deployed to Vercel
- ✅ Environment variables configured
- ✅ Images uploaded to Cloudinary folders
- ✅ Designs appear in Design Studio
- ✅ Mockups appear in product selector
- ✅ No console errors

---

## 🔄 Updating Designs

To add new designs or mockups:

1. **Upload to Cloudinary** (Media Library → Upload → Select folder)
2. **Refresh your website** - new images will automatically appear!
3. **No code changes needed** - the API fetches all images dynamically

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Check Vercel Logs**: Project → Deployments → Click deployment → View Function Logs

---

**Your website is now live with dynamic Cloudinary integration! 🎉**

