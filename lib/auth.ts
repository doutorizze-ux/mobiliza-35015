import { SignJWT, jwtVerify } from 'jose';
const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET || 'change-this-in-production');
export async function createSession(email:string){return new SignJWT({email,role:'director'}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('12h').sign(secret())}
export async function verifySession(token?:string){if(!token)return null;try{return (await jwtVerify(token,secret())).payload}catch{return null}}
