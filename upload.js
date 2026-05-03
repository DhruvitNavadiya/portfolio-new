const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const cloudName = 'deq6qmh8n';
const apiKey = '986212796353773';
const apiSecret = 'VZ6DR-4mbM3H1C8M6xOvGpzk41k';

const componentPath = path.join(__dirname, 'src/components/ProjectsSection.tsx');
const publicDir = path.join(__dirname, 'public');

async function uploadToCloudinary(filePath) {
  const timestamp = Math.round((new Date()).getTime() / 1000);
  const paramsToSign = `folder=portfolio&format=webp&timestamp=${timestamp}`;
  const signature = crypto.createHash('sha1').update(paramsToSign + apiSecret).digest('hex');

  const ext = path.extname(filePath).toLowerCase();
  let mimeType = 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
  else if (ext === '.webp') mimeType = 'image/webp';
  else if (ext === '.gif') mimeType = 'image/gif';

  const base64Data = `data:${mimeType};base64,` + fs.readFileSync(filePath, 'base64');

  const formData = new FormData();
  formData.append('file', base64Data);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('folder', 'portfolio');
  formData.append('format', 'webp');

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  if (data.secure_url) {
    return data.secure_url;
  } else {
    throw new Error(JSON.stringify(data));
  }
}

async function run() {
  let content = fs.readFileSync(componentPath, 'utf8');
  // Match any src that starts with a slash (local path)
  const srcRegex = /src:\s*"(\/[^"]+)"/g;
  let match;
  const imagePaths = [];

  while ((match = srcRegex.exec(content)) !== null) {
    imagePaths.push(match[1]);
  }

  const uniquePaths = [...new Set(imagePaths)];
  console.log(`Found ${uniquePaths.length} unique images to upload.`);

  for (const imgPath of uniquePaths) {
    if (imgPath.startsWith('http')) continue;
    
    // Convert url encoded strings (like %20 for spaces)
    const decodedPath = decodeURIComponent(imgPath);
    const fullPath = path.join(publicDir, decodedPath);
    
    if (fs.existsSync(fullPath)) {
      try {
        console.log(`Uploading ${imgPath}...`);
        const secureUrl = await uploadToCloudinary(fullPath);
        console.log(`Uploaded to: ${secureUrl}`);
        
        // Replace in content
        const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const exactMatchRegex = new RegExp(`src:\\s*"${escapeRegExp(imgPath)}"`, 'g');
        content = content.replace(exactMatchRegex, `src: "${secureUrl}"`);
      } catch (e) {
        console.error(`Failed to upload ${imgPath}`, e.message);
      }
    } else {
      console.warn(`Local file not found: ${fullPath}`);
    }
  }

  fs.writeFileSync(componentPath, content, 'utf8');
  console.log('Finished updating ProjectsSection.tsx');
}

run().catch(console.error);
