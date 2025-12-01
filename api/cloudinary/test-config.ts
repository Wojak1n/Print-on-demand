import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Debug endpoint to test Cloudinary configuration
 * GET /api/cloudinary/test-config
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dwm9hk3qg';
  const API_KEY = process.env.CLOUDINARY_API_KEY || '544387832215932';
  const API_SECRET = process.env.CLOUDINARY_API_SECRET || '';

  // Don't expose the actual secret, just check if it exists
  const secretPreview = API_SECRET 
    ? `${API_SECRET.substring(0, 3)}...${API_SECRET.substring(API_SECRET.length - 3)}`
    : 'NOT SET';

  return res.status(200).json({
    success: true,
    config: {
      cloudName: CLOUD_NAME,
      apiKey: API_KEY,
      apiSecretSet: !!API_SECRET,
      apiSecretPreview: secretPreview,
      apiSecretLength: API_SECRET.length,
    },
    envVars: {
      CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
    },
  });
}

