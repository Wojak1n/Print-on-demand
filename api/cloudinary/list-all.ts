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
  folder?: string;
}

interface CloudinaryResponse {
  resources: CloudinaryResource[];
  next_cursor?: string;
}

/**
 * Debug endpoint to list ALL images from Cloudinary
 * GET /api/cloudinary/list-all
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

    // Fetch ALL images from Cloudinary Admin API
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image`;
    const params = new URLSearchParams({
      type: 'upload',
      max_results: '500',
    });

    console.log('Fetching ALL images from Cloudinary:', {
      url: `${url}?${params.toString()}`,
      cloudName: CLOUD_NAME,
    });

    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      return res.status(response.status).json({
        error: 'Failed to fetch images from Cloudinary',
        details: errorData,
        status: response.status,
      });
    }

    const data: CloudinaryResponse = await response.json();
    
    // Group images by folder
    const folderMap: Record<string, any[]> = {};
    const noFolder: any[] = [];

    data.resources.forEach(resource => {
      const parts = resource.public_id.split('/');
      if (parts.length > 1) {
        const folder = parts[0];
        if (!folderMap[folder]) {
          folderMap[folder] = [];
        }
        folderMap[folder].push({
          publicId: resource.public_id,
          url: resource.secure_url,
          width: resource.width,
          height: resource.height,
          format: resource.format,
        });
      } else {
        noFolder.push({
          publicId: resource.public_id,
          url: resource.secure_url,
          width: resource.width,
          height: resource.height,
          format: resource.format,
        });
      }
    });

    return res.status(200).json({
      success: true,
      totalCount: data.resources.length,
      folders: folderMap,
      noFolder: noFolder,
      folderNames: Object.keys(folderMap),
    });

  } catch (error) {
    console.error('Error fetching Cloudinary images:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

