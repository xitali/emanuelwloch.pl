import fs from 'fs';
import sharp from 'sharp';

// Recommended Facebook Cover Resolution (1640 x 624 px - 100% Crisp 2.63:1 ratio)
const svgWidth = 1640;
const svgHeight = 624;

// Ultra-minimalist, compression-resistant SVG Banner
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;700;800;900&amp;family=Fira+Code:wght@600;700&amp;display=swap');
      
      .main-title {
        font-family: 'Outfit', system-ui, -apple-system, sans-serif;
        font-weight: 900;
        font-size: 96px;
        fill: #ffffff;
        letter-spacing: -1px;
      }

      .main-subtitle {
        font-family: 'Outfit', system-ui, -apple-system, sans-serif;
        font-weight: 800;
        font-size: 26px;
        fill: #38bdf8;
        letter-spacing: 6px;
        text-transform: uppercase;
      }

      .url-pill-text {
        font-family: 'Outfit', system-ui, -apple-system, sans-serif;
        font-weight: 900;
        font-size: 32px;
        fill: #ffffff;
        letter-spacing: 1px;
      }

      .tech-stack-text {
        font-family: 'Fira Code', monospace;
        font-weight: 600;
        font-size: 20px;
        fill: #94a3b8;
        letter-spacing: 1px;
      }

      .status-text {
        font-family: 'Fira Code', monospace;
        font-weight: 700;
        font-size: 14px;
        fill: #38bdf8;
        letter-spacing: 2px;
        text-transform: uppercase;
      }
    </style>

    <!-- Linear Gradients -->
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#040711" />
      <stop offset="50%" stop-color="#080e1e" />
      <stop offset="100%" stop-color="#04060e" />
    </linearGradient>

    <radialGradient id="cyan-glow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.22" />
      <stop offset="60%" stop-color="#0369a1" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="button-bg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0ea5e9" />
    </linearGradient>
  </defs>

  <!-- 1. Solid Dark Background -->
  <rect width="${svgWidth}" height="${svgHeight}" fill="url(#bg-gradient)" />
  
  <!-- 2. Ambient Soft Glow in Center -->
  <rect width="${svgWidth}" height="${svgHeight}" fill="url(#cyan-glow)" />

  <!-- 3. Minimalist Geometry Lines (High contrast, compression proof) -->
  <line x1="0" y1="0" x2="${svgWidth}" y2="0" stroke="#0ea5e9" stroke-width="6" />
  <line x1="0" y1="${svgHeight}" x2="${svgWidth}" y2="${svgHeight}" stroke="#0ea5e9" stroke-width="6" />

  <!-- 4. Centered Safe-Zone Content Container -->
  <g transform="translate(${svgWidth / 2}, ${svgHeight / 2})">

    <!-- Top Status Badge -->
    <g transform="translate(0, -180)">
      <rect x="-190" y="0" width="380" height="42" rx="21" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.5" />
      <circle cx="-160" cy="21" r="5" fill="#10b981" />
      <text x="-140" y="26" class="status-text" text-anchor="start">FULL-STACK ARCHITECT</text>
    </g>

    <!-- Main Title: EMANUEL WŁOCH -->
    <text x="0" y="-70" class="main-title" text-anchor="middle">EMANUEL WŁOCH</text>

    <!-- Subtitle: FULL-STACK ENGINEER -->
    <text x="0" y="-20" class="main-subtitle" text-anchor="middle">FULL-STACK SOFTWARE ENGINEER &amp; ARCHITECT</text>

    <!-- Tech Stack Line -->
    <text x="0" y="35" class="tech-stack-text" text-anchor="middle">
      NEXT.JS 15 <tspan fill="#0ea5e9">•</tspan> REACT 19 <tspan fill="#0ea5e9">•</tspan> TURSO EDGE DB <tspan fill="#0ea5e9">•</tspan> TAILWIND V4
    </text>

    <!-- High Contrast Website Button Pill -->
    <g transform="translate(0, 85)">
      <rect x="-240" y="0" width="480" height="68" rx="34" fill="url(#button-bg)" />
      <!-- Globe Icon -->
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 0c-2.5 3-4 6.5-4 10s1.5 7 4 10c2.5-3 4-6.5 4-10s-1.5-7-4-10zM2 12h20" transform="translate(-190, 20) scale(1.2)" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <text x="15" y="44" class="url-pill-text" text-anchor="middle">emanuelwloch.pl</text>
    </g>

  </g>
</svg>`;

const svgPath = `C:\\Users\\emanu\\.gemini\\antigravity\\brain\\3d9c90dd-c2b0-4a90-8f8e-80760a303359\\facebook_banner_minimal.svg`;
const pngPath = `C:\\Users\\emanu\\.gemini\\antigravity\\brain\\3d9c90dd-c2b0-4a90-8f8e-80760a303359\\facebook_banner_ultra_hd.png`;

async function main() {
  fs.writeFileSync(svgPath, svgContent);
  console.log('Minimalist SVG created.');

  const svgBuffer = Buffer.from(svgContent);

  await sharp(svgBuffer)
    .resize(1640, 624)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(pngPath);

  console.log('Compression-proof PNG created successfully at:', pngPath);
}

main().catch(console.error);
