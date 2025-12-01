/**
 * One-time script to rename Cloudinary images with proper folder structure
 * 
 * This script will:
 * 1. Find all images with Public ID like "MOCK-1", "MOCK-2", etc.
 * 2. Rename them to "mockups/MOCK-1", "mockups/MOCK-2", etc.
 * 3. Find all images with Public ID like "DSGN-1", "DSGN-2", etc.
 * 4. Rename them to "designs/DSGN-1", "designs/DSGN-2", etc.
 * 
 * Run with: node scripts/rename-cloudinary-images.js
 */

const https = require('https');
const crypto = require('crypto');

// Cloudinary credentials
const CLOUD_NAME = 'dwm9hk3qg';
const API_KEY = '544387832215932';
const API_SECRET = 'ZEK1zGOXkP6wfx02jrFtwFnmb9c'; // From your QUICK_START.md

/**
 * Make authenticated request to Cloudinary Admin API
 */
function cloudinaryRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const credentials = `${API_KEY}:${API_SECRET}`;
    const base64Credentials = Buffer.from(credentials).toString('base64');

    const options = {
      hostname: 'api.cloudinary.com',
      path: `/v1_1/${CLOUD_NAME}${path}`,
      method: method,
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Rename a single image using Cloudinary's rename API
 */
async function renameImage(oldPublicId, newPublicId) {
  console.log(`📝 Renaming: ${oldPublicId} → ${newPublicId}`);

  return new Promise((resolve, reject) => {
    const timestamp = Math.round(Date.now() / 1000);

    // Create signature for rename operation
    const paramsToSign = `from_public_id=${oldPublicId}&timestamp=${timestamp}&to_public_id=${newPublicId}${API_SECRET}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    const postData = new URLSearchParams({
      from_public_id: oldPublicId,
      to_public_id: newPublicId,
      timestamp: timestamp.toString(),
      api_key: API_KEY,
      signature: signature,
    }).toString();

    const options = {
      hostname: 'api.cloudinary.com',
      path: `/v1_1/${CLOUD_NAME}/image/rename`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`✅ Success: ${newPublicId}`);
            resolve(parsed);
          } else {
            console.error(`❌ Failed to rename ${oldPublicId}: HTTP ${res.statusCode}:`, parsed);
            resolve(null);
          }
        } catch (e) {
          console.error(`❌ Failed to rename ${oldPublicId}:`, e.message);
          resolve(null);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Failed to rename ${oldPublicId}:`, error.message);
      resolve(null);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Get all resources from Cloudinary
 */
async function getAllResources() {
  console.log('📡 Fetching all images from Cloudinary...\n');
  
  try {
    const result = await cloudinaryRequest('GET', '/resources/image?max_results=500');
    return result.resources || [];
  } catch (error) {
    console.error('❌ Failed to fetch resources:', error.message);
    return [];
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting Cloudinary image rename script...\n');
  console.log(`Cloud Name: ${CLOUD_NAME}`);
  console.log(`API Key: ${API_KEY}\n`);

  // Get all resources
  const resources = await getAllResources();
  console.log(`📦 Found ${resources.length} total images\n`);

  let renamedCount = 0;

  // Process each resource
  for (const resource of resources) {
    const publicId = resource.public_id;
    
    // Check if it's a mockup (MOCK-1, MOCK-2, etc.)
    if (/^MOCK-\d+$/i.test(publicId)) {
      const newPublicId = `mockups/${publicId}`;
      await renameImage(publicId, newPublicId);
      renamedCount++;
    }
    // Check if it's a design (DSGN-1, DSGN-2, etc.)
    else if (/^DSGN-\d+$/i.test(publicId)) {
      const newPublicId = `designs/${publicId}`;
      await renameImage(publicId, newPublicId);
      renamedCount++;
    }
    // Skip images that already have folder structure
    else if (publicId.includes('/')) {
      console.log(`⏭️  Skipping (already has folder): ${publicId}`);
    }
    // Skip other images
    else {
      console.log(`⏭️  Skipping (doesn't match pattern): ${publicId}`);
    }
  }

  console.log(`\n✅ Done! Renamed ${renamedCount} images.`);
  console.log('\n🎉 Your images now have proper folder structure!');
  console.log('\nTest with:');
  console.log('  https://print-on-demand-nine.vercel.app/api/cloudinary/list-images?folder=mockups');
  console.log('  https://print-on-demand-nine.vercel.app/api/cloudinary/list-images?folder=designs');
}

// Run the script
main().catch(console.error);

