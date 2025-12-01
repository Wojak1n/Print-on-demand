# 🌥️ Cloudinary Setup Guide

This guide will help you set up Cloudinary upload presets so that admins can upload designs and mockups directly from the website.

---

## 📋 Prerequisites

- Cloudinary account (Cloud Name: `dwm9hk3qg`)
- Admin access to Cloudinary dashboard

---

## 🔧 Step 1: Create Upload Presets

Upload presets allow unsigned uploads from the browser without exposing your API secret.

### **For Designs:**

1. Go to **Cloudinary Dashboard**: https://cloudinary.com/console
2. Navigate to **Settings** → **Upload** → **Upload presets**
3. Click **Add upload preset**
4. Configure the preset:
   - **Preset name**: `khayali_designs`
   - **Signing mode**: **Unsigned** ✅
   - **Folder**: `designs`
   - **Use filename**: Yes (optional)
   - **Unique filename**: Yes (recommended)
   - **Overwrite**: No
   - **Allowed formats**: `jpg, png, svg, webp, gif`
   - **Max file size**: `10 MB` (adjust as needed)
5. Click **Save**

### **For Mockups:**

1. Click **Add upload preset** again
2. Configure the preset:
   - **Preset name**: `khayali_mockups`
   - **Signing mode**: **Unsigned** ✅
   - **Folder**: `mockups`
   - **Use filename**: Yes (optional)
   - **Unique filename**: Yes (recommended)
   - **Overwrite**: No
   - **Allowed formats**: `jpg, png, webp`
   - **Max file size**: `10 MB` (adjust as needed)
3. Click **Save**

---

## 🎯 Step 2: Test the Upload

1. **Login as Admin**:
   - Email: `hafsa@admin.com`
   - Password: `hafsa123`

2. **Go to Design Studio**

3. **Upload a Design**:
   - Click the **Upload** button (upload icon)
   - Select an image file
   - Wait for the upload to complete
   - You should see: "Design uploaded to Cloudinary successfully! ✅"

4. **Upload a Mockup**:
   - Click the **Upload Product** button (plus icon on the right)
   - Select a product image
   - Wait for the upload to complete
   - You should see: "Mockup uploaded to Cloudinary successfully! ✅"

---

## 🔍 Step 3: Verify Uploads in Cloudinary

1. Go to **Media Library** in Cloudinary dashboard
2. Check the **designs** folder - you should see your uploaded designs
3. Check the **mockups** folder - you should see your uploaded mockups

---

## 📁 Folder Structure

Your Cloudinary account should have these folders:

```
dwm9hk3qg/
├── featured/          # Featured designs for homepage
│   ├── featued-1_ajkopf
│   ├── featured-2_bdxzwl
│   └── featued-3_hutv5n
├── designs/           # Admin-uploaded designs (available in Design Studio)
│   └── (uploaded designs will appear here)
└── mockups/           # Admin-uploaded product mockups
    └── (uploaded mockups will appear here)
```

---

## ⚠️ Troubleshooting

### **Error: "Upload failed"**

**Possible causes:**
1. Upload preset not created or incorrect name
2. Upload preset is set to "Signed" instead of "Unsigned"
3. Network issues

**Solution:**
- Double-check preset names: `khayali_designs` and `khayali_mockups`
- Ensure presets are set to **Unsigned**
- Check browser console for detailed error messages

### **Error: "Cloudinary upload failed. Using local storage."**

This means the upload to Cloudinary failed, but the app fell back to local storage (base64). The design/mockup will work but won't be stored in Cloudinary.

**Solution:**
- Check your internet connection
- Verify upload presets are configured correctly
- Check Cloudinary dashboard for any account issues

---

## 🎉 Success!

Once configured, admins can:
- ✅ Upload designs directly to Cloudinary
- ✅ Upload custom product mockups
- ✅ All uploads are automatically saved to the correct folders
- ✅ Designs and mockups are accessible to all users in the Design Studio

---

## 🔐 Security Notes

- **Unsigned uploads** are safe because they use upload presets with restrictions
- Only admins can see the upload buttons (regular users cannot upload)
- Upload presets limit file types, sizes, and destination folders
- For production, consider adding more restrictions in the upload preset settings

---

## 📝 Next Steps

After setting up Cloudinary uploads, you can:
1. Upload your design library to the `designs` folder
2. Upload product mockups to the `mockups` folder
3. Designs will automatically appear in the Design Studio for all users
4. Mockups will be available for product customization

---

**Need help?** Check the Cloudinary documentation: https://cloudinary.com/documentation/upload_presets

