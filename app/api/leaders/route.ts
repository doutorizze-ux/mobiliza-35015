import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { db } from '@/lib/db';
export async function POST(req:Request){const token=(await cookies()).get('mobiliza_session')?.value;if(!await verifySession(token))return NextResponse.redirect(new URL('/admin/login',req.url));const f=await req.formData();const name=String(f.get('name')||'').trim();const slug=String(f.get('slug')||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');if(name&&slug)await db.query('INSERT INTO leaders(slug,name) VALUES($1,$2) ON CONFLICT(slug) DO UPDATE SET name=EXCLUDED.name, active=true',[slug,name]);return NextResponse.redirect(new URL('/admin',req.url));}
