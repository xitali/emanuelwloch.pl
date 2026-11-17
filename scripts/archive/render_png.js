import { execSync } from 'child_process';

const htmlPath = `C:\\Users\\emanu\\.gemini\\antigravity\\brain\\3d9c90dd-c2b0-4a90-8f8e-80760a303359\\render_banner.html`;
const targetPngPath = `C:\\Users\\emanu\\.gemini\\antigravity\\brain\\3d9c90dd-c2b0-4a90-8f8e-80760a303359\\facebook_banner_ultra_hd.png`;

const edgeExecutable = `"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"`;

// Run Edge headless screenshot command
const command = `${edgeExecutable} --headless --disable-gpu --screenshot="${targetPngPath}" --window-size=2050,780 "file:///${htmlPath.replace(/\\/g, '/')}"`;

try {
  execSync(command, { stdio: 'inherit' });
  console.log('Successfully rendered PNG to ' + targetPngPath);
} catch (err) {
  console.error('Error rendering PNG:', err);
}
