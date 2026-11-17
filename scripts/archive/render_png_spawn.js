import { spawnSync } from 'child_process';
import fs from 'fs';

const htmlFile = `C:\\Users\\emanu\\.gemini\\antigravity\\brain\\3d9c90dd-c2b0-4a90-8f8e-80760a303359\\render_banner.html`;
const outputPng = `C:\\Users\\emanu\\.gemini\\antigravity\\brain\\3d9c90dd-c2b0-4a90-8f8e-80760a303359\\facebook_banner_ultra_hd.png`;
const edgeExe = `C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe`;

console.log('Rendering HTML to PNG using Edge...');

const res = spawnSync(edgeExe, [
  '--headless=new',
  '--disable-gpu',
  `--screenshot=${outputPng}`,
  '--window-size=2050,780',
  `file:///${htmlFile.replace(/\\/g, '/')}`
], { encoding: 'utf-8' });

console.log('Result:', res.stdout, res.stderr);

if (fs.existsSync(outputPng)) {
  console.log('PNG successfully created at:', outputPng);
} else {
  console.log('PNG creation failed, searching for screenshot.png...');
  // Try default screenshot name
  spawnSync(edgeExe, [
    '--headless=new',
    '--disable-gpu',
    '--screenshot',
    '--window-size=2050,780',
    `file:///${htmlFile.replace(/\\/g, '/')}`
  ], { cwd: `C:\\Users\\emanu\\.gemini\\antigravity\\brain\\3d9c90dd-c2b0-4a90-8f8e-80760a303359`, encoding: 'utf-8' });
  
  const defaultPng = `C:\\Users\\emanu\\.gemini\\antigravity\\brain\\3d9c90dd-c2b0-4a90-8f8e-80760a303359\\screenshot.png`;
  if (fs.existsSync(defaultPng)) {
    fs.renameSync(defaultPng, outputPng);
    console.log('Renamed screenshot.png to facebook_banner_ultra_hd.png!');
  }
}
