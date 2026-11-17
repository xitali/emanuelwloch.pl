// Reviewed public copy; backup and guarded atomic transaction. No slugs, prices or publication flags change.
import {createClient} from '@libsql/client';import {readFile,writeFile,mkdir} from 'node:fs/promises';
const patches=JSON.parse(await readFile(new URL('../data/project-copy-review-2026-11-07.json',import.meta.url),'utf8'));
const db=createClient({url:process.env.TURSO_DATABASE_URL,authToken:process.env.TURSO_AUTH_TOKEN});
const prepared=[];
for(const patch of patches){const rows=(await db.execute({sql:'SELECT * FROM projects WHERE id = ?',args:[patch.id]})).rows;if(rows.length!==1)throw new Error('Expected project missing.');prepared.push({...patch,before:rows[0]});}
await mkdir('.debug',{recursive:true});
await writeFile(`.debug/project-copy-backup-${Date.now()}.json`,JSON.stringify(prepared,null,2));
if(process.argv.includes('--apply')){
 const tx=await db.transaction('write');try{
 for(const p of prepared){const entries=Object.entries(p.changes).map(([k,v])=>[k,Array.isArray(v)?JSON.stringify(v):v]);const result=await tx.execute({sql:`UPDATE projects SET ${entries.map(([k])=>`${k} = ?`).join(', ')}, updated_at = ? WHERE id = ? AND ${entries.map(([k])=>`${k} IS ?`).join(' AND ')}`,args:[...entries.map(([,v])=>v),new Date().toISOString(),p.id,...entries.map(([k])=>p.before[k])]});if(result.rowsAffected!==1)throw new Error('Concurrent edit detected; rolling back.');}
 await tx.commit();console.log('Updated',prepared.length,'public project descriptions; slugs and statuses unchanged.');
 }catch(e){await tx.rollback();throw e;}finally{tx.close();}
}else console.log('Dry run:',prepared.length,'projects; local backup prepared.');
db.close();
