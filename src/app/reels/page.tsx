"use client";
import Link from "next/link";
import { ArrowUpRight, Pause, Play, Share2, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Reel={url:string;title:string;projectSlug?:string};
const fallback:Reel[]=[
 {url:"/media/reels/reel-01.mp4",title:"Reel 01"},
 {url:"/media/reels/reel-02.mp4",title:"Reel 02"},
 {url:"/media/reels/reel-03.mp4",title:"Reel 03"},
];
export default function ReelsPage(){
 const [reels,setReels]=useState<Reel[]>(fallback),[active,setActive]=useState(0),[muted,setMuted]=useState(true),[paused,setPaused]=useState(false); const refs=useRef<(HTMLVideoElement|null)[]>([]);
 useEffect(()=>{fetch('/api/reels').then(r=>r.ok?r.json():null).then(d=>{if(d?.reels?.length)setReels(d.reels)}).catch(()=>{})},[])
 useEffect(()=>{refs.current.forEach((v,i)=>{if(!v)return;v.muted=muted;if(i===active&&!paused)v.play().catch(()=>{});else v.pause();})},[active,paused,muted,reels.length])
 useEffect(()=>{const els=document.querySelectorAll('.video-reel-slide');const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>.65){const i=[...els].indexOf(e.target);if(i>=0){setActive(i);setPaused(false)}}}),{threshold:[.65]});els.forEach(e=>ob.observe(e));return()=>ob.disconnect()},[reels.length])
 const share=async()=>{const url=location.href;if(navigator.share) await navigator.share({title:reels[active]?.title,url}); else navigator.clipboard.writeText(url)};
 return <div className="video-reels-shell"><div className="video-reels-scroll">{reels.map((r,i)=><section className="video-reel-slide" key={r.url}>
   <video ref={el=>{refs.current[i]=el}} src={r.url} loop playsInline muted={muted} preload={i<2?"auto":"metadata"}/><div className="video-reel-shade"/>
   <button className="reel-tap" onClick={()=>setPaused(v=>!v)}>{paused&&i===active?<Play fill="currentColor"/>:<Pause fill="currentColor"/>}</button>
   <div className="video-reel-info"><span>LUNGNUAD · REEL {String(i+1).padStart(2,'0')}</span><h1>{r.title}</h1><p>Visual story · Swipe up for next reel</p>{r.projectSlug&&<Link href={`/projects/${r.projectSlug}`}>View project <ArrowUpRight/></Link>}</div>
   <div className="video-reel-actions"><button onClick={()=>setMuted(v=>!v)}>{muted?<VolumeX/>:<Volume2/>}<small>{muted?'Sound':'Mute'}</small></button><button onClick={share}><Share2/><small>Share</small></button></div>
  </section>)}</div></div>
}
