import {createHash} from 'node:crypto';
import {readFile,writeFile,stat,rename,unlink} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const projects=JSON.parse(await readFile('.debug/hyperframes-projects/projects.json','utf8'));
const previous=JSON.parse(await readFile('src/lib/project-previews.json','utf8'));
const redirects=new Map(JSON.parse(await readFile('src/lib/project-preview-redirects.json','utf8')).map(r=>[r.source,r.destination]));
const manifest=process.argv.includes('--partial') ? {...previous} : {};
for(const project of projects){
 const output=`public/project-previews/${project.id}`;
 const temp=`.debug/hyperframes-projects/${project.id}/optimized.mp4`;
 let crf=26;
 const encode=()=>execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',`${output}.mp4`,'-vf','scale=1280:800','-c:v','libx264','-preset','slow','-crf',String(crf),'-pix_fmt','yuv420p','-movflags','+faststart','-an',temp]);
 encode();
 while((await stat(temp)).size>600*1024 && crf<34){crf+=2;encode();}
 if((await stat(temp)).size>600*1024)throw new Error(`Preview exceeds 600 KB: ${project.title}`);
 const metadata=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration:stream=width,height,codec_name,r_frame_rate','-of','json',temp],{encoding:'utf8'}));
 const stream=metadata.streams.find(s=>s.codec_name==='h264');
 if(!stream || stream.width!==1280 || stream.height!==800 || stream.r_frame_rate!=='24/1')throw new Error('Invalid preview dimensions or frame rate');
 if(Math.abs(Number(metadata.format.duration)-5)>.1)throw new Error('Invalid rendered duration');
 const version=createHash('sha256').update(await readFile(temp)).digest('hex').slice(0,8);
 const basename=`${project.id}-${version}`;
 const final=`public/project-previews/${basename}`;
 await rename(temp,`${final}.mp4`);
 execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',`${final}.mp4`,'-frames:v','1',`${final}.jpg`]);
 await unlink(`${output}.mp4`);
 manifest[project.id]={source:project.source,video:`/project-previews/${basename}.mp4`,poster:`/project-previews/${basename}.jpg`};
 console.log(`${project.title}: ${Math.round((await stat(`${final}.mp4`)).size/1024)} KB, 5s, 1280x800, CRF ${crf}`);
}
for(const [id,entry] of Object.entries(manifest)) for(const field of ['video','poster']){
 const old=previous[id]?.[field];if(old && old!==entry[field]){
  for(const [source,destination] of redirects)if(destination===old)redirects.set(source,entry[field]);
  redirects.set(old,entry[field]);
 }
}
await writeFile('src/lib/project-preview-redirects.json',JSON.stringify([...redirects].map(([source,destination])=>({source,destination})),null,2)+'\n');
await writeFile('src/lib/project-previews.json',JSON.stringify(manifest,null,2)+'\n');
