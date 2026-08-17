import { NextResponse } from "next/server";
export const runtime="nodejs";
export async function POST(req:Request){
 try{const form=await req.formData();const file=form.get('file');const title=String(form.get('title')||'reel');if(!(file instanceof File))return NextResponse.json({error:'No file'},{status:400});
 const { put }=await import('@vercel/blob');const safe=title.toLowerCase().replace(/[^a-z0-9ก-๙]+/gi,'-').replace(/^-|-$/g,'')||'reel';const blob=await put(`reels/${Date.now()}-${safe}.${file.name.split('.').pop()||'mp4'}`,file,{access:'public',addRandomSuffix:false});return NextResponse.json(blob)}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Upload failed'},{status:500})}}
