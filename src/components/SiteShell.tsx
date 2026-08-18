"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House, FolderKanban, Images,
  Search, Menu, ShieldCheck
} from "lucide-react";
import { ReactNode } from "react";

const desktopNav = [
  { href: "/", label: "Home", icon: House },
  { href: "/projects", label: "ผลงาน", icon: FolderKanban },
  { href: "/gallery", label: "Gallery", icon: Images },
];

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const mobileNav = [
    { href: "/", label: "Home", icon: House },
    { href: "/projects", label: "ผลงาน", icon: FolderKanban },
    { href: "/gallery", label: "Gallery", icon: Images },
  ];

  return (
    <div className="site-shell">
      <aside className="sidebar">
        <Link className="brand" href="/">
          <span className="brand-main">LUNGNUAD</span>
          <span className="brand-sub">PRODUCTION</span>
        </Link>

        <nav className="sidebar-nav">
          {desktopNav.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link className={`nav-item ${active ? "active" : ""}`} href={item.href} key={item.href}>
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-section">
          <span className="eyebrow">Categories</span>
          <Link href="/projects/category/commercial">Commercial / Advertising</Link>
          <Link href="/projects/category/wedding">Wedding</Link>
          <Link href="/projects/category/education">Education</Link>
          <Link href="/projects/category/corporate">Corporate / Presentation</Link>
          <Link href="/projects/category/event">Event</Link>
          <Link href="/projects/category/school-activities">School Activities</Link>
        </div>

        <div className="sidebar-footer">
          <Link className="sidebar-admin-link" href="/studio"><ShieldCheck size={14} /> Admin</Link>
          <span>Visual stories with purpose.</span>
          <small>© 2026 Lungnuad Production</small>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="mobile-brand">
            <Link className="brand" href="/">
              <span className="brand-main">LUNGNUAD</span>
              <span className="brand-sub">PRODUCTION</span>
            </Link>
          </div>
          <div className="topbar-actions">
            <label className="search-box" aria-label="Search projects">
              <Search size={17} />
              <input placeholder="Search work..." />
            </label>
            <button className="icon-button" aria-label="Open menu"><Menu size={20} /></button>
          </div>
        </header>
        {children}
      </main>


      <nav className="liquid-mobile-nav">
        {mobileNav.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link className={`liquid-nav-item ${active ? "active" : ""}`} href={item.href} key={item.href}>
              <Icon />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
