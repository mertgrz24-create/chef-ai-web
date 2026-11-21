"use client";

import { useEffect, useRef, useState } from "react";
import { copy, homePath, type Locale } from "@/lib/marketing";
import { LanguageSwitch } from "@/components/marketing/language-switch";

export function Navbar({ locale }: { locale: Locale }) {
  const text = copy[locale].nav;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen]);
  const links = [
    ["#features", text.features],
    ["#how-it-works", text.how],
    ["#pricing", text.pricing],
  ];
  const renderLinks = () =>
    links.map(([href, label]) => (
      <a key={href} href={href} onClick={() => setMenuOpen(false)}>
        {label}
      </a>
    ));
  return (
    <header className="site-header on-dark">
      <div className="container nav-row">
        <a
          className="wordmark"
          href={homePath(locale)}
          aria-label="Chef-AI"
          translate="no"
        >
          Chef<span>AI</span>
        </a>
        <nav className="desktop-nav" aria-label={text.label}>
          {renderLinks()}
        </nav>
        <div className="nav-tools">
          <LanguageSwitch locale={locale} />
          <button
            ref={menuButton}
            className="menu-toggle"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? text.close : text.open}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path
                d={
                  menuOpen ? "m6 6 12 12M6 18 18 6" : "M4 7h16M4 12h16M4 17h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>
      <nav
        id="mobile-menu"
        className="mobile-menu container"
        aria-label={text.label}
        hidden={!menuOpen}
      >
        {renderLinks()}
      </nav>
      <noscript>
        <style>{".menu-toggle { display: none !important; }"}</style>
        <nav className="noscript-nav container" aria-label={text.label}>
          {links.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
      </noscript>
    </header>
  );
}
