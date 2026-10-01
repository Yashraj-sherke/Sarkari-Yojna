import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({ 
  cloud_name: 'dars4ivin', 
  api_key: '624222644454834', 
  api_secret: '624222644454834'
});

const publicDir = path.join(__dirname, 'public');

async function uploadFiles() {
  const files = fs.readdirSync(publicDir);
  for (const file of files) {
    if (file.endsWith('.webp') || file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      const filePath = path.join(publicDir, file);
      // Remove extension for public_id
      const publicId = path.parse(file).name;
      try {
        console.log(`Uploading ${file}...`);
        const result = await cloudinary.uploader.upload(filePath, {
          public_id: publicId,
          unique_filename: false,
          overwrite: true
        });
        console.log(`Successfully uploaded ${file} to ${result.secure_url}`);
      } catch (error) {
        console.error(`Failed to upload ${file}:`, error);
      }
    }
  }
}

uploadFiles();
