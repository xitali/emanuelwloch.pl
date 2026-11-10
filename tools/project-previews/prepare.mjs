import {createClient} from '@libsql/client';
import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const manifestArg=process.argv.find(arg=>arg.startsWith('--manifest='))?.slice('--manifest='.length);
let rows;
if(manifestArg){
 const previous=JSON.parse(await readFile('src/lib/project-previews.json','utf8'));
 const reviewed=JSON.parse(await readFile(manifestArg,'utf8'));
 rows=reviewed.filter(row=>row.images[0]!==previous[row.id]?.source);
}else{
 const db=createClient({url:process.env.TURSO_DATABASE_URL,authToken:process.env.TURSO_AUTH_TOKEN});
 try{rows=(await db.execute('SELECT id,title,images FROM projects')).rows;}
 finally{db.close();}
}
const composition=await readFile('tools/project-previews/index.html','utf8');
const projects=[];
for(const row of rows){
 const id=String(row.id);if(!/^[a-f0-9-]{36}$/.test(id))throw new Error('Invalid project ID');
 const images=Array.isArray(row.images) ? row.images : JSON.parse(row.images || '[]');
 const source=images[0];
 if(!source)throw new Error(`Project screen missing: ${row.title}`);
 let input;
 if(source.startsWith('/projects/')) {
   input=path.resolve('public',`.${source}`);
   if(!input.startsWith(path.resolve('public/projects')+path.sep))throw new Error('Invalid image path');
 } else {
   const url=new URL(source);if(url.protocol!=='https:')throw new Error('Invalid image URL');
   const response=await fetch(url);if(!response.ok)throw new Error(`Image unavailable: ${row.title}`);
   input=Buffer.from(await response.arrayBuffer());
 }
 const dir=path.join('.debug/hyperframes-projects',id);await mkdir(dir,{recursive:true});
 const dimensions=await sharp(input).metadata();
 const imageHeight=Math.min(650,Math.round(1070*dimensions.height/dimensions.width));
 const html=composition.replaceAll('__TOP__',String(Math.round((800-imageHeight-30)/2))).replaceAll('__FRAME_HEIGHT__',String(imageHeight+30)).replaceAll('__IMAGE_HEIGHT__',String(imageHeight));
 await writeFile(path.join(dir,'index.html'),html);
 await copyFile('node_modules/gsap/dist/gsap.min.js',path.join(dir,'gsap.min.js'));
 await sharp(input).png().toFile(path.join(dir,'screen.png'));
 projects.push({id,title:row.title,source,dir});
}
await mkdir('public/project-previews',{recursive:true});
await writeFile('.debug/hyperframes-projects/projects.json',JSON.stringify(projects,null,2));
console.log(projects.map(({id,title})=>({id,title})));
