"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House, PlaySquare, FolderKanban, Images, UserRound, Mail,
  Search, Menu, ShieldCheck, MoreHorizontal, X
} from "lucide-react";
import { ReactNode, useState } from "react";
import { useCms } from "@/components/CmsProvider";

const desktopNav = [
  { href: "/", label: "Home", icon: House },
  { href: "/reels", label: "Reels", icon: PlaySquare },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/gallery", label: "Gallery", icon: Images },
  { href: "/about", label: "About", icon: UserRound },
  { href: "/contact", label: "Contact", icon: Mail },
  { href: "/studio", label: "Admin", icon: ShieldCheck },
];

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const { cms } = useCms();

  const labels = cms.navigation;
  const mobileNav = [
    { href: "/", label: labels.home, icon: House },
    { href: "/reels", label: labels.reels, icon: PlaySquare },
    { href: "/projects", label: labels.projects, icon: FolderKanban },
    { href: "/gallery", label: labels.gallery, icon: Images },
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
          <Link href="/projects">All Work</Link>
          <Link href="/projects?category=Education">Education</Link>
          <Link href="/projects?category=Commercial">Commercial</Link>
          <Link href="/projects?category=Restaurant">Restaurant</Link>
          <Link href="/projects?category=Event">Event</Link>
        </div>

        <div className="sidebar-footer">
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
              <input placeholder="Search projects..." />
            </label>
            <button className="icon-button" aria-label="Open menu"><Menu size={20} /></button>
          </div>
        </header>
        {children}
      </main>

      {moreOpen && (
        <div className="liquid-more-sheet">
          <button className="liquid-more-close" onClick={() => setMoreOpen(false)}><X /></button>
          <Link href="/about" onClick={() => setMoreOpen(false)}><UserRound />{labels.about}</Link>
          <Link href="/contact" onClick={() => setMoreOpen(false)}><Mail />{labels.contact}</Link>
        </div>
      )}

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
        <button className={`liquid-nav-item ${moreOpen ? "active" : ""}`} onClick={() => setMoreOpen(v => !v)}>
          <MoreHorizontal />
          <span>{labels.more}</span>
        </button>
      </nav>
    </div>
  );
}
