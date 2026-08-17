"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  PlaySquare,
  FolderKanban,
  Images,
  UserRound,
  Mail,
  Search,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { ReactNode } from "react";

const nav = [
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

  return (
    <div className="site-shell">
      <aside className="sidebar">
        <Link className="brand" href="/">
          <span className="brand-main">LUNGNUAD</span>
          <span className="brand-sub">PRODUCTION</span>
        </Link>

        <nav className="sidebar-nav">
          {nav.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                className={`nav-item ${active ? "active" : ""}`}
                href={item.href}
                key={item.href}
              >
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
            <button className="icon-button" aria-label="Open menu">
              <Menu size={20} />
            </button>
          </div>
        </header>

        {children}
      </main>

      <nav className="bottom-nav">
        {nav.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              className={`bottom-nav-item ${active ? "active" : ""}`}
              href={item.href}
              key={item.href}
            >
              <Icon size={21} strokeWidth={1.9} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
