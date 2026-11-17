import sharp from 'sharp';
import fs from 'fs';

const svgPath = `C:\\Users\\emanu\\.gemini\\antigravity\\brain\\3d9c90dd-c2b0-4a90-8f8e-80760a303359\\facebook_banner_ultra_hd.svg`;
const pngPath = `C:\\Users\\emanu\\.gemini\\antigravity\\brain\\3d9c90dd-c2b0-4a90-8f8e-80760a303359\\facebook_banner_ultra_hd.png`;

async function convert() {
  console.log('Converting SVG to PNG with Sharp...');
  const svgBuffer = fs.readFileSync(svgPath);

  await sharp(svgBuffer)
    .resize(2050, 780)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(pngPath);

  console.log('Successfully created PNG at:', pngPath);
}

convert().catch(console.error);
