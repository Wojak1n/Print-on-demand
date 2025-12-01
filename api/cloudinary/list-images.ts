import type { VercelRequest, VercelResponse } from '@vercel/node';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dwm9hk3qg';
const API_KEY = process.env.CLOUDINARY_API_KEY || '544387832215932';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || '';

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
}

interface CloudinaryResponse {
  resources: CloudinaryResource[];
  next_cursor?: string;
}

/**
 * Vercel Serverless Function to list images from Cloudinary folders
 * GET /api/cloudinary/list-images?folder=designs
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { folder } = req.query;

  if (!folder || typeof folder !== 'string') {
    return res.status(400).json({ error: 'Folder parameter is required' });
  }

  if (!API_SECRET) {
    return res.status(500).json({ 
      error: 'Cloudinary API secret not configured',
      message: 'Please set CLOUDINARY_API_SECRET in Vercel environment variables'
    });
  }

  try {
    // Create authentication signature
    const timestamp = Math.floor(Date.now() / 1000);
    const crypto = await import('crypto');
    
    const signature = crypto
      .createHash('sha1')
      .update(`folder=${folder}&timestamp=${timestamp}${API_SECRET}`)
      .digest('hex');

    // Fetch images from Cloudinary Admin API
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image`;
    const params = new URLSearchParams({
      type: 'upload',
      prefix: folder,
      max_results: '500',
      timestamp: timestamp.toString(),
      api_key: API_KEY,
      signature: signature,
    });

    const response = await fetch(`${url}?${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary API error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to fetch images from Cloudinary',
        details: errorData
      });
    }

    const data: CloudinaryResponse = await response.json();

    // Transform resources to a simpler format
    const images = data.resources.map(resource => ({
      publicId: resource.public_id,
      url: resource.secure_url,
      width: resource.width,
      height: resource.height,
      format: resource.format,
      createdAt: resource.created_at,
    }));

    return res.status(200).json({
      success: true,
      folder,
      count: images.length,
      images,
    });

  } catch (error) {
    console.error('Error fetching Cloudinary images:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

