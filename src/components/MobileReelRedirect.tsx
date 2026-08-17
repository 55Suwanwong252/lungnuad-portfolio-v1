"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function MobileReelRedirect(){const router=useRouter();useEffect(()=>{if(window.matchMedia("(max-width: 767px)").matches) router.replace("/reels");},[router]);return null;}
