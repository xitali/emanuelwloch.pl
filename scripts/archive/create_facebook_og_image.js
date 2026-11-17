import sharp from 'sharp';
import fs from 'fs';

const bgImagePath = `C:\\Users\\emanu\\.gemini\\antigravity\\brain\\3d9c90dd-c2b0-4a90-8f8e-80760a303359\\fb_cover_bg_hd_1784990979692.jpg`;
const bgBase64 = fs.readFileSync(bgImagePath).toString('base64');
const bgDataUri = `data:image/jpeg;base64,${bgBase64}`;

// Ideal Facebook / OpenGraph standard dimension: 1200 x 630 px
const svgWidth = 1200;
const svgHeight = 630;

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&amp;family=Fira+Code:wght@500;600;700&amp;display=swap');
      
      .hero-title {
        font-family: 'Outfit', system-ui, -apple-system, sans-serif;
        font-weight: 900;
        font-size: 64px;
        fill: #ffffff;
        letter-spacing: -1px;
      }

      .gradient-text {
        fill: url(#cyan-gradient);
      }

      .hero-tagline {
        font-family: 'Outfit', system-ui, -apple-system, sans-serif;
        font-weight: 600;
        font-size: 20px;
        fill: #cbd5e1;
      }

      .badge-text {
        font-family: 'Fira Code', monospace;
        font-weight: 600;
        font-size: 13px;
        fill: #38bdf8;
        letter-spacing: 1.5px;
        text-transform: uppercase;
      }

      .pill-text {
        font-family: 'Fira Code', monospace;
        font-weight: 600;
        font-size: 14px;
        fill: #e2e8f0;
      }

      .cta-button-text {
        font-family: 'Outfit', system-ui, -apple-system, sans-serif;
        font-weight: 800;
        font-size: 22px;
        fill: #ffffff;
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
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="card-shadow">
      <feDropShadow dx="0" dy="12" stdDeviation="20" flood-color="#000000" flood-opacity="0.85"/>
    </filter>
  </defs>

  <!-- 1. Background Image -->
  <image href="${bgDataUri}" width="${svgWidth}" height="${svgHeight}" preserveAspectRatio="xMidYMid slice" />

  <!-- 2. Dark Overlay -->
  <rect width="${svgWidth}" height="${svgHeight}" fill="black" opacity="0.35" />

  <!-- 3. Glassmorphism Hero Card -->
  <g transform="translate(60, 50)" filter="url(#card-shadow)">
    <!-- Glass Panel Background -->
    <rect width="1080" height="530" rx="24" fill="rgba(6, 11, 25, 0.85)" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.5" />
    <rect width="1080" height="530" rx="24" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />

    <!-- Top Glow Accent Bar -->
    <line x1="40" y1="0" x2="1040" y2="0" stroke="rgba(56, 189, 248, 0.6)" stroke-width="2.5" />

    <!-- Top Pill Badge -->
    <g transform="translate(50, 45)">
      <rect width="440" height="38" rx="19" fill="rgba(14, 165, 233, 0.18)" stroke="rgba(56, 189, 248, 0.45)" stroke-width="1" />
      <circle cx="22" cy="19" r="4.5" fill="#38bdf8" filter="url(#neon-glow)" />
      <text x="38" y="24" class="badge-text">FULL-STACK SOFTWARE ENGINEER &amp; ARCHITECT</text>
    </g>

    <!-- Main Title -->
    <g transform="translate(50, 140)">
      <text class="hero-title">
        Emanuel <tspan class="gradient-text">Włoch</tspan>
      </text>
    </g>

    <!-- Subtitle / Tagline -->
    <g transform="translate(50, 190)">
      <text class="hero-tagline">
        Projektuję &amp; buduję nowoczesne aplikacje webowe, systemy Edge i wydajne API.
      </text>
    </g>

    <!-- Tech Stack Tag Pills -->
    <g transform="translate(50, 245)">
      <g transform="translate(0, 0)">
        <rect width="130" height="36" rx="8" fill="rgba(2, 6, 23, 0.85)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1" />
        <text x="65" y="23" class="pill-text" text-anchor="middle">Next.js 16</text>
      </g>
      <g transform="translate(142, 0)">
        <rect width="115" height="36" rx="8" fill="rgba(2, 6, 23, 0.85)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1" />
        <text x="57.5" y="23" class="pill-text" text-anchor="middle">React 19</text>
      </g>
      <g transform="translate(269, 0)">
        <rect width="130" height="36" rx="8" fill="rgba(2, 6, 23, 0.85)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1" />
        <text x="65" y="23" class="pill-text" text-anchor="middle">TypeScript</text>
      </g>
      <g transform="translate(411, 0)">
        <rect width="155" height="36" rx="8" fill="rgba(2, 6, 23, 0.85)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1" />
        <text x="77.5" y="23" class="pill-text" text-anchor="middle">Turso Edge DB</text>
      </g>
      <g transform="translate(578, 0)">
        <rect width="135" height="36" rx="8" fill="rgba(2, 6, 23, 0.85)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1" />
        <text x="67.5" y="23" class="pill-text" text-anchor="middle">Tailwind v4</text>
      </g>
    </g>

    <!-- Neon CTA Button Badge -->
    <g transform="translate(50, 335)">
      <rect width="380" height="56" rx="28" fill="url(#cta-gradient)" filter="url(#neon-glow)" />
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 0c-2.5 3-4 6.5-4 10s1.5 7 4 10c2.5-3 4-6.5 4-10s-1.5-7-4-10zM2 12h20" transform="translate(30, 16) scale(1.0)" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <text x="195" y="36" class="cta-button-text" text-anchor="middle">emanuelwloch.pl</text>
      <path d="M5 12h14M12 5l7 7-7 7" transform="translate(325, 17) scale(0.9)" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    </g>
  </g>
</svg>`;

async function main() {
  const svgBuffer = Buffer.from(svgContent);

  const publicOgPath = `d:\\emanuelw\\public\\og-image.jpg`;
  const appOgPath = `d:\\emanuelw\\src\\app\\opengraph-image.jpg`;

  await sharp(svgBuffer)
    .resize(1200, 630)
    .jpeg({
      quality: 95,
      progressive: true,
      chromaSubsampling: '4:4:4',
      force: true
    })
    .toFile(publicOgPath);

  fs.copyFileSync(publicOgPath, appOgPath);

  console.log('1200x630 Facebook OG Image created successfully at both:', publicOgPath, 'and', appOgPath);
}

main().catch(console.error);
