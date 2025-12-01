import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import fs from 'fs';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dwm9hk3qg';
const API_KEY = process.env.CLOUDINARY_API_KEY || '544387832215932';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || '';

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Upload image to Cloudinary with proper folder structure
 * POST /api/cloudinary/upload
 * Body: multipart/form-data with 'file' and 'folder' fields
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!API_SECRET) {
    return res.status(500).json({ 
      error: 'Cloudinary API secret not configured',
      message: 'Please set CLOUDINARY_API_SECRET in Vercel environment variables'
    });
  }

  try {
    // Parse multipart form data
    const form = formidable({ multiples: false });
    
    const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const folder = Array.isArray(fields.folder) ? fields.folder[0] : fields.folder;
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!folder || !['designs', 'mockups', 'featured'].includes(folder)) {
      return res.status(400).json({ 
        error: 'Invalid folder',
        message: 'Folder must be one of: designs, mockups, featured'
      });
    }

    // Read file as base64
    const fileBuffer = fs.readFileSync(file.filepath);
    const base64File = fileBuffer.toString('base64');
    const dataURI = `data:${file.mimetype};base64,${base64File}`;

    // Generate unique public_id with folder structure
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const publicId = `${folder}/${timestamp}_${randomId}`;

    // Create signature for authenticated upload
    const crypto = require('crypto');
    const timestamp_sig = Math.round(new Date().getTime() / 1000);
    const signature = crypto
      .createHash('sha1')
      .update(`public_id=${publicId}&timestamp=${timestamp_sig}${API_SECRET}`)
      .digest('hex');

    // Upload to Cloudinary
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    
    const formData = new FormData();
    formData.append('file', dataURI);
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp_sig.toString());
    formData.append('api_key', API_KEY);
    formData.append('signature', signature);

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      console.error('Cloudinary upload error:', errorData);
      return res.status(uploadResponse.status).json({
        error: 'Failed to upload to Cloudinary',
        details: errorData,
      });
    }

    const uploadData = await uploadResponse.json();

    // Clean up temp file
    fs.unlinkSync(file.filepath);

    return res.status(200).json({
      success: true,
      publicId: uploadData.public_id,
      url: uploadData.secure_url,
      width: uploadData.width,
      height: uploadData.height,
      format: uploadData.format,
      folder: folder,
    });

  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

