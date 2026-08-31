import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
export const runtime='nodejs';
export async function POST(req:Request){
  try{
    const f=await req.formData();
    const values=[String(f.get('leader')||'raimundo-verissimo'),String(f.get('action_date')),String(f.get('city')),String(f.get('neighborhood')||''),String(f.get('activity_type')),Number(f.get('conversations')),Number(f.get('support')),Number(f.get('undecided')),Number(f.get('materials')||0),String(f.get('notes')||'')];
    if(values.slice(1,7).some(v=>v===''||v===null))return NextResponse.json({error:'Campos obrigatórios ausentes'},{status:400});
    if([values[5],values[6],values[7],values[8]].some(v=>Number(v)<0))return NextResponse.json({error:'Totais inválidos'},{status:400});
    const result=await db.query('INSERT INTO actions (leader_slug,action_date,city,neighborhood,activity_type,conversations,support,undecided,materials,notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id',values);
    const dir=process.env.UPLOAD_DIR||'/tmp/mobiliza-uploads';
    await mkdir(dir,{recursive:true});
    for(const file of f.getAll('photos')){
      if(!(file instanceof File)||file.size===0)continue;
      if(file.size>10*1024*1024||!['image/jpeg','image/png'].includes(file.type))continue;
      const name=crypto.randomUUID()+path.extname(file.name);
      await writeFile(path.join(dir,name),Buffer.from(await file.arrayBuffer()));
      await db.query('INSERT INTO attachments (action_id,filename,original_name,mime_type,size_bytes) VALUES ($1,$2,$3,$4,$5)',[result.rows[0].id,name,file.name,file.type,file.size]);
    }
    return NextResponse.json({ok:true,id:result.rows[0].id});
  }catch(e){console.error(e);return NextResponse.json({error:'Não foi possível registrar a ação'},{status:500})}
}
