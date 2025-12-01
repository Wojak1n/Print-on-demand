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
    // Cloudinary Admin API uses Basic Auth with API_KEY:API_SECRET
    const credentials = `${API_KEY}:${API_SECRET}`;
    const base64Credentials = Buffer.from(credentials).toString('base64');

    // Use Cloudinary's resources/by_asset_folder endpoint for folder-based organization
    // This works with Cloudinary's Media Library folder structure
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/by_asset_folder`;
    const params = new URLSearchParams({
      asset_folder: folder,
      max_results: '500',
    });

    console.log('Fetching from Cloudinary by asset folder:', {
      url: `${url}?${params.toString()}`,
      cloudName: CLOUD_NAME,
      folder: folder,
      hasApiKey: !!API_KEY,
      hasApiSecret: !!API_SECRET,
    });

    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Cloudinary response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      console.error('Cloudinary API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });

      return res.status(response.status).json({
        error: 'Failed to fetch images from Cloudinary',
        details: errorData,
        status: response.status,
        cloudName: CLOUD_NAME,
        folder: folder,
      });
    }

    const data: CloudinaryResponse = await response.json();
    console.log('Cloudinary response:', {
      resourceCount: data.resources?.length || 0,
    });

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

