"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House, FolderKanban, MessageCircle,
  Search, Menu, ShieldCheck, X, ChevronRight
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import LineIcon from "@/components/LineIcon";

const desktopNav = [
  { href: "/", label: "Home", icon: House },
  { href: "/projects", label: "ผลงาน", icon: FolderKanban },
  { href: "/contact", label: "ติดต่อ", icon: MessageCircle },
];

const categoryShortcuts = [
  { href: "/projects/category/commercial", label: "Commercial / Advertising" },
  { href: "/projects/category/wedding", label: "Wedding" },
  { href: "/projects/category/education", label: "Education" },
  { href: "/projects/category/corporate", label: "Corporate / Presentation" },
  { href: "/projects/category/event", label: "Event" },
  { href: "/projects/category/school-activities", label: "School Activities" },
];

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const mobileNav = [
    { href: "/", label: "Home", icon: House },
    { href: "/projects", label: "ผลงาน", icon: FolderKanban },
    { href: "/contact", label: "ติดต่อ", icon: MessageCircle },
  ];

  useEffect(() => {
    setPortalReady(true);
    return () => setPortalReady(false);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
          {categoryShortcuts.map((item) => (
            <Link href={item.href} key={item.href}>{item.label}</Link>
          ))}
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
            <button
              className={`icon-button ${menuOpen ? "is-open" : ""}`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
              type="button"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>
        {children}
      </main>

      <button
        className={`mobile-global-menu-button ${menuOpen ? "is-open" : ""}`}
        type="button"
        onPointerDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setMenuOpen((value) => !value);
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setMenuOpen((value) => !value);
          }
        }}
        aria-label={menuOpen ? "Close quick menu" : "Open quick menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X /> : <Menu />}
      </button>

      {portalReady && menuOpen && createPortal(
        <>
          <button
            className="quick-menu-scrim"
            type="button"
            aria-label="Close menu"
            onPointerDown={(event) => {
              event.preventDefault();
              setMenuOpen(false);
            }}
          />
          <aside className="quick-category-menu" aria-label="เมนูลัดประเภทงาน">
            <div className="quick-category-menu-head">
              <div>
                <span>QUICK MENU</span>
                <strong>ประเภทงาน</strong>
              </div>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
            </div>
            <div className="quick-category-primary">
              {desktopNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link href={item.href} key={item.href}>
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <nav className="quick-category-links">
              {categoryShortcuts.map((item, index) => (
                <Link href={item.href} key={item.href}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.label}</strong>
                  <ChevronRight />
                </Link>
              ))}
            </nav>
          </aside>
        </>,
        document.body
      )}

      <a
        className="floating-line-button"
        href="https://line.me/ti/p/2j7MaV_2sN"
        target="_blank"
        rel="noreferrer"
        aria-label="Add LINE — Lungnuad Production"
        title="Add LINE"
      >
        <LineIcon />
        <span>LINE</span>
      </a>

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
