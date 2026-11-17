import fs from 'fs';

const bgImagePath = `C:\\Users\\emanu\\.gemini\\antigravity\\brain\\3d9c90dd-c2b0-4a90-8f8e-80760a303359\\fb_cover_bg_hd_1784990979692.jpg`;
const bgBase64 = fs.readFileSync(bgImagePath).toString('base64');
const bgDataUri = `data:image/jpeg;base64,${bgBase64}`;

const svgWidth = 2050;
const svgHeight = 780;

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <defs>
    <!-- Fonts -->
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&amp;family=Fira+Code:wght@500;700&amp;display=swap');
      
      .title-text {
        font-family: 'Outfit', -apple-system, sans-serif;
        font-weight: 900;
        font-size: 78px;
        fill: url(#title-gradient);
        letter-spacing: -1px;
      }
      
      .subtitle-text {
        font-family: 'Outfit', -apple-system, sans-serif;
        font-weight: 700;
        font-size: 24px;
        fill: #38bdf8;
        letter-spacing: 5px;
        text-transform: uppercase;
      }
      
      .tech-badge-text {
        font-family: 'Fira Code', monospace;
        font-weight: 600;
        font-size: 19px;
        fill: #cbd5e1;
      }
      
      .url-badge-text {
        font-family: 'Outfit', sans-serif;
        font-weight: 800;
        font-size: 28px;
        fill: #ffffff;
        letter-spacing: 1px;
      }

      .contact-item-text {
        font-family: 'Fira Code', monospace;
        font-weight: 500;
        font-size: 17px;
        fill: #94a3b8;
      }
    </style>
    
    <!-- Gradients -->
    <linearGradient id="title-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="60%" stop-color="#f0f9ff" />
      <stop offset="100%" stop-color="#38bdf8" />
    </linearGradient>

    <linearGradient id="url-bg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0ea5e9" />
    </linearGradient>

    <!-- Drop Shadows -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    
    <filter id="shadow">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- 1. Background Image -->
  <image href="${bgDataUri}" width="${svgWidth}" height="${svgHeight}" preserveAspectRatio="xMidYMid slice" />

  <!-- 2. Dark Overlay -->
  <rect width="${svgWidth}" height="${svgHeight}" fill="black" opacity="0.35" />

  <!-- 3. Glassmorphic Main Card Container -->
  <g transform="translate(100, 110)" filter="url(#shadow)">
    <!-- Main Card Border & Glass BG -->
    <rect x="0" y="0" width="1850" height="560" rx="32" fill="rgba(15, 23, 42, 0.75)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="2" />
    <rect x="0" y="0" width="1850" height="560" rx="32" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />

    <!-- Cyan Accent Bar -->
    <rect x="0" y="40" width="8" height="480" rx="4" fill="#0ea5e9" filter="url(#glow)" />

    <!-- Status Chip -->
    <g transform="translate(50, 45)">
      <rect width="360" height="42" rx="21" fill="rgba(14, 165, 233, 0.18)" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.5" />
      <circle cx="26" cy="21" r="5" fill="#10b981" />
      <text x="44" y="26" font-family="'Fira Code', monospace" font-size="14" font-weight="700" fill="#38bdf8" letter-spacing="1">FULL-STACK ARCHITECT</text>
    </g>

    <!-- Main Title -->
    <text x="50" y="170" class="title-text" filter="url(#shadow)">EMANUEL WŁOCH</text>

    <!-- Subtitle -->
    <text x="50" y="215" class="subtitle-text">FULL-STACK SOFTWARE ENGINEER &amp; ARCHITECT</text>

    <!-- Tech Stack Pill Row -->
    <g transform="translate(50, 255)">
      <rect width="980" height="48" rx="14" fill="rgba(6, 9, 19, 0.8)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />
      <!-- Zap Vector Icon -->
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" transform="translate(20, 13) scale(0.9)" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <text x="48" y="31" class="tech-badge-text">
        Next.js 16  <tspan fill="#334155">•</tspan>  React 19  <tspan fill="#334155">•</tspan>  TypeScript  <tspan fill="#334155">•</tspan>  Turso DB  <tspan fill="#334155">•</tspan>  Tailwind v4
      </text>
    </g>

    <!-- Contact Vector Badges Row (No Emojis, No &nbsp;) -->
    <g transform="translate(50, 332)">
      <!-- Item 1: Email -->
      <g transform="translate(0, 0)">
        <rect width="340" height="44" rx="12" fill="rgba(6, 9, 19, 0.6)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
        <!-- Mail Icon Vector -->
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" transform="translate(14, 11)" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="48" y="27" class="contact-item-text">kontakt@emanuelwloch.pl</text>
      </g>

      <!-- Item 2: GitHub -->
      <g transform="translate(360, 0)">
        <rect width="250" height="44" rx="12" fill="rgba(6, 9, 19, 0.6)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
        <!-- Code / Github Icon Vector -->
        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" transform="translate(14, 11)" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="48" y="27" class="contact-item-text">github.com/xitali</text>
      </g>

      <!-- Item 3: Location -->
      <g transform="translate(630, 0)">
        <rect width="220" height="44" rx="12" fill="rgba(6, 9, 19, 0.6)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
        <!-- Pin Icon Vector -->
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" transform="translate(14, 10) scale(0.9)" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="44" y="27" class="contact-item-text">Polska / Remote</text>
      </g>
    </g>

    <!-- URL Button Badge (Prominent) -->
    <g transform="translate(50, 412)">
      <rect width="450" height="66" rx="20" fill="url(#url-bg)" filter="url(#glow)" />
      <!-- Globe Vector Icon -->
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 0c-2.5 3-4 6.5-4 10s1.5 7 4 10c2.5-3 4-6.5 4-10s-1.5-7-4-10zM2 12h20" transform="translate(24, 19) scale(1.2)" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <text x="68" y="43" class="url-badge-text">https://emanuelwloch.pl</text>
    </g>

    <!-- Right Side Code Window Snippet -->
    <g transform="translate(1120, 45)">
      <rect width="680" height="470" rx="22" fill="rgba(6, 9, 19, 0.92)" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1.5" />
      <!-- Window Controls -->
      <circle cx="30" cy="30" r="6" fill="#ef4444" />
      <circle cx="50" cy="30" r="6" fill="#eab308" />
      <circle cx="70" cy="30" r="6" fill="#22c55e" />
      <text x="96" y="35" font-family="'Fira Code', monospace" font-size="13" fill="#64748b">developer.config.ts</text>
      <line x1="0" y1="55" x2="680" y2="55" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />

      <!-- Code lines -->
      <g transform="translate(30, 95)" font-family="'Fira Code', monospace" font-size="15" leading="1.8">
        <text y="0" fill="#c084fc">export const <tspan fill="#38bdf8">emanuelWloch</tspan> = {</text>
        <text y="32" fill="#94a3b8">  name: <tspan fill="#4ade80">'Emanuel Włoch'</tspan>,</text>
        <text y="64" fill="#94a3b8">  title: <tspan fill="#4ade80">'Full-Stack Software Engineer'</tspan>,</text>
        <text y="96" fill="#94a3b8">  email: <tspan fill="#38bdf8">'kontakt@emanuelwloch.pl'</tspan>,</text>
        <text y="128" fill="#94a3b8">  github: <tspan fill="#38bdf8">'https://github.com/xitali'</tspan>,</text>
        <text y="160" fill="#94a3b8">  website: <tspan fill="#38bdf8">'https://emanuelwloch.pl'</tspan>,</text>
        <text y="192" fill="#94a3b8">  primaryStack: [<tspan fill="#38bdf8">'Next.js'</tspan>, <tspan fill="#38bdf8">'React'</tspan>, <tspan fill="#38bdf8">'Turso'</tspan>],</text>
        <text y="224" fill="#94a3b8">  architecture: <tspan fill="#facc15">'Edge First &amp; Serverless'</tspan>,</text>
        <text y="256" fill="#94a3b8">  location: <tspan fill="#4ade80">'Polska / Remote'</tspan>,</text>
        <text y="288" fill="#94a3b8">  status: <tspan fill="#4ade80">'Open for high-impact projects'</tspan></text>
        <text y="320" fill="#c084fc">};</text>
      </g>
    </g>
  </g>
</svg>`;

const svgPath = `C:\\Users\\emanu\\.gemini\\antigravity\\brain\\3d9c90dd-c2b0-4a90-8f8e-80760a303359\\facebook_banner_ultra_hd.svg`;
const htmlPath = `C:\\Users\\emanu\\.gemini\\antigravity\\brain\\3d9c90dd-c2b0-4a90-8f8e-80760a303359\\render_banner.html`;

fs.writeFileSync(svgPath, svgContent);

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; background: #000; overflow: hidden; }
    svg { width: 2050px; height: 780px; display: block; }
  </style>
</head>
<body>
  ${svgContent}
</body>
</html>`;

fs.writeFileSync(htmlPath, htmlContent);

console.log('SVG and HTML created successfully.');
