import sharp from 'sharp';
import fs from 'fs';

const svgPath = `C:\\Users\\emanu\\.gemini\\antigravity\\brain\\3d9c90dd-c2b0-4a90-8f8e-80760a303359\\facebook_banner_portfolio.svg`;
const jpgPath = `C:\\Users\\emanu\\.gemini\\antigravity\\brain\\3d9c90dd-c2b0-4a90-8f8e-80760a303359\\facebook_banner_ultra_hd.jpg`;

async function convertToJpeg() {
  console.log('Converting to High-Quality sRGB JPEG (4:4:4 chroma)...');
  const svgBuffer = fs.readFileSync(svgPath);

  await sharp(svgBuffer)
    .resize(1640, 624)
    .jpeg({
      quality: 98,
      progressive: true,
      chromaSubsampling: '4:4:4', // 4:4:4 preserves full color detail for text & gradients!
      force: true
    })
    .toFile(jpgPath);

  console.log('JPEG successfully created at:', jpgPath);
}

convertToJpeg().catch(console.error);
