import { NextResponse } from "next/server";
export async function GET(){
 try{
  const { list } = await import("@vercel/blob");
  const result=await list({prefix:"reels/",limit:100});
  const reels=result.blobs.filter(b=>/\.(mp4|mov|webm)$/i.test(b.pathname)).sort((a,b)=>+new Date(b.uploadedAt)-+new Date(a.uploadedAt)).map(b=>({url:b.url,title:b.pathname.split('/').pop()?.replace(/^\d+-/,'').replace(/\.[^.]+$/,'')||'Reel'}));
  return NextResponse.json({reels});
 }catch{return NextResponse.json({reels:[]})}
}
