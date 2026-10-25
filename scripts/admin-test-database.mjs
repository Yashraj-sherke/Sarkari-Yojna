// Isolated test-only preload. Never use this module for deployment.
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { hashPassword } from '../lib/admin-password.ts';
if(process.env.ADMIN_TEST_DATABASE!=='isolated')throw new Error('Test preload requires ADMIN_TEST_DATABASE=isolated.');
process.env.DATABASE_URL='postgresql://test:test@admin-test.invalid/test_'+crypto.randomUUID();
process.env.TRUST_CHATGPT_PROXY='false'; process.env.ADMIN_USER_IDS='';
const database=new PGlite();
for(const name of ['0000_high_pretty_boy.sql','0001_breezy_purple_man.sql','0002_smooth_pride.sql','0003_admin_workflow.sql'])await database.exec(await readFile(new URL('../drizzle/'+name,import.meta.url),'utf8'));
const hashed=await hashPassword('isolated-test-password-2026');
for(const [id,email,role] of [['test-super','super@example.test','SUPER_ADMIN'],['test-editor','editor@example.test','EDITOR'],['test-reviewer','reviewer@example.test','REVIEWER']])await database.query('INSERT INTO users(id,email,password_hash,role,active,created_at) VALUES($1,$2,$3,$4,true,$5)',[id,email,hashed,role,new Date().toISOString()]);
const original=globalThis.fetch;
function format(result,query){return {command:query.trim().split(/\s+/)[0],rowCount:result.rows.length,fields:result.fields,rows:result.rows.map(row=>result.fields.map(field=>{
 const value=row[field.name]; if(value===null||value===undefined)return null;
 if(field.dataTypeID===16)return value?'t':'f';if([114,3802].includes(field.dataTypeID))return JSON.stringify(value);return String(value);
}))};}
globalThis.fetch=async(input,options)=>{
 const url=typeof input==='string'?input:input instanceof URL?input.href:input.url;
 if(new URL(url).hostname.includes('admin-test.invalid')||new URL(url).hostname==='api.invalid'){
  try {const body=JSON.parse(options?.body??await input.text());
   const execute=async(db,statement)=>format(await db.query(statement.query,statement.params??[]),statement.query);
   const result=body.queries?{results:await database.transaction(async tx=>{const rows=[];for(const statement of body.queries)rows.push(await execute(tx,statement));return rows;})}:await execute(database,body);
   return Response.json(result);
  }catch(error){console.error('Isolated SQL test failure:',error.message);return Response.json({message:error.message,code:error.code},{status:400});}
 }
 return original(input,options);
};
console.log('Isolated admin PostgreSQL test database ready; production DB disabled.');
