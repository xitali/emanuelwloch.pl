import fs from 'fs';
import sharp from 'sharp';

const svgWidth = 1640;
const svgHeight = 624;

// Portfolio-styled Facebook Cover SVG Banner matching emanuelwloch.pl exact aesthetic
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&amp;family=Fira+Code:wght@500;600;700&amp;display=swap');
      
      .hero-title {
        font-family: 'Outfit', system-ui, -apple-system, sans-serif;
        font-weight: 900;
        font-size: 76px;
        fill: #ffffff;
        letter-spacing: -1px;
      }

      .gradient-text {
        fill: url(#cyan-gradient);
      }

      .hero-tagline {
        font-family: 'Outfit', system-ui, -apple-system, sans-serif;
        font-weight: 600;
        font-size: 22px;
        fill: #94a3b8;
        letter-spacing: 0.5px;
      }

      .badge-text {
        font-family: 'Fira Code', monospace;
        font-weight: 600;
        font-size: 14px;
        fill: #38bdf8;
        letter-spacing: 1.5px;
        text-transform: uppercase;
      }

      .pill-text {
        font-family: 'Fira Code', monospace;
        font-weight: 500;
        font-size: 15px;
        fill: #cbd5e1;
      }

      .cta-button-text {
        font-family: 'Outfit', system-ui, -apple-system, sans-serif;
        font-weight: 800;
        font-size: 24px;
        fill: #ffffff;
        letter-spacing: 0.5px;
      }
    </style>

    <!-- Gradients matching emanuelwloch.pl -->
    <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#0ea5e9" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>

    <linearGradient id="cta-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0ea5e9" />
    </linearGradient>

    <!-- Background Orbs -->
    <radialGradient id="cyan-orb" cx="20%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.35" />
      <stop offset="70%" stop-color="#0369a1" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#060913" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="purple-orb" cx="80%" cy="70%" r="50%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.25" />
      <stop offset="70%" stop-color="#6d28d9" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#060913" stop-opacity="0" />
    </radialGradient>

    <!-- Glow Filter -->
    <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="card-shadow">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.75"/>
    </filter>
  </defs>

  <!-- 1. Deep Dark Slate Background (#060913) -->
  <rect width="${svgWidth}" height="${svgHeight}" fill="#060913" />

  <!-- 2. Ambient Color Glows (Cyan & Purple Orbs) -->
  <rect width="${svgWidth}" height="${svgHeight}" fill="url(#cyan-orb)" />
  <rect width="${svgWidth}" height="${svgHeight}" fill="url(#purple-orb)" />

  <!-- 3. Tech Grid Overlay Pattern -->
  <g stroke="rgba(255, 255, 255, 0.03)" stroke-width="1">
    <line x1="200" y1="0" x2="200" y2="${svgHeight}" />
    <line x1="400" y1="0" x2="400" y2="${svgHeight}" />
    <line x1="600" y1="0" x2="600" y2="${svgHeight}" />
    <line x1="800" y1="0" x2="800" y2="${svgHeight}" />
    <line x1="1000" y1="0" x2="1000" y2="${svgHeight}" />
    <line x1="1200" y1="0" x2="1200" y2="${svgHeight}" />
    <line x1="1400" y1="0" x2="1400" y2="${svgHeight}" />
    
    <line x1="0" y1="150" x2="${svgWidth}" y2="150" />
    <line x1="0" y1="300" x2="${svgWidth}" y2="300" />
    <line x1="0" y1="450" x2="${svgWidth}" y2="450" />
  </g>

  <!-- 4. Glassmorphism Hero Container Card (Matching website glass-panel) -->
  <g transform="translate(120, 70)" filter="url(#card-shadow)">
    <!-- Glass Panel Background -->
    <rect width="1400" height="484" rx="28" fill="rgba(15, 23, 42, 0.75)" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1.5" />
    <rect width="1400" height="484" rx="28" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />

    <!-- Top Glow Line -->
    <line x1="40" y1="0" x2="1360" y2="0" stroke="rgba(56, 189, 248, 0.5)" stroke-width="2" />

    <!-- Content inside Glass Panel -->
    
    <!-- Top Pill Badge -->
    <g transform="translate(60, 50)">
      <rect width="450" height="40" rx="20" fill="rgba(14, 165, 233, 0.12)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1" />
      <circle cx="24" cy="20" r="5" fill="#38bdf8" filter="url(#neon-glow)" />
      <text x="40" y="25" class="badge-text">FULL-STACK SOFTWARE ENGINEER &amp; ARCHITECT</text>
    </g>

    <!-- Main Title (Emanuel Włoch with Cyan Gradient) -->
    <g transform="translate(60, 155)">
      <text class="hero-title">
        Emanuel <tspan class="gradient-text">Włoch</tspan>
      </text>
    </g>

    <!-- Subtitle / Tagline -->
    <g transform="translate(60, 210)">
      <text class="hero-tagline">
        Projektuję &amp; buduję nowoczesne aplikacje webowe, systemy Edge i wydajne API.
      </text>
    </g>

    <!-- Tech Stack Tag Pills -->
    <g transform="translate(60, 265)">
      <!-- Tag 1: Next.js 16 -->
      <g transform="translate(0, 0)">
        <rect width="140" height="38" rx="10" fill="rgba(6, 9, 19, 0.8)" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1" />
        <text x="70" y="24" class="pill-text" text-anchor="middle">Next.js 16</text>
      </g>
      <!-- Tag 2: React 19 -->
      <g transform="translate(155, 0)">
        <rect width="125" height="38" rx="10" fill="rgba(6, 9, 19, 0.8)" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1" />
        <text x="62.5" y="24" class="pill-text" text-anchor="middle">React 19</text>
      </g>
      <!-- Tag 3: TypeScript -->
      <g transform="translate(295, 0)">
        <rect width="140" height="38" rx="10" fill="rgba(6, 9, 19, 0.8)" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1" />
        <text x="70" y="24" class="pill-text" text-anchor="middle">TypeScript</text>
      </g>
      <!-- Tag 4: Turso Edge DB -->
      <g transform="translate(450, 0)">
        <rect width="170" height="38" rx="10" fill="rgba(6, 9, 19, 0.8)" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1" />
        <text x="85" y="24" class="pill-text" text-anchor="middle">Turso Edge DB</text>
      </g>
      <!-- Tag 5: Tailwind v4 -->
      <g transform="translate(635, 0)">
        <rect width="145" height="38" rx="10" fill="rgba(6, 9, 19, 0.8)" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1" />
        <text x="72.5" y="24" class="pill-text" text-anchor="middle">Tailwind v4</text>
      </g>
    </g>

    <!-- Neon CTA Button Badge (emanuelwloch.pl) -->
    <g transform="translate(60, 350)">
      <rect width="420" height="64" rx="32" fill="url(#cta-gradient)" filter="url(#neon-glow)" />
      <!-- Globe Icon -->
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 0c-2.5 3-4 6.5-4 10s1.5 7 4 10c2.5-3 4-6.5 4-10s-1.5-7-4-10zM2 12h20" transform="translate(32, 18) scale(1.1)" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <text x="215" y="41" class="cta-button-text" text-anchor="middle">emanuelwloch.pl</text>
      <!-- Arrow Icon -->
      <path d="M5 12h14M12 5l7 7-7 7" transform="translate(355, 20) scale(1.0)" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    </g>
  </g>
</svg>`;

const svgPath = `C:\\Users\\emanu\\.gemini\\antigravity\\brain\\3d9c90dd-c2b0-4a90-8f8e-80760a303359\\facebook_banner_portfolio.svg`;
const pngPath = `C:\\Users\\emanu\\.gemini\\antigravity\\brain\\3d9c90dd-c2b0-4a90-8f8e-80760a303359\\facebook_banner_ultra_hd.png`;

async function main() {
  fs.writeFileSync(svgPath, svgContent);
  console.log('Portfolio-styled SVG created.');

  const svgBuffer = Buffer.from(svgContent);

  await sharp(svgBuffer)
    .resize(1640, 624)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(pngPath);

  console.log('Portfolio Hero PNG created successfully at:', pngPath);
}

main().catch(console.error);
