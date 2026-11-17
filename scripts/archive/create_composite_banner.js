import sharp from 'sharp';
import fs from 'fs';

const bgImagePath = `C:\\Users\\emanu\\.gemini\\antigravity\\brain\\3d9c90dd-c2b0-4a90-8f8e-80760a303359\\fb_cover_bg_hd_1784990979692.jpg`;
const bgBase64 = fs.readFileSync(bgImagePath).toString('base64');
const bgDataUri = `data:image/jpeg;base64,${bgBase64}`;

const svgWidth = 1640;
const svgHeight = 624;

// Combine 8K Tech Render Background + Portfolio Glassmorphism Hero UI
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
        fill: #cbd5e1;
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
        font-weight: 600;
        font-size: 15px;
        fill: #e2e8f0;
      }

      .cta-button-text {
        font-family: 'Outfit', system-ui, -apple-system, sans-serif;
        font-weight: 800;
        font-size: 24px;
        fill: #ffffff;
        letter-spacing: 0.5px;
      }
    </style>

    <!-- Gradients -->
    <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#0ea5e9" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>

    <linearGradient id="cta-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0ea5e9" />
    </linearGradient>

    <!-- Glow Filter -->
    <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="card-shadow">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.85"/>
    </filter>
  </defs>

  <!-- 1. Rich 8K Tech Render Background -->
  <image href="${bgDataUri}" width="${svgWidth}" height="${svgHeight}" preserveAspectRatio="xMidYMid slice" />

  <!-- 2. Dark Overlay for optimal text contrast -->
  <rect width="${svgWidth}" height="${svgHeight}" fill="black" opacity="0.32" />

  <!-- 3. Glassmorphism Hero Container Card -->
  <g transform="translate(120, 70)" filter="url(#card-shadow)">
    <!-- Glass Panel Background -->
    <rect width="1400" height="484" rx="28" fill="rgba(6, 11, 25, 0.82)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1.5" />
    <rect width="1400" height="484" rx="28" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />

    <!-- Top Glow Accent Bar -->
    <line x1="40" y1="0" x2="1360" y2="0" stroke="rgba(56, 189, 248, 0.6)" stroke-width="2.5" />

    <!-- Top Pill Badge -->
    <g transform="translate(60, 50)">
      <rect width="450" height="40" rx="20" fill="rgba(14, 165, 233, 0.18)" stroke="rgba(56, 189, 248, 0.45)" stroke-width="1" />
      <circle cx="24" cy="20" r="5" fill="#38bdf8" filter="url(#neon-glow)" />
      <text x="40" y="25" class="badge-text">FULL-STACK SOFTWARE ENGINEER &amp; ARCHITECT</text>
    </g>

    <!-- Main Title -->
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
      <g transform="translate(0, 0)">
        <rect width="140" height="38" rx="10" fill="rgba(2, 6, 23, 0.85)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1" />
        <text x="70" y="24" class="pill-text" text-anchor="middle">Next.js 16</text>
      </g>
      <g transform="translate(155, 0)">
        <rect width="125" height="38" rx="10" fill="rgba(2, 6, 23, 0.85)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1" />
        <text x="62.5" y="24" class="pill-text" text-anchor="middle">React 19</text>
      </g>
      <g transform="translate(295, 0)">
        <rect width="140" height="38" rx="10" fill="rgba(2, 6, 23, 0.85)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1" />
        <text x="70" y="24" class="pill-text" text-anchor="middle">TypeScript</text>
      </g>
      <g transform="translate(450, 0)">
        <rect width="170" height="38" rx="10" fill="rgba(2, 6, 23, 0.85)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1" />
        <text x="85" y="24" class="pill-text" text-anchor="middle">Turso Edge DB</text>
      </g>
      <g transform="translate(635, 0)">
        <rect width="145" height="38" rx="10" fill="rgba(2, 6, 23, 0.85)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1" />
        <text x="72.5" y="24" class="pill-text" text-anchor="middle">Tailwind v4</text>
      </g>
    </g>

    <!-- Neon CTA Button Badge -->
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

const jpgPath = `C:\\Users\\emanu\\.gemini\\antigravity\\brain\\3d9c90dd-c2b0-4a90-8f8e-80760a303359\\facebook_banner_ultra_hd.jpg`;

async function main() {
  const svgBuffer = Buffer.from(svgContent);

  await sharp(svgBuffer)
    .resize(1640, 624)
    .jpeg({
      quality: 98,
      progressive: true,
      chromaSubsampling: '4:4:4',
      force: true
    })
    .toFile(jpgPath);

  console.log('Rich Tech Background + Portfolio UI JPEG created successfully at:', jpgPath);
}

main().catch(console.error);
