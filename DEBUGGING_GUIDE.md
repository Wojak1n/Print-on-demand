# 🔍 Debugging Guide - Cloudinary API Not Working

## 🎯 Quick Checklist

### **1. Check Vercel Environment Variables**

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Make sure you have **ALL 3** variables:

- ✅ `CLOUDINARY_CLOUD_NAME` = `dwm9hk3qg`
- ✅ `CLOUDINARY_API_KEY` = `544387832215932`
- ✅ `CLOUDINARY_API_SECRET` = `ZEK1zGOXkP6wfx02jrFtwFnmb9c`

**Important:** All 3 should be set for **Production, Preview, and Development**

---

### **2. Check if Images Exist in Cloudinary**

1. **Go to**: https://cloudinary.com/console/media_library
2. **Check folders**:
   - Do you have a `designs/` folder with images?
   - Do you have a `mockups/` folder with images?

**If folders are empty:**
- Upload some images to `designs/` folder
- Upload some images to `mockups/` folder

---

### **3. Test the API Directly**

Open these URLs in your browser (replace `your-project` with your Vercel URL):

**Test Designs:**
```
https://your-project.vercel.app/api/cloudinary/list-images?folder=designs
```

**Test Mockups:**
```
https://your-project.vercel.app/api/cloudinary/list-images?folder=mockups
```

**Expected Response (Success):**
```json
{
  "success": true,
  "folder": "designs",
  "count": 5,
  "images": [...]
}
```

**Error Response (No API Secret):**
```json
{
  "error": "Cloudinary API secret not configured",
  "message": "Please set CLOUDINARY_API_SECRET in Vercel environment variables"
}
```

**Error Response (Wrong Credentials):**
```json
{
  "error": "Failed to fetch images from Cloudinary",
  "details": { ... },
  "status": 401
}
```

---

### **4. Check Browser Console**

1. **Open your website**
2. **Press F12** (open DevTools)
3. **Go to Console tab**
4. **Go to Design Studio page**
5. **Look for these messages**:

**Success:**
```
🔍 Fetching designs from Cloudinary...
📡 Calling API: /api/cloudinary/list-images?folder=designs
📡 API Response Status: 200 OK
✅ Successfully fetched 5 images from designs
✅ Designs fetched: 5 images
```

**Error:**
```
❌ Failed to fetch images from Cloudinary: {...}
```

---

### **5. Check Vercel Function Logs**

1. **Go to**: Vercel Dashboard → Your Project → Deployments
2. **Click on the latest deployment**
3. **Click "Functions" tab**
4. **Click on `/api/cloudinary/list-images`**
5. **Check the logs** for errors

---

## 🔧 Common Issues & Solutions

### **Issue 1: "Cloudinary API secret not configured"**

**Cause:** Environment variable not set in Vercel

**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Add `CLOUDINARY_API_SECRET` = `ZEK1zGOXkP6wfx02jrFtwFnmb9c`
3. Redeploy

---

### **Issue 2: "401 Unauthorized"**

**Cause:** Wrong API Key or API Secret

**Solution:**
1. Go to Cloudinary Dashboard → Settings → API Keys
2. Verify your API Key and API Secret
3. Update Vercel environment variables
4. Redeploy

---

### **Issue 3: "No designs showing up" but API returns success**

**Cause:** Images might be in wrong folder or folder name mismatch

**Solution:**
1. Check Cloudinary Media Library
2. Make sure images are in `designs/` folder (not `design/` or root)
3. Make sure folder name is exactly `designs` (lowercase)

---

### **Issue 4: API works but images don't appear in UI**

**Cause:** Frontend not calling API or error in mapping

**Solution:**
1. Check browser console for errors
2. Look for the emoji logs (🔍, ✅, ❌)
3. Check if `cloudinaryDesigns` array is populated

---

### **Issue 5: Works on Vercel but not localhost**

**Cause:** This is NORMAL! The API only works on Vercel

**Solution:**
- This is expected behavior
- The serverless function only runs on Vercel
- Test on your Vercel deployment URL

---

## 🧪 Step-by-Step Debugging

### **Step 1: Verify Cloudinary has images**

1. Go to: https://cloudinary.com/console/media_library
2. Click on `designs` folder
3. You should see images
4. Click on `mockups` folder
5. You should see images

**If folders don't exist or are empty:**
- Upload some test images
- Make sure to set folder to `designs` or `mockups` when uploading

---

### **Step 2: Test API endpoint**

1. Open: `https://your-project.vercel.app/api/cloudinary/list-images?folder=designs`
2. You should see JSON response with images
3. If you see error, check the error message

---

### **Step 3: Check browser console**

1. Open your website
2. Press F12
3. Go to Console tab
4. Navigate to Design Studio
5. Look for emoji logs (🔍, ✅, ❌)

---

### **Step 4: Check Vercel logs**

1. Vercel Dashboard → Deployments → Latest → Functions
2. Click on `/api/cloudinary/list-images`
3. Check for errors

---

## 📸 What Your Cloudinary Should Look Like

```
Cloudinary Media Library
├── designs/
│   ├── design-1.png
│   ├── design-2.jpg
│   ├── cool-pattern.svg
│   └── ... (more designs)
│
├── mockups/
│   ├── tshirt-white.png
│   ├── tshirt-black.png
│   ├── hoodie.png
│   └── ... (more mockups)
│
└── featured/
    ├── featued-1_ajkopf
    ├── featured-2_bdxzwl
    └── featued-3_hutv5n
```

---

## 🆘 Still Not Working?

**Share these with me:**

1. **API Response**: What do you see when you visit `/api/cloudinary/list-images?folder=designs`?
2. **Browser Console**: Screenshot of console when you visit Design Studio
3. **Vercel Logs**: Screenshot of function logs
4. **Cloudinary Folders**: Screenshot of your Media Library showing folders

---

**I've added detailed logging to help debug! Check your browser console for emoji logs (🔍, ✅, ❌)**

