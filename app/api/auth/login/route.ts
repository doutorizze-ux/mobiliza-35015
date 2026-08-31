import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';
export async function POST(req:Request){
  const {email,password}=await req.json() as {email:string,password:string};
  const expected=process.env.ADMIN_EMAIL||'diretor@mobiliza.local';
  const hash=process.env.ADMIN_PASSWORD_HASH;
  const plain=process.env.ADMIN_PASSWORD||'TroqueEstaSenha123!';
  const ok=email===expected&&(hash?await bcrypt.compare(password,hash):password===plain);
  if(!ok)return NextResponse.json({error:'Credenciais inválidas'},{status:401});
  const res=NextResponse.json({ok:true});
  res.cookies.set('mobiliza_session',await createSession(email),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:43200});
  return res;
}
